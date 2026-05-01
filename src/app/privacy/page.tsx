import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chính Sách Bảo Mật",
  description:
    "Chính sách bảo mật của Khu Du Lịch Sinh Thái Sơn Kiều — cam kết bảo vệ thông tin cá nhân của quý khách khi sử dụng dịch vụ đặt vé và website.",
  alternates: { canonical: "/privacy" },
};

const TOC = [
  { id: "thu-thap",   label: "Thu thập thông tin" },
  { id: "su-dung",    label: "Sử dụng thông tin" },
  { id: "bao-mat",    label: "Bảo mật thông tin" },
  { id: "cookies",    label: "Cookies" },
  { id: "quyen",      label: "Quyền của quý khách" },
  { id: "lien-he",    label: "Liên hệ" },
];

function Chip({ n }: { n: string }) {
  return (
    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-[11px] font-black text-white">
      {n}
    </span>
  );
}

function Note({ color, icon, children }: { color: "amber" | "emerald" | "blue"; icon: string; children: React.ReactNode }) {
  const cls = {
    amber:   "bg-amber-50 ring-amber-200 text-amber-800",
    emerald: "bg-emerald-50 ring-emerald-200 text-emerald-800",
    blue:    "bg-blue-50 ring-blue-200 text-blue-800",
  }[color];
  return (
    <div className={`flex gap-3 rounded-2xl px-4 py-3.5 ring-1 text-[13.5px] leading-relaxed ${cls}`}>
      <span className="mt-0.5 shrink-0 text-base">{icon}</span>
      <div>{children}</div>
    </div>
  );
}

function DataItem({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="flex gap-3 rounded-xl bg-gray-50 px-4 py-3.5 ring-1 ring-gray-100">
      <span className="mt-0.5 text-base shrink-0">{icon}</span>
      <div>
        <p className="text-[12px] font-bold text-gray-700 mb-0.5">{title}</p>
        <p className="text-[13px] text-gray-500 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50/50 pt-16">

      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
          <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-4">
            <Link href="/" className="hover:text-blue-600 transition">Trang chủ</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">Chính Sách Bảo Mật</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">🔒</div>
                <h1 className="text-[28px] font-black text-gray-900 md:text-[34px]">Chính Sách Bảo Mật</h1>
              </div>
              <p className="text-[14px] text-gray-500 max-w-xl">
                Cam kết bảo vệ quyền riêng tư và thông tin cá nhân của quý khách khi sử dụng dịch vụ của Sơn Kiều.
              </p>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-500">
              Cập nhật: Tháng 4 · 2026
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <div className="flex gap-8 items-start">

          {/* Sidebar TOC */}
          <aside className="hidden lg:block w-52 shrink-0 sticky top-24">
            <div className="rounded-2xl bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Nội dung</p>
              <nav className="space-y-1">
                {TOC.map(item => (
                  <a key={item.id} href={`#${item.id}`}
                    className="block rounded-lg px-3 py-2 text-[12px] font-medium text-gray-500 transition hover:bg-blue-50 hover:text-blue-700">
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <Link href="/terms"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium text-gray-400 transition hover:bg-gray-50 hover:text-gray-600">
                  <span>📋</span> Điều khoản sử dụng
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0 flex-1 space-y-5">

            {/* Intro */}
            <div className="rounded-2xl bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]">
              <p className="text-[14px] leading-relaxed text-gray-600">
                Khu Du Lịch Sinh Thái Sơn Kiều xây dựng chính sách này nhằm giải thích rõ cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của quý khách khi sử dụng{" "}
                <span className="font-semibold text-blue-700">sonkieu.vn</span> và dịch vụ đặt vé trực tuyến.
                Việc tiếp tục sử dụng dịch vụ đồng nghĩa quý khách đồng ý với chính sách này.
              </p>
            </div>

            {/* 1. Thu thập */}
            <section id="thu-thap" className="rounded-2xl bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
                <Chip n="01" />
                <h2 className="text-[16px] font-bold text-gray-900">Thu Thập Thông Tin</h2>
              </div>
              <div className="p-6 space-y-3">
                <DataItem icon="🎫" title="Đặt vé trực tuyến"
                  body="Họ tên, số điện thoại, địa chỉ email, ngày tham quan, số lượng khách và thông tin thanh toán (mã hóa qua cổng thanh toán bảo mật)." />
                <DataItem icon="📧" title="Đăng ký nhận tin"
                  body="Địa chỉ email để gửi thông tin ưu đãi, sự kiện và cập nhật từ khu du lịch." />
                <DataItem icon="💬" title="Liên hệ trực tiếp"
                  body="Nội dung tin nhắn, câu hỏi hoặc phản hồi quý khách gửi qua form liên hệ hoặc hotline." />
                <DataItem icon="🌐" title="Tự động qua website"
                  body="Địa chỉ IP, loại trình duyệt, thiết bị truy cập, trang đã xem và thời gian — thông qua cookies và công nghệ tương tự." />
                <Note color="blue" icon="🛡️">
                  Chúng tôi <strong>không thu thập</strong> thông tin nhạy cảm như số CCCD, thông tin sức khỏe hoặc dữ liệu sinh trắc học trừ khi pháp luật yêu cầu.
                </Note>
              </div>
            </section>

            {/* 2. Sử dụng */}
            <section id="su-dung" className="rounded-2xl bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
                <Chip n="02" />
                <h2 className="text-[16px] font-bold text-gray-900">Sử Dụng Thông Tin</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-2.5">
                  {[
                    "Xác nhận và xử lý đơn đặt vé, gửi vé QR và thông báo nhắc lịch tham quan.",
                    "Xử lý thanh toán và hoàn tiền khi có yêu cầu hủy vé theo chính sách.",
                    "Cải thiện chất lượng dịch vụ dựa trên phản hồi, đánh giá và hành vi sử dụng website.",
                    "Gửi thông tin marketing và ưu đãi — chỉ khi quý khách đã đồng ý và có thể hủy bất kỳ lúc nào.",
                    "Tuân thủ yêu cầu pháp lý, giải quyết tranh chấp và thực thi điều khoản dịch vụ.",
                    "Phân tích thống kê tổng hợp (không định danh cá nhân) nhằm nâng cao trải nghiệm người dùng.",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-[13.5px] text-gray-600 leading-relaxed">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 3. Bảo mật */}
            <section id="bao-mat" className="rounded-2xl bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
                <Chip n="03" />
                <h2 className="text-[16px] font-bold text-gray-900">Bảo Mật Thông Tin</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: "🔐", title: "HTTPS/TLS", body: "Mã hóa toàn bộ kết nối giữa trình duyệt và máy chủ." },
                    { icon: "💳", title: "PCI-DSS", body: "Thanh toán qua MoMo, ZaloPay đạt chuẩn — không lưu số thẻ trực tiếp." },
                    { icon: "🗄️", title: "Quyền truy cập hạn chế", body: "Chỉ nhân viên có thẩm quyền mới được phép xem dữ liệu khách hàng." },
                    { icon: "💾", title: "Sao lưu định kỳ", body: "Dữ liệu sao lưu thường xuyên với quy trình ứng phó sự cố sẵn sàng." },
                  ].map(({ icon, title, body }) => (
                    <div key={title} className="rounded-xl bg-gray-50 px-4 py-3.5 ring-1 ring-gray-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{icon}</span>
                        <p className="text-[12px] font-bold text-gray-700">{title}</p>
                      </div>
                      <p className="text-[12px] text-gray-500 leading-relaxed">{body}</p>
                    </div>
                  ))}
                </div>
                <Note color="blue" icon="🚨">
                  Chúng tôi sẽ thông báo trong vòng <strong>72 giờ</strong> nếu phát hiện sự cố bảo mật ảnh hưởng đến thông tin cá nhân của quý khách.
                </Note>
              </div>
            </section>

            {/* 4. Cookies */}
            <section id="cookies" className="rounded-2xl bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
                <Chip n="04" />
                <h2 className="text-[16px] font-bold text-gray-900">Cookies & Công Nghệ Theo Dõi</h2>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { type: "Cần thiết", icon: "⚙️", color: "bg-gray-100 text-gray-700", body: "Duy trì phiên đặt vé và giỏ vé. Không thể vô hiệu hóa vì cần cho website hoạt động." },
                  { type: "Phân tích", icon: "📊", color: "bg-blue-100 text-blue-700", body: "Google Analytics giúp hiểu cách khách sử dụng website. Dữ liệu được ẩn danh hóa." },
                  { type: "Tiếp thị", icon: "📣", color: "bg-purple-100 text-purple-700", body: "Facebook Pixel để hiển thị quảng cáo phù hợp. Quý khách có thể từ chối loại cookies này." },
                ].map(({ type, icon, color, body }) => (
                  <div key={type} className="flex gap-3 rounded-xl bg-gray-50 px-4 py-3.5 ring-1 ring-gray-100">
                    <span className="mt-0.5 text-base shrink-0">{icon}</span>
                    <div className="min-w-0">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold mb-1 ${color}`}>{type}</span>
                      <p className="text-[13px] text-gray-500 leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
                <Note color="amber" icon="ℹ️">
                  Quý khách có thể quản lý hoặc xóa cookies qua cài đặt trình duyệt. Vô hiệu hóa cookies có thể ảnh hưởng một số tính năng website.
                </Note>
              </div>
            </section>

            {/* 5. Quyền */}
            <section id="quyen" className="rounded-2xl bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
                <Chip n="05" />
                <h2 className="text-[16px] font-bold text-gray-900">Quyền Của Quý Khách</h2>
              </div>
              <div className="p-6">
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {[
                    { icon: "👁️", title: "Quyền truy cập", body: "Yêu cầu bản sao thông tin cá nhân chúng tôi đang lưu trữ." },
                    { icon: "✏️", title: "Quyền chỉnh sửa", body: "Yêu cầu sửa thông tin không chính xác hoặc không đầy đủ." },
                    { icon: "🗑️", title: "Quyền xóa", body: "Yêu cầu xóa thông tin cá nhân trong giới hạn pháp luật cho phép." },
                    { icon: "🚫", title: "Quyền phản đối", body: "Hạn chế hoặc phản đối việc xử lý dữ liệu cá nhân của mình." },
                    { icon: "📧", title: "Hủy nhận email", body: "Hủy đăng ký nhận email marketing bất kỳ lúc nào qua link trong email." },
                  ].map(({ icon, title, body }) => (
                    <div key={title} className="flex gap-3 rounded-xl bg-gray-50 px-4 py-3.5 ring-1 ring-gray-100">
                      <span className="mt-0.5 text-base shrink-0">{icon}</span>
                      <div>
                        <p className="text-[12px] font-bold text-gray-700 mb-0.5">{title}</p>
                        <p className="text-[12px] text-gray-500 leading-relaxed">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[13px] text-gray-500 leading-relaxed">
                  Để thực hiện các quyền trên, vui lòng liên hệ chúng tôi. Chúng tôi sẽ phản hồi trong vòng <strong className="text-gray-700">7 ngày làm việc</strong>.
                </p>
              </div>
            </section>

            {/* 6. Liên hệ */}
            <section id="lien-he" className="rounded-2xl bg-blue-700 p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Chip n="06" />
                <h2 className="text-[16px] font-bold">Liên Hệ</h2>
              </div>
              <p className="text-[13px] text-blue-200 mb-4">
                Mọi câu hỏi, góp ý hoặc yêu cầu liên quan đến chính sách bảo mật, vui lòng liên hệ:
              </p>
              <div className="space-y-2 mb-4">
                {[
                  { icon: "🏢", label: "Khu Du Lịch Sinh Thái Sơn Kiều" },
                  { icon: "📍", label: "Trường Sơn, Quảng Ninh, tỉnh Quảng Trị" },
                  { icon: "🌐", label: "sonkieu.vn" },
                ].map(({ icon, label }) => (
                  <p key={label} className="flex items-center gap-2 text-[13px] text-blue-100">
                    <span>{icon}</span>{label}
                  </p>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="tel:0857086588"
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-[13px] font-semibold hover:bg-white/25 transition">
                  📞 0857 086 588
                </a>
              </div>
            </section>

            {/* Footer nav */}
            <div className="flex flex-wrap justify-center gap-6 text-[12px] text-gray-400 pb-4">
              <Link href="/terms" className="hover:text-blue-600 transition">Điều Khoản Sử Dụng</Link>
              <Link href="/faq" className="hover:text-blue-600 transition">Câu Hỏi Thường Gặp</Link>
              <Link href="/contact" className="hover:text-blue-600 transition">Liên Hệ</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
