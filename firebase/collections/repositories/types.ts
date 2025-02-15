export interface Repository {
  id: string
  name: string
  full_name: string
  description: string
  html_url: string
  language: string
  stargazers_count: number
  forks_count: number
  topics: string[]
  created_at: string
  updated_at: string
  // AI-specific fields
  ai_reasoning?: string
  difficulty_level?: "beginner" | "intermediate" | "advanced"
  suggested_features?: string[]
}
