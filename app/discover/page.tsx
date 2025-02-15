import { Suspense } from "react"
import { getLatestSpotlight } from "@/firebase/services/repo-spotlights/queries"
import { SpotlightSection } from "@/app/discover/spotlight-section"
import { SpotlightTimer } from "@/app/discover/spotlight-timer"
import { SpotlightHistory } from "@/app/discover/spotlight-history"

export const revalidate = 3600 // Revalidate every hour

export default async function DiscoverPage() {
  const spotlight = await getLatestSpotlight()

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Discover Projects</h1>
        {spotlight && <SpotlightTimer spotlight={spotlight} />}
      </div>

      <div className="grid gap-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Current Spotlight</h2>
            <p className="text-sm text-muted-foreground">
              AI-curated projects refreshed hourly
            </p>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-48 rounded-lg bg-muted animate-pulse"
                    />
                  ))}
              </div>
            }
          >
            <SpotlightSection spotlight={spotlight} />
          </Suspense>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Spotlight History</h2>
          <Suspense
            fallback={
              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-24 rounded-lg bg-muted animate-pulse"
                    />
                  ))}
              </div>
            }
          >
            <SpotlightHistory />
          </Suspense>
        </section>
      </div>
    </div>
  )
}
