export default function Loading() {
  return (
    <main className="container mx-auto py-8">
      <div className="animate-pulse">
        <div className="h-10 w-48 bg-gray-200 rounded mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </main>
  )
}
