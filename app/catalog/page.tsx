import { fetchPopularProjects } from "@/services/github"
import { Suspense } from "react"
import { ProjectFilters } from "@/components/filters/project-filters"
import { SearchProjects } from "@/components/search-projects"
import { ProjectListSkeleton } from "@/app/catalog/project-list-skeleton"
import { ProjectList } from "@/app/catalog/project-list"
import {
  GitHubRepo,
  isBlockedRepository,
  shouldBlockRepository,
} from "@/types/github"

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
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Project Catalog
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Browse and discover popular open source projects
          </p>
        </div>

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
  let allFilteredRepos: GitHubRepo[] = []
  let page = currentPage
  let total = 0
  const batchSize = perPage * 2 // Fetch 24 at a time

  // Keep fetching until we have enough filtered repos
  while (allFilteredRepos.length < perPage) {
    const { items, total: totalCount } = await fetchPopularProjects(
      page,
      batchSize,
      language
    )
    total = totalCount

    const filteredBatch = items.filter(
      (repo) =>
        !isBlockedRepository(repo.full_name) && !shouldBlockRepository(repo)
    )

    allFilteredRepos = [...allFilteredRepos, ...filteredBatch]

    // Break if we've fetched everything available
    if (items.length < batchSize) break
    page++
  }

  // Take exactly perPage items
  const paginatedRepos = allFilteredRepos.slice(0, perPage)

  // Estimate total based on filter ratio from this batch
  const filterRatio =
    paginatedRepos.length / (batchSize * (page - currentPage + 1))
  const estimatedTotal = Math.floor(total * filterRatio)

  return (
    <ProjectList
      initialItems={paginatedRepos}
      total={estimatedTotal}
      currentPage={currentPage}
      perPage={perPage}
    />
  )
}
