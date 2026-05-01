export default function PricingLoading() {
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

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 space-y-14">
        {/* 3 category sections */}
        {Array.from({ length: 3 }).map((_, section) => (
          <div key={section} className="animate-pulse space-y-5">
            {/* Section heading */}
            <div className="space-y-2">
              <div className="h-5 w-40 rounded-xl bg-gray-200" />
              <div className="h-3 w-56 rounded-xl bg-gray-200" />
            </div>

            {/* 3 price cards in a row */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, card) => (
                <div
                  key={card}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04]"
                >
                  {/* Image area */}
                  <div className="h-[168px] w-full bg-gray-200" />
                  {/* Content */}
                  <div className="space-y-3 p-5">
                    <div className="h-4 w-3/4 rounded-xl bg-gray-200" />
                    <div className="h-3 w-full rounded-xl bg-gray-200" />
                    <div className="h-3 w-2/3 rounded-xl bg-gray-200" />
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-6 w-24 rounded-xl bg-gray-200" />
                      <div className="h-8 w-20 rounded-xl bg-gray-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
