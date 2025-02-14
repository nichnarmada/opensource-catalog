import type { Bookmark } from "@/firebase/collections/bookmarks/types"

export interface UserProfile {
  id: string
  displayName: string
  photoURL: string
  bio: string
  interests: string[]
  createdAt: Date
}

// Firebase-specific types
export type UserProfileCreate = Omit<UserProfile, "id">
export type UserProfileUpdate = Partial<UserProfileCreate>

// Type for user preferences or settings
export interface UserSettings {
  emailNotifications?: boolean
  theme?: "light" | "dark" | "system"
  // Add other user-specific settings as needed
}

// Extended user type with auth-related fields
export interface FirebaseUser extends UserProfile {
  email?: string | null
  emailVerified: boolean
  lastLoginAt?: Date
  settings?: UserSettings
}

// User profile with additional stats
export interface UserProfileWithStats extends UserProfile {
  totalBookmarks: number
  recentBookmarks: Bookmark[]
  topLanguages: Array<{
    language: string
    count: number
  }>
}
