type DbReview = {
  id: string;
  guest_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

const AVATAR_COLORS = [
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-teal-600",
  "from-emerald-500 to-green-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-blue-500 to-indigo-600",
];

function formatViDate(iso: string): string {
  const d = new Date(iso);
  return `Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
}

const REVIEWS = [
  {
    name:   "Nguyễn Thu Hương",
    from:   "Hà Nội",
    initials: "TH",
    color:  "from-violet-500 to-purple-600",
    rating: 5,
    text:   "Trải nghiệm hang động tuyệt vời nhất trong cuộc đời tôi! Hướng dẫn viên rất chuyên nghiệp, nhiệt tình và am hiểu địa chất. Cảnh quan bên trong hang đẹp đến ngỡ ngàng. Nhất định sẽ quay lại!",
    trip:   "Hang Động",
    time:   "Tháng 3, 2025",
    verified: true,
  },
  {
    name:   "Trần Minh Quân",
    from:   "TP. Hồ Chí Minh",
    initials: "MQ",
    color:  "from-cyan-500 to-teal-600",
    rating: 5,
    text:   "Hồ bơi thiên nhiên đẹp không tưởng — nước trong vắt, mát lạnh và cực kỳ sạch sẽ. Cả gia đình tôi đều rất hài lòng. Đặt vé online nhanh, nhận QR tức thì, không cần xếp hàng. Quá tiện!",
    trip:   "Hồ Bơi Thiên Nhiên",
    time:   "Tháng 2, 2025",
    verified: true,
  },
  {
    name:   "Lê Thị Mai Anh",
    from:   "Đà Nẵng",
    initials: "MA",
    color:  "from-emerald-500 to-green-600",
    rating: 5,
    text:   "Cung đường tham quan sinh thái thực sự ấn tượng. Không khí trong lành, cảnh sắc hùng vĩ. Nhân viên rất nhiệt tình hỗ trợ từ A đến Z. Đây là kỳ nghỉ hoàn hảo cho ai yêu thiên nhiên!",
    trip:   "Tham Quan Sinh Thái",
    time:   "Tháng 4, 2025",
    verified: true,
  },
];

function StarFilled({ dim = false }: { dim?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={dim ? "#d1d5db" : "#f59e0b"} stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-100">
      <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.95.78-3 .53-.81 1.24-1.49 2.13-2.04L9.24 6c-1.4.73-2.52 1.73-3.36 3-.84 1.27-1.26 2.62-1.26 4.05 0 1.29.43 2.34 1.3 3.15.87.81 1.92 1.22 3.15 1.22.96 0 1.76-.3 2.4-.9.64-.6.96-1.39.96-2.37zm9.25 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.692-1.327-.817-.56-.124-1.074-.13-1.54-.022-.16-.94.09-1.94.77-3 .53-.81 1.24-1.49 2.13-2.04L18.49 6c-1.4.73-2.52 1.73-3.36 3-.84 1.27-1.26 2.62-1.26 4.05 0 1.29.43 2.34 1.3 3.15.87.81 1.92 1.22 3.15 1.22.96 0 1.76-.3 2.4-.9.64-.6.96-1.39.96-2.37z"/>
    </svg>
  );
}

export default function Testimonials({ reviews }: { reviews?: DbReview[] }) {
  const useDynamic = reviews && reviews.length > 0;

  return (
    <section className="relative overflow-hidden py-24"
      style={{ background: "linear-gradient(180deg,#f0fdf4 0%,#f8fafc 40%,#f0fdf4 100%)" }}>

      {/* Subtle top/bottom accent lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent" />

      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle,#bbf7d0,transparent 70%)" }} />
      <div className="pointer-events-none absolute -bottom-20 left-0 h-64 w-64 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle,#a7f3d0,transparent 70%)" }} />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">

        {/* ── Rating hero strip ── */}
        <div className="mb-14 flex flex-col items-center text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">
            Đánh giá thực tế
          </p>
          <h2 className="text-3xl font-black text-gray-900 md:text-4xl">
            Khách Hàng{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Nói Gì
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] text-gray-500">
            Hơn 5,000 du khách đã tin tưởng trải nghiệm — dưới đây là những chia sẻ chân thực nhất.
          </p>

          {/* Score card */}
          <div className="mt-8 w-full rounded-2xl border border-emerald-100
                          bg-white px-5 py-5 shadow-[0_4px_24px_rgba(16,185,129,0.10)]
                          sm:w-auto sm:px-8 sm:py-4">
            <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-6">
              {/* Score */}
              <div className="flex flex-col items-center">
                <span className="text-[2.8rem] font-black leading-none text-gray-900 sm:text-[3.2rem]">4.8</span>
                <div className="mt-1 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => <StarFilled key={i} />)}
                </div>
              </div>

              {/* Divider — desktop only */}
              <div className="hidden h-12 w-px bg-gray-100 sm:block" />

              {/* Rating bars */}
              <div className="flex flex-1 flex-col gap-1.5 text-left sm:flex-none">
                {[
                  { pct: 88, label: "5 sao" },
                  { pct: 9,  label: "4 sao" },
                  { pct: 3,  label: "≤3 sao" },
                ].map(({ pct, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="w-12 text-right text-[11px] text-gray-400 sm:w-14">{label}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 sm:w-28 sm:flex-none">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                        style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-500">{pct}%</span>
                  </div>
                ))}
              </div>

              {/* Divider — desktop only */}
              <div className="hidden h-12 w-px bg-gray-100 sm:block" />

              {/* Count */}
              <div className="flex flex-col items-center text-center">
                <span className="text-[1.3rem] font-black text-gray-800 sm:text-[1.4rem]">1,200+</span>
                <span className="text-[11px] text-gray-400">đánh giá<br/>xác thực</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Review cards ── */}
        {useDynamic && (
          <div className="grid gap-5 md:grid-cols-3">
            {reviews!.map((r, i) => {
              const initials = r.guest_name
                .split(" ")
                .filter(Boolean)
                .slice(-2)
                .map((w) => w[0].toUpperCase())
                .join("");
              const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
              return (
                <div key={r.id}
                  className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-6
                             shadow-[0_2px_20px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]
                             transition-all duration-300 hover:-translate-y-1.5
                             hover:shadow-[0_12px_40px_rgba(16,185,129,0.12)]
                             hover:ring-emerald-200">
                  <div className="absolute left-4 top-5 opacity-60">
                    <QuoteIcon />
                  </div>
                  <div className="mb-3 flex gap-0.5 pl-10">
                    {Array.from({ length: r.rating }).map((_, j) => <StarFilled key={j} />)}
                    {Array.from({ length: 5 - r.rating }).map((_, j) => <StarFilled key={j} dim />)}
                  </div>
                  <p className="flex-1 text-[14px] leading-[1.8] text-gray-600">
                    &ldquo;{r.comment}&rdquo;
                  </p>
                  <div className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full
                                  bg-emerald-50 px-3 py-1">
                    <span className="text-[10px] text-emerald-500">{formatViDate(r.created_at)}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-3 border-t border-gray-50 pt-4">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center
                                    rounded-full bg-gradient-to-br ${color} text-xs font-black text-white
                                    shadow-sm`}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[13px] font-bold text-gray-900">{r.guest_name}</p>
                        <VerifiedIcon />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!useDynamic && (
          <div className="grid gap-5 md:grid-cols-3">
            {REVIEWS.map(({ name, from, initials, color, rating, text, trip, time, verified }) => (
              <div key={name}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-6
                           shadow-[0_2px_20px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]
                           transition-all duration-300 hover:-translate-y-1.5
                           hover:shadow-[0_12px_40px_rgba(16,185,129,0.12)]
                           hover:ring-emerald-200">

                {/* Large quote mark */}
                <div className="absolute left-4 top-5 opacity-60">
                  <QuoteIcon />
                </div>

                {/* Stars */}
                <div className="mb-3 flex gap-0.5 pl-10">
                  {Array.from({ length: rating }).map((_, i) => <StarFilled key={i} />)}
                  {Array.from({ length: 5 - rating }).map((_, i) => <StarFilled key={i} dim />)}
                </div>

                {/* Quote */}
                <p className="flex-1 text-[14px] leading-[1.8] text-gray-600">
                  &ldquo;{text}&rdquo;
                </p>

                {/* Trip badge */}
                <div className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full
                                bg-emerald-50 px-3 py-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    {trip}
                  </span>
                  <span className="text-[10px] text-emerald-400">· {time}</span>
                </div>

                {/* Author */}
                <div className="mt-4 flex items-center gap-3 border-t border-gray-50 pt-4">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center
                                  rounded-full bg-gradient-to-br ${color} text-xs font-black text-white
                                  shadow-sm`}>
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[13px] font-bold text-gray-900">{name}</p>
                      {verified && <VerifiedIcon />}
                    </div>
                    <p className="text-[11px] text-gray-400">{from}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Platform logos strip ── */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6
                        border-t border-gray-100 pt-10">
          {["Google", "TripAdvisor", "Booking.com", "Agoda"].map(platform => (
            <span key={platform}
              className="flex items-center gap-2 text-[12px] font-semibold text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {platform}
            </span>
          ))}
          <span className="text-[12px] text-gray-300">và nhiều nền tảng khác</span>
        </div>
      </div>
    </section>
  );
}
