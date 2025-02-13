export interface UserProfile {
  id: string
  displayName: string
  photoURL?: string
  bio?: string
  interests?: string[] // programming languages or topics of interest
  createdAt: Date
}
