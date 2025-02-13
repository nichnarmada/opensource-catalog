import { GitHubRepo } from "./github"
import { UserProfile } from "./user"

export interface Bookmark {
  id: string
  userId: string
  userProfile: Pick<UserProfile, "displayName" | "photoURL"> // Denormalized user data
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
  isPublic: boolean // New field for privacy control
}

// Remove empty interfaces and replace with proper types
export type BookmarkCreate = Omit<Bookmark, "id">
export type BookmarkUpdate = Partial<BookmarkCreate>

// New type for the bookmark feed
export interface ActivityFeed {
  activities: Activity[]
  lastVisible?: Date // For pagination
  hasMore: boolean
}

// New type for bookmark stats
export interface BookmarkStats {
  repoId: number
  repo: Pick<
    GitHubRepo,
    "full_name" | "description" | "language" | "stargazers_count"
  >
  totalBookmarks: number
  recentBookmarkers: Array<Pick<UserProfile, "id" | "displayName" | "photoURL">>
}

export interface Activity extends Bookmark {
  activityType: "bookmark"
  timestamp: Date
}
