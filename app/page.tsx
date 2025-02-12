import { fetchPopularProjects } from "@/services/github"
import HomeClient from "./page-client"

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const currentPage = Number(searchParams.page) || 1
  const searchQuery = (searchParams.q as string) || ""
  const perPage = 12

  // Server-side data fetching
  const { items, total } = await fetchPopularProjects(
    currentPage,
    perPage,
    "all",
    searchQuery
  )

  return (
    <main className="container mx-auto py-8 bg-background">
      <h1 className="text-4xl font-bold mb-8 text-foreground">
        Explore Open-Source Projects
      </h1>
      <HomeClient
        initialItems={items}
        total={total}
        currentPage={currentPage}
        searchQuery={searchQuery}
        perPage={perPage}
      />
    </main>
  )
}
