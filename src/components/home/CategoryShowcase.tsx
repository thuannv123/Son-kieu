import Link from "next/link";
import Image from "next/image";
import type { Activity } from "@/types";

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

function fmtPrice(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function computeStats(activities: Activity[], cat: string) {
  const items = activities.filter(a => a.category === cat);
  if (!items.length) return [{ v: "–", l: "Dịch vụ" }, { v: "–", l: "Phút" }, { v: "–", l: "Mỗi khách" }];
  const count = items.length;
  const minDur = Math.min(...items.map(a => a.durationMinutes));
  const maxDur = Math.max(...items.map(a => a.durationMinutes));
  const minPrice = Math.min(...items.map(a => a.price));
  const durLabel = minDur === maxDur ? `${minDur}` : `${minDur}–${maxDur}`;
  return [
    { v: `${count}`, l: count === 1 ? "Dịch vụ" : "Dịch vụ" },
    { v: durLabel,   l: "Phút"                                 },
    { v: `Từ ${fmtPrice(minPrice)}`, l: "Mỗi khách"           },
  ];
}

const CATEGORIES = [
  {
    key:  "CAVE",
    href: "/activities?cat=CAVE",
    imgSrc: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80",
    label: "Hang Động",
    en: "Cave Exploration",
    desc: "Thám hiểm hệ thống hang động triệu năm tuổi với những khối thạch nhũ kỳ ảo, dòng suối ngầm thơ mộng và bầu không khí huyền bí.",
    stats: [] as { v: string; l: string }[],
    from: "#0d1117",
    via:  "#1a2332",
    to:   "#0f1a1a",
    accent: "#64748b",
    tag: "bg-slate-700/60 text-slate-300",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21l3-9 3 9M6 12l6-9 6 9M15 12l3 9"/>
        <path d="M6 18h12"/>
      </svg>
    ),
    large: true,
  },
  {
    key:  "LAKE",
    href: "/activities?cat=LAKE",
    imgSrc: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1000&auto=format&fit=crop&q=80",
    label: "Hồ Bơi",
    en: "Natural Swimming",
    desc: "Đắm mình trong làn nước ngọc bích trong lành giữa rừng già. Nhiệt độ lý tưởng quanh năm.",
    stats: [] as { v: string; l: string }[],
    from: "#071e2e",
    via:  "#0c3040",
    to:   "#0a2e2e",
    accent: "#22d3ee",
    tag: "bg-cyan-900/60 text-cyan-300",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    large: false,
  },
  {
    key:  "SIGHTSEEING",
    href: "/activities?cat=SIGHTSEEING",
    imgSrc: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1000&auto=format&fit=crop&q=80",
    label: "Tham Quan",
    en: "Eco Sightseeing",
    desc: "Dạo bộ trên những cung đường sinh thái với cảnh quan rừng núi hùng vĩ.",
    stats: [] as { v: string; l: string }[],
    from: "#081a0c",
    via:  "#0d2e14",
    to:   "#061a10",
    accent: "#4ade80",
    tag: "bg-emerald-900/60 text-emerald-300",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l4-8 4 5 3-3 5 6"/>
        <path d="M3 21h18"/>
      </svg>
    ),
    large: false,
  },
];

export default function CategoryShowcase({ activities = [] }: { activities?: Activity[] }) {
  const [cave, lake, sight] = CATEGORIES.map(cat => ({
    ...cat,
    stats: computeStats(activities, cat.key),
  }));

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">

        {/* Header */}
        <div className="mb-12">
          <p className="label mb-2">Danh mục</p>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-3xl font-black text-gray-900 md:text-4xl">
              Khám Phá Theo Sở Thích
            </h2>
            <Link href="/activities"
              className="hidden flex-shrink-0 items-center gap-1.5 text-sm font-semibold
                         text-emerald-700 hover:text-emerald-900 transition-colors sm:flex">
              Tất cả hoạt động <ArrowRightIcon />
            </Link>
          </div>
        </div>

        {/* Asymmetric grid: Cave tall-left, Lake+Sight stacked right */}
        <div className="grid gap-4 md:grid-cols-2 md:grid-rows-2" style={{ minHeight: "520px" }}>

          {/* Cave — tall, spans 2 rows */}
          <CategoryCard cat={cave} className="md:row-span-2" />

          {/* Lake */}
          <CategoryCard cat={lake} />

          {/* Sightseeing */}
          <CategoryCard cat={sight} />
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  cat,
  className = "",
}: {
  cat: typeof CATEGORIES[number];
  className?: string;
}) {
  return (
    <Link href={cat.href}
      className={`group relative flex flex-col overflow-hidden rounded-3xl
                  p-6 transition-transform duration-300 hover:-translate-y-1
                  ring-1 ring-white/5 ${className} ${cat.large ? "min-h-[300px] md:min-h-0" : "min-h-[240px]"}`}
      style={{ background: `linear-gradient(145deg, ${cat.from}, ${cat.via} 50%, ${cat.to})` }}>

      {/* Background photo */}
      {cat.imgSrc && (
        <Image
          src={cat.imgSrc}
          alt={cat.label}
          fill
          className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}

      {/* Decorative glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(ellipse 60% 50% at 50% 100%, ${cat.accent}18, transparent)` }} />

      {/* Top: icon + tag */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm"
          style={{ boxShadow: `0 0 24px ${cat.accent}30` }}>
          {cat.icon}
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${cat.tag}`}>
          {cat.en}
        </span>
      </div>

      {/* Spacer pushes content to bottom */}
      <div className="flex-1" />

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-2xl font-black text-white">{cat.label}</h3>
        <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-white/55">
          {cat.desc}
        </p>

        {/* Mini stats */}
        <div className="mt-4 flex gap-5">
          {cat.stats.map(({ v, l }) => (
            <div key={l}>
              <p className="text-lg font-black text-white">{v}</p>
              <p className="text-[10px] font-medium text-white/40">{l}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-5 inline-flex items-center gap-1.5 rounded-full
                        border border-white/20 bg-white/10 px-4 py-2
                        text-[12px] font-bold text-white backdrop-blur-sm
                        transition-all duration-200 group-hover:bg-white/20 group-hover:gap-2.5">
          Khám phá ngay
          <ArrowRightIcon />
        </div>
      </div>
    </Link>
  );
}
