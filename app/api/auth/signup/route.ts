import { db } from "@/firebase/config"
import { doc, setDoc } from "firebase/firestore"
import { User } from "firebase/auth"

interface SignupRequestBody {
  user: User
}

function formatGauntletName(email: string): string {
  // Remove @gauntletai.com and split by dot
  const [firstName, lastName] = email
    .split("@")[0]
    .split(".")
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())

  return `${firstName} ${lastName}`
}

function getDisplayName(user: User): string {
  if (!user.email) return "Anonymous"

  if (user.email.endsWith("@gauntletai.com")) {
    return formatGauntletName(user.email)
  }

  // Default fallback for other email addresses
  return user.displayName || user.email.split("@")[0] || "Anonymous"
}

export async function POST(request: Request) {
  try {
    const { user } = (await request.json()) as SignupRequestBody

    if (!user?.uid) {
      return Response.json(
        { error: "Invalid user data provided" },
        { status: 400 }
      )
    }

    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: getDisplayName(user),
      photoURL: user.photoURL || null,
      bio: "",
      interests: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: user.email,
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error("Failed to create user profile:", error)

    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json(
      { error: "Failed to create user profile" },
      { status: 500 }
    )
  }
}
