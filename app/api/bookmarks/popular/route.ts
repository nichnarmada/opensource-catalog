import { db } from "@/config/firebase"
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore"

export async function GET() {
  try {
    const bookmarksRef = collection(db, "bookmarks")
    const q = query(
      bookmarksRef,
      where("isPublic", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    )

    const querySnapshot = await getDocs(q)
    const bookmarks = querySnapshot.docs.map((doc) => doc.data())

    // Group by repo and count
    const repoStats = bookmarks.reduce((acc, bookmark) => {
      const repoId = bookmark.repo.id
      if (!acc[repoId]) {
        acc[repoId] = {
          repoId,
          repo: bookmark.repo,
          totalBookmarks: 0,
          recentBookmarkers: [],
        }
      }
      acc[repoId].totalBookmarks++
      acc[repoId].recentBookmarkers.push(bookmark.userProfile)
      return acc
    }, {})

    return Response.json(Object.values(repoStats))
  } catch (error) {
    console.error("Error fetching popular repositories:", error)
    return Response.json(
      { error: "Failed to fetch popular repositories" },
      { status: 500 }
    )
  }
}
