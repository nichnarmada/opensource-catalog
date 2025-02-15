import { Suspense } from "react"
import { ProjectListSkeleton } from "@/app/catalog/project-list-skeleton"
import { ProjectList } from "@/app/catalog/project-list"
import { CatalogContent } from "@/app/catalog/catalog-content"
import { getFirestoreRepositories } from "@/firebase/services/repositories"

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
    const { repositories, total } = await getFirestoreRepositories({
      language,
      perPage,
      minStars: 100,
    })

    return (
      <ProjectList
        initialItems={repositories}
        total={total}
        currentPage={currentPage}
        perPage={perPage}
      />
    )
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Failed to load projects. Please try again later.
        </p>
      </div>
    )
  }
}
