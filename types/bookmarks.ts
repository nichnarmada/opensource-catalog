import { GitHubRepo } from "./github"

export interface Bookmark {
  id: string
  userId: string
  repo: Pick<
    GitHubRepo,
    | "id"
    | "full_name"
    | "description"
    | "html_url"
    | "language"
    | "stargazers_count"
    | "topics"
  >
  createdAt: Date
}

export interface BookmarkCreate extends Omit<Bookmark, "id"> {
  // Fields required when creating a new bookmark
}

export interface BookmarkUpdate extends Partial<BookmarkCreate> {
  // Fields that can be updated
}
