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
} from "firebase/firestore"
import { Bookmark } from "@/types/bookmarks"

export async function addBookmark(userId: string, repo: GitHubRepo) {
  // First check if already bookmarked
  const existingBookmark = await getBookmarkByRepoId(userId, repo.id)
  if (existingBookmark) {
    return existingBookmark
  }

  const bookmarkRef = doc(collection(db, "bookmarks"))
  const bookmark: Omit<Bookmark, "id"> = {
    userId,
    repo: {
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      topics: repo.topics,
    },
    createdAt: new Date(),
  }

  await setDoc(bookmarkRef, bookmark)
  return { id: bookmarkRef.id, ...bookmark }
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
