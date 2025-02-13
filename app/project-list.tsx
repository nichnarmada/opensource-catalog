"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ProjectCard } from "@/components/ProjectCard"
import { GitHubRepo } from "@/types/github"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { useDebouncedCallback } from "use-debounce"
import { useState } from "react"
import { ProjectFilters } from "@/components/filters/project-filters"
import { Search } from "lucide-react"

interface ProjectListProps {
  initialItems: GitHubRepo[]
  total: number
  currentPage: number
  searchQuery: string
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
  searchQuery,
  perPage,
}: ProjectListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchQuery)
  const totalPages = Math.ceil(total / perPage)

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("q", term)
    } else {
      params.delete("q")
    }
    params.set("page", "1")
    router.push(`/?${params.toString()}`)
  }, 300)

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())
    router.push(`/?${params.toString()}`)
  }

  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Search projects..."
            className="pr-10"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              handleSearch(e.target.value)
            }}
          />
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>
        <ProjectFilters />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {initialItems.map((project) => (
          <ProjectCard key={project.id} project={project} />
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
