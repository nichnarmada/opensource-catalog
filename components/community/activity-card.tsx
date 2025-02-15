"use client"

import { formatDistanceToNow } from "date-fns"
import { Bookmark, MessageSquare, GitFork, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Activity } from "@/firebase/collections/activities"

interface ActivityCardProps {
  activity: Activity
}

const activityIcons = {
  bookmark: Bookmark,
  comment: MessageSquare,
  fork_idea: GitFork,
  star: Star,
} as const

export function ActivityCard({ activity }: ActivityCardProps) {
  const IconComponent = activityIcons[activity.type]
  const [owner, name] = activity.repo.full_name.split("/")

  return (
    <Card className="w-full">
      <CardContent className="flex items-start space-x-4 p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <IconComponent className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={activity.userProfile.photoURL || undefined} />
              <AvatarFallback>
                {activity.userProfile.displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">
              {activity.userProfile.displayName}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            bookmarked{" "}
            <a
              href={activity.repo.html_url}
              className="font-medium text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {owner}/{name}
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(activity.timestamp.toDate(), {
              addSuffix: true,
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
