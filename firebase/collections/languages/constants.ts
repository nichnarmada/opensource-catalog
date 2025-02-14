import { collection } from "firebase/firestore"
import { db } from "@/firebase/config"

export const LANGUAGES_COLLECTION = "languages"

export const languagesCollection = collection(db, LANGUAGES_COLLECTION)

export interface Language {
  id: string
  name: string
  addedBy?: string
  createdAt: Date
}

export interface LanguageResponse {
  languages: {
    id: string
    name: string
    addedBy?: string
    createdAt: string
  }[]
}
