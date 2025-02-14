import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/firebase/config"
import { collection, query, where, getDocs } from "firebase/firestore"

export async function GET(request: NextRequest) {
  try {
    const pathParts = request.nextUrl.pathname.split("/")
    const userId = pathParts[pathParts.length - 2] // -2 because path ends with /bookmarks

    const bookmarksRef = collection(db, "bookmarks")
    const q = query(bookmarksRef, where("userId", "==", userId))
    const querySnapshot = await getDocs(q)

    const bookmarks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({
      success: true,
      data: bookmarks,
    })
  } catch (error) {
    console.error("[USER_BOOKMARKS]", error)
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR" } },
      { status: 500 }
    )
  }
}
