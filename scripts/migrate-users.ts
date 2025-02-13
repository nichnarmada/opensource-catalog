import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { config } from "dotenv"

// Load environment variables from .env
config()

// Check if credentials are available
if (
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
  !process.env.FIREBASE_ADMIN_PRIVATE_KEY
) {
  console.error("Missing Firebase Admin credentials in environment variables")
  console.log("Required variables:", {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✓" : "✗",
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL ? "✓" : "✗",
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY ? "✓" : "✗",
  })
  process.exit(1)
}

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  })
}

const adminAuth = getAuth()
const adminDb = getFirestore()

async function migrateUsers() {
  try {
    console.log("Starting user migration...")

    // List all users
    const listUsersResult = await adminAuth.listUsers()
    console.log(`Found ${listUsersResult.users.length} users to migrate`)

    for (const user of listUsersResult.users) {
      const userRef = adminDb.collection("users").doc(user.uid)
      const userDoc = await userRef.get()

      if (!userDoc.exists) {
        await userRef.set({
          id: user.uid,
          displayName:
            user.displayName || user.email?.split("@")[0] || "Anonymous",
          photoURL: user.photoURL || null,
          bio: "",
          interests: [],
          createdAt: user.metadata.creationTime
            ? new Date(user.metadata.creationTime)
            : new Date(),
        })
        console.log(`Created profile for user ${user.uid}`)
      } else {
        console.log(`Profile already exists for user ${user.uid}`)
      }
    }

    console.log("Migration completed successfully")
    process.exit(0)
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

migrateUsers()
