import { fetchPopularProjects } from "@/services/github"
import { Suspense } from "react"
import { ProjectListSkeleton } from "@/app/catalog/project-list-skeleton"
import { ProjectList } from "@/app/catalog/project-list"
import {
  GitHubRepo,
  isBlockedRepository,
  shouldBlockRepository,
} from "@/types/github"
import { CatalogContent } from "@/app/catalog/catalog-content"

type SearchParams = { [key: string]: string | string[] | undefined }

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const currentPage = Number(resolvedParams.page) || 1
  const perPage = Number(resolvedParams.per_page) || 12
  const searchQuery = resolvedParams.q?.toString() || ""
  const language = resolvedParams.language?.toString()

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

        <CatalogContent
          initialSearchQuery={searchQuery}
          initialLanguage={language || "all"}
        >
          <Suspense fallback={<ProjectListSkeleton />}>
            <Projects
              currentPage={currentPage}
              perPage={perPage}
              language={language}
            />
          </Suspense>
        </CatalogContent>
      </div>
    </main>
  )
}

// Add caching to prevent rate limiting
export const dynamic = "force-dynamic" // Opt out of static generation
export const revalidate = 60 // Revalidate every 60 seconds

async function Projects({
  currentPage,
  perPage,
  language,
}: {
  currentPage: number
  perPage: number
  language?: string
}) {
  try {
    let allFilteredRepos: GitHubRepo[] = []
    let page = 1 // Always start from page 1
    let total = 0
    const batchSize = perPage * 2
    const neededIndex = (currentPage - 1) * perPage + perPage - 1 // Last index we need

    // Keep fetching until we have enough for the current page
    while (allFilteredRepos.length <= neededIndex) {
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

      // Break if no more results
      if (items.length < batchSize) break
      page++
    }

    // Get the correct slice for current page
    const startIndex = (currentPage - 1) * perPage
    const paginatedRepos = allFilteredRepos.slice(
      startIndex,
      startIndex + perPage
    )

    const filterRatio = allFilteredRepos.length / ((page - 1) * batchSize)
    const estimatedTotal = Math.floor(total * filterRatio)

    return (
      <ProjectList
        initialItems={paginatedRepos}
        total={estimatedTotal}
        currentPage={currentPage}
        perPage={perPage}
      />
    )
  } catch (error) {
    // Handle GitHub API errors gracefully
    console.error("Failed to fetch projects:", error)
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Failed to load projects. GitHub API rate limit may have been exceeded.
          Please try again in a few minutes.
        </p>
      </div>
    )
  }
}
