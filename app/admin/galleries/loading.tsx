export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-64 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />
      </div>
      <div className="p-6 border rounded-lg bg-white">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="h-32 bg-gray-100 animate-pulse rounded mb-3" />
              <div className="h-5 bg-gray-100 animate-pulse rounded mb-2" />
              <div className="h-4 bg-gray-100 animate-pulse rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

