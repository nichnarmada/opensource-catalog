import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore"
import { db } from "@/firebase/config"
import { Project } from "../types/project"

// Collection name for projects
const PROJECTS_COLLECTION = "projects"

// Get all projects
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
      collection(db, PROJECTS_COLLECTION)
    )
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Project)
    )
  } catch (error) {
    console.error("Error getting projects:", error)
    throw error
  }
}

// Get a single project by ID
export const getProjectById = async (
  projectId: string
): Promise<Project | null> => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Project
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting project:", error)
    throw error
  }
}

// Add a new project
export const addProject = async (
  projectData: Omit<Project, "id">
): Promise<string> => {
  try {
    const docRef = await addDoc(
      collection(db, PROJECTS_COLLECTION),
      projectData
    )
    return docRef.id
  } catch (error) {
    console.error("Error adding project:", error)
    throw error
  }
}

// Filter projects by programming language
export const getProjectsByLanguage = async (
  language: string
): Promise<Project[]> => {
  try {
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      where("programmingLanguage", "==", language)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Project)
    )
  } catch (error) {
    console.error("Error filtering projects:", error)
    throw error
  }
}
