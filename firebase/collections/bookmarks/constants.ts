export const BOOKMARKS_COLLECTION = "bookmarks" as const
export const REPO_STATS_COLLECTION = "repo_stats" as const

export const BOOKMARK_FIELD_NAMES = {
  userId: "userId",
  repoId: "repo.id",
  createdAt: "createdAt",
  isPublic: "isPublic",
} as const

export const BOOKMARK_INDEXES = {
  byUser: [
    BOOKMARK_FIELD_NAMES.userId,
    BOOKMARK_FIELD_NAMES.createdAt,
  ] as const,
  byRepo: [
    BOOKMARK_FIELD_NAMES.repoId,
    BOOKMARK_FIELD_NAMES.createdAt,
  ] as const,
  publicFeed: [
    BOOKMARK_FIELD_NAMES.isPublic,
    BOOKMARK_FIELD_NAMES.createdAt,
  ] as const,
} as const
