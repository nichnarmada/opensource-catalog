import { GitHubRepo, GitHubSearchResponse } from "@/types/github"

export const fetchPopularProjects = async (
  page: number = 1,
  perPage: number = 12,
  language?: string,
  searchQuery?: string
): Promise<{ items: GitHubRepo[]; total: number }> => {
  const queryParts = ["stars:>1000"]

  // Add language filter if specified
  if (language && language !== "all") {
    queryParts.push(`language:${language}`)
  } else {
    queryParts.push("language:typescript language:javascript language:python")
  }

  // Add search term if specified
  if (searchQuery) {
    queryParts.push(searchQuery)
  }

  const query = encodeURIComponent(queryParts.join(" "))
  const url = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&page=${page}&per_page=${perPage}`

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
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
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
    return {
      items: data.items,
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
