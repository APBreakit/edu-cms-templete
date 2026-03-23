export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-64 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="h-10 w-28 bg-gray-200 animate-pulse rounded" />
      </div>
      <div className="p-6 border rounded-lg bg-white">
        <div className="h-10 bg-gray-100 animate-pulse rounded mb-6" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4">
              <div className="h-5 bg-gray-100 animate-pulse rounded col-span-2" />
              <div className="h-5 bg-gray-100 animate-pulse rounded" />
              <div className="h-5 bg-gray-100 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

