import { fetchPopularProjects } from "@/services/github"
import { ProjectList } from "./project-list"
import { Suspense } from "react"
import { ProjectListSkeleton } from "./project-list-skeleton"

type SearchParams = { [key: string]: string | string[] | undefined }

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams

  return (
    <main className="container mx-auto py-8 bg-background">
      <h1 className="text-4xl font-bold mb-8 text-foreground">
        Explore Open-Source Projects
      </h1>
      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectContent searchParams={resolvedSearchParams} />
      </Suspense>
    </main>
  )
}

async function ProjectContent({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const currentPage = Number(searchParams?.page) || 1
  const searchQuery = (searchParams?.q as string) ?? ""
  const perPage = 12

  const { items, total } = await fetchPopularProjects(
    currentPage,
    perPage,
    "all",
    searchQuery
  )

  return (
    <ProjectList
      initialItems={items}
      total={total}
      currentPage={currentPage}
      searchQuery={searchQuery}
      perPage={perPage}
    />
  )
}
