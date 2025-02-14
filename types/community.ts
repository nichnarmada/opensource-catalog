import { Bookmark } from "@/firebase/collections/bookmarks/types"
import { UserProfile } from "@/firebase/collections/users/types"

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
