import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/firebase/config"
import {
  BOOKMARKS_COLLECTION,
  BOOKMARK_FIELD_NAMES,
} from "@/firebase/collections/bookmarks/constants"
import type { Bookmark } from "@/firebase/collections/bookmarks/types"

// Get all bookmarks for a user
export async function getUserBookmarks(userId: string): Promise<Bookmark[]> {
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

// Check if a repository is bookmarked by a user
export async function isRepoBookmarked(
  userId: string,
  repoId: string
): Promise<boolean> {
  const bookmarksRef = collection(db, BOOKMARKS_COLLECTION)
  const q = query(
    bookmarksRef,
    where(BOOKMARK_FIELD_NAMES.userId, "==", userId),
    where(BOOKMARK_FIELD_NAMES.repoId, "==", repoId)
  )
  const querySnapshot = await getDocs(q)

  return !querySnapshot.empty
}
