"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { GitHubRepo } from "@/types/github"
import { Badge } from "@/components/ui/badge"
import { Star, Bookmark, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookmarkStats } from "@/types/bookmarks"

interface ProjectCardProps {
  project: GitHubRepo
  bookmarkStats: BookmarkStats
  isBookmarked: boolean
  onBookmarkToggle: () => Promise<void>
}

export function ProjectCard({
  project,
  bookmarkStats: stats,
  isBookmarked: bookmarked,
  onBookmarkToggle,
}: ProjectCardProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleBookmarkClick = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark projects",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await onBookmarkToggle()
    } catch (error) {
      console.error("Bookmark error:", error)
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="flex-none space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <a
              href={project.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block font-semibold hover:underline line-clamp-2 text-sm sm:text-base"
            >
              {project.full_name}
            </a>
            <div className="flex items-center text-xs sm:text-sm text-muted-foreground mt-1">
              <Star className="mr-1 h-3 w-3 sm:h-4 sm:w-4 fill-yellow-500 text-yellow-500" />
              {project.stargazers_count.toLocaleString()}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-rose-500"
            onClick={handleBookmarkClick}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Bookmark
                className={`h-4 w-4 transition-colors ${
                  bookmarked
                    ? "fill-rose-500 text-rose-500"
                    : "text-muted-foreground"
                }`}
              />
            )}
            <span className="sr-only">
              {bookmarked ? "Remove bookmark" : "Add bookmark"}
            </span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.languages?.map((lang) => (
            <Badge key={lang} variant="secondary" className="text-xs">
              {lang}
            </Badge>
          ))}
          {project.topics?.slice(0, 2).map((topic) => (
            <Badge key={topic} variant="outline" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>
        {stats.totalBookmarks > 0 && (
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-xs text-muted-foreground">
              {stats.totalBookmarks}{" "}
              {stats.totalBookmarks === 1 ? "bookmark" : "bookmarks"}
            </span>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {stats.recentBookmarkers.slice(0, 3).map((user) => (
                  <Avatar
                    key={user.id}
                    className="h-6 w-6 border-2 border-background"
                  >
                    <AvatarImage src={user.photoURL} />
                    <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              {stats.totalBookmarks > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{stats.totalBookmarks - 3} others
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
