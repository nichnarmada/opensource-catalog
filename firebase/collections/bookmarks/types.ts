import { GitHubRepo } from "../../../types/github"
import { UserProfile } from "@/firebase/collections/users/types"

export interface Bookmark {
  id: string
  userId: string
  userProfile: {
    displayName: string
    photoURL: string | null | undefined
  }
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
  createdAt: Date
  isPublic: boolean
}

export type BookmarkCreate = Omit<Bookmark, "id">
export type BookmarkUpdate = Partial<BookmarkCreate>

export interface BookmarkStats {
  repoId: number
  repo: Pick<
    GitHubRepo,
    "full_name" | "description" | "language" | "stargazers_count"
  >
  totalBookmarks: number
  recentBookmarkers: Array<Pick<UserProfile, "id" | "displayName" | "photoURL">>
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
