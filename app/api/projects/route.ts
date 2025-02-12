import { fetchPopularProjects } from "@/services/github"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get("page") || "1", 10)
  const language = searchParams.get("language") || "all"
  const search = searchParams.get("search") || ""

  try {
    const { items, total } = await fetchPopularProjects(
      page,
      12,
      language,
      search
    )

    return Response.json({
      items,
      total,
      page,
    })
  } catch (error) {
    return Response.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}
