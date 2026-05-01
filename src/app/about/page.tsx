import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Về Sơn Kiều",
  description: "Khám phá câu chuyện, sứ mệnh và đội ngũ đằng sau Khu Du Lịch Sinh Thái Sơn Kiều tại Trường Sơn, Quảng Trị — nơi kết nối con người với thiên nhiên hoang sơ.",
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3C17 3 10 5 7 12C5 17 8 21 12 21C16 21 19 17 19 13C19 9 16 7 13 8C11 8.5 10 10 11 12C12 14 15 13 15 11"/>
        <path d="M7 12C5 8 6 4 8 3"/>
      </svg>
    ), gradient: "from-green-500 to-emerald-600", glow: "rgba(34,197,94,0.35)",
    title: "Thiên Nhiên Nguyên Sơ",
    desc:  "Hang động triệu năm, hồ suối tự nhiên và rừng nguyên sinh Trường Sơn hoang sơ, chưa bị tác động bởi đô thị hoá.",
  },
  { icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ), gradient: "from-emerald-500 to-teal-600", glow: "rgba(16,185,129,0.35)",
    title: "An Toàn Tuyệt Đối",
    desc:  "Toàn bộ hoạt động đều có quy trình an toàn nghiêm ngặt, thiết bị bảo hộ đầy đủ và được kiểm tra định kỳ.",
  },
  { icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ), gradient: "from-blue-500 to-indigo-600", glow: "rgba(99,102,241,0.35)",
    title: "Hướng Dẫn Viên Chuyên Nghiệp",
    desc:  "Đội ngũ HDV bản địa am hiểu địa hình, văn hoá và thiên nhiên địa phương — luôn đồng hành cùng bạn.",
  },
  { icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ), gradient: "from-orange-500 to-amber-500", glow: "rgba(249,115,22,0.35)",
    title: "Ẩm Thực Đặc Sắc",
    desc:  "Trải nghiệm ẩm thực đặc sản Quảng Trị — từ cơm lam, gà nướng lá chanh đến các món đặc trưng vùng Trường Sơn.",
  },
  { icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ), gradient: "from-teal-500 to-cyan-600", glow: "rgba(20,184,166,0.35)",
    title: "Giá Cả Hợp Lý",
    desc:  "Chính sách giá minh bạch, không phát sinh chi phí ẩn. Trẻ em dưới 1m miễn phí — phù hợp cho cả gia đình.",
  },
  { icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16"
        style={{ background: "linear-gradient(160deg,#030f05 0%,#071a0b 55%,#040e06 100%)" }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-[100px]"
            style={{ background: "radial-gradient(ellipse,rgba(16,185,129,0.12) 0%,transparent 70%)" }} />
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="adots" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="white"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#adots)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="mb-6 flex items-center gap-2 text-[12px] text-white/40">
            <Link href="/" className="transition hover:text-white/70">Trang chủ</Link>
            <span>/</span>
            <span className="text-white/60">Về chúng tôi</span>
          </div>
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10
                            bg-white/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase
                            tracking-[0.18em] text-white/60 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Câu chuyện của chúng tôi
            </div>
            <h1 className="text-4xl font-black leading-none text-white md:text-[3.2rem]">
              Về{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Sơn Kiều
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/55">
              Từ những bước chân đầu tiên vào rừng Trường Sơn đến khu du lịch sinh thái được hàng vạn du khách yêu mến — đây là hành trình của chúng tôi.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map(({ value, label, gradient }) => (
              <div key={label} className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-sm">
                <p className={`text-[2rem] font-black leading-none bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                  {value}
                </p>
                <p className="mt-1 text-[12px] text-white/40">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-gray-50" />
      </section>

      {/* ── Story / Mission ── */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">Sứ Mệnh</p>
              <h2 className="text-3xl font-black text-gray-900 md:text-4xl">
                Nơi Thiên Nhiên{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  Gặp Gỡ Con Người
                </span>
              </h2>
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-600">
                <p>Sơn Kiều ra đời từ một tình yêu giản dị — tình yêu với núi rừng Trường Sơn hùng vĩ, với những dòng suối trong vắt ẩn mình giữa đại ngàn, và với những hang động triệu năm tuổi còn giữ nguyên vẻ hoang sơ nguyên thuỷ.</p>
                <p>Chúng tôi tin rằng mỗi chuyến đi không chỉ là giây phút nghỉ ngơi, mà còn là cơ hội để con người kết nối sâu sắc hơn với thiên nhiên — để lắng nghe tiếng nước chảy, để hít thở không khí rừng nguyên sinh và để cảm nhận sự bình yên thực sự.</p>
                <p>Với phương châm <em className="text-emerald-700 font-semibold not-italic">"Du lịch có trách nhiệm — Phát triển bền vững"</em>, Sơn Kiều cam kết bảo tồn hệ sinh thái địa phương, hỗ trợ cộng đồng bản địa và mang đến những trải nghiệm xứng đáng với từng đồng bạn bỏ ra.</p>
              </div>
            </div>

            {/* Commitment card */}
            <div className="relative overflow-hidden rounded-3xl p-8 text-white"
              style={{ background: "linear-gradient(135deg,#071a0b 0%,#0d2f12 100%)" }}>
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute right-0 top-0 h-48 w-48 rounded-full blur-[60px]"
                  style={{ background: "radial-gradient(circle,rgba(16,185,129,0.15),transparent 70%)" }} />
              </div>
              <div className="relative">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl
                                bg-gradient-to-br from-emerald-500 to-teal-600
                                shadow-[0_0_24px_rgba(16,185,129,0.4)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <h3 className="text-[18px] font-black text-white">Cam Kết Của Chúng Tôi</h3>
                <ul className="mt-5 space-y-3">
                  {COMMITMENTS.map(item => (
                    <li key={item} className="flex items-start gap-3 text-[14px] text-emerald-100/80">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Sơn Kiều ── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">Lý Do Chọn Chúng Tôi</p>
            <h2 className="text-3xl font-black text-gray-900 md:text-4xl">
              Tại Sao Chọn{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Sơn Kiều?
              </span>
            </h2>
            <p className="mt-3 text-[15px] text-gray-500 max-w-xl mx-auto">
              Hơn cả một điểm đến — chúng tôi mang đến trải nghiệm trọn vẹn mà bạn sẽ muốn quay lại.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_CARDS.map(({ icon, gradient, glow, title, desc }) => (
              <div key={title}
                className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6
                           shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all duration-300
                           hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]
                           hover:border-emerald-100">
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient}`}
                  style={{ boxShadow: `0 0 20px ${glow}` }}>
                  {icon}
                </div>
                <h3 className="text-[14px] font-bold text-gray-900 transition-colors group-hover:text-emerald-700">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-20"
        style={{ background: "linear-gradient(180deg,#f0fdf4 0%,#f8fafc 100%)" }}>
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">Đội Ngũ</p>
            <h2 className="text-3xl font-black text-gray-900 md:text-4xl">Con Người Đằng Sau Sơn Kiều</h2>
            <p className="mt-3 text-[15px] text-gray-500 max-w-lg mx-auto">
              Những con người tâm huyết — luôn nỗ lực để mỗi chuyến đi của bạn trở nên đáng nhớ.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TEAM.map(member => (
              <div key={member.name}
                className="group flex flex-col overflow-hidden rounded-3xl bg-white p-7
                           shadow-[0_2px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] text-center
                           transition-all duration-300 hover:-translate-y-1
                           hover:shadow-[0_12px_40px_rgba(16,185,129,0.10)]
                           hover:ring-emerald-200">
                <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full
                                bg-gradient-to-br ${member.color} text-xl font-black text-white
                                shadow-lg`}>
                  {member.avatar}
                </div>
                <h3 className="text-[15px] font-black text-gray-900">{member.name}</h3>
                <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-600">
                  {member.role}
                </p>
                <p className="mt-4 text-[13px] leading-relaxed text-gray-500">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20"
        style={{ background: "linear-gradient(160deg,#030f05 0%,#071a0b 55%,#040e06 100%)" }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-72 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
            style={{ background: "radial-gradient(ellipse,rgba(16,185,129,0.12) 0%,transparent 70%)" }} />
        </div>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        <div className="relative mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">Đến Thăm Chúng Tôi</h2>
          <p className="mt-3 text-[15px] text-white/50">
            Trải nghiệm thiên nhiên Trường Sơn cùng đội ngũ Sơn Kiều — chúng tôi đang chờ đón bạn!
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/booking"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5
                         text-[14px] font-bold text-white shadow-[0_4px_20px_rgba(16,185,129,0.40)]
                         transition hover:bg-emerald-500 hover:-translate-y-0.5">
              Đặt Vé Ngay
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/15
                         px-7 py-3.5 text-[14px] font-semibold text-white backdrop-blur-sm
                         transition hover:bg-white/10">
              Liên Hệ Chúng Tôi
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
