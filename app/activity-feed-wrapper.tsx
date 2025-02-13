"use client"

import { ActivityFeed as ActivityFeedType } from "@/types/activity"
import { useState } from "react"
import { ActivityFeed } from "@/components/community/activity-feed"

interface ActivityFeedWrapperProps {
  initialFeed: ActivityFeedType
}

export function ActivityFeedWrapper({ initialFeed }: ActivityFeedWrapperProps) {
  const [activities, setActivities] = useState(initialFeed.activities)
  const [hasMore, setHasMore] = useState(initialFeed.hasMore)
  const [isLoading, setIsLoading] = useState(false)
  const [lastVisible, setLastVisible] = useState(initialFeed.lastVisible)

  const loadMore = async () => {
    if (!hasMore || isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/bookmarks/feed?lastVisible=${lastVisible?.toISOString()}`
      )
      const data: ActivityFeedType = await response.json()

      setActivities((prev) => [...prev, ...data.activities])
      setHasMore(data.hasMore)
      setLastVisible(data.lastVisible)
    } catch (error) {
      console.error("Failed to load more bookmarks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ActivityFeed
      activities={activities}
      onLoadMore={loadMore}
      hasMore={hasMore}
      isLoading={isLoading}
    />
  )
}
