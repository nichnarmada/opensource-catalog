import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit as queryLimit,
} from "firebase/firestore"
import { db } from "../../config"
import {
  USERS_COLLECTION,
  USER_FIELD_NAMES,
} from "../../collections/users/constants"
import type { UserProfile } from "../../collections/users/types"
import type { UserProfileWithStats } from "../../collections/users/types"
import type { Bookmark } from "../../collections/bookmarks/types"
import {
  BOOKMARKS_COLLECTION,
  BOOKMARK_FIELD_NAMES,
} from "../../collections/bookmarks/constants"

export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const docRef = doc(db, USERS_COLLECTION, userId)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    return null
  }

  const data = docSnap.data()
  return {
    id: docSnap.id,
    displayName: data.displayName,
    photoURL: data.photoURL,
    bio: data.bio,
    interests: data.interests,
    createdAt: data.createdAt.toDate(),
  }
}

export async function getUsersByInterest(
  interest: string,
  maxResults: number = 10
): Promise<UserProfile[]> {
  const q = query(
    collection(db, USERS_COLLECTION),
    where(USER_FIELD_NAMES.interests, "array-contains", interest),
    orderBy(USER_FIELD_NAMES.createdAt, "desc"),
    queryLimit(maxResults)
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
  })) as UserProfile[]
}

export async function searchUsers(
  searchTerm: string,
  maxResults: number = 10
): Promise<UserProfile[]> {
  // Note: This is a simple implementation. For better search,
  // consider using a service like Algolia or implementing
  // a more sophisticated search mechanism
  const q = query(
    collection(db, USERS_COLLECTION),
    where(USER_FIELD_NAMES.displayName, ">=", searchTerm),
    where(USER_FIELD_NAMES.displayName, "<=", searchTerm + "\uf8ff"),
    queryLimit(maxResults)
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
  })) as UserProfile[]
}

export async function getRecentUsers(
  count: number = 10
): Promise<UserProfile[]> {
  const q = query(
    collection(db, USERS_COLLECTION),
    orderBy(USER_FIELD_NAMES.createdAt, "desc"),
    queryLimit(count)
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
  })) as UserProfile[]
}

export async function getUserProfileWithStats(
  userId: string
): Promise<UserProfileWithStats | null> {
  const profile = await getUserProfile(userId)
  if (!profile) return null

  // Get user's bookmarks for stats
  const bookmarksRef = collection(db, BOOKMARKS_COLLECTION)
  const q = query(
    bookmarksRef,
    where(BOOKMARK_FIELD_NAMES.userId, "==", userId),
    where(BOOKMARK_FIELD_NAMES.isPublic, "==", true),
    orderBy(BOOKMARK_FIELD_NAMES.createdAt, "desc"),
    queryLimit(5)
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
