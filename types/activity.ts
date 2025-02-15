import { Repository } from "@/firebase/collections/repositories/types"
import { UserProfile } from "@/firebase/collections/users/types"
import { Timestamp } from "firebase/firestore"

export type ActivityType = "bookmark" | "comment" | "fork_idea" | "star"

export interface Activity {
  id: string
  type: ActivityType
  userId: string
  userProfile: Pick<UserProfile, "displayName" | "photoURL">
  repo: Repository
  timestamp: Date
  isPublic: boolean
  createdAt: Timestamp
}

export interface ActivityFeed {
  activities: Activity[]
  lastVisible?: Date
  hasMore: boolean
}
