import { GitHubRepo, GitHubSearchResponse } from "@/types/github"

interface RepoLanguages {
  [key: string]: number // language name -> bytes of code
}

async function fetchRepoLanguages(fullName: string): Promise<string[]> {
  const url = `https://api.github.com/repos/${fullName}/languages`
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  }

  if (process.env.GITHUB_TOKEN?.startsWith("ghp_")) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const response = await fetch(url, { headers })
  if (!response.ok) return []

  const languages: RepoLanguages = await response.json()
  // Sort languages by bytes of code and take top 3
  return Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([lang]) => lang)
}

export const fetchPopularProjects = async (
  page: number = 1,
  perPage: number = 12,
  language?: string,
  searchQuery?: string
): Promise<{ items: GitHubRepo[]; total: number }> => {
  const query = [
    searchQuery,
    language ? `language:${language}` : "",
    "stars:>100",
  ]
    .filter(Boolean)
    .join(" ")

  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
    query
  )}&sort=stars&order=desc&page=${page}&per_page=${perPage}`

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  }

  // Only add token if it exists
  const token = process.env.GITHUB_TOKEN
  if (token?.startsWith("ghp_")) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      headers,
      cache: "no-store", // Disable caching to always fetch fresh data
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("GitHub API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      })
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      )
    }

    const data: GitHubSearchResponse = await response.json()

    // Fetch languages for each repo
    const itemsWithLanguages = await Promise.all(
      data.items.map(async (repo) => {
        const languages = await fetchRepoLanguages(repo.full_name)
        return {
          ...repo,
          languages, // Add this to GitHubRepo type
        }
      })
    )

    return {
      items: itemsWithLanguages,
      total: Math.min(data.total_count, 1000), // GitHub API limits to 1000 results
    }
  } catch (error) {
    console.error("Fetch error:", error)
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch projects from GitHub"
    )
  }
}
