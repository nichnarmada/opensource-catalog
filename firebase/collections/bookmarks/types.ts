import { Timestamp } from "firebase/firestore"
import { Repository } from "../repositories/types"
import { UserProfile } from "../users/types"

export interface Bookmark {
  id: string
  userId: string
  userProfile: Pick<UserProfile, "displayName" | "photoURL">
  repo: Repository
  createdAt: Timestamp
}

export type BookmarkCreate = Omit<Bookmark, "id">
export type BookmarkUpdate = Partial<BookmarkCreate>
