export default function ActivitiesLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero skeleton */}
      <div className="bg-emerald-950 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl animate-pulse space-y-4 text-center">
          <div className="mx-auto h-4 w-32 rounded-full bg-emerald-800/60" />
          <div className="mx-auto h-10 w-2/3 rounded-xl bg-emerald-800/80 md:w-1/2" />
          <div className="mx-auto h-5 w-1/2 rounded-xl bg-emerald-800/50 md:w-1/3" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        {/* Filter tabs skeleton */}
        <div className="mb-8 flex animate-pulse gap-2 overflow-x-auto pb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-9 shrink-0 rounded-full bg-gray-200"
              style={{ width: `${72 + i * 12}px` }}
            />
          ))}
        </div>

        {/* Activity card grid skeleton */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04]"
            >
              {/* Image area — top 60% */}
              <div className="h-[168px] w-full bg-gray-200" />
              {/* Text area — bottom 40% */}
              <div className="space-y-2.5 p-4">
                <div className="h-4 w-3/4 rounded-xl bg-gray-200" />
                <div className="h-3 w-1/2 rounded-xl bg-gray-200" />
                <div className="flex items-center justify-between pt-1">
                  <div className="h-5 w-20 rounded-full bg-gray-200" />
                  <div className="h-7 w-24 rounded-xl bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
