"use client"

import {
  getUserBookmarks,
  removeBookmark,
  getBookmarkStats,
} from "@/firebase/services/bookmarks"
import { ProjectCard } from "@/components/project-card"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { Bookmark, BookmarkStats } from "@/firebase/collections/bookmarks/types"

export default function SavedPage() {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      redirect("/auth")
      return
    }

    const fetchBookmarks = async () => {
      try {
        const userBookmarks = await getUserBookmarks(user.uid)
        setBookmarks(userBookmarks)
      } catch (error) {
        console.error("Error fetching bookmarks:", error)
        setError("Failed to load bookmarks. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()
  }, [user])

  if (!user) {
    return null // This prevents flash of content before redirect
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Your Bookmarks
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Projects you&apos;ve bookmarked for later
          </p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading bookmarks...</div>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No bookmarks yet. Browse projects to add some!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {bookmarks.map((bookmark) => (
              <ProjectCard
                key={bookmark.id}
                project={bookmark.repo}
                bookmarkStats={{
                  repoId: bookmark.repo.id,
                  repo: {
                    full_name: bookmark.repo.full_name,
                    description: bookmark.repo.description,
                    language: bookmark.repo.language,
                    stargazers_count: bookmark.repo.stargazers_count,
                  },
                  totalBookmarks: 1, // Since it's bookmarked
                  recentBookmarkers: [
                    {
                      id: bookmark.userId,
                      displayName: bookmark.userProfile.displayName,
                      photoURL: bookmark.userProfile.photoURL ?? undefined,
                    },
                  ],
                }}
                isBookmarked={true}
                onBookmarkToggle={async () => {
                  // Handle unbookmark
                  await removeBookmark(user.uid, bookmark.repo.id)
                  setBookmarks(bookmarks.filter((b) => b.id !== bookmark.id))
                }}
              />
            ))}
          </div>
        )}
        {error && (
          <div className="text-destructive text-center py-8">{error}</div>
        )}
      </div>
    </main>
  )
}
