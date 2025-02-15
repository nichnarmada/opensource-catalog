"use client"

import { type RepoSpotlight } from "@/firebase/collections/repo-spotlights/types"
import { type Repository } from "@/firebase/collections/repositories/types"
import { ProjectCard } from "@/components/project-card"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import {
  addBookmark,
  removeBookmark,
} from "@/firebase/services/bookmarks/mutations"
import { getUserBookmarks } from "@/firebase/services/bookmarks/queries"

interface SpotlightSectionProps {
  spotlight: RepoSpotlight | null
}

export function SpotlightSection({ spotlight }: SpotlightSectionProps) {
  const { user } = useAuth()
  const [bookmarkedRepos, setBookmarkedRepos] = useState<
    Record<string, boolean>
  >({})

  // Check initial bookmark states
  useEffect(() => {
    if (!user) return
    spotlight?.repositories.forEach(async (repo) => {
      const isBookmarkedResult = await getUserBookmarks(user.uid)
      setBookmarkedRepos((prev) => ({
        ...prev,
        [repo.id]: isBookmarkedResult.some(
          (bookmark) => bookmark.repo.id === repo.id
        ),
      }))
    })
  }, [user, spotlight])

  const handleBookmarkToggle = async (repo: Repository) => {
    if (!user) return

    try {
      const currentlyBookmarked = bookmarkedRepos[repo.id]
      if (currentlyBookmarked) {
        await removeBookmark(user.uid, repo.id.toString())
      } else {
        await addBookmark(
          user.uid,
          {
            displayName: user.displayName || "Anonymous",
            photoURL: user.photoURL || "",
          },
          repo
        )
      }
      setBookmarkedRepos((prev) => ({
        ...prev,
        [repo.id]: !currentlyBookmarked,
      }))
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    }
  }

  if (!spotlight) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No spotlight available yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {spotlight.repositories.map((repo) => (
        <ProjectCard
          key={repo.id}
          project={repo}
          isBookmarked={bookmarkedRepos[repo.id] || false}
          onBookmarkToggle={() => handleBookmarkToggle(repo)}
          showDetails={true}
        />
      ))}
    </div>
  )
}
