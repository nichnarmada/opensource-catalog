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
  Activity,
  ActivityFeed,
  ACTIVITIES_COLLECTION,
} from "@/firebase/collections/activities"

export async function getPublicActivityFeed(
  pageSize: number = 10,
  lastVisible?: QueryDocumentSnapshot
) {
  let q = query(
    collection(db, ACTIVITIES_COLLECTION),
    where("isPublic", "==", true),
    orderBy("createdAt", "desc")
  )

  if (lastVisible) {
    q = query(q, startAfter(lastVisible))
  }

  q = query(q, limit(pageSize))

  const snapshot = await getDocs(q)

  return {
    activities: snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Activity[],
    lastVisible: snapshot.docs[snapshot.docs.length - 1],
    hasMore: snapshot.docs.length === pageSize,
  } as ActivityFeed
}
