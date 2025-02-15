import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { config } from "dotenv"
import {
  isBlockedRepository,
  shouldBlockRepository,
} from "@/firebase/collections/repositories"
import {
  Repository,
  RepositorySearchResponse,
} from "@/firebase/collections/repositories/types"
// Load environment variables from .env
config()

// Check if credentials are available
if (
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
  !process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
  !process.env.GITHUB_TOKEN
) {
  console.error("Missing required credentials in environment variables")
  console.log("Required variables:", {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✓" : "✗",
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL ? "✓" : "✗",
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY ? "✓" : "✗",
    githubToken: process.env.GITHUB_TOKEN ? "✓" : "✗",
  })
  process.exit(1)
}

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  })
}

const adminDb = getFirestore()

async function migrateRepositories() {
  try {
    console.log("Starting repository migration...")

    // Fetch multiple pages of repositories
    const pages = 10 // Fetch 10 pages (1000 repos total)
    const allRepos: Repository[] = []

    for (let page = 1; page <= pages; page++) {
      console.log(`Fetching page ${page}/${pages}...`)
      const response = await fetch(
        `https://api.github.com/search/repositories?q=stars:>100&sort=stars&order=desc&per_page=100&page=${page}`,
        {
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          },
        }
      )

      const data: RepositorySearchResponse = await response.json()
      allRepos.push(...data.items)

      // Respect GitHub's rate limit
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    console.log(`Found ${allRepos.length} repositories to migrate`)

    // Process in smaller batches to avoid Firestore limits
    const batchSize = 500
    for (let i = 0; i < allRepos.length; i += batchSize) {
      const batch = adminDb.batch()
      const batchRepos = allRepos.slice(i, i + batchSize)

      for (const repo of batchRepos) {
        const repoRef = adminDb
          .collection("repositories")
          .doc(repo.id.toString())
        batch.set(
          repoRef,
          {
            id: repo.id.toString(),
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            html_url: repo.html_url,
            language: repo.language,
            languages: repo.languages || [],
            stargazers_count: repo.stargazers_count,
            topics: repo.topics,
            is_blocked:
              isBlockedRepository(repo.full_name) ||
              shouldBlockRepository(repo),
            last_synced: new Date(),
            created_at: new Date(),
            updated_at: new Date(),
          },
          { merge: true }
        )
      }

      await batch.commit()
      console.log(`Committed batch ${i / batchSize + 1}`)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    console.log("Migration completed successfully")
    process.exit(0)
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

migrateRepositories()
