"use client"

import { useState, useEffect } from "react"
import { type RepoSpotlight } from "@/firebase/collections/repo-spotlights/types"
import { getSpotlightHistory } from "@/firebase/services/repo-spotlights/queries"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, GitFork, ArrowUpRight } from "lucide-react"
import Link from "next/link"

export function SpotlightHistory() {
  const [spotlights, setSpotlights] = useState<RepoSpotlight[]>([])
  const [loading, setLoading] = useState(false)
  const [lastTimestamp, setLastTimestamp] = useState<string>()

  // Load initial spotlights
  useEffect(() => {
    const loadInitialSpotlights = async () => {
      const initialSpotlights = await getSpotlightHistory()
      setSpotlights(initialSpotlights)
      if (initialSpotlights.length > 0) {
        setLastTimestamp(
          initialSpotlights[initialSpotlights.length - 1].timestamp
        )
      }
    }

    loadInitialSpotlights()
  }, [])

  const loadMore = async () => {
    if (!lastTimestamp || loading) return

    setLoading(true)
    try {
      const moreSpotlights = await getSpotlightHistory(10, lastTimestamp)
      setSpotlights([...spotlights, ...moreSpotlights])
      if (moreSpotlights.length > 0) {
        setLastTimestamp(moreSpotlights[moreSpotlights.length - 1].timestamp)
      }
    } catch (error) {
      console.error("Error loading more spotlights:", error)
    } finally {
      setLoading(false)
    }
  }

  if (spotlights.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No spotlight history available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {spotlights.map((spotlight) => (
          <AccordionItem key={spotlight.id} value={spotlight.id}>
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm">
                    {new Date(spotlight.timestamp).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {spotlight.repositories.length} projects
                  </span>
                </div>
                {spotlight.aiCuratorNotes && (
                  <span className="text-sm text-muted-foreground max-w-md truncate">
                    {spotlight.aiCuratorNotes}
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 p-4">
                {spotlight.repositories.map((repo) => (
                  <div
                    key={repo.id}
                    className="flex items-start justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{repo.name}</h3>
                        <Badge variant="secondary">{repo.language}</Badge>
                        <Badge
                          variant={getDifficultyVariant(repo.difficulty_level)}
                        >
                          {repo.difficulty_level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {repo.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          <span>
                            {(repo.stargazers_count ?? 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork className="h-4 w-4" />
                          <span>
                            {(repo.forks_count ?? 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link
                        href={repo.html_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {lastTimestamp && (
        <div className="text-center">
          <Button variant="outline" onClick={loadMore} disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  )
}

function getDifficultyVariant(
  difficulty?: "beginner" | "intermediate" | "advanced"
): "default" | "secondary" | "destructive" {
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
