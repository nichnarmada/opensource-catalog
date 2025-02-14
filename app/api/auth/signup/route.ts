import { db } from "@/firebase/config"
import { doc, setDoc } from "firebase/firestore"

export async function POST(request: Request) {
  const { user } = await request.json()

  try {
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName || user.email?.split("@")[0] || "Anonymous",
      photoURL: user.photoURL || null,
      bio: "",
      interests: [],
      createdAt: new Date(),
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error("Failed to create user profile:", error)
    return Response.json(
      { error: "Failed to create user profile" },
      { status: 500 }
    )
  }
}
