export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero skeleton */}
      <div className="bg-emerald-950 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl animate-pulse space-y-4 text-center">
          <div className="mx-auto h-4 w-28 rounded-full bg-emerald-800/60" />
          <div className="mx-auto h-10 w-2/3 rounded-xl bg-emerald-800/80 md:w-1/2" />
          <div className="mx-auto h-5 w-1/2 rounded-xl bg-emerald-800/50 md:w-1/3" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        {/* Blog card grid skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04]"
            >
              {/* Cover image */}
              <div className="h-[180px] w-full bg-gray-200" />
              {/* Content */}
              <div className="space-y-3 p-5">
                {/* Category badge */}
                <div className="h-5 w-20 rounded-full bg-gray-200" />
                {/* Title */}
                <div className="space-y-2">
                  <div className="h-4 w-full rounded-xl bg-gray-200" />
                  <div className="h-4 w-5/6 rounded-xl bg-gray-200" />
                </div>
                {/* Excerpt */}
                <div className="space-y-1.5">
                  <div className="h-3 w-full rounded-xl bg-gray-200" />
                  <div className="h-3 w-4/5 rounded-xl bg-gray-200" />
                </div>
                {/* Meta row */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="h-6 w-6 rounded-full bg-gray-200" />
                  <div className="h-3 w-24 rounded-xl bg-gray-200" />
                  <div className="ml-auto h-3 w-16 rounded-xl bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
