import { db } from "@/firebase/config"
import { collection, getDocs, addDoc, query, where } from "firebase/firestore"

console.log("languages.ts loaded, db:", db)

export interface Language {
  id: string
  name: string
  addedBy?: string
  createdAt: Date
}

interface LanguageResponse {
  languages: {
    id: string
    name: string
    addedBy?: string
    createdAt: string
  }[]
}

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

export async function addLanguage(name: string, userId: string) {
  const languagesRef = collection(db, "languages")

  // Check if language already exists
  const q = query(languagesRef, where("name", "==", name))
  const existing = await getDocs(q)

  if (!existing.empty) {
    throw new Error("Language already exists")
  }

  const newLanguage = {
    name,
    addedBy: userId,
    createdAt: new Date(),
  }

  const doc = await addDoc(languagesRef, newLanguage)

  // Invalidate cache
  cachedLanguages = null

  return {
    id: doc.id,
    ...newLanguage,
  }
}
