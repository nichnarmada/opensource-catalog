import { onSchedule } from "firebase-functions/v2/scheduler"
import { generateNewSpotlight } from "@/firebase/services/repo-spotlights/mutations"

// Generate new spotlight every hour
export const generateSpotlight = onSchedule("0 * * * *", async () => {
  try {
    const spotlight = await generateNewSpotlight()
    console.log(`Generated new spotlight with ID: ${spotlight.id}`)
  } catch (error) {
    console.error("Error generating spotlight:", error)
    throw error
  }
})
