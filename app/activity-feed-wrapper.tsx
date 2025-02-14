"use client"

import { ActivityFeed as ActivityFeedType, Activity } from "@/types/activity"
import { useState } from "react"
import { ActivityFeed } from "@/components/community/activity-feed"
import { getPublicBookmarkFeed } from "@/firebase/services/bookmarks"
import { BookmarkActivity } from "@/firebase/collections/bookmarks/types"

interface ActivityFeedWrapperProps {
  initialFeed: ActivityFeedType
}

// Transform BookmarkActivity to Activity
function transformBookmarkActivity(activity: BookmarkActivity): Activity {
  return {
    ...activity,
    type: "bookmark",
    userProfile: {
      ...activity.userProfile,
      photoURL: activity.userProfile.photoURL || "",
    },
  }
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
      const data = await getPublicBookmarkFeed(10, lastVisible)
      setActivities((prev) => [
        ...prev,
        ...data.activities.map(transformBookmarkActivity),
      ])
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
