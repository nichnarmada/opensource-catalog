"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { BookmarkStats } from "@/types/bookmarks"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import Link from "next/link"

export function PopularRepositories() {
  const [popularRepos, setPopularRepos] = useState<BookmarkStats[]>([])

  useEffect(() => {
    async function fetchPopularRepos() {
      const response = await fetch("/api/bookmarks/popular")
      const data = await response.json()
      setPopularRepos(data)
    }
    fetchPopularRepos()
  }, [])

  return (
    <div className="space-y-4">
      {popularRepos.map((stats) => (
        <Card key={stats.repoId}>
          <CardHeader>
            <Link
              href={`/catalog/${stats.repoId}`}
              target="_blank"
              className="font-medium hover:underline"
            >
              {stats.repo.full_name}
            </Link>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {stats.repo.description}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="secondary">{stats.repo.language}</Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                {stats.repo.stargazers_count.toLocaleString()}
              </div>
              <span>{stats.totalBookmarks} bookmarks</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div
                className="flex -space-x-2"
                key={`bookmarkers-${stats.repoId}`}
              >
                {stats.recentBookmarkers.slice(0, 3).map((user) => (
                  <Avatar key={user.id} className="border-2 border-background">
                    <AvatarImage src={user.photoURL} />
                    <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              {stats.totalBookmarks > 3 && (
                <span className="text-sm text-muted-foreground">
                  +{stats.totalBookmarks - 3} others
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
