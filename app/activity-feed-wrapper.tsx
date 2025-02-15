"use client"

import { useState } from "react"
import { ActivityFeed } from "@/components/community/activity-feed"
import { getPublicActivityFeed } from "@/firebase/services/activities/queries"
import {
  Activity,
  ActivityFeed as ActivityFeedType,
} from "@/firebase/collections/activities"

interface ActivityFeedWrapperProps {
  initialFeed: ActivityFeedType
}

export function ActivityFeedWrapper({ initialFeed }: ActivityFeedWrapperProps) {
  const [activities, setActivities] = useState<Activity[]>(
    initialFeed.activities
  )
  const [hasMore, setHasMore] = useState(initialFeed.hasMore)
  const [isLoading, setIsLoading] = useState(false)
  const [lastVisible, setLastVisible] = useState(initialFeed.lastVisible)

  const loadMore = async () => {
    if (!hasMore || isLoading) return

    setIsLoading(true)
    try {
      const data = await getPublicActivityFeed(10, lastVisible)
      setActivities((prev) => [...prev, ...data.activities])
      setHasMore(data.hasMore)
      setLastVisible(data.lastVisible)
    } catch (error) {
      console.error("Failed to load more activities:", error)
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
