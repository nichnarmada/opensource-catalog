import { Timestamp } from "firebase/firestore"
import { BLOCKED_REPOSITORIES } from "./constants"

export interface Repository {
  id: string // GitHub repo ID
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  languages: string[] // All languages used
  stargazers_count: number
  topics: string[]

  // Filtering metadata
  is_blocked: boolean
  block_reason?: {
    blocked_keywords: string[]
    suspicious_keywords: string[]
    is_blocked_repo: boolean
  }

  // Timestamps
  last_synced: Timestamp
  created_at: Timestamp
  updated_at: Timestamp
}

export type BlockedRepository = (typeof BLOCKED_REPOSITORIES)[number]

export interface RepositorySearchResponse {
  total_count: number
  incomplete_results: boolean
  items: Repository[]
}
