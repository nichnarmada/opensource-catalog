import { Bookmark } from "./bookmarks"
import { UserProfile } from "./user"

export interface UserProfileWithStats extends UserProfile {
  totalBookmarks: number
  recentBookmarks: Bookmark[]
  topLanguages: Array<{
    language: string
    count: number
  }>
}

export interface CommunityFeedFilters {
  language?: string
  timeRange?: "day" | "week" | "month" | "all"
  userId?: string
}

export interface CommunityFeedResponse {
  bookmarks: Bookmark[]
  users: UserProfile[]
  lastVisible?: Date
  hasMore: boolean
}
