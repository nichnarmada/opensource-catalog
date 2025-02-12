export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  stargazers_count: number
  language: string | null
  topics: string[]
  license: {
    key: string
    name: string
    url: string
  } | null
  created_at: string
  updated_at: string
  owner: {
    login: string
    avatar_url: string
  }
}

export interface GitHubSearchResponse {
  total_count: number
  incomplete_results: boolean
  items: GitHubRepo[]
}
