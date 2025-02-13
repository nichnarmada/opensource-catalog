import { db } from "@/config/firebase"
import { collection, getDocs } from "firebase/firestore"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const languagesRef = collection(db, "languages")
    const snapshot = await getDocs(languagesRef)

    const languages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamp to ISO string for serialization
      createdAt: doc.data().createdAt?.toDate().toISOString(),
    }))

    return NextResponse.json({ languages })
  } catch (error) {
    console.error("Error fetching languages:", error)
    return NextResponse.json(
      { error: "Failed to fetch languages" },
      { status: 500 }
    )
  }
}
