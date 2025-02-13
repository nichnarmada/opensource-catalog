"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { GitHubRepo } from "@/types/github"
import { Badge } from "@/components/ui/badge"
import { Star, Bookmark, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import { addBookmark, removeBookmark, isBookmarked } from "@/services/bookmarks"
import { useToast } from "@/hooks/use-toast"

interface ProjectCardProps {
  project: GitHubRepo
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [bookmarked, setBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      isBookmarked(user.uid, project.id)
        .then(setBookmarked)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user, project.id])

  const handleBookmarkToggle = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark projects",
        variant: "destructive",
      })
      return
    }

    try {
      if (bookmarked) {
        await removeBookmark(user.uid, project.id)
        setBookmarked(false)
        toast({
          title: "Bookmark removed",
          description: "Project removed from your bookmarks",
        })
      } else {
        await addBookmark(user.uid, project)
        setBookmarked(true)
        toast({
          title: "Bookmark added",
          description: "Project added to your bookmarks",
        })
      }
    } catch (error) {
      console.error("Bookmark error:", error)
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      })
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
            onClick={handleBookmarkToggle}
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
      </CardContent>
    </Card>
  )
}
