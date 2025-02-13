import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/config/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"

export async function GET(request: NextRequest) {
  try {
    const pathParts = request.nextUrl.pathname.split("/")
    const repoId = Number(pathParts[pathParts.length - 1])

    const bookmarksRef = collection(db, "bookmarks")
    const q = query(bookmarksRef, where("repo.id", "==", repoId))
    const querySnapshot = await getDocs(q)

    const recentBookmarkers = querySnapshot.docs
      .map((doc) => doc.data().userProfile)
      .slice(0, 3)

    return NextResponse.json({
      repoId,
      totalBookmarks: querySnapshot.size,
      recentBookmarkers,
    })
  } catch (error) {
    console.error("[BOOKMARK_STATS]", error)
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR" } },
      { status: 500 }
    )
  }
}
