import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Câu Hỏi Thường Gặp | Khu Du Lịch Sinh Thái Sơn Kiều",
  description:
    "Giải đáp câu hỏi thường gặp khi đi Khu Du Lịch Sinh Thái Sơn Kiều: đặt vé, giờ mở cửa, đường đi, ăn uống, an toàn và kinh nghiệm tham quan.",
  keywords: ["FAQ Sơn Kiều", "câu hỏi Sơn Kiều", "kinh nghiệm đi Sơn Kiều", "khu du lịch Quảng Trị"],
  alternates: { canonical: "/faq" },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
