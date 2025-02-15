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
  currentPage?: number
}

export async function getFirestoreRepositories({
  language,
  minStars = 0,
  topics = [],
  perPage = 12,
  currentPage = 1,
}: GetRepositoriesOptions = {}) {
  console.log("Collection name:", REPOSITORY_COLLECTION)

  // First, get total count
  let countQuery = query(
    collection(db, "repositories"),
    where("stargazers_count", ">=", minStars)
  )

  if (language && language !== "all") {
    countQuery = query(countQuery, where("language", "==", language))
  }

  if (topics.length === 1) {
    countQuery = query(countQuery, where("topics", "array-contains", topics[0]))
  }

  const countSnapshot = await getDocs(countQuery)
  console.log("Count snapshot size:", countSnapshot.size)

  // Calculate how many documents to skip
  const skipCount = (currentPage - 1) * perPage

  // Get one document before the page we want to start from
  let startAtDoc
  if (skipCount > 0) {
    const startAtQuery = query(
      collection(db, "repositories"),
      where("stargazers_count", ">=", minStars),
      orderBy("stargazers_count", "desc"),
      limit(skipCount)
    )
    const startAtSnapshot = await getDocs(startAtQuery)
    startAtDoc = startAtSnapshot.docs[startAtSnapshot.docs.length - 1]
  }

  // Then get paginated results
  let q = query(
    collection(db, "repositories"),
    where("stargazers_count", ">=", minStars),
    orderBy("stargazers_count", "desc")
  )

  if (language && language !== "all") {
    q = query(q, where("language", "==", language))
  }

  if (topics.length === 1) {
    q = query(q, where("topics", "array-contains", topics[0]))
  }

  if (startAtDoc) {
    q = query(q, startAfter(startAtDoc))
  }

  q = query(q, limit(perPage))

  const snapshot = await getDocs(q)
  console.log("Page results:", {
    page: currentPage,
    count: snapshot.docs.length,
  })

  return {
    repositories: snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Repository[],
    lastVisible: snapshot.docs[snapshot.docs.length - 1],
    total: countSnapshot.size,
  }
}
