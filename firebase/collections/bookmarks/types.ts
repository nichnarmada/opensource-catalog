import { Timestamp } from "firebase/firestore"
import { Repository } from "../repositories/types"
import { UserProfile } from "../users/types"

export interface Bookmark {
  id: string
  userId: string
  userProfile: Pick<UserProfile, "displayName" | "photoURL">
  repo: Repository
  createdAt: Timestamp
  isPublic: boolean
}

export type BookmarkCreate = Omit<Bookmark, "id">
export type BookmarkUpdate = Partial<BookmarkCreate>

export interface BookmarkStats {
  repoId: string
  repo: Pick<
    Repository,
    "full_name" | "description" | "language" | "stargazers_count"
  >
  totalBookmarks: number
  recentBookmarkers: Array<Pick<UserProfile, "displayName" | "photoURL" | "id">>
}

// Activity types for the feed
export interface Activity extends Bookmark {
  activityType: "bookmark"
  timestamp: Date
}

export interface ActivityFeed {
  activities: Activity[]
  lastVisible?: Date
  hasMore: boolean
}

// BookmarkActivity is our internal representation
export interface BookmarkActivity extends Omit<Bookmark, "userProfile"> {
  activityType: "bookmark"
  type: "bookmark"
  timestamp: Date
  userProfile: {
    displayName: string
    photoURL?: string | undefined
  }
}

// BookmarkFeed is our internal representation
export interface BookmarkFeed {
  activities: BookmarkActivity[]
  lastVisible?: Date
  hasMore: boolean
}
