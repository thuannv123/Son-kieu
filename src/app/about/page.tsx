import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Về Khu Du Lịch Sinh Thái Sơn Kiều",
  description: "Tìm hiểu Khu Du Lịch Sinh Thái Sơn Kiều tại Trường Sơn, Quảng Trị: câu chuyện hình thành, thiên nhiên hoang sơ, văn hóa bản địa và định hướng du lịch bền vững.",
  keywords: ["về Sơn Kiều", "Khu Du Lịch Sinh Thái Sơn Kiều", "du lịch sinh thái Quảng Trị", "Trường Sơn Quảng Trị"],
  alternates: { canonical: "/about" },
};

const STATS = [
  { value: "3+",     label: "Năm hoạt động", gradient: "from-emerald-400 to-teal-300" },
  { value: "5.000+", label: "Lượt khách",    gradient: "from-sky-400 to-cyan-300"     },
  { value: "4.9★",   label: "Đánh giá",      gradient: "from-amber-400 to-yellow-300" },
  { value: "15+",    label: "Hoạt động",     gradient: "from-violet-400 to-purple-300"},
];

const WHY_CARDS = [
  { icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3C17 3 10 5 7 12C5 17 8 21 12 21C16 21 19 17 19 13C19 9 16 7 13 8C11 8.5 10 10 11 12C12 14 15 13 15 11"/>
        <path d="M7 12C5 8 6 4 8 3"/>
      </svg>
    ), gradient: "from-green-500 to-emerald-600", glow: "rgba(34,197,94,0.35)",
    title: "Thiên Nhiên Nguyên Sơ",
    desc:  "Hang động triệu năm, hồ suối tự nhiên và rừng nguyên sinh Trường Sơn hoang sơ, chưa bị tác động bởi đô thị hoá.",
  },
  { icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ), gradient: "from-emerald-500 to-teal-600", glow: "rgba(16,185,129,0.35)",
    title: "An Toàn Tuyệt Đối",
    desc:  "Toàn bộ hoạt động đều có quy trình an toàn nghiêm ngặt, thiết bị bảo hộ đầy đủ và được kiểm tra định kỳ.",
  },
  { icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ), gradient: "from-blue-500 to-indigo-600", glow: "rgba(99,102,241,0.35)",
    title: "Hướng Dẫn Viên Chuyên Nghiệp",
    desc:  "Đội ngũ HDV bản địa am hiểu địa hình, văn hoá và thiên nhiên địa phương — luôn đồng hành cùng bạn.",
  },
  { icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ), gradient: "from-orange-500 to-amber-500", glow: "rgba(249,115,22,0.35)",
    title: "Ẩm Thực Đặc Sắc",
    desc:  "Trải nghiệm ẩm thực đặc sản Quảng Trị — từ cơm lam, gà nướng lá chanh đến các món đặc trưng vùng Trường Sơn.",
  },
  { icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ), gradient: "from-teal-500 to-cyan-600", glow: "rgba(20,184,166,0.35)",
    title: "Giá Cả Hợp Lý",
    desc:  "Chính sách giá minh bạch, không phát sinh chi phí ẩn. Trẻ em dưới 1m miễn phí — phù hợp cho cả gia đình.",
  },
  { icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ), gradient: "from-violet-500 to-purple-600", glow: "rgba(139,92,246,0.35)",
    title: "Đặt Vé Dễ Dàng",
    desc:  "Đặt vé trực tuyến 24/7, nhận QR code tức thì qua SMS & email — không cần xếp hàng, không chờ xác nhận.",
  },
];

const TEAM = [
  { name: "Nguyễn Văn Thuận", role: "Nhà Sáng Lập",         avatar: "NT", color: "from-emerald-600 to-teal-600",
    bio: "Người con bản địa Trường Sơn với hơn 15 năm gắn bó với núi rừng. Ông Thuận xây dựng Sơn Kiều từ tình yêu thiên nhiên và mong muốn giới thiệu vẻ đẹp quê hương đến với mọi người." },
  { name: "Trần Văn Hùng",    role: "Trưởng Hướng Dẫn Viên", avatar: "TH", color: "from-blue-600 to-indigo-600",
    bio: "Hơn 8 năm kinh nghiệm dẫn đoàn khám phá hang động và rừng nguyên sinh. Được đào tạo bài bản về cứu hộ, sinh thái học và luôn đặt trải nghiệm khách hàng lên hàng đầu." },
  { name: "Lê Thị Mai",       role: "Quản Lý Dịch Vụ",      avatar: "LM", color: "from-rose-500 to-pink-600",
    bio: "Với nền tảng quản trị du lịch và đam mê dịch vụ, chị Mai đảm bảo mọi trải nghiệm của khách đều được chuẩn bị chu đáo từ đặt vé đến khi rời resort." },
];

const COMMITMENTS = [
  "Bảo tồn 100% hệ sinh thái tự nhiên",
  "Không sử dụng hoá chất trong khu vực suối",
  "Hỗ trợ sinh kế cho người dân địa phương",
  "Giảm thiểu rác thải nhựa toàn khu",
  "Trồng cây bù đắp lượng carbon mỗi năm",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">

      <PageHero
        title="Về Sơn Kiều"
        eyebrow="Câu Chuyện Của Chúng Tôi"
        subtitle="Từ những bước chân đầu tiên vào rừng Trường Sơn đến khu du lịch sinh thái được hàng vạn du khách yêu mến — đây là hành trình của chúng tôi."
        crumbs={[{ label: "Về Chúng Tôi" }]}
        size="default"
      />

      {/* ── Story / Mission ── */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-start">
            <div>
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e]">
                Sứ Mệnh
              </p>
              <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] font-normal italic
                             leading-[1.06] tracking-[0.04em] text-gray-950">
                Nơi Thiên Nhiên Gặp Gỡ Con Người
              </h2>
              <div className="my-7 flex items-center gap-4">
                <span className="block h-px w-12 bg-gray-200" />
                <span className="text-[#22c55e] opacity-60">✦</span>
                <span className="block h-px w-12 bg-gray-200" />
              </div>
              <div className="space-y-5 text-[15px] leading-[2] text-gray-500">
                <p>Sơn Kiều ra đời từ một tình yêu giản dị — tình yêu với núi rừng Trường Sơn hùng vĩ, với những dòng suối trong vắt ẩn mình giữa đại ngàn, và với những hang động triệu năm tuổi còn giữ nguyên vẻ hoang sơ nguyên thuỷ.</p>
                <p>Chúng tôi tin rằng mỗi chuyến đi không chỉ là giây phút nghỉ ngơi, mà còn là cơ hội để con người kết nối sâu sắc hơn với thiên nhiên — để lắng nghe tiếng nước chảy, để hít thở không khí rừng nguyên sinh và để cảm nhận sự bình yên thực sự.</p>
                <p>Với phương châm <em className="font-semibold text-gray-700 not-italic">&ldquo;Du lịch có trách nhiệm — Phát triển bền vững&rdquo;</em>, Sơn Kiều cam kết bảo tồn hệ sinh thái địa phương, hỗ trợ cộng đồng bản địa và mang đến những trải nghiệm xứng đáng với từng đồng bạn bỏ ra.</p>
              </div>
            </div>

            {/* Commitment card */}
            <div className="border border-[#052e16]/10 bg-[#052e16] p-10">
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#22c55e]">
                Cam Kết Của Chúng Tôi
              </p>
              <ul className="space-y-4">
                {COMMITMENTS.map(item => (
                  <li key={item} className="flex items-start gap-3 text-[14px] leading-relaxed text-white/70">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e"
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className="mt-0.5 shrink-0">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-5 border-t border-white/10 pt-7">
                {STATS.map(({ value, label }) => (
                  <div key={label}>
                    <p className="font-display text-[1.8rem] font-normal italic tracking-[0.04em] text-white">
                      {value}
                    </p>
                    <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Sơn Kiều ── */}
      <section className="bg-white py-24 md:py-28">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-14 text-center">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e]">
              Lý Do Chọn Chúng Tôi
            </p>
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] font-normal italic
                           leading-[1.06] tracking-[0.04em] text-gray-950">
              Tại Sao Chọn Sơn Kiều?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] font-light leading-[2] text-gray-400">
              Hơn cả một điểm đến — chúng tôi mang đến trải nghiệm trọn vẹn mà bạn sẽ muốn quay lại.
            </p>
          </div>
          <div className="grid gap-px bg-gray-100 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_CARDS.map(({ icon, title, desc }) => (
              <div key={title}
                className="group flex flex-col bg-white p-8 transition-colors hover:bg-[#052e16]/[0.02]">
                <div className="mb-6 flex h-12 w-12 items-center justify-center border border-gray-200
                                text-[#052e16]/60 transition-colors
                                group-hover:border-[#22c55e] group-hover:text-[#22c55e]">
                  {icon}
                </div>
                <h3 className="font-display text-[18px] font-normal italic leading-snug
                               tracking-[0.03em] text-gray-950
                               transition-colors group-hover:text-[#16a34a]">
                  {title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="bg-[#052e16] py-24 md:py-28">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-14 text-center">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e]">
              Đội Ngũ
            </p>
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] font-normal italic
                           leading-[1.06] tracking-[0.04em] text-white">
              Con Người Đằng Sau Sơn Kiều
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] font-light leading-[2] text-white/50">
              Những con người tâm huyết — luôn nỗ lực để mỗi chuyến đi của bạn trở nên đáng nhớ.
            </p>
          </div>
          <div className="grid gap-px bg-white/8 md:grid-cols-3">
            {TEAM.map(member => (
              <div key={member.name}
                className="flex flex-col bg-[#052e16] p-8 text-center
                           transition-colors hover:bg-[#073d1e]">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center
                                border border-white/20 font-display text-[1.4rem] font-normal
                                italic tracking-[0.04em] text-white/70">
                  {member.avatar}
                </div>
                <h3 className="font-display text-[18px] font-normal italic tracking-[0.03em] text-white">
                  {member.name}
                </h3>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.26em] text-[#22c55e]">
                  {member.role}
                </p>
                <p className="mt-4 text-[13px] leading-relaxed text-white/50">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-white/10 bg-[#052e16] py-24">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] font-normal italic
                         leading-[1.06] tracking-[0.04em] text-white">
            Đến Thăm Chúng Tôi
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] font-light leading-[2] text-white/50">
            Trải nghiệm thiên nhiên Trường Sơn cùng đội ngũ Sơn Kiều — chúng tôi đang chờ đón bạn!
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/booking"
              className="inline-flex items-center gap-2.5 border border-white bg-white
                         px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em]
                         text-[#052e16] transition hover:bg-white/90"
              style={{ borderRadius: 0 }}>
              Đặt Vé Ngay
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-2.5 border border-white/25
                         bg-transparent px-8 py-3.5 text-[11px] font-bold uppercase
                         tracking-[0.22em] text-white transition hover:bg-white/10"
              style={{ borderRadius: 0 }}>
              Liên Hệ Chúng Tôi
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
