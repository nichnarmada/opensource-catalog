import { getPublicBookmarkFeed } from "@/services/bookmarks"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10)
    const lastVisible = searchParams.get("lastVisible")
      ? new Date(searchParams.get("lastVisible")!)
      : undefined

    const feed = await getPublicBookmarkFeed(pageSize, lastVisible)

    return Response.json(feed)
  } catch (error) {
    console.error("Error fetching bookmark feed:", error)
    return Response.json(
      { error: "Failed to fetch bookmark feed" },
      { status: 500 }
    )
  }
}
