import { db } from "@/config/firebase"
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  limit,
  orderBy,
  getDocs,
} from "firebase/firestore"
import { UserProfile } from "@/types/user"
import { UserProfileWithStats } from "@/types/community"
import { Bookmark } from "@/types/bookmarks"

export async function createUserProfile(
  userId: string,
  data: Omit<UserProfile, "id" | "createdAt">
) {
  const userRef = doc(db, "users", userId)
  const profile: Omit<UserProfile, "id"> = {
    ...data,
    createdAt: new Date(),
  }

  await setDoc(userRef, profile)
  return { id: userId, ...profile }
}

export async function getUserProfile(userId: string) {
  const userRef = doc(db, "users", userId)
  const userDoc = await getDoc(userRef)

  if (!userDoc.exists()) {
    return null
  }

  return {
    id: userDoc.id,
    ...userDoc.data(),
  } as UserProfile
}

export async function updateUserProfile(
  userId: string,
  data: Partial<Omit<UserProfile, "id" | "createdAt">>
) {
  const userRef = doc(db, "users", userId)
  await updateDoc(userRef, data)
}

export async function getUserProfileWithStats(
  userId: string
): Promise<UserProfileWithStats | null> {
  const profile = await getUserProfile(userId)
  if (!profile) return null

  // Get user's bookmarks for stats
  const bookmarksRef = collection(db, "bookmarks")
  const q = query(
    bookmarksRef,
    where("userId", "==", userId),
    where("isPublic", "==", true),
    orderBy("createdAt", "desc"),
    limit(5)
  )

  const bookmarksSnapshot = await getDocs(q)
  const recentBookmarks = bookmarksSnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      } as Bookmark)
  )

  // Calculate language stats from bookmarks
  const languageCounts: Record<string, number> = {}
  recentBookmarks.forEach((bookmark) => {
    const lang = bookmark.repo.language
    if (lang) {
      languageCounts[lang] = (languageCounts[lang] || 0) + 1
    }
  })

  const topLanguages = Object.entries(languageCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([language, count]) => ({ language, count }))

  return {
    ...profile,
    totalBookmarks: bookmarksSnapshot.size,
    recentBookmarks,
    topLanguages,
  }
}
