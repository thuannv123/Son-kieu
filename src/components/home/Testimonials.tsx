import { WaveDown, WaveUp } from "@/components/ui/WaveDivider";

type DbReview = {
  id: string;
  guest_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

function formatViDate(iso: string): string {
  const d = new Date(iso);
  return `Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
}

const REVIEWS = [
  {
    name:     "Nguyễn Thu Hương",
    from:     "Hà Nội",
    initials: "TH",
    rating:   5,
    text:     "Trải nghiệm hang động tuyệt vời nhất trong cuộc đời tôi! Hướng dẫn viên rất chuyên nghiệp, nhiệt tình và am hiểu địa chất. Cảnh quan bên trong hang đẹp đến ngỡ ngàng. Nhất định sẽ quay lại!",
    trip:     "Hang Động",
    time:     "Tháng 3, 2025",
  },
  {
    name:     "Trần Minh Quân",
    from:     "TP. Hồ Chí Minh",
    initials: "MQ",
    rating:   5,
    text:     "Hồ bơi thiên nhiên đẹp không tưởng — nước trong vắt, mát lạnh và cực kỳ sạch sẽ. Cả gia đình đều rất hài lòng. Đặt vé online nhanh, nhận QR tức thì, không cần xếp hàng. Quá tiện!",
    trip:     "Hồ Bơi Thiên Nhiên",
    time:     "Tháng 2, 2025",
  },
  {
    name:     "Lê Thị Mai Anh",
    from:     "Đà Nẵng",
    initials: "MA",
    rating:   5,
    text:     "Cung đường tham quan sinh thái thực sự ấn tượng. Không khí trong lành, cảnh sắc hùng vĩ. Nhân viên rất nhiệt tình hỗ trợ từ A đến Z. Đây là kỳ nghỉ hoàn hảo cho ai yêu thiên nhiên!",
    trip:     "Tham Quan Sinh Thái",
    time:     "Tháng 4, 2025",
  },
];

function StarFilled() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" className="text-white/8">
      <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.95.78-3 .53-.81 1.24-1.49 2.13-2.04L9.24 6c-1.4.73-2.52 1.73-3.36 3-.84 1.27-1.26 2.62-1.26 4.05 0 1.29.43 2.34 1.3 3.15.87.81 1.92 1.22 3.15 1.22.96 0 1.76-.3 2.4-.9.64-.6.96-1.39.96-2.37zm9.25 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.692-1.327-.817-.56-.124-1.074-.13-1.54-.022-.16-.94.09-1.94.77-3 .53-.81 1.24-1.49 2.13-2.04L18.49 6c-1.4.73-2.52 1.73-3.36 3-.84 1.27-1.26 2.62-1.26 4.05 0 1.29.43 2.34 1.3 3.15.87.81 1.92 1.22 3.15 1.22.96 0 1.76-.3 2.4-.9.64-.6.96-1.39.96-2.37z"/>
    </svg>
  );
}

export default function Testimonials({ reviews }: { reviews?: DbReview[] }) {
  const useDynamic = reviews && reviews.length > 0;

  return (
    <>
      <WaveDown fill="#052e16" />

      <section className="bg-[#052e16] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-4 md:px-6">

          {/* Header */}
          <div className="mb-16 text-center">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e]">
              Đánh Giá Thực Tế
            </p>
            <h2 className="font-display text-[clamp(2.6rem,6vw,5rem)] font-normal italic
                           leading-[1.06] tracking-[0.04em] text-white">
              Khách Hàng Nói Gì
            </h2>
            <div className="my-7 flex items-center justify-center gap-4">
              <span className="block h-px w-14 bg-white/20" />
              <span className="text-[#22c55e] opacity-70">✦</span>
              <span className="block h-px w-14 bg-white/20" />
            </div>

            {/* Score strip */}
            <div className="mx-auto mt-8 inline-flex flex-wrap items-center justify-center
                            gap-6 border border-white/12 px-8 py-5">
              <div className="text-center">
                <p className="font-display text-[3.5rem] font-normal italic leading-none text-white">4.8</p>
                <div className="mt-2 flex justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => <StarFilled key={i} />)}
                </div>
              </div>
              <div className="h-12 w-px bg-white/15 hidden sm:block" />
              <div className="text-left">
                {[
                  { pct: 88, label: "5 sao" },
                  { pct: 9,  label: "4 sao" },
                  { pct: 3,  label: "≤3 sao" },
                ].map(({ pct, label }) => (
                  <div key={label} className="flex items-center gap-3 mb-1.5">
                    <span className="w-12 text-right text-[10px] uppercase tracking-[0.12em] text-white/40">
                      {label}
                    </span>
                    <div className="h-px w-28 bg-white/10">
                      <div className="h-full bg-[#22c55e]" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-white/50">{pct}%</span>
                  </div>
                ))}
              </div>
              <div className="h-12 w-px bg-white/15 hidden sm:block" />
              <div className="text-center">
                <p className="font-display text-[2rem] font-normal italic text-white">1,200+</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/40">
                  đánh giá xác thực
                </p>
              </div>
            </div>
          </div>

          {/* Review cards */}
          {useDynamic ? (
            <div className="grid gap-px bg-white/8 md:grid-cols-3">
              {reviews!.map((r, i) => {
                const initials = r.guest_name
                  .split(" ").filter(Boolean).slice(-2)
                  .map(w => w[0].toUpperCase()).join("");
                return (
                  <div key={r.id}
                    className="flex flex-col bg-[#052e16] p-8 transition-colors hover:bg-[#073d1e]">
                    <div className="mb-4 opacity-60"><QuoteIcon /></div>
                    <div className="mb-5 flex gap-0.5">
                      {Array.from({ length: r.rating }).map((_, j) => <StarFilled key={j} />)}
                    </div>
                    <p className="flex-1 font-display text-[17px] font-normal italic
                                  leading-[1.7] tracking-[0.03em] text-white/75">
                      &ldquo;{r.comment}&rdquo;
                    </p>
                    <div className="mt-6 border-t border-white/8 pt-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center
                                        border border-white/20 text-[11px] font-bold text-white/70">
                          {initials}
                        </div>
                        <p className="text-[13px] font-semibold text-white/80">{r.guest_name}</p>
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">
                        {formatViDate(r.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-px bg-white/8 md:grid-cols-3">
              {REVIEWS.map(({ name, from, initials, rating, text, trip, time }) => (
                <div key={name}
                  className="flex flex-col bg-[#052e16] p-8 transition-colors hover:bg-[#073d1e]">
                  <div className="mb-4 opacity-60"><QuoteIcon /></div>
                  <div className="mb-5 flex gap-0.5">
                    {Array.from({ length: rating }).map((_, i) => <StarFilled key={i} />)}
                  </div>
                  <p className="flex-1 font-display text-[17px] font-normal italic
                                leading-[1.7] tracking-[0.03em] text-white/75">
                    &ldquo;{text}&rdquo;
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#22c55e]/70">
                      {trip}
                    </span>
                    <span className="text-white/20">·</span>
                    <span className="text-[9px] text-white/35">{time}</span>
                  </div>
                  <div className="mt-5 border-t border-white/8 pt-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center
                                      border border-white/20 text-[11px] font-bold text-white/70">
                        {initials}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-white/80">{name}</p>
                        <p className="text-[10px] text-white/35">{from}</p>
                      </div>
                    </div>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Platform strip */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6
                          border-t border-white/8 pt-10">
            {["Google", "TripAdvisor", "Booking.com", "Agoda"].map(platform => (
              <span key={platform} className="flex items-center gap-2
                                              text-[11px] font-semibold uppercase tracking-[0.16em] text-white/30">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {platform}
              </span>
            ))}
          </div>
        </div>
      </section>

      <WaveUp fill="#052e16" />
    </>
  );
}
