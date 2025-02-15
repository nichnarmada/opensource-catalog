"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, GitFork, ArrowUpRight, Bookmark, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Repository } from "@/firebase/collections/repositories/types"
import Link from "next/link"

interface ProjectCardProps {
  project: Repository
  isBookmarked: boolean
  onBookmarkToggle: () => void
  showDetails?: boolean
}

export function ProjectCard({
  project,
  isBookmarked,
  onBookmarkToggle,
  showDetails = false,
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

  const getDifficultyVariant = (
    difficulty?: "beginner" | "intermediate" | "advanced"
  ): "default" | "secondary" | "destructive" => {
    switch (difficulty) {
      case "beginner":
        return "default"
      case "intermediate":
        return "secondary"
      case "advanced":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <CardDescription className="text-sm line-clamp-2">
              {project.description}
            </CardDescription>
          </div>
          {project.difficulty_level && (
            <Badge variant={getDifficultyVariant(project.difficulty_level)}>
              {project.difficulty_level}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>{(project.stargazers_count ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="h-4 w-4" />
              <span>{(project.forks_count ?? 0).toLocaleString()}</span>
            </div>
            <Badge variant="secondary">{project.language || "Unknown"}</Badge>
          </div>

          {showDetails && project.ai_reasoning && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Why fork this?</p>
              <p className="text-sm text-muted-foreground">
                {project.ai_reasoning}
              </p>
            </div>
          )}

          {showDetails &&
            project.suggested_features &&
            project.suggested_features.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Suggested features:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {project.suggested_features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <div className="flex items-center gap-2 w-full">
          <Button asChild className="flex-1">
            <Link
              href={project.html_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Repository
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleBookmarkClick}
            disabled={loading}
            className={isBookmarked ? "text-rose-500" : ""}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Bookmark className={isBookmarked ? "fill-rose-500" : ""} />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
