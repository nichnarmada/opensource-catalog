import { Activity } from "@/firebase/collections/activities"
import { ActivityCard } from "./activity-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"

interface ActivityFeedProps {
  activities: Activity[]
  onLoadMore: () => Promise<void>
  hasMore: boolean
  isLoading: boolean
}

export function ActivityFeed({
  activities,
  onLoadMore,
  hasMore,
  isLoading,
}: ActivityFeedProps) {
  const { ref, inView } = useInView()

  // Auto-load more when the user scrolls near the bottom
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore()
    }
  }, [inView, hasMore, isLoading, onLoadMore])

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}

      {hasMore && (
        <div ref={ref} className="flex justify-center py-4">
          <Button
            variant="ghost"
            disabled={isLoading}
            onClick={() => onLoadMore()}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Load more
          </Button>
        </div>
      )}
    </div>
  )
}
