import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
} from "firebase/firestore"
import { db } from "@/firebase/config"
import {
  REPO_SPOTLIGHTS_COLLECTION,
  type RepoSpotlight,
} from "@/firebase/collections/repo-spotlights/types"

// Get the latest spotlight
export async function getLatestSpotlight(): Promise<RepoSpotlight | null> {
  const spotlightsRef = collection(db, REPO_SPOTLIGHTS_COLLECTION)
  const q = query(spotlightsRef, orderBy("timestamp", "desc"), limit(1))
  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    return null
  }

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  } as RepoSpotlight
}

// Get spotlight history (paginated)
export async function getSpotlightHistory(
  pageSize: number = 10,
  startAfterTimestamp?: string
): Promise<RepoSpotlight[]> {
  const spotlightsRef = collection(db, REPO_SPOTLIGHTS_COLLECTION)
  let q = query(spotlightsRef, orderBy("timestamp", "desc"), limit(pageSize))

  if (startAfterTimestamp) {
    q = query(q, where("timestamp", "<", startAfterTimestamp))
  }

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as RepoSpotlight[]
}

// Get time until next refresh
export function getTimeUntilNextRefresh(currentSpotlight: RepoSpotlight): {
  minutes: number
  seconds: number
} {
  const now = new Date()
  const nextHour = new Date(now)
  nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0) // Set to next hour at 00 minutes
  const timeLeft = nextHour.getTime() - now.getTime()

  // If time's up or negative, return 0
  if (timeLeft <= 0) {
    return { minutes: 0, seconds: 0 }
  }

  const minutes = Math.floor(timeLeft / (60 * 1000))
  const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000)

  return { minutes, seconds }
}
