import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Điều Khoản Sử Dụng",
  description:
    "Điều khoản sử dụng dịch vụ của Khu Du Lịch Sinh Thái Sơn Kiều — quy định đặt vé, chính sách hủy hoàn, trách nhiệm và an toàn khi tham quan.",
  alternates: { canonical: "/terms" },
};

const TOC = [
  { id: "dat-ve",      label: "Quy định đặt vé" },
  { id: "huy-hoan",   label: "Hủy & hoàn vé" },
  { id: "trach-nhiem",label: "Trách nhiệm" },
  { id: "an-toan",    label: "Quy định an toàn" },
  { id: "chung",      label: "Điều khoản chung" },
];

function Chip({ n }: { n: string }) {
  return (
    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-[11px] font-black text-white">
      {n}
    </span>
  );
}

function Note({ color, icon, children }: { color: "amber" | "emerald" | "blue" | "red"; icon: string; children: React.ReactNode }) {
  const cls = {
    amber:   "bg-amber-50 ring-amber-200 text-amber-800",
    emerald: "bg-emerald-50 ring-emerald-200 text-emerald-800",
    blue:    "bg-blue-50 ring-blue-200 text-blue-800",
    red:     "bg-red-50 ring-red-200 text-red-700",
  }[color];
  return (
    <div className={`flex gap-3 rounded-2xl px-4 py-3.5 ring-1 text-[13.5px] leading-relaxed ${cls}`}>
      <span className="mt-0.5 shrink-0 text-base">{icon}</span>
      <div>{children}</div>
    </div>
  );
}

function Row({ when, refund, color }: { when: string; refund: string; color: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-gray-100">
      <span className="text-[13px] text-gray-600">{when}</span>
      <span className={`shrink-0 rounded-full px-3 py-0.5 text-[11px] font-bold ${color}`}>{refund}</span>
    </div>
  );
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50/50 pt-16">

      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
          <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-4">
            <Link href="/" className="hover:text-emerald-600 transition">Trang chủ</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">Điều Khoản Sử Dụng</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-xl">📋</div>
                <h1 className="text-[28px] font-black text-gray-900 md:text-[34px]">Điều Khoản Sử Dụng</h1>
              </div>
              <p className="text-[14px] text-gray-500 max-w-xl">
                Áp dụng khi quý khách sử dụng dịch vụ đặt vé và tham quan tại Khu Du Lịch Sinh Thái Sơn Kiều.
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
                    className="block rounded-lg px-3 py-2 text-[12px] font-medium text-gray-500 transition hover:bg-emerald-50 hover:text-emerald-700">
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <Link href="/privacy"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium text-gray-400 transition hover:bg-gray-50 hover:text-gray-600">
                  <span>🔒</span> Chính sách bảo mật
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0 flex-1 space-y-5">

            {/* Intro */}
            <div className="rounded-2xl bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]">
              <p className="text-[14px] leading-relaxed text-gray-600">
                Các điều khoản này điều chỉnh việc quý khách sử dụng website{" "}
                <span className="font-semibold text-emerald-700">sonkieu.vn</span> và dịch vụ đặt vé, tham quan của Khu Du Lịch Sinh Thái Sơn Kiều.
                Bằng cách đặt vé hoặc sử dụng dịch vụ, quý khách xác nhận đã đọc và đồng ý bị ràng buộc bởi các điều khoản này.
              </p>
            </div>

            {/* 1. Quy định đặt vé */}
            <section id="dat-ve" className="rounded-2xl bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
                <Chip n="01" />
                <h2 className="text-[16px] font-bold text-gray-900">Quy Định Đặt Vé</h2>
              </div>
              <div className="p-6 space-y-4">
                <ul className="space-y-2.5">
                  {[
                    "Mỗi giao dịch yêu cầu cung cấp chính xác họ tên, số điện thoại, email và số lượng khách.",
                    "Vé chỉ có giá trị đúng ngày và hoạt động được ghi trên vé. Không được chuyển nhượng hoặc dùng lại sau check-in.",
                    "Đặt vé xác nhận ngay sau thanh toán — quý khách nhận email và mã QR trong vòng 5 phút.",
                    "Số lượng vé mỗi hoạt động có giới hạn. Sơn Kiều có quyền từ chối khi vượt sức chứa.",
                    "Trẻ 5–12 tuổi giảm 50%; dưới 5 tuổi miễn phí. Xuất trình giấy tờ khi check-in nếu cần.",
                    "Giá áp dụng tại thời điểm hoàn tất thanh toán — giá đã xác nhận không thay đổi.",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-[13.5px] text-gray-600 leading-relaxed">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Note color="emerald" icon="🎫">
                  Vé đoàn từ <strong>10 người trở lên</strong> được hưởng ưu đãi đặc biệt. Liên hệ hotline{" "}
                  <a href="tel:0857086588" className="underline font-semibold">0857 086 588</a> để được báo giá nhóm.
                </Note>
              </div>
            </section>

            {/* 2. Hủy & hoàn vé */}
            <section id="huy-hoan" className="rounded-2xl bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
                <Chip n="02" />
                <h2 className="text-[16px] font-bold text-gray-900">Chính Sách Hủy & Hoàn Vé</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Row when="Hủy trước 24 giờ trở lên" refund="Hoàn 100%" color="bg-emerald-100 text-emerald-800" />
                  <Row when="Hủy trong vòng 24 giờ" refund="Hoàn 50%" color="bg-amber-100 text-amber-800" />
                  <Row when="Vào ngày tham quan / Không đến" refund="Không hoàn" color="bg-red-100 text-red-700" />
                </div>

                <ul className="space-y-2 text-[13.5px] text-gray-600 leading-relaxed">
                  {[
                    "Thời điểm hủy tính theo giờ địa phương GMT+7 của ngày tham quan đã đặt.",
                    "Yêu cầu hủy gửi qua email hoặc tin nhắn, kèm mã đặt vé và lý do.",
                    "Tiền hoàn về đúng phương thức ban đầu: 3–7 ngày làm việc (ngân hàng) hoặc 24 giờ (ví điện tử).",
                    "Hủy do thiên tai, dịch bệnh hoặc bất khả kháng được xem xét hoàn 100% theo từng trường hợp.",
                    "Nếu Sơn Kiều hủy do thời tiết nguy hiểm: hoàn 100% hoặc đổi lịch miễn phí.",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Chuyển khoản */}
                <div className="rounded-2xl bg-amber-50 ring-1 ring-amber-200 p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚠️</span>
                    <p className="text-[13px] font-bold text-amber-900">Thanh toán chuyển khoản — liên hệ trong 24 giờ</p>
                  </div>
                  <div className="space-y-2 text-[13px] text-amber-800 leading-relaxed">
                    <div className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span><strong>Trong 24 giờ sau chuyển khoản:</strong> có thể hoàn tiền hoặc đổi ngày tham quan.</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span><strong>Sau 24 giờ:</strong> không hoàn tiền — chỉ hỗ trợ đổi lịch trong vòng 30 ngày (1 lần, tùy chỗ còn).</span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-amber-100 px-4 py-3 ring-1 ring-amber-300 flex gap-3 text-[13px] text-amber-900 leading-relaxed">
                    <span className="mt-0.5 shrink-0">🖼️</span>
                    <span>
                      <strong>Bắt buộc để được xét hoàn tiền:</strong> cung cấp ảnh biên lai chuyển khoản thể hiện rõ số tiền, ngân hàng, thời gian và mã giao dịch. Yêu cầu không có bằng chứng sẽ không được xử lý.
                    </span>
                  </div>
                  <p className="text-[13px] font-semibold text-amber-800">
                    Liên hệ:{" "}
                    <a href="tel:0857086588" className="underline">0857 086 588</a>
                  </p>
                </div>

                <Note color="amber" icon="ℹ️">
                  Phí dịch vụ cổng thanh toán (nếu có) không được hoàn trả khi hủy vé. Vui lòng kiểm tra với đơn vị thanh toán.
                </Note>
              </div>
            </section>

            {/* 3. Trách nhiệm */}
            <section id="trach-nhiem" className="rounded-2xl bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
                <Chip n="03" />
                <h2 className="text-[16px] font-bold text-gray-900">Trách Nhiệm & Giới Hạn Bồi Thường</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-2.5">
                  {[
                    "Không chịu trách nhiệm về thiệt hại do khách không tuân thủ hướng dẫn an toàn hoặc chỉ dẫn của nhân viên.",
                    "Hoạt động có yếu tố rủi ro (hang động sâu, vượt suối): khách ký cam kết tự nguyện và chịu trách nhiệm cá nhân.",
                    "Không chịu trách nhiệm về mất mát hoặc hư hỏng tài sản cá nhân trong quá trình tham quan.",
                    "Mức bồi thường tối đa không vượt quá giá trị vé tham quan đã thanh toán.",
                    "Sơn Kiều có mua bảo hiểm trách nhiệm cho khách trong khuôn viên khu du lịch — chi tiết theo yêu cầu.",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-[13.5px] text-gray-600 leading-relaxed">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 4. An toàn */}
            <section id="an-toan" className="rounded-2xl bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
                <Chip n="04" />
                <h2 className="text-[16px] font-bold text-gray-900">Quy Định An Toàn</h2>
              </div>
              <div className="p-6 space-y-4">
                <ul className="space-y-2.5">
                  {[
                    "Luôn tuân theo hướng dẫn của nhân viên và hướng dẫn viên trong suốt hành trình.",
                    "Không rời tuyến đường chỉ định, leo trèo khu vực có biển cấm hoặc khám phá khu chưa mở cửa.",
                    "Không tham gia hoạt động dưới nước nếu không biết bơi và không mặc áo phao. Bắt buộc áo phao cho trẻ dưới 10 tuổi tại hồ.",
                    "Nghiêm cấm mang vũ khí, chất cháy nổ, chất kích thích hoặc rượu bia vào khu tham quan.",
                    "Không hút thuốc trong hang động, rừng và khu vực có biển cấm. Khu hút thuốc tại khu nhà hàng và nghỉ ngơi.",
                    "Không xả rác, bẻ cây, bắt sinh vật hoặc có hành vi gây hại môi trường sinh thái.",
                    "Khách có trách nhiệm giám sát trẻ em — không để trẻ chạy nhảy tại khu vực nguy hiểm.",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-[13.5px] text-gray-600 leading-relaxed">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Note color="red" icon="🚫">
                  Vi phạm quy định an toàn có thể bị yêu cầu rời khỏi khu tham quan <strong>không hoàn tiền</strong>. Trường hợp nghiêm trọng sẽ được chuyển đến cơ quan chức năng.
                </Note>
              </div>
            </section>

            {/* 5. Điều khoản chung */}
            <section id="chung" className="rounded-2xl bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
                <Chip n="05" />
                <h2 className="text-[16px] font-bold text-gray-900">Điều Khoản Chung</h2>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { title: "Sửa đổi điều khoản", body: "Sơn Kiều có quyền cập nhật các điều khoản bất kỳ lúc nào. Thay đổi có hiệu lực khi đăng tải. Tiếp tục sử dụng dịch vụ đồng nghĩa chấp nhận điều khoản mới." },
                  { title: "Luật áp dụng", body: "Điều khoản được điều chỉnh bởi pháp luật nước CHXHCN Việt Nam. Tranh chấp giải quyết tại Tòa án có thẩm quyền tại tỉnh Quảng Trị." },
                  { title: "Sở hữu trí tuệ", body: "Toàn bộ nội dung website (hình ảnh, văn bản, logo, thiết kế) thuộc quyền sở hữu của Sơn Kiều. Không sao chép cho mục đích thương mại khi chưa có văn bản chấp thuận." },
                  { title: "Liên kết bên thứ ba", body: "Website có thể chứa liên kết đến trang web bên ngoài. Sơn Kiều không chịu trách nhiệm về nội dung hoặc chính sách bảo mật của các trang đó." },
                  { title: "Ngôn ngữ", body: "Điều khoản soạn thảo bằng tiếng Việt. Bản tiếng Việt có giá trị pháp lý cao hơn bản dịch." },
                ].map(({ title, body }) => (
                  <div key={title} className="rounded-xl bg-gray-50 px-4 py-3.5 ring-1 ring-gray-100">
                    <p className="text-[12px] font-bold text-gray-700 mb-1">{title}</p>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{body}</p>
                  </div>
                ))}
                <Note color="emerald" icon="⚖️">
                  Các điều khoản không ảnh hưởng đến quyền lợi người tiêu dùng theo pháp luật Việt Nam. Thắc mắc về quyền lợi, liên hệ Cục Cạnh tranh và Bảo vệ người tiêu dùng.
                </Note>
              </div>
            </section>

            {/* Contact */}
            <div className="rounded-2xl bg-emerald-700 p-6 text-white">
              <p className="text-[13px] font-bold text-emerald-200 mb-1">Câu hỏi về điều khoản?</p>
              <h3 className="text-[18px] font-black mb-3">Liên hệ với chúng tôi</h3>
              <div className="flex flex-wrap gap-3">
                <a href="tel:0857086588"
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-[13px] font-semibold hover:bg-white/25 transition">
                  📞 0857 086 588
                </a>
                <Link href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-[13px] font-semibold hover:bg-white/25 transition">
                  Trang liên hệ →
                </Link>
              </div>
            </div>

            {/* Footer nav */}
            <div className="flex flex-wrap justify-center gap-6 text-[12px] text-gray-400 pb-4">
              <Link href="/privacy" className="hover:text-emerald-600 transition">Chính Sách Bảo Mật</Link>
              <Link href="/faq" className="hover:text-emerald-600 transition">Câu Hỏi Thường Gặp</Link>
              <Link href="/booking" className="hover:text-emerald-600 transition">Đặt Vé</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
