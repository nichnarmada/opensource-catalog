import { addDoc, getDocs, query, where } from "firebase/firestore"
import { languagesCollection } from "@/firebase/collections/languages/constants"
import type { Language } from "@/firebase/collections/languages/constants"

export async function addLanguage(
  name: string,
  userId: string
): Promise<Language> {
  // Check if language already exists
  const q = query(languagesCollection, where("name", "==", name))
  const existing = await getDocs(q)

  if (!existing.empty) {
    throw new Error("Language already exists")
  }

  const newLanguage = {
    name,
    addedBy: userId,
    createdAt: new Date(),
  }

  const doc = await addDoc(languagesCollection, newLanguage)

  return {
    id: doc.id,
    ...newLanguage,
  }
}
