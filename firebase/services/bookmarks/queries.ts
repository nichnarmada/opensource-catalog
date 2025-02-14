import {
  collection,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
  getDoc,
} from "firebase/firestore"
import { db } from "@/firebase/config"
import {
  BOOKMARKS_COLLECTION,
  REPO_STATS_COLLECTION,
  BOOKMARK_FIELD_NAMES,
} from "../../collections/bookmarks/constants"
import type {
  Bookmark,
  BookmarkActivity,
  BookmarkFeed,
} from "../../collections/bookmarks/types"

export async function getBookmarkByRepoId(userId: string, repoId: number) {
  const bookmarksRef = collection(db, BOOKMARKS_COLLECTION)
  const q = query(
    bookmarksRef,
    where(BOOKMARK_FIELD_NAMES.userId, "==", userId),
    where(BOOKMARK_FIELD_NAMES.repoId, "==", repoId)
  )
  const querySnapshot = await getDocs(q)
  const doc = querySnapshot.docs[0]
  return doc ? ({ id: doc.id, ...doc.data() } as Bookmark) : null
}

export async function getUserBookmarks(userId: string) {
  const bookmarksRef = collection(db, BOOKMARKS_COLLECTION)
  const q = query(
    bookmarksRef,
    where(BOOKMARK_FIELD_NAMES.userId, "==", userId)
  )
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Bookmark[]
}

export async function isBookmarked(userId: string, repoId: number) {
  const bookmarksRef = collection(db, BOOKMARKS_COLLECTION)
  const q = query(
    bookmarksRef,
    where(BOOKMARK_FIELD_NAMES.userId, "==", userId),
    where(BOOKMARK_FIELD_NAMES.repoId, "==", repoId)
  )
  const querySnapshot = await getDocs(q)
  return !querySnapshot.empty
}

export async function getPublicBookmarkFeed(
  pageSize: number = 10,
  lastVisibleDate?: Date
): Promise<BookmarkFeed> {
  const bookmarksRef = collection(db, BOOKMARKS_COLLECTION)
  let q = query(
    bookmarksRef,
    where(BOOKMARK_FIELD_NAMES.isPublic, "==", true),
    orderBy(BOOKMARK_FIELD_NAMES.createdAt, "desc"),
    limit(pageSize)
  )

  if (lastVisibleDate) {
    q = query(q, where(BOOKMARK_FIELD_NAMES.createdAt, "<", lastVisibleDate))
  }

  const querySnapshot = await getDocs(q)
  const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
  const lastVisibleTimestamp = lastVisibleDoc?.data().createdAt as Timestamp

  return {
    activities: querySnapshot.docs.map((doc) => {
      const data = doc.data()
      const timestamp = (data.createdAt as Timestamp).toDate()

      return {
        id: doc.id,
        type: "bookmark" as const,
        userId: data.userId,
        userProfile: data.userProfile,
        repo: data.repo,
        timestamp,
        createdAt: timestamp,
        isPublic: data.isPublic,
        activityType: "bookmark",
      }
    }) as BookmarkActivity[],
    lastVisible: lastVisibleTimestamp?.toDate(),
    hasMore: querySnapshot.docs.length === pageSize,
  }
}

export async function getBookmarksByUser(
  userId: string,
  pageSize: number = 10,
  lastVisible?: DocumentSnapshot
): Promise<BookmarkFeed> {
  const bookmarksRef = collection(db, BOOKMARKS_COLLECTION)
  let q = query(
    bookmarksRef,
    where(BOOKMARK_FIELD_NAMES.userId, "==", userId),
    where(BOOKMARK_FIELD_NAMES.isPublic, "==", true),
    orderBy(BOOKMARK_FIELD_NAMES.createdAt, "desc"),
    limit(pageSize)
  )

  if (lastVisible) {
    q = query(q, startAfter(lastVisible))
  }

  const querySnapshot = await getDocs(q)
  const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1]

  return {
    activities: querySnapshot.docs.map((doc) => {
      const data = doc.data()
      const timestamp = (data.createdAt as Timestamp).toDate()

      return {
        id: doc.id,
        userId: data.userId,
        userProfile: data.userProfile,
        repo: data.repo,
        timestamp,
        createdAt: timestamp,
        isPublic: data.isPublic,
        activityType: "bookmark",
      }
    }) as BookmarkActivity[],
    lastVisible: lastVisibleDoc?.data().createdAt,
    hasMore: querySnapshot.docs.length === pageSize,
  }
}

export async function getBookmarkStats(repoId: string | number) {
  const [statsDoc, repoDoc] = await Promise.all([
    getDoc(doc(db, REPO_STATS_COLLECTION, repoId.toString())),
    getDoc(doc(db, "github_repos", repoId.toString())),
  ])

  return {
    totalBookmarks: statsDoc.exists()
      ? statsDoc.data()?.bookmark_count || 0
      : 0,
    recentBookmarkers: repoDoc.exists()
      ? repoDoc.data()?.cached_stats?.recent_bookmarkers || []
      : [],
  }
}

export async function getPopularRepos(maxResults: number = 3) {
  const statsRef = collection(db, REPO_STATS_COLLECTION)
  const q = query(
    statsRef,
    orderBy("bookmark_count", "desc"),
    limit(maxResults)
  )

  const snapshot = await getDocs(q)
  const repoIds = snapshot.docs.map((doc) => doc.id)

  // Get full repo data from github_repos collection
  const reposRef = collection(db, "github_repos")
  const reposData = await Promise.all(
    repoIds.map(async (repoId) => {
      const docRef = doc(reposRef, repoId)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? docSnap.data() : null
    })
  )

  return reposData.filter(Boolean) as Array<{
    id: string
    full_name: string
    description: string
    language: string
    stargazers_count: number
    cached_stats?: {
      recent_bookmarkers: Array<{
        id: string
        displayName: string
        photoURL?: string
      }>
    }
  }>
}
