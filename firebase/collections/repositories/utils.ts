import { Repository, BlockedRepository } from "./types"
import {
  BLOCKED_REPOSITORIES,
  BLOCKED_KEYWORDS,
  SUSPICIOUS_KEYWORDS,
} from "./constants"

export function isBlockedRepository(fullName: string): boolean {
  return BLOCKED_REPOSITORIES.includes(fullName as BlockedRepository)
}

export function shouldBlockRepository(repo: Repository): boolean {
  if (!repo.description) return false
  const description = repo.description.toLowerCase()

  // Always block if contains any blocked keywords
  if (
    BLOCKED_KEYWORDS.some((keyword) =>
      description.includes(keyword.toLowerCase())
    )
  ) {
    return true
  }

  // Block if contains multiple suspicious keywords
  const hasSuspiciousLearning = SUSPICIOUS_KEYWORDS.LEARNING.some((keyword) =>
    description.includes(keyword.toLowerCase())
  )
  const hasSuspiciousLibrary = SUSPICIOUS_KEYWORDS.LIBRARIES.some((keyword) =>
    description.includes(keyword.toLowerCase())
  )
  const hasSuspiciousMeta = SUSPICIOUS_KEYWORDS.META.some((keyword) =>
    description.includes(keyword.toLowerCase())
  )

  return (
    [hasSuspiciousLearning, hasSuspiciousLibrary, hasSuspiciousMeta].filter(
      Boolean
    ).length >= 2
  )
}
