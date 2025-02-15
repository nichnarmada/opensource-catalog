"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ProjectCard } from "@/components/project-card"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  addBookmark,
  removeBookmark,
  isBookmarked,
} from "@/firebase/services/bookmarks"
import { BookmarkStats } from "@/firebase/collections/bookmarks/types"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { ProjectListSkeleton } from "./project-list-skeleton"
import { Repository } from "@/firebase/collections/repositories/types"

interface ProjectListProps {
  initialItems: Repository[]
  total: number
  currentPage: number
  perPage: number
}

function getPageNumbers(currentPage: number, totalPages: number) {
  const delta = 2 // Number of pages to show before and after current page
  const pages: (number | "ellipsis")[] = []

  // Always show first page
  pages.push(1)

  // Calculate range of pages around current page
  const rangeStart = Math.max(2, currentPage - delta)
  const rangeEnd = Math.min(totalPages - 1, currentPage + delta)

  // Add ellipsis after first page if needed
  if (rangeStart > 2) {
    pages.push("ellipsis")
  }

  // Add pages in range
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i)
  }

  // Add ellipsis before last page if needed
  if (rangeEnd < totalPages - 1) {
    pages.push("ellipsis")
  }

  // Always show last page if there is more than one page
  if (totalPages > 1) {
    pages.push(totalPages)
  }

  return pages
}

export function ProjectList({
  initialItems,
  total,
  currentPage,
  perPage,
}: ProjectListProps) {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [bookmarkStates, setBookmarkStates] = useState<Record<string, boolean>>(
    {}
  )
  const [bookmarkStats, setBookmarkStats] = useState<
    Record<string, BookmarkStats>
  >({})
  const totalPages = Math.ceil(total / perPage)
  const [isLoading, setIsLoading] = useState(false)

  // Load initial bookmark states and stats
  useEffect(() => {
    if (!user) return

    initialItems.forEach(async (project) => {
      const [bookmarked, stats] = await Promise.all([
        isBookmarked(user.uid, parseInt(project.id)),
        fetch(`/api/bookmarks/stats/${project.id}`).then((res) => res.json()),
      ])

      setBookmarkStates((prev) => ({ ...prev, [project.id]: bookmarked }))
      setBookmarkStats((prev) => ({ ...prev, [project.id]: stats }))
    })
  }, [initialItems, user])

  const handleBookmarkToggle = async (project: Repository) => {
    if (!user) return

    const isCurrentlyBookmarked = bookmarkStates[project.id]

    if (isCurrentlyBookmarked) {
      await removeBookmark(user.uid, parseInt(project.id))
    } else {
      await addBookmark(
        user.uid,
        {
          displayName:
            user.displayName || user.email?.split("@")[0] || "Anonymous",
          photoURL: user.photoURL ?? "",
        },
        {
          ...project,
          id: project.id.toString(),
        },
        true
      )
    }

    // Update bookmark state and stats
    const newStats = await fetch(`/api/bookmarks/stats/${project.id}`).then(
      (res) => res.json()
    )

    setBookmarkStates((prev) => ({
      ...prev,
      [project.id]: !isCurrentlyBookmarked,
    }))
    setBookmarkStats((prev) => ({ ...prev, [project.id]: newStats }))
  }

  const handlePageChange = (page: number) => {
    setIsLoading(true)
    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())
    router.push(`/catalog?${params.toString()}`)
  }

  // Reset loading when items change
  useEffect(() => {
    setIsLoading(false)
  }, [initialItems])

  const pages = getPageNumbers(currentPage, totalPages)

  if (isLoading) {
    return <ProjectListSkeleton />
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {initialItems.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            bookmarkStats={
              bookmarkStats[project.id] || {
                repoId: project.id,
                repo: {
                  full_name: project.full_name,
                  description: project.description,
                  language: project.language,
                  stargazers_count: project.stargazers_count,
                },
                totalBookmarks: 0,
                recentBookmarkers: [],
              }
            }
            isBookmarked={bookmarkStates[project.id] || false}
            onBookmarkToggle={() => handleBookmarkToggle(project)}
          />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Pagination>
          <PaginationContent className="flex-wrap gap-2">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) handlePageChange(currentPage - 1)
                }}
                aria-disabled={currentPage <= 1}
                className={
                  currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {pages.map((page, i) =>
              page === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(page)
                    }}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages)
                    handlePageChange(currentPage + 1)
                }}
                aria-disabled={currentPage >= totalPages}
                className={
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
