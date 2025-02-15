import { db } from "@/firebase/config"
import { collection, doc, writeBatch, Timestamp } from "firebase/firestore"
import {
  Repository,
  REPOSITORY_COLLECTION,
  isBlockedRepository,
  shouldBlockRepository,
} from "@/firebase/collections/repositories"
import { REPOSITORIES_CONFIG } from "@/firebase/collections/repositories/constants"

export async function addRepositories(repos: Repository[]) {
  const batch = writeBatch(db)

  for (const repo of repos) {
    const processedRepo = processRepoForFirestore(repo)
    const repoRef = doc(collection(db, REPOSITORY_COLLECTION), processedRepo.id)
    batch.set(repoRef, processedRepo, { merge: true })
  }

  await batch.commit()
}

function processRepoForFirestore(repo: Repository): Repository {
  const isBlocked =
    isBlockedRepository(repo.full_name) || shouldBlockRepository(repo)

  return {
    id: repo.id.toString(),
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description,
    html_url: repo.html_url,
    language: repo.language,
    languages: repo.languages || [],
    stargazers_count: repo.stargazers_count,
    topics: repo.topics,

    is_blocked: isBlocked,
    block_reason: isBlocked
      ? {
          blocked_keywords: findBlockedKeywords(repo.description),
          suspicious_keywords: findSuspiciousKeywords(repo.description),
          is_blocked_repo: isBlockedRepository(repo.full_name),
        }
      : undefined,

    last_synced: Timestamp.now(),
    created_at: Timestamp.now(),
    updated_at: Timestamp.now(),
  }
}

function findBlockedKeywords(description: string | null): string[] {
  if (!description) return []
  const desc = description.toLowerCase()
  return REPOSITORIES_CONFIG.blocked_keywords.filter((keyword) =>
    desc.includes(keyword.toLowerCase())
  )
}

function findSuspiciousKeywords(description: string | null): string[] {
  if (!description) return []
  const desc = description.toLowerCase()
  const suspicious: string[] = []

  Object.entries(REPOSITORIES_CONFIG.suspicious_keywords).forEach(
    ([, keywords]) => {
      keywords.forEach((keyword) => {
        if (desc.includes(keyword.toLowerCase())) {
          suspicious.push(keyword)
        }
      })
    }
  )

  return suspicious
}
