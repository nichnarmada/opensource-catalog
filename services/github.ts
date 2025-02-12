export const fetchPopularProjects = async (): Promise<any> => {
  const query = "stars:>1000"
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
    query
  )}&sort=stars&order=desc`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch projects from GitHub")
  }

  const data = await response.json()
  return data.items
}
