import Link from "next/link";
import Image from "next/image";
import { WaveDown, WaveUp } from "@/components/ui/WaveDivider";

interface Dish {
  id: string; name: string; description: string; price: string;
  tag: string; emoji: string; color: string; image_url?: string | null;
}

function ArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

export default function DiningSection({ dishes }: { dishes: Dish[] }) {
  if (!dishes.length) return null;

  return (
    <>
      <WaveDown fill="#052e16" />

      <section className="bg-[#052e16] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-4 md:px-6">

          {/* Header */}
          <div className="mb-16 text-center">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e]">
              Ẩm Thực Bản Địa
            </p>
            <h2 className="font-display text-[clamp(2.6rem,6vw,5rem)] font-normal italic
                           leading-[1.06] tracking-[0.04em] text-white">
              Hương Vị Sơn Kiều
            </h2>
            <div className="my-7 flex items-center justify-center gap-4">
              <span className="block h-px w-14 bg-white/20" />
              <span className="text-[#22c55e] opacity-70">✦</span>
              <span className="block h-px w-14 bg-white/20" />
            </div>
            <p className="mx-auto max-w-lg text-[15px] font-light leading-[2] text-white/60">
              Đặc sản rừng nướng than hoa, combo gia đình và đồ uống mát lạnh — phục vụ tại khu du lịch.
            </p>
          </div>

          {/* Food grid */}
          <div className="grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
            {dishes.slice(0, 4).map((dish, i) => (
              <Link href="/dining" key={dish.id}
                className="group flex flex-col overflow-hidden bg-[#052e16]
                           transition-colors hover:bg-[#073d1e]">

                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#073d1e]">
                  {dish.image_url ? (
                    <Image
                      src={dish.image_url}
                      alt={dish.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center
                                    text-5xl opacity-20">
                      {dish.emoji}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#052e16]/80 via-transparent to-transparent" />

                  {/* Tag */}
                  <div className="absolute left-3 top-3">
                    <span className="border border-white/20 bg-[#052e16]/60 px-2.5 py-0.5
                                     text-[9px] font-bold uppercase tracking-[0.18em]
                                     text-white/80 backdrop-blur-sm">
                      {dish.tag}
                    </span>
                  </div>

                  {i === 0 && (
                    <div className="absolute right-3 top-3">
                      <span className="border border-[#22c55e]/40 bg-[#052e16]/60 px-2.5 py-0.5
                                       text-[9px] font-bold uppercase tracking-[0.18em]
                                       text-[#22c55e] backdrop-blur-sm">
                        Bán chạy
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-display text-[16px] font-normal italic tracking-[0.03em]
                                 text-white transition-colors group-hover:text-[#22c55e]">
                    {dish.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-white/45">
                    {dish.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3">
                    <span className="font-display text-[17px] font-normal italic tracking-[0.03em] text-[#22c55e]">
                      {dish.price}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em]
                                     text-white/35 transition-colors group-hover:text-white/70">
                      Xem →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 flex flex-col items-center justify-between gap-6
                          border border-white/12 px-8 py-7 sm:flex-row">
            <div>
              <p className="font-display text-[20px] font-normal italic tracking-[0.04em] text-white">
                Xem đầy đủ thực đơn Sơn Kiều
              </p>
              <p className="mt-1 text-[13px] text-white/45">
                Combo · Đặc sản rừng · Đồ uống · Món lẻ — phục vụ tại khu du lịch
              </p>
            </div>
            <Link href="/dining"
              className="inline-flex shrink-0 items-center gap-2.5 border border-[#22c55e]
                         bg-transparent px-7 py-3 text-[11px] font-bold uppercase
                         tracking-[0.2em] text-[#22c55e] transition hover:bg-[#22c55e]
                         hover:text-[#052e16]"
              style={{ borderRadius: 0 }}>
              Xem Thực Đơn <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <WaveUp fill="#052e16" />
    </>
  );
}
