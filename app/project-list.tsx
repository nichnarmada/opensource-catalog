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

interface ProjectListProps {
  initialItems: GitHubRepo[]
  total: number
  currentPage: number
  searchQuery: string
  perPage: number
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

  return (
    <div className="space-y-6">
      <div className="w-full max-w-xl">
        <Input
          type="search"
          placeholder="Search projects..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            handleSearch(e.target.value)
          }}
          className="w-full"
        />
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

            {/* Show fewer page numbers on mobile */}
            <div className="hidden sm:flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(pageNumber)
                      }}
                      isActive={currentPage === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}
              {totalPages > 5 && <PaginationEllipsis />}
            </div>

            {/* Mobile pagination - just show current page */}
            <div className="sm:hidden flex items-center">
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
              <PaginationEllipsis />
            </div>

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
