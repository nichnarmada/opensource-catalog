import { db } from "@/firebase/config"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import {
  Activity,
  ACTIVITIES_COLLECTION,
} from "@/firebase/collections/activities"
import { Repository } from "@/firebase/collections/repositories"
import { UserProfile } from "@/firebase/collections/users/types"

export async function createBookmarkActivity(
  userId: string,
  userProfile: Pick<UserProfile, "displayName" | "photoURL">,
  repo: Repository,
  isPublic: boolean = true
): Promise<Activity> {
  const activity: Omit<Activity, "id"> = {
    type: "bookmark",
    userId,
    userProfile: {
      displayName: userProfile.displayName,
      photoURL: userProfile.photoURL || "",
    },
    repo,
    timestamp: Timestamp.now(),
    isPublic,
    createdAt: Timestamp.now(),
  }

  const docRef = await addDoc(collection(db, ACTIVITIES_COLLECTION), activity)
  return { id: docRef.id, ...activity }
}
