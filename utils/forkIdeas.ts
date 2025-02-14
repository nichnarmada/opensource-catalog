import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore"
import { db } from "@/firebase/config"
import { ForkIdea } from "../types/forkIdea"

const FORK_IDEAS_COLLECTION = "forkIdeas"

// Fetch all fork ideas for a given project
export const getForkIdeasByProject = async (
  projectId: string
): Promise<ForkIdea[]> => {
  try {
    const q = query(
      collection(db, FORK_IDEAS_COLLECTION),
      where("projectId", "==", projectId)
    )
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as ForkIdea)
    )
  } catch (error) {
    console.error("Error fetching fork ideas:", error)
    throw error
  }
}

// Add a new fork idea
export const addForkIdea = async (
  forkIdeaData: Omit<ForkIdea, "id">
): Promise<string> => {
  try {
    const docRef = await addDoc(
      collection(db, FORK_IDEAS_COLLECTION),
      forkIdeaData
    )
    return docRef.id
  } catch (error) {
    console.error("Error adding fork idea:", error)
    throw error
  }
}
