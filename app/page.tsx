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
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Explore Open-Source Projects
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Discover interesting projects and share your ideas for improvements
          </p>
        </div>
        <Suspense fallback={<ProjectListSkeleton />}>
          <ProjectContent searchParams={resolvedSearchParams} />
        </Suspense>
      </div>
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
