"use client";

import Link from "next/link";
import { useState } from "react";

const EXPLORE_LINKS = [
  { href: "/activities",                 label: "Tất Cả Hoạt Động"    },
  { href: "/activities?cat=CAVE",        label: "Hang Động"            },
  { href: "/activities?cat=LAKE",        label: "Hồ Bơi Thiên Nhiên"  },
  { href: "/activities?cat=SIGHTSEEING", label: "Tham Quan Sinh Thái" },
  { href: "/dining",                     label: "Ẩm Thực"              },
  { href: "/gallery",                    label: "Thư Viện Ảnh"         },
];

const INFO_LINKS = [
  { href: "/about",      label: "Về Chúng Tôi"    },
  { href: "/pricing",    label: "Bảng Giá"         },
  { href: "/events",     label: "Sự Kiện"          },
  { href: "/faq",        label: "Câu Hỏi Thường Gặp" },
  { href: "/directions", label: "Hướng Dẫn Đường Đến" },
  { href: "/contact",    label: "Liên Hệ"          },
];

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#050f07"/>
    </svg>
  );
}
function MapPinIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function PhoneIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.79a16 16 0 0 0 6.29 6.29l.62-.61a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/></svg>;
}
function ClockIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function LogoMark() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M17 3C17 3 10 5 7 12C5 17 8 21 12 21C16 21 19 17 19 13C19 9 16 7 13 8C11 8.5 10 10 11 12C12 14 15 13 15 11" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M7 12C5 8 6 4 8 3" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail]       = useState("");
  const [subState, setSubState] = useState<"idle" | "loading" | "done">("idle");

  async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubState("loading");
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
    } catch {/* silent */}
    setSubState("done");
  }

  return (
    <footer style={{ background: "#050f07" }}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">

        {/* Newsletter banner */}
        <div className="border-b border-white/[0.05] py-10">
          <div className="flex flex-col items-center gap-5 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <p className="text-[15px] font-bold text-white">Nhận ưu đãi & tin tức mới nhất</p>
              <p className="mt-1 text-[13px] text-gray-500">Đăng ký để không bỏ lỡ các sự kiện và khuyến mãi đặc biệt.</p>
            </div>
            {subState === "done" ? (
              <p className="rounded-xl bg-emerald-600/20 px-5 py-3 text-[13px] font-semibold text-emerald-400">
                ✓ Đăng ký thành công! Cảm ơn bạn.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex w-full max-w-sm gap-2">
                <input
                  type="email" required placeholder="Email của bạn"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[13px] text-white placeholder:text-gray-600 focus:border-emerald-500 focus:outline-none"
                />
                <button type="submit" disabled={subState === "loading"}
                  className="shrink-0 rounded-xl bg-emerald-600 px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50">
                  {subState === "loading" ? "…" : "Đăng ký"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <LogoMark />
              <div>
                <p className="text-[15px] font-bold tracking-tight text-white">Sơn Kiều</p>
                <p className="text-[11px] font-medium text-emerald-600">Khu Du Lịch Sinh Thái</p>
              </div>
            </div>
            <p className="mt-5 max-w-[260px] text-sm leading-relaxed text-gray-500">
              Nơi nghỉ dưỡng yên bình — homestay giữa thiên nhiên hoang sơ,
              tái kết nối với đất trời và tìm lại sự bình yên trong lòng núi rừng đại ngàn.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { icon: <FacebookIcon />,  label: "Facebook",  href: "#" },
                { icon: <InstagramIcon />, label: "Instagram", href: "#" },
                { icon: <YoutubeIcon />,   label: "YouTube",   href: "#" },
              ].map(({ icon, label, href }) => (
                <a key={label} href={href} aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-gray-500 transition-all hover:bg-emerald-600 hover:text-white">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Khám phá */}
          <div>
            <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-600">Khám Phá</h3>
            <ul className="space-y-3">
              {EXPLORE_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[13px] text-gray-500 transition-colors hover:text-emerald-400">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Thông tin */}
          <div>
            <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-600">Thông Tin</h3>
            <ul className="space-y-3">
              {INFO_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[13px] text-gray-500 transition-colors hover:text-emerald-400">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-600">Liên Hệ</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-2.5 text-[13px] text-gray-500">
                <MapPinIcon />
                <span>Xã Trường Sơn, Tỉnh Quảng Trị</span>
              </li>
              <li className="flex items-center gap-2.5 text-[13px] text-gray-500">
                <PhoneIcon />
                <a href="tel:+84857086588" className="hover:text-emerald-400 transition-colors">0857 086 588</a>
              </li>
              <li className="flex items-center gap-2.5 text-[13px] text-gray-500">
                <ClockIcon />
                <span>08:00 – 17:00 · Hàng ngày</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.05] py-6 text-[12px] text-gray-600 sm:flex-row">
          <p>© {new Date().getFullYear()} Khu Du Lịch Sinh Thái Sơn Kiều · Bảo lưu mọi quyền.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Chính sách bảo mật</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Điều khoản sử dụng</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
