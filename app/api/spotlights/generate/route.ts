import { NextResponse } from "next/server"
import { generateNewSpotlight } from "@/firebase/services/repo-spotlights/mutations"

export async function POST() {
  try {
    const spotlight = await generateNewSpotlight()
    return NextResponse.json(
      { message: "Spotlight generated successfully", spotlight },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error generating spotlight:", error)
    return NextResponse.json(
      { error: "Failed to generate spotlight" },
      { status: 500 }
    )
  }
}
