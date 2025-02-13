export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  languages?: string[]
  stargazers_count: number
  topics: string[]
  // Add other GitHub API fields as needed
}

export interface GitHubSearchResponse {
  total_count: number
  incomplete_results: boolean
  items: GitHubRepo[]
}
