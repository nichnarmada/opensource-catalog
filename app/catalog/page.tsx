import { fetchPopularProjects } from "@/services/github"
import { Suspense } from "react"
import { ProjectFilters } from "@/components/filters/project-filters"
import { SearchProjects } from "@/components/search-projects"
import { ProjectListSkeleton } from "@/app/catalog/project-list-skeleton"
import { ProjectList } from "@/app/catalog/project-list"

type SearchParams = { [key: string]: string | string[] | undefined }

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const currentPage = Number(resolvedSearchParams.page) || 1
  const perPage = Number(resolvedSearchParams.per_page) || 12
  const searchQuery = resolvedSearchParams.q?.toString() || ""
  const language = resolvedSearchParams.language?.toString()

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Popular Open Source Projects
        </h1>
        <SearchProjects initialValue={searchQuery} />
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <ProjectFilters />
          <Suspense fallback={<ProjectListSkeleton />}>
            <Projects
              currentPage={currentPage}
              perPage={perPage}
              language={language}
            />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

async function Projects({
  currentPage,
  perPage,
  language,
}: {
  currentPage: number
  perPage: number
  language?: string
}) {
  const { items, total } = await fetchPopularProjects(
    currentPage,
    perPage,
    language
  )

  return (
    <ProjectList
      initialItems={items}
      total={total}
      currentPage={currentPage}
      perPage={perPage}
    />
  )
}
