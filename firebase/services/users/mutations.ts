import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/firebase/config"
import { USERS_COLLECTION } from "../../collections/users/constants"
import type {
  UserProfile,
  UserProfileCreate,
  UserProfileUpdate,
  UserSettings,
} from "../../collections/users/types"

export async function createUserProfile(
  userId: string,
  data: UserProfileCreate
): Promise<UserProfile> {
  const userProfile: UserProfile = {
    id: userId,
    ...data,
    createdAt: new Date(),
  }

  await setDoc(doc(db, USERS_COLLECTION, userId), {
    ...userProfile,
    createdAt: serverTimestamp(), // Use server timestamp for consistency
  })

  return userProfile
}

export async function updateUserProfile(
  userId: string,
  data: UserProfileUpdate
): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, userId)
  await updateDoc(userRef, { ...data })
}

export async function updateUserSettings(
  userId: string,
  settings: Partial<UserSettings>
): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, userId)
  await updateDoc(userRef, { settings })
}

export async function updateLastLogin(userId: string): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, userId)
  await updateDoc(userRef, {
    lastLoginAt: serverTimestamp(),
  })
}
