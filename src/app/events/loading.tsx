export default function EventsLoading() {
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

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 space-y-8">
        {/* Tab skeletons */}
        <div className="flex animate-pulse gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-9 rounded-full bg-gray-200"
              style={{ width: `${80 + i * 16}px` }}
            />
          ))}
        </div>

        {/* Event card skeletons — stacked list */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse flex gap-4 overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.04]"
            >
              {/* Date badge */}
              <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center gap-1 rounded-xl bg-gray-200">
                <div className="h-3 w-8 rounded bg-gray-300" />
                <div className="h-5 w-6 rounded bg-gray-300" />
              </div>

              {/* Event info */}
              <div className="min-w-0 flex-1 space-y-2.5 py-1">
                <div className="h-4 w-3/4 rounded-xl bg-gray-200" />
                <div className="h-3 w-1/2 rounded-xl bg-gray-200" />
                <div className="flex gap-2 pt-1">
                  <div className="h-5 w-20 rounded-full bg-gray-200" />
                  <div className="h-5 w-16 rounded-full bg-gray-200" />
                </div>
              </div>

              {/* CTA button */}
              <div className="shrink-0 self-center">
                <div className="h-9 w-24 rounded-xl bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
