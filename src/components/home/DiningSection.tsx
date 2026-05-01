import Link from "next/link";
import Image from "next/image";

interface Dish {
  id: string; name: string; description: string; price: string;
  tag: string; emoji: string; color: string; image_url?: string | null;
}

const COLOR_BG: Record<string, string> = {
  orange: "#92400e",
  amber:  "#78350f",
  teal:   "#134e4a",
  cyan:   "#164e63",
  lime:   "#14532d",
  yellow: "#78350f",
  violet: "#4c1d95",
  rose:   "#881337",
};

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

export default function DiningSection({ dishes }: { dishes: Dish[] }) {
  if (!dishes.length) return null;

  return (
    <section className="relative overflow-hidden py-24"
      style={{ background: "linear-gradient(180deg,#fffaf5 0%,#fff7ed 50%,#fffaf5 100%)" }}>

      {/* Warm glow decorations */}
      <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full
                      blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle,#fdba74,transparent 70%)" }} />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full
                      blur-3xl opacity-15"
        style={{ background: "radial-gradient(circle,#fcd34d,transparent 70%)" }} />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-500">
            Ẩm thực bản địa
          </p>
          <h2 className="text-4xl font-black text-gray-900 md:text-[2.6rem]">
            Hương Vị{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-400
                             bg-clip-text text-transparent">
              Sơn Kiều
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] text-gray-500">
            Đặc sản rừng nướng than hoa, combo gia đình và đồ uống mát lạnh — phục vụ tại khu du lịch.
          </p>
        </div>

        {/* Food card grid — 2×2 mobile, 4-col desktop */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {dishes.slice(0, 4).map((dish, i) => {
            const bg = COLOR_BG[dish.color] ?? "#92400e";
            return (
              <Link href="/dining" key={dish.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white
                           shadow-[0_2px_16px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.05]
                           transition-all duration-300 hover:-translate-y-1.5
                           hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)]">

                {/* Food image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden"
                  style={{ backgroundColor: bg }}>
                  {dish.image_url ? (
                    <Image
                      src={dish.image_url}
                      alt={dish.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center
                                    text-6xl opacity-30 transition-transform duration-500
                                    group-hover:scale-110">
                      {dish.emoji}
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t
                                  from-black/50 via-transparent to-transparent" />

                  {/* Tag badge */}
                  <div className="absolute left-2.5 top-2.5">
                    <span className="rounded-full bg-orange-500/90 px-2.5 py-0.5
                                     text-[10px] font-bold uppercase tracking-wider
                                     text-white shadow-sm">
                      {dish.tag}
                    </span>
                  </div>

                  {/* Bestseller crown on first item */}
                  {i === 0 && (
                    <div className="absolute right-2.5 top-2.5">
                      <span className="rounded-full bg-amber-400/95 px-2 py-0.5
                                       text-[10px] font-black text-amber-900">
                        ★ Bán chạy
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col p-3.5">
                  <h3 className="text-[13px] font-bold leading-snug text-gray-900
                                 transition-colors group-hover:text-orange-600 md:text-[14px]">
                    {dish.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-gray-400">
                    {dish.description}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-x-1.5 gap-y-1 pt-3">
                    <span className="text-[13px] font-black text-orange-500 sm:text-[15px]">
                      {dish.price}
                    </span>
                    <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px]
                                     font-bold text-orange-600 ring-1 ring-orange-100
                                     transition group-hover:bg-orange-500 group-hover:text-white
                                     group-hover:ring-orange-500 sm:px-3 sm:py-1 sm:text-[11px]">
                      Xem →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl
                        border border-orange-100 bg-orange-50/70 px-6 py-5 sm:flex-row">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🍖</span>
            <div>
              <p className="font-bold text-gray-900">Xem đầy đủ thực đơn Sơn Kiều</p>
              <p className="mt-0.5 text-[13px] text-gray-500">
                Combo · Đặc sản rừng · Đồ uống · Món lẻ — phục vụ tại khu du lịch
              </p>
            </div>
          </div>
          <Link href="/dining"
            className="inline-flex shrink-0 items-center gap-2 rounded-full
                       bg-orange-500 px-6 py-2.5 text-[13px] font-bold text-white
                       shadow-[0_4px_14px_rgba(249,115,22,0.35)]
                       transition hover:bg-orange-400 hover:-translate-y-0.5">
            Xem thực đơn <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
