import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên Hệ Khu Du Lịch Sơn Kiều | Trường Sơn, Quảng Trị",
  description:
    "Liên hệ Khu Du Lịch Sinh Thái Sơn Kiều để đặt vé, hỏi đường, tư vấn hoạt động tham quan, ẩm thực và lịch trình du lịch tại Quảng Trị.",
  keywords: ["liên hệ Sơn Kiều", "số điện thoại Sơn Kiều", "Khu Du Lịch Sơn Kiều", "du lịch Quảng Trị"],
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
