export const USERS_COLLECTION = "users" as const
export const USER_SETTINGS_COLLECTION = "user_settings" as const

export const USER_FIELD_NAMES = {
  id: "id",
  displayName: "displayName",
  photoURL: "photoURL",
  bio: "bio",
  interests: "interests",
  createdAt: "createdAt",
  email: "email",
  emailVerified: "emailVerified",
  lastLoginAt: "lastLoginAt",
} as const

export const USER_INDEXES = {
  byInterests: [USER_FIELD_NAMES.interests] as const,
  byCreatedAt: [USER_FIELD_NAMES.createdAt] as const,
} as const
