import { Repository } from "../repositories/types"

export interface RepoSpotlight {
  id: string
  timestamp: string // When this spotlight was generated
  repositories: Repository[]
  aiCuratorNotes?: string // AI's explanation for this batch selection
  generationPrompt?: string // What prompt was used to generate this batch
}

export const REPO_SPOTLIGHTS_COLLECTION = "repo-spotlights" as const
