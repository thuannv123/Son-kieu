import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hình Ảnh Khu Du Lịch Sơn Kiều | Gallery Du Lịch Quảng Trị",
  description:
    "Thư viện hình ảnh Khu Du Lịch Sinh Thái Sơn Kiều: hang động, hồ suối tự nhiên, cảnh quan Trường Sơn, ẩm thực và trải nghiệm tham quan tại Quảng Trị.",
  keywords: ["hình ảnh Sơn Kiều", "gallery Sơn Kiều", "ảnh du lịch Quảng Trị", "Khu Du Lịch Sơn Kiều"],
  alternates: { canonical: "/gallery" },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
