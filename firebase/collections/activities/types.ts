import { Timestamp, QueryDocumentSnapshot } from "firebase/firestore"
import { Repository } from "../repositories/types"
import { UserProfile } from "../users/types"

export type ActivityType = "bookmark" // We can add more types later like "comment" | "fork_idea"

export interface Activity {
  id: string
  type: ActivityType
  userId: string
  userProfile: Pick<UserProfile, "displayName" | "photoURL">
  repo: Repository
  timestamp: Timestamp
  isPublic: boolean
  createdAt: Timestamp
}

export interface ActivityFeed {
  activities: Activity[]
  lastVisible?: QueryDocumentSnapshot
  hasMore: boolean
}
