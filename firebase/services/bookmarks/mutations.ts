import {
  collection,
  doc,
  writeBatch,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/firebase/config"
import {
  BookmarkCreate,
  Bookmark,
} from "@/firebase/collections/bookmarks/types"
import {
  BOOKMARKS_COLLECTION,
  BOOKMARK_FIELD_NAMES,
} from "@/firebase/collections/bookmarks/constants"
import { UserProfile } from "@/firebase/collections/users/types"
import { Repository } from "@/firebase/collections/repositories/types"

// Helper function to get bookmark by repo ID
async function getBookmarkByRepoId(
  userId: string,
  repoId: string
): Promise<Bookmark | null> {
  const bookmarksRef = collection(db, BOOKMARKS_COLLECTION)
  const q = query(
    bookmarksRef,
    where(BOOKMARK_FIELD_NAMES.userId, "==", userId),
    where(BOOKMARK_FIELD_NAMES.repoId, "==", repoId)
  )
  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) {
    return null
  }

  const doc = querySnapshot.docs[0]
  return {
    id: doc.id,
    ...doc.data(),
  } as Bookmark
}

export async function addBookmark(
  userId: string,
  userProfile: Pick<UserProfile, "displayName" | "photoURL">,
  repo: Repository
): Promise<Bookmark> {
  if (!repo || typeof repo.id === "undefined") {
    throw new Error("Invalid repository data")
  }

  // First check if already bookmarked
  const existingBookmark = await getBookmarkByRepoId(userId, repo.id)
  if (existingBookmark) {
    return existingBookmark
  }

  const batch = writeBatch(db)

  // Add the bookmark
  const bookmarkRef = doc(collection(db, BOOKMARKS_COLLECTION))
  const bookmark: BookmarkCreate = {
    userId,
    userProfile: {
      displayName: userProfile.displayName,
      photoURL: userProfile.photoURL ?? null,
    },
    repo,
    createdAt: Timestamp.now(),
  }
  batch.set(bookmarkRef, bookmark)

  await batch.commit()

  return {
    id: bookmarkRef.id,
    ...bookmark,
  }
}

export async function removeBookmark(userId: string, repoId: string) {
  // Remove the bookmark
  const bookmark = await getBookmarkByRepoId(userId, repoId)
  if (bookmark) {
    const batch = writeBatch(db)
    batch.delete(doc(db, BOOKMARKS_COLLECTION, bookmark.id))
    await batch.commit()
  }
}
