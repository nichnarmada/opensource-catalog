import { GitHubRepo } from "./github"
import { UserProfile } from "@/firebase/collections/users/types"

export type ActivityType = "bookmark" | "comment" | "fork_idea" | "star"

export interface Activity {
  id: string
  type: ActivityType
  userId: string
  userProfile: Pick<UserProfile, "displayName" | "photoURL">
  repo: Pick<
    GitHubRepo,
    | "id"
    | "name"
    | "full_name"
    | "description"
    | "html_url"
    | "language"
    | "stargazers_count"
    | "topics"
  >
  timestamp: Date
  isPublic: boolean
}

export interface ActivityFeed {
  activities: Activity[]
  lastVisible?: Date
  hasMore: boolean
}
