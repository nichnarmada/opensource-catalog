import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/config/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"

export async function PATCH(request: NextRequest) {
  try {
    const pathParts = request.nextUrl.pathname.split("/")
    const bookmarkId = pathParts[pathParts.length - 1]
    const { isPublic, userId } = await request.json()

    // Get and verify bookmark
    const bookmarkRef = doc(db, "bookmarks", bookmarkId)
    const bookmark = await getDoc(bookmarkRef)

    if (!bookmark.exists()) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND" } },
        { status: 404 }
      )
    }

    // Verify ownership
    const bookmarkData = bookmark.data()
    if (bookmarkData.userId !== userId) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN" } },
        { status: 403 }
      )
    }

    await updateDoc(bookmarkRef, { isPublic })
    return NextResponse.json({
      success: true,
      data: { ...bookmarkData, isPublic },
    })
  } catch (error) {
    console.error("[BOOKMARK_PATCH]", error)
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR" } },
      { status: 500 }
    )
  }
}
