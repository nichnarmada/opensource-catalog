import { db } from "@/firebase/config"
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
} from "firebase/firestore"
import {
  Repository,
  REPOSITORY_COLLECTION,
} from "@/firebase/collections/repositories"

interface GetRepositoriesOptions {
  language?: string
  minStars?: number
  topics?: string[]
  perPage?: number
  lastVisible?: QueryDocumentSnapshot
}

export async function getFirestoreRepositories({
  language,
  minStars = 0,
  topics = [],
  perPage = 12,
  lastVisible,
}: GetRepositoriesOptions = {}) {
  // First, get total count
  const countQuery = query(
    collection(db, REPOSITORY_COLLECTION),
    where("is_blocked", "==", false),
    where("stargazers_count", ">=", minStars)
  )

  if (language) {
    query(countQuery, where("language", "==", language))
  }

  if (topics.length === 1) {
    query(countQuery, where("topics", "array-contains", topics[0]))
  }

  const countSnapshot = await getDocs(countQuery)
  const total = countSnapshot.size

  // Then get paginated results
  let q = query(
    collection(db, REPOSITORY_COLLECTION),
    where("is_blocked", "==", false),
    where("stargazers_count", ">=", minStars),
    orderBy("stargazers_count", "desc")
  )

  if (language) {
    q = query(q, where("language", "==", language))
  }

  // Note: For topics, we might need a different strategy if filtering by multiple topics
  // This is because Firestore has limitations on array-contains-any queries
  if (topics.length === 1) {
    q = query(q, where("topics", "array-contains", topics[0]))
  }

  if (lastVisible) {
    q = query(q, startAfter(lastVisible))
  }

  q = query(q, limit(perPage))

  const snapshot = await getDocs(q)

  return {
    repositories: snapshot.docs.map((doc) => doc.data() as Repository),
    lastVisible: snapshot.docs[snapshot.docs.length - 1],
    total, // Now returns actual total count
  }
}
