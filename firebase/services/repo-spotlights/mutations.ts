import { addDoc, collection } from "firebase/firestore"
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

// Function to generate repository recommendations using OpenAI
async function generateRepoRecommendations(): Promise<Repository[]> {
  const prompt = `Generate a list of 10 interesting open source projects that students could fork and enhance. 
  Focus on actual applications (not frameworks, libraries, or learning resources).
  
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
  // Generate recommendations using OpenAI
  const repositories = await generateRepoRecommendations()

  // Enrich with GitHub data
  const enrichedRepos = await enrichWithGitHubData(repositories)

  // Create new spotlight
  const spotlight: Omit<RepoSpotlight, "id"> = {
    timestamp: new Date().toISOString(),
    repositories: enrichedRepos,
    aiCuratorNotes: "Generated using GPT-4 with focus on forkable applications",
    generationPrompt: "Focus on actual applications for student projects",
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
