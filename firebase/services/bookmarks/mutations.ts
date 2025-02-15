import {
  collection,
  doc,
  writeBatch,
  increment,
  serverTimestamp,
  updateDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/firebase/config"
import {
  BookmarkCreate,
  Bookmark,
} from "@/firebase/collections/bookmarks/types"
import {
  BOOKMARKS_COLLECTION,
  REPO_STATS_COLLECTION,
} from "@/firebase/collections/bookmarks/constants"
import { UserProfile } from "@/firebase/collections/users/types"
import { Repository } from "@/firebase/collections/repositories/types"
import { getBookmarkByRepoId } from "@/firebase/services/bookmarks/queries"
import { createBookmarkActivity } from "../activities/mutations"

export async function addBookmark(
  userId: string,
  userProfile: Pick<UserProfile, "displayName" | "photoURL">,
  repo: Repository,
  isPublic: boolean = true
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
    isPublic,
  }
  batch.set(bookmarkRef, bookmark)

  // Update real-time stats
  const statsRef = doc(db, REPO_STATS_COLLECTION, repo.id.toString())
  batch.set(
    statsRef,
    {
      id: repo.id.toString(),
      bookmark_count: increment(1),
      updated_at: serverTimestamp(),
    },
    { merge: true }
  )

  await batch.commit()

  // Create activity
  await createBookmarkActivity(userId, userProfile, repo, isPublic)

  return {
    id: bookmarkRef.id,
    ...bookmark,
  }
}

export async function removeBookmark(userId: string, repoId: string) {
  const batch = writeBatch(db)

  // Remove the bookmark
  const bookmark = await getBookmarkByRepoId(userId, repoId)
  if (bookmark) {
    batch.delete(doc(db, BOOKMARKS_COLLECTION, bookmark.id))

    // Update stats
    const statsRef = doc(db, REPO_STATS_COLLECTION, repoId)
    batch.set(
      statsRef,
      {
        bookmark_count: increment(-1),
        updated_at: serverTimestamp(),
      },
      { merge: true }
    )

    await batch.commit()
  }
}

export async function updateBookmarkPrivacy(
  bookmarkId: string,
  userId: string,
  isPublic: boolean
): Promise<{ success: boolean; error?: { code: string } }> {
  try {
    const bookmarkRef = doc(db, BOOKMARKS_COLLECTION, bookmarkId)
    const bookmark = await getDoc(bookmarkRef)

    if (!bookmark.exists()) {
      return { success: false, error: { code: "NOT_FOUND" } }
    }

    const bookmarkData = bookmark.data()
    if (bookmarkData.userId !== userId) {
      return { success: false, error: { code: "FORBIDDEN" } }
    }

    await updateDoc(bookmarkRef, { isPublic })
    return { success: true }
  } catch (error) {
    console.error("Error updating bookmark privacy:", error)
    return { success: false, error: { code: "INTERNAL_ERROR" } }
  }
}
