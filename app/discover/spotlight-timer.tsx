"use client"

import { useEffect, useState } from "react"
import { getTimeUntilNextRefresh } from "@/firebase/services/repo-spotlights/queries"
import { type RepoSpotlight } from "@/firebase/collections/repo-spotlights/types"
import { Clock } from "lucide-react"

interface SpotlightTimerProps {
  spotlight: RepoSpotlight
}

export function SpotlightTimer({ spotlight }: SpotlightTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() =>
    getTimeUntilNextRefresh(spotlight)
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilNextRefresh(spotlight))
    }, 1000)

    return () => clearInterval(timer)
  }, [spotlight])

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      <span>
        Next refresh in {timeLeft.minutes}:
        {timeLeft.seconds.toString().padStart(2, "0")}
      </span>
    </div>
  )
}
