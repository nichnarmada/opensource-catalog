"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { BlockedRepoSuggestion } from "@/types/github"
import {
  getAllBlockSuggestions,
  voteForBlockSuggestion,
} from "@/services/block-suggestions"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function FilterSuggestionsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [suggestions, setSuggestions] = useState<BlockedRepoSuggestion[]>([])

  useEffect(() => {
    getAllBlockSuggestions().then(setSuggestions)
  }, [])

  const handleVote = async (suggestion: BlockedRepoSuggestion) => {
    if (!user) return

    try {
      await voteForBlockSuggestion(suggestion.id, {
        userId: user.uid,
        displayName:
          user.displayName || user.email?.split("@")[0] || "Anonymous",
        createdAt: new Date(),
      })

      // Refresh suggestions
      const updated = await getAllBlockSuggestions()
      setSuggestions(updated)

      toast({
        title: "Vote recorded",
        description: "Thank you for helping curate the catalog!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record vote",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Filter Suggestions</h1>
          <p className="text-muted-foreground">
            Vote on repositories that should be filtered out from the catalog.
            Repositories need {VOTES_THRESHOLD} votes to be automatically
            filtered.
          </p>
        </div>

        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{suggestion.repoFullName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Reason: {suggestion.reason}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleVote(suggestion)}
                  disabled={suggestion.votes.some(
                    (v) => v.userId === user?.uid
                  )}
                >
                  Vote ({suggestion.votes.length} / {VOTES_THRESHOLD})
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Suggested by {suggestion.suggestedBy.displayName}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
