export default async function HomePage() {
  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Welcome to Open Source Brainstorm
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Discover and bookmark interesting open source projects
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            {/* Add your activity feed component here */}
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Your Bookmarks</h2>
            {/* Add your bookmarks component here */}
          </section>
        </div>
      </div>
    </main>
  )
}
