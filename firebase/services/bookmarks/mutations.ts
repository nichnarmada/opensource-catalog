import {
  collection,
  doc,
  writeBatch,
  increment,
  serverTimestamp,
  updateDoc,
  getDoc,
} from "firebase/firestore"
import { db } from "@/firebase/config"
import { type BookmarkCreate } from "../../collections/bookmarks/types"
import {
  BOOKMARKS_COLLECTION,
  REPO_STATS_COLLECTION,
} from "../../collections/bookmarks/constants"
import { UserProfile } from "../../../types/user"
import { GitHubRepo } from "../../../types/github"
import { getBookmarkByRepoId } from "./queries"

export async function addBookmark(
  userId: string,
  userProfile: Pick<UserProfile, "displayName" | "photoURL">,
  repo: GitHubRepo,
  isPublic: boolean = true
) {
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
  return {
    id: bookmarkRef.id,
    ...bookmark,
    activityType: "bookmark" as const,
    timestamp: bookmark.createdAt,
  }
}

export async function removeBookmark(userId: string, repoId: number) {
  const batch = writeBatch(db)

  // Remove the bookmark
  const bookmark = await getBookmarkByRepoId(userId, repoId)
  if (bookmark) {
    batch.delete(doc(db, BOOKMARKS_COLLECTION, bookmark.id))

    // Update stats
    const statsRef = doc(db, REPO_STATS_COLLECTION, repoId.toString())
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
    // Get and verify bookmark
    const bookmarkRef = doc(db, BOOKMARKS_COLLECTION, bookmarkId)
    const bookmark = await getDoc(bookmarkRef)

    if (!bookmark.exists()) {
      return { success: false, error: { code: "NOT_FOUND" } }
    }

    // Verify ownership
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
