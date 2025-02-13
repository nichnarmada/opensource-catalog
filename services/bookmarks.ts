import { db } from "@/config/firebase"
import { GitHubRepo } from "@/types/github"
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
} from "firebase/firestore"
import { Activity, ActivityFeed } from "@/types/activity"
import { UserProfile } from "@/types/user"
import { Bookmark } from "@/types/bookmarks"

export async function addBookmark(
  userId: string,
  userProfile: Pick<UserProfile, "displayName" | "photoURL">,
  repo: GitHubRepo,
  isPublic: boolean = true
) {
  console.log("Adding bookmark with data:", { userId, userProfile, repo })

  if (!repo || typeof repo.id === "undefined") {
    console.error("Invalid repo data received:", repo)
    throw new Error("Invalid repository data")
  }

  // First check if already bookmarked
  const existingBookmark = await getBookmarkByRepoId(userId, repo.id)
  if (existingBookmark) {
    return existingBookmark
  }

  const bookmarkRef = doc(collection(db, "bookmarks"))
  const bookmark: Omit<Bookmark, "id"> = {
    userId,
    userProfile: {
      displayName: userProfile.displayName,
      photoURL: userProfile.photoURL ?? null,
    },
    repo: {
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description || "",
      html_url: repo.html_url,
      language: repo.language || "Unknown",
      stargazers_count: repo.stargazers_count,
      topics: repo.topics || [],
    },
    createdAt: new Date(),
    isPublic,
  }

  await setDoc(bookmarkRef, bookmark)
  return {
    id: bookmarkRef.id,
    ...bookmark,
    // Add activity fields for feed compatibility
    activityType: "bookmark" as const,
    timestamp: bookmark.createdAt,
  }
}

export async function removeBookmark(userId: string, repoId: number) {
  const bookmark = await getBookmarkByRepoId(userId, repoId)
  if (bookmark) {
    await deleteDoc(doc(db, "bookmarks", bookmark.id))
  }
}

async function getBookmarkByRepoId(userId: string, repoId: number) {
  const bookmarksRef = collection(db, "bookmarks")
  const q = query(
    bookmarksRef,
    where("userId", "==", userId),
    where("repo.id", "==", repoId)
  )
  const querySnapshot = await getDocs(q)
  const doc = querySnapshot.docs[0]
  return doc ? ({ id: doc.id, ...doc.data() } as Bookmark) : null
}

export async function getUserBookmarks(userId: string) {
  const bookmarksRef = collection(db, "bookmarks")
  const q = query(bookmarksRef, where("userId", "==", userId))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Bookmark[]
}

export async function isBookmarked(userId: string, repoId: number) {
  const bookmarksRef = collection(db, "bookmarks")
  const q = query(
    bookmarksRef,
    where("userId", "==", userId),
    where("repo.id", "==", repoId)
  )
  const querySnapshot = await getDocs(q)
  return !querySnapshot.empty
}

export async function getPublicBookmarkFeed(
  pageSize: number = 10,
  lastVisibleDate?: Date
): Promise<ActivityFeed> {
  const bookmarksRef = collection(db, "bookmarks")
  let q = query(
    bookmarksRef,
    where("isPublic", "==", true),
    orderBy("createdAt", "desc"),
    limit(pageSize)
  )

  if (lastVisibleDate) {
    q = query(q, where("createdAt", "<", lastVisibleDate))
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
      }
    }) as Activity[],
    lastVisible: lastVisibleTimestamp?.toDate(),
    hasMore: querySnapshot.docs.length === pageSize,
  }
}

export async function getBookmarksByUser(
  userId: string,
  pageSize: number = 10,
  lastVisible?: DocumentSnapshot
): Promise<ActivityFeed> {
  const bookmarksRef = collection(db, "bookmarks")
  let q = query(
    bookmarksRef,
    where("userId", "==", userId),
    where("isPublic", "==", true),
    orderBy("createdAt", "desc"),
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
        type: "bookmark" as const,
        userId: data.userId,
        userProfile: data.userProfile,
        repo: data.repo,
        timestamp,
        createdAt: timestamp,
        isPublic: data.isPublic,
      }
    }) as Activity[],
    lastVisible: lastVisibleDoc?.data().createdAt,
    hasMore: querySnapshot.docs.length === pageSize,
  }
}
