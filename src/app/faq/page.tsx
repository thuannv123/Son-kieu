"use client";

import { useState } from "react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQGroup {
  icon: string;
  title: string;
  items: FAQItem[];
}

const FAQ_GROUPS: FAQGroup[] = [
  {
    icon: "🎫",
    title: "Đặt vé & Thanh toán",
    items: [
      {
        question: "Tôi có thể đặt vé trước bao lâu?",
        answer:
          "Bạn có thể đặt vé trước tối đa 30 ngày so với ngày tham quan. Chúng tôi khuyến khích đặt sớm — đặc biệt vào các dịp lễ, cuối tuần và mùa cao điểm (tháng 6–8) — để đảm bảo suất tham gia. Đặt vé trực tuyến 24/7 tại trang /booking.",
      },
      {
        question: "Phương thức thanh toán nào được chấp nhận?",
        answer:
          "Chúng tôi chấp nhận thanh toán qua: chuyển khoản ngân hàng (Vietcombank, Techcombank, MB Bank), ví điện tử MoMo & ZaloPay, thẻ ATM nội địa và quốc tế (Visa / Mastercard), và thanh toán tiền mặt tại quầy. Xác nhận vé được gửi ngay qua email và SMS sau khi thanh toán thành công.",
      },
      {
        question: "Trẻ em có phải mua vé không?",
        answer:
          "Trẻ em dưới 5 tuổi được miễn phí hoàn toàn. Trẻ từ 5–12 tuổi được giảm 50% giá vé người lớn. Từ 13 tuổi trở lên áp dụng giá vé người lớn bình thường. Vui lòng mang theo giấy khai sinh hoặc hộ chiếu của trẻ khi đến check-in để được xác nhận ưu đãi.",
      },
      {
        question: "Chính sách hoàn/hủy vé như thế nào?",
        answer:
          "Hủy trước 24 giờ so với giờ tham quan: hoàn tiền 100%. Hủy trong vòng 24 giờ: hoàn 50%. Không hoàn tiền nếu hủy vào ngày tham quan hoặc không đến (no-show). Yêu cầu hoàn vé vui lòng gửi qua email hoặc liên hệ hotline. Thời gian xử lý hoàn tiền từ 3–7 ngày làm việc.",
      },
      {
        question: "Tôi có nhận được xác nhận đặt vé không?",
        answer:
          "Ngay sau khi thanh toán thành công, hệ thống sẽ tự động gửi email xác nhận kèm mã vé QR đến địa chỉ email bạn đăng ký. Ngoài ra, tin nhắn SMS xác nhận cũng được gửi đến số điện thoại. Vui lòng giữ mã QR để xuất trình khi check-in tại cổng.",
      },
    ],
  },
  {
    icon: "🌿",
    title: "Hoạt động & Trải nghiệm",
    items: [
      {
        question: "Thời gian tốt nhất để tham quan là khi nào?",
        answer:
          "Thời gian lý tưởng nhất là từ tháng 3 đến tháng 8, khi thời tiết khô ráo, mát mẻ và các hoạt động ngoài trời đều diễn ra thuận lợi. Buổi sáng sớm (7:00–9:00) là thời điểm tuyệt vời để khám phá hang động khi nhiệt độ còn mát. Mùa mưa (tháng 9–11) vẫn có thể tham quan nhưng một số hoạt động có thể bị hạn chế do điều kiện thời tiết.",
      },
      {
        question: "Hoạt động nào phù hợp cho người cao tuổi?",
        answer:
          "Chúng tôi có nhiều hoạt động nhẹ nhàng phù hợp cho người cao tuổi và gia đình có trẻ nhỏ, bao gồm: tham quan vườn sinh thái, ngắm cảnh hồ thiên nhiên, trải nghiệm ẩm thực và văn hóa địa phương, đi bộ cung đường ngắn trong rừng. Một số hoạt động mạo hiểm như thám hiểm hang sâu yêu cầu sức khỏe tốt — nhân viên sẽ tư vấn trực tiếp khi đăng ký.",
      },
      {
        question: "Tôi cần mang theo những gì khi đến tham quan?",
        answer:
          "Khuyến nghị mang theo: giày thể thao hoặc sandal có quai hậu chắc chắn (không đi dép lê vào hang động), quần áo thoải mái và thấm hút mồ hôi, kem chống nắng và mũ, nước uống cá nhân (có thể mua tại khu resort), thuốc cá nhân nếu cần. Áo phao và mũ bảo hiểm được cung cấp miễn phí cho các hoạt động dưới nước và trong hang.",
      },
      {
        question: "Có hướng dẫn viên đi kèm không?",
        answer:
          "Tất cả các tour tham quan hang động và trải nghiệm thiên nhiên đều có hướng dẫn viên địa phương am hiểu địa hình đi kèm. Dịch vụ hướng dẫn bằng tiếng Việt là miễn phí; hướng dẫn viên tiếng Anh có thể được sắp xếp trước (phụ phí áp dụng). Nhóm tối thiểu 2 người mới xuất phát; cá nhân đặt riêng vui lòng liên hệ để sắp xếp.",
      },
    ],
  },
  {
    icon: "🛡️",
    title: "An toàn & Chính sách",
    items: [
      {
        question: "Khu du lịch có an toàn cho trẻ em không?",
        answer:
          "An toàn là ưu tiên hàng đầu của chúng tôi. Toàn bộ khu vực được trang bị hàng rào bảo vệ, biển báo và đèn chiếu sáng. Đội ngũ cứu hộ và sơ cứu trực 24/7. Trẻ em dưới 12 tuổi phải có người lớn đi kèm khi tham gia các hoạt động trong hang động và dưới nước. Áo phao bắt buộc cho trẻ dưới 10 tuổi tại khu vực hồ.",
      },
      {
        question: "Chính sách về thức ăn và đồ uống mang vào?",
        answer:
          "Khách tham quan được mang theo nước uống và đồ ăn nhẹ vào khu vực tham quan. Tuy nhiên, vì đây là khu sinh thái, chúng tôi đề nghị không mang thức ăn thừa hoặc đồ nhựa sử dụng một lần. Vui lòng sử dụng thùng rác đặt dọc theo các lối đi. Thức ăn nặng mùi không được phép mang vào hang động để bảo vệ hệ sinh thái tự nhiên.",
      },
      {
        question: "Có chính sách nào về nhiếp ảnh không?",
        answer:
          "Chụp ảnh cá nhân và gia đình được tự do tại tất cả khu vực. Chụp ảnh thương mại, quay phim chuyên nghiệp hoặc sử dụng flycam/drone cần xin phép trước và có thể phát sinh phụ phí. Nghiêm cấm sử dụng đèn flash mạnh trong hang động để bảo vệ các loài sinh vật đặc hữu. Chúng tôi khuyến khích chia sẻ ảnh lên mạng xã hội với hashtag #SonKieuEco.",
      },
      {
        question: "Khu du lịch có hỗ trợ người khuyết tật không?",
        answer:
          "Chúng tôi nỗ lực tạo điều kiện tốt nhất cho mọi đối tượng khách. Khu vực nhà hàng, khu nghỉ dưỡng và một số điểm tham quan có lối đi dành cho xe lăn. Tuy nhiên, địa hình hang động và rừng núi có độ dốc nhất định — vui lòng thông báo trước khi đặt vé để được tư vấn lộ trình phù hợp nhất.",
      },
    ],
  },
  {
    icon: "🚗",
    title: "Đường đến & Tiện ích",
    items: [
      {
        question: "Có chỗ gửi xe không?",
        answer:
          "Có. Khu du lịch có bãi đỗ xe rộng rãi, có mái che, miễn phí cho khách tham quan trong ngày. Bãi đỗ xe ô tô, xe máy và xe đạp tách biệt. Bảo vệ trực 24/7. Xe khách từ 16 chỗ trở lên vui lòng thông báo trước để chúng tôi sắp xếp vị trí phù hợp.",
      },
      {
        question: "Từ trung tâm thành phố Đông Hà đến Sơn Kiều mất bao lâu?",
        answer:
          "Từ thành phố Đông Hà (Quảng Trị) đến Sơn Kiều khoảng 45–60 phút lái xe (khoảng 35 km) theo hướng Tây Nam, qua xã Trường Sơn. Lộ trình: QL1A → QL9 → đường vào Trường Sơn. Google Maps: tìm kiếm \"Khu Du Lịch Sinh Thái Sơn Kiều\". Chúng tôi có thể hỗ trợ đặt xe đưa đón từ trung tâm thành phố theo yêu cầu.",
      },
      {
        question: "Khu du lịch có wifi và điện thoại liên lạc không?",
        answer:
          "Khu nhà hàng và khu nghỉ dưỡng có Wifi miễn phí. Tín hiệu điện thoại trong hang động và một số khu vực rừng sâu có thể yếu — khuyến nghị tải offline map trước khi vào. Bộ đàm liên lạc được trang bị cho hướng dẫn viên. Trạm sạc điện thoại miễn phí tại khu nhà hàng và khu nghỉ ngơi.",
      },
    ],
  },
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-white ring-1 transition-all duration-200 ${
      isOpen
        ? "shadow-[0_4px_24px_rgba(5,150,105,0.10)] ring-emerald-400/30"
        : "shadow-[0_1px_12px_rgba(0,0,0,0.05)] ring-black/[0.04]"
    }`}>
      <button onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 px-6 py-4 text-left">
        <span className={`text-[15px] font-semibold leading-snug ${
          isOpen ? "text-emerald-700" : "text-gray-900"
        }`}>
          {item.question}
        </span>
        <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full
                          text-sm font-bold transition-all duration-300 ${
          isOpen ? "bg-emerald-600 text-white rotate-45" : "bg-gray-100 text-gray-500"
        }`}>
          +
        </span>
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}>
        <div className="overflow-hidden">
          <div className="border-t border-gray-100 px-6 pb-5 pt-4">
            <p className="text-[14px] leading-relaxed text-gray-600">{item.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const toggle = (key: string) => setOpenKey(prev => prev === key ? null : key);

  return (
    <main className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16"
        style={{ background: "linear-gradient(160deg,#030f05 0%,#071a0b 55%,#040e06 100%)" }}>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[380px] w-[650px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-[100px]"
            style={{ background: "radial-gradient(ellipse,rgba(16,185,129,0.12) 0%,transparent 70%)" }} />
        </div>

        <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="fqdots" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#fqdots)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center md:px-6 md:py-20">
          <div className="mb-6 flex items-center justify-center gap-2 text-[12px] text-white/40">
            <Link href="/" className="transition hover:text-white/70">Trang chủ</Link>
            <span>/</span>
            <span className="text-white/60">Câu hỏi thường gặp</span>
          </div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10
                          bg-white/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase
                          tracking-[0.18em] text-white/60 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Hỗ trợ · Sơn Kiều
          </div>

          <h1 className="text-4xl font-black leading-none text-white md:text-[3.2rem]">
            Câu Hỏi{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Thường Gặp
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-white/50">
            Tổng hợp những câu hỏi phổ biến nhất từ khách tham quan.
            Không tìm thấy câu trả lời? Đội ngũ hỗ trợ sẵn sàng giúp bạn.
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* ── Content ── */}
      <div className="bg-white">
        <div className="mx-auto max-w-3xl px-4 pb-20 pt-10 md:px-6">
          <div className="space-y-10">
            {FAQ_GROUPS.map(group => (
              <section key={group.title}>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl
                                  bg-gradient-to-br from-emerald-600 to-teal-600
                                  text-lg shadow-[0_0_16px_rgba(16,185,129,0.30)]">
                    {group.icon}
                  </div>
                  <div>
                    <h2 className="text-[17px] font-black text-gray-900">{group.title}</h2>
                    <p className="text-[12px] text-gray-400">{group.items.length} câu hỏi</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {group.items.map((item, idx) => {
                    const key = `${group.title}-${idx}`;
                    return (
                      <AccordionItem key={key} item={item}
                        isOpen={openKey === key} onToggle={() => toggle(key)} />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 overflow-hidden rounded-3xl"
            style={{ background: "linear-gradient(160deg,#030f05 0%,#071a0b 55%,#040e06 100%)" }}>
            <div className="relative px-8 py-10 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10
                              bg-white/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase
                              tracking-[0.18em] text-white/60 backdrop-blur-sm">
                Cần hỗ trợ thêm?
              </div>
              <h3 className="text-[22px] font-black text-white">
                Không tìm thấy{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  câu trả lời?
                </span>
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-white/50">
                Đội ngũ chăm sóc khách hàng của chúng tôi sẵn sàng hỗ trợ bạn mọi lúc.
              </p>

              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <a href="tel:0857086588"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3
                             text-[14px] font-bold text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)]
                             transition hover:bg-emerald-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  0857 086 588
                </a>
                <Link href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15
                             bg-white/[0.06] px-6 py-3 text-[14px] font-bold text-white
                             backdrop-blur-sm transition hover:bg-white/[0.12]">
                  Liên hệ chúng tôi
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
