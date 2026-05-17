import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Đường Đến Khu Du Lịch Sơn Kiều | Trường Sơn, Quảng Trị",
  description:
    "Hướng dẫn đường đến Khu Du Lịch Sinh Thái Sơn Kiều ở Trường Sơn, Quảng Trị từ Đông Hà, Đồng Hới, Huế và Đà Nẵng. Xem lộ trình, mốc đường và phương tiện phù hợp.",
  keywords: ["đường đến Sơn Kiều", "Khu Du Lịch Sơn Kiều ở đâu", "du lịch Trường Sơn Quảng Trị", "đường đi Sơn Kiều"],
  alternates: { canonical: "/directions" },
};

const ROUTES = [
  {
    from:     "Đà Nẵng",
    distance: "~180 km",
    time:     "~3.5 giờ",
    steps: [
      { road: "QL1A",        desc: "Từ Đà Nẵng đi theo Quốc lộ 1A về hướng Bắc qua Huế (~110km)." },
      { road: "QL1A → QL9",  desc: "Tại Đông Hà rẽ trái vào QL9, đi về hướng Tây (~40km)." },
      { road: "QL9 → ĐT565", desc: "Tại thị trấn La Lay, rẽ phải vào đường tỉnh ĐT565 (~20km)." },
      { road: "ĐT565",       desc: "Đi thẳng theo ĐT565, theo biển chỉ dẫn 'Khu Du Lịch Sơn Kiều' vào đến khu vực Trường Sơn." },
    ],
  },
  {
    from:     "Huế",
    distance: "~120 km",
    time:     "~2.5 giờ",
    steps: [
      { road: "QL1A",  desc: "Từ Huế đi theo Quốc lộ 1A về hướng Bắc vượt đèo Hải Vân, qua Đông Hà (~75km)." },
      { road: "QL9",   desc: "Tại Đông Hà rẽ trái vào QL9 đi về hướng Tây (~40km)." },
      { road: "ĐT565", desc: "Tại La Lay, rẽ phải vào ĐT565, đi khoảng 20km đến điểm Trường Sơn, theo biển báo." },
    ],
  },
  {
    from:     "Đồng Hới",
    distance: "~60 km",
    time:     "~1.5 giờ",
    steps: [
      { road: "QL1A",  desc: "Từ Đồng Hới đi QL1A về hướng Nam qua địa phận Quảng Trị (~25km)." },
      { road: "QL9",   desc: "Rẽ vào QL9 hướng Tây, đi qua thị trấn Cam Lộ (~15km)." },
      { road: "ĐT565", desc: "Vào ĐT565, đi thẳng khoảng 20km đến Trường Sơn — theo biển 'Khu Du Lịch Sơn Kiều'." },
    ],
  },
];

const TRANSPORT = [
  {
    mode: "Xe Tự Lái",
    num:  "01",
    desc: "Phương tiện thuận tiện nhất. Đường đến Sơn Kiều phần lớn là đường nhựa, xe ô tô đi thoải mái. Một số đoạn cuối có thể gồ ghề — nên đi xe gầm cao.",
    tips: [
      "Đổ đầy xăng trước khi vào khu vực Trường Sơn",
      "Tải bản đồ offline phòng mất sóng",
      "Bãi đậu xe rộng rãi, miễn phí trong khu",
      "Nên khởi hành sáng sớm để tránh nắng",
    ],
  },
  {
    mode: "Xe Khách",
    num:  "02",
    desc: "Tuyến xe khách Đông Hà – Trường Sơn có mỗi ngày. Xuống bến Trường Sơn, gọi điện để được đón vào khu. Hoặc đi xe khách đến Đông Hà rồi bắt xe ôm.",
    tips: [
      "Xe chạy lúc 6:00 và 11:00 từ bến xe Đông Hà",
      "Giá vé ~40.000đ/lượt",
      "Gọi 0857 086 588 để được đón từ bến xe",
      "Hỏi tài xế bến 'Khu Du Lịch Sơn Kiều'",
    ],
  },
  {
    mode: "Xe Máy",
    num:  "03",
    desc: "Thích hợp cho những bạn thích phượt. Đường đèo đẹp nhưng có một số đoạn dốc — nên kiểm tra xe kỹ trước khi đi, đặc biệt phanh và lốp.",
    tips: [
      "Mang theo áo mưa và đồ bảo hộ đầy đủ",
      "Tránh đi trong điều kiện mưa lớn",
      "Có thể dừng nghỉ tại thị trấn Cam Lộ",
      "Bãi đậu xe máy miễn phí trong khu",
    ],
  },
];

const LANDMARKS = [
  { name: "Thị trấn Cam Lộ",                 dist: "~30 km từ khu", note: "Điểm mua sắm, đổ xăng cuối trước khi vào" },
  { name: "Ngã ba La Lay (QL9 & ĐT565)",      dist: "~15 km từ khu", note: "Điểm rẽ quan trọng — theo biển Trường Sơn" },
  { name: "Cầu Trường Sơn",                   dist: "~3 km từ khu",  note: "Vượt qua cầu, rẽ phải vào đường vào khu" },
  { name: "Trụ sở UBND xã Trường Sơn",        dist: "~1 km từ khu",  note: "Hỏi thăm người dân nếu cần" },
  { name: "Cổng vào Khu Du Lịch Sơn Kiều",    dist: "Điểm đến",      note: "Biển hiệu lớn, có bảo vệ hướng dẫn đậu xe" },
];

export default function DirectionsPage() {
  return (
    <main className="min-h-screen">

      <PageHero
        title="Hướng Dẫn Đường Đến"
        eyebrow="Xã Trường Sơn · Quảng Trị"
        subtitle="Lộ trình chi tiết từ các thành phố lớn đến Khu Du Lịch Sinh Thái Sơn Kiều."
        crumbs={[{ label: "Đường Đến" }]}
        cta={{ label: "Gọi hỗ trợ: 0857 086 588", href: "tel:0857086588" }}
        size="compact"
      />

      {/* Map */}
      <div className="bg-white">
        <div className="relative">
          <iframe
            src="https://maps.google.com/maps?q=Khu+Du+Lich+Sinh+Thai+Son+Kieu,+Truong+Son,+Quang+Tri&output=embed"
            width="100%" height="420"
            style={{ border: 0, display: "block" }}
            allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bản đồ Khu Du Lịch Sơn Kiều"
          />
          <div className="absolute bottom-4 right-4">
            <a href="https://maps.app.goo.gl/EwefauNChTBqBGZL9"
              target="_blank" rel="noopener noreferrer"
              className="border border-gray-200 bg-white px-4 py-2 text-[12px] font-semibold
                         text-gray-700 shadow-sm transition hover:bg-gray-50"
              style={{ borderRadius: 0 }}>
              Mở Google Maps ↗
            </a>
          </div>
        </div>
      </div>

      {/* Routes */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <div className="mb-10 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
              Lộ Trình
            </p>
            <h2 className="mt-2 font-display text-[28px] font-normal italic text-gray-900 md:text-[2rem]">
              Các Tuyến Đường Phổ Biến
            </h2>
            <p className="mt-2 text-[14px] text-gray-500">Lộ trình chi tiết từ các thành phố lớn gần nhất</p>
          </div>

          <div className="grid gap-px bg-gray-100 md:grid-cols-3">
            {ROUTES.map(route => (
              <div key={route.from} className="overflow-hidden bg-white">
                <div className="bg-[#052e16] p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-white/50">Từ</p>
                      <h3 className="text-[20px] font-black">{route.from}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[22px] font-black">{route.distance}</p>
                      <p className="text-[12px] text-white/60">{route.time}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <ol className="space-y-4">
                    {route.steps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center
                                          bg-[#052e16] text-[11px] font-bold text-white">
                            {i + 1}
                          </div>
                          {i < route.steps.length - 1 && (
                            <div className="mt-1 h-full w-px bg-gray-100" />
                          )}
                        </div>
                        <div className="min-w-0 pb-3">
                          <span className="mb-1 inline-block border border-gray-200 px-1.5 py-0.5
                                           text-[10px] font-bold uppercase tracking-[0.1em] text-[#052e16]"
                            style={{ borderRadius: 0 }}>
                            {step.road}
                          </span>
                          <p className="text-[12px] leading-relaxed text-gray-600">{step.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transport */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-10 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
              Phương Tiện
            </p>
            <h2 className="mt-2 font-display text-[28px] font-normal italic text-gray-900 md:text-[2rem]">
              Cách Di Chuyển
            </h2>
            <p className="mt-2 text-[14px] text-gray-500">Chọn cách di chuyển phù hợp với bạn</p>
          </div>

          <div className="grid gap-px bg-gray-200 md:grid-cols-3">
            {TRANSPORT.map(t => (
              <div key={t.mode} className="overflow-hidden bg-white">
                <div className="bg-[#052e16] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center
                                    border border-white/20 text-[13px] font-black text-white">
                      {t.num}
                    </div>
                    <h3 className="text-[16px] font-black text-white">{t.mode}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[13px] leading-relaxed text-gray-500">{t.desc}</p>
                  <ul className="mt-4 space-y-2">
                    {t.tips.map(tip => (
                      <li key={tip} className="flex items-start gap-2 text-[12px] text-gray-600">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center
                                         bg-emerald-100 text-[10px] font-bold text-emerald-700">
                          ✓
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Landmarks + Info */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2">

            {/* Landmarks */}
            <div>
              <h2 className="font-display text-[22px] font-normal italic text-gray-900">Điểm Mốc Quan Trọng</h2>
              <p className="mt-1 mb-6 text-[13px] text-gray-400">
                Các mốc địa danh giúp bạn định hướng trên đường đến Sơn Kiều
              </p>
              <div className="space-y-px bg-gray-100">
                {LANDMARKS.map((lm, i) => (
                  <div key={lm.name}
                    className="flex items-start gap-4 bg-white p-4 transition hover:bg-gray-50">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center
                                    text-[13px] font-bold ${
                      i === LANDMARKS.length - 1
                        ? "bg-[#052e16] text-white"
                        : "border border-gray-200 bg-white text-gray-600"
                    }`}>
                      {i === LANDMARKS.length - 1 ? "★" : i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-gray-900">{lm.name}</p>
                      <p className="text-[12px] font-medium text-emerald-600">{lm.dist}</p>
                      <p className="mt-0.5 text-[12px] text-gray-400">{lm.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info + CTAs */}
            <div className="space-y-5">

              {/* Parking */}
              <div className="border border-gray-200 p-6">
                <h3 className="mb-4 text-[15px] font-black text-gray-900">🅿️ Thông Tin Đậu Xe</h3>
                <ul className="space-y-2.5">
                  {[
                    "Bãi đậu xe rộng, miễn phí hoàn toàn",
                    "Có mái che cho xe máy",
                    "Bảo vệ 24/7",
                    "Có chỗ dành riêng cho xe khuyết tật",
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-[13px] text-gray-600">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center
                                       bg-emerald-100 text-[10px] font-bold text-emerald-700">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Call support */}
              <div className="border border-emerald-200 bg-emerald-50 p-6">
                <h3 className="mb-2 text-[15px] font-black text-gray-900">📞 Cần Hỗ Trợ Đường Đi?</h3>
                <p className="mb-4 text-[13px] leading-relaxed text-gray-500">
                  Đội ngũ chúng tôi sẵn sàng hướng dẫn đường và đón khách tại các điểm lớn gần khu.
                </p>
                <a href="tel:0857086588"
                  className="flex items-center gap-3 border border-emerald-100 bg-white px-4 py-3
                             text-[14px] font-semibold text-gray-900 shadow-sm transition hover:bg-emerald-50"
                  style={{ borderRadius: 0 }}>
                  <span className="text-emerald-600">📱</span>
                  0857 086 588
                </a>
              </div>

              <Link href="/booking"
                className="flex w-full items-center justify-center gap-2 bg-[#052e16]
                           px-4 py-3.5 text-[14px] font-bold text-white
                           transition hover:bg-[#052e16]/90"
                style={{ borderRadius: 0 }}>
                Đặt Vé Trước Khi Đến →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Warning banner */}
      <div className="border-y border-amber-200 bg-amber-50 py-5">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="text-center text-[13px] text-amber-800">
            <span className="font-bold">⚠️ Lưu ý:</span>{" "}
            Một số ứng dụng bản đồ chưa cập nhật chính xác địa điểm Sơn Kiều.
            Nếu gặp khó khăn, hãy gọi trực tiếp{" "}
            <a href="tel:0857086588" className="font-bold underline">0857 086 588</a> để được hỗ trợ.
          </p>
        </div>
      </div>
    </main>
  );
}
