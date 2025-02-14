import {
  Language,
  LanguageResponse,
} from "@/firebase/collections/languages/constants"

// Cache languages in memory
let cachedLanguages: Language[] | null = null
let cacheTimestamp: number | null = null
const CACHE_DURATION = 1000 * 60 * 5 // 5 minutes

export async function getLanguages(forceRefresh = false): Promise<Language[]> {
  // Return cached languages if available and not expired
  if (
    !forceRefresh &&
    cachedLanguages &&
    cacheTimestamp &&
    Date.now() - cacheTimestamp < CACHE_DURATION
  ) {
    return cachedLanguages
  }

  const response = await fetch("/api/languages")
  if (!response.ok) {
    throw new Error("Failed to fetch languages")
  }

  const data = (await response.json()) as LanguageResponse
  cachedLanguages = data.languages.map((lang) => ({
    ...lang,
    createdAt: new Date(lang.createdAt),
  }))
  cacheTimestamp = Date.now()

  return cachedLanguages
}
