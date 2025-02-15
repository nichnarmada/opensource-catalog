import {
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore"
import { db } from "@/firebase/config"
import {
  REPO_SPOTLIGHTS_COLLECTION,
  type RepoSpotlight,
} from "@/firebase/collections/repo-spotlights/types"
import OpenAI from "openai"
import { type Repository } from "@/firebase/collections/repositories/types"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Get the last N spotlights to avoid repetition
async function getLastNSpotlights(n: number = 5): Promise<RepoSpotlight[]> {
  const spotlightsRef = collection(db, REPO_SPOTLIGHTS_COLLECTION)
  const q = query(spotlightsRef, orderBy("timestamp", "desc"), limit(n))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as RepoSpotlight[]
}

// Function to generate repository recommendations using OpenAI
async function generateRepoRecommendations(
  previousRepos: string[]
): Promise<Repository[]> {
  const prompt = `Generate a list of 10 interesting open source projects that students could fork and enhance. 
  Focus on actual applications (not frameworks, libraries, or learning resources).
  
  IMPORTANT: Do NOT include any of these previously recommended repositories:
  ${previousRepos.join("\n")}
  
  Return the response in this exact JSON format:
  {
    "repositories": [
      {
        "id": "string",
        "name": "string",
        "full_name": "owner/repo",
        "description": "string",
        "language": "string",
        "ai_reasoning": "string explaining why this is good for forking",
        "difficulty_level": "beginner" | "intermediate" | "advanced",
        "suggested_features": ["feature1", "feature2", "feature3"]
      }
    ]
  }

  Requirements for each repository:
  - Must be an actual application (not a framework, library, or learning resource)
  - Must be actively maintained
  - Must be suitable for student projects
  - Must have clear potential for enhancement
  - Must NOT be any of the previously recommended repositories
  - Difficulty level should be balanced across selections`

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4-turbo-preview",
    response_format: { type: "json_object" },
  })

  if (!completion.choices[0].message.content) {
    throw new Error("No content in OpenAI response")
  }

  const response = JSON.parse(completion.choices[0].message.content)

  // Ensure each repository has a unique ID
  const repositories = response.repositories.map(
    (repo: Partial<Repository>, index: number) => ({
      ...repo,
      id: `${repo.full_name?.replace("/", "-")}-${index}`,
    })
  )

  if (!Array.isArray(repositories)) {
    throw new Error("Invalid response format from OpenAI")
  }

  return repositories
}

// Function to fetch additional repository details from GitHub API
async function enrichWithGitHubData(
  repositories: Repository[]
): Promise<Repository[]> {
  const enrichedRepos = await Promise.all(
    repositories.map(async (repo) => {
      const response = await fetch(
        `https://api.github.com/repos/${repo.full_name}`,
        {
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          },
        }
      )
      const data = await response.json()

      return {
        ...repo,
        stargazers_count: data.stargazers_count,
        forks_count: data.forks_count,
        topics: data.topics,
        created_at: data.created_at,
        updated_at: data.updated_at,
        html_url: data.html_url,
      }
    })
  )

  return enrichedRepos
}

// Function to generate and save a new spotlight
export async function generateNewSpotlight(): Promise<RepoSpotlight> {
  // Get previous spotlights to avoid repetition
  const previousSpotlights = await getLastNSpotlights(5)
  const previousRepos = previousSpotlights
    .flatMap((spotlight) => spotlight.repositories)
    .map((repo) => repo.full_name)

  // Generate recommendations using OpenAI, avoiding previous repos
  const repositories = await generateRepoRecommendations(previousRepos)

  // Enrich with GitHub data
  const enrichedRepos = await enrichWithGitHubData(repositories)

  // Create new spotlight with previous repos info
  const spotlight: Omit<RepoSpotlight, "id"> = {
    timestamp: new Date().toISOString(),
    repositories: enrichedRepos,
    aiCuratorNotes: "Generated using GPT-4 with focus on forkable applications",
    generationPrompt: "Focus on actual applications for student projects",
    previouslyExcludedRepos: previousRepos, // Store excluded repos for transparency
  }

  // Save to Firestore
  const docRef = await addDoc(
    collection(db, REPO_SPOTLIGHTS_COLLECTION),
    spotlight
  )

  return {
    id: docRef.id,
    ...spotlight,
  }
}
