"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { WaveDown } from "@/components/ui/WaveDivider";

const EXPLORE = [
  { href: "/activities",                 label: "Tất Cả Hoạt Động"    },
  { href: "/activities?cat=CAVE",        label: "Hang Động"            },
  { href: "/activities?cat=LAKE",        label: "Hồ Bơi Thiên Nhiên"  },
  { href: "/activities?cat=SIGHTSEEING", label: "Tham Quan Sinh Thái" },
  { href: "/dining",                     label: "Ẩm Thực"              },
  { href: "/gallery",                    label: "Thư Viện Ảnh"         },
];

const INFO = [
  { href: "/about",      label: "Về Chúng Tôi"         },
  { href: "/pricing",    label: "Bảng Giá"              },
  { href: "/events",     label: "Sự Kiện"               },
  { href: "/faq",        label: "Câu Hỏi Thường Gặp"   },
  { href: "/directions", label: "Hướng Dẫn Đường Đến"  },
  { href: "/contact",    label: "Liên Hệ"               },
];

function Fb() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>; }
function Ig() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>; }
function Yt() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#052e16"/></svg>; }

export default function Footer() {
  const [email,    setEmail]    = useState("");
  const [subState, setSubState] = useState<"idle" | "loading" | "done">("idle");

  async function handleSubscribe(e: React.SyntheticEvent<HTMLFormElement>) {
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
    <>
      {/* Wave: white → dark footer */}
      <WaveDown fill="#052e16" />

      <footer className="bg-[#052e16] text-white">
        <div className="ds-container">

          {/* Newsletter */}
          <div className="border-b border-white/10 py-12">
            <div className="flex flex-col gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
              <div>
                <p className="font-display text-[22px] font-normal italic tracking-[0.04em] text-white">
                  Nhận ưu đãi &amp; tin tức mới nhất
                </p>
                <p className="mt-1 text-[13px] text-white/50">
                  Đăng ký để không bỏ lỡ các sự kiện và khuyến mãi đặc biệt.
                </p>
              </div>

              {subState === "done" ? (
                <p className="border border-emerald-500/40 px-5 py-3 text-[13px] font-semibold text-emerald-400">
                  ✓ Đăng ký thành công!
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex w-full max-w-sm gap-0">
                  <input
                    type="email" required placeholder="Email của bạn"
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="flex-1 border border-r-0 border-white/20 bg-white/8 px-4 py-2.5
                               text-[13px] text-white placeholder:text-white/35
                               focus:border-emerald-500 focus:outline-none"
                    style={{ borderRadius: 0 }}
                  />
                  <button
                    type="submit" disabled={subState === "loading"}
                    className="shrink-0 border border-[#22c55e] bg-[#22c55e] px-5 py-2.5
                               text-[11px] font-bold uppercase tracking-[0.18em] text-[#052e16]
                               transition hover:bg-[#16a34a] hover:border-[#16a34a] disabled:opacity-50"
                    style={{ borderRadius: 0 }}
                  >
                    {subState === "loading" ? "…" : "Đăng ký"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Main grid */}
          <div className="grid gap-10 py-14 md:grid-cols-[1.6fr_1fr_1fr_1.1fr]">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden
                                rounded-full bg-white/10 ring-1 ring-white/20">
                  <Image src="/icon.png" alt="Sơn Kiều" width={32} height={32} className="h-8 w-8 object-contain" />
                </div>
                <div>
                  <p className="font-display text-[20px] font-normal italic tracking-[0.06em] text-white">
                    Sơn Kiều
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/40">
                    Eco Resort
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-[260px] text-[13px] leading-relaxed text-white/55">
                Nơi nghỉ dưỡng yên bình — homestay giữa thiên nhiên hoang sơ, tái kết nối với đất trời
                và tìm lại sự bình yên trong lòng núi rừng đại ngàn Trường Sơn.
              </p>

              {/* Social */}
              <div className="mt-6 flex gap-2">
                {[
                  { icon: <Fb />, label: "Facebook",  href: "#" },
                  { icon: <Ig />, label: "Instagram", href: "#" },
                  { icon: <Yt />, label: "YouTube",   href: "#" },
                ].map(({ icon, label, href }) => (
                  <a key={label} href={href} aria-label={label}
                     className="flex h-9 w-9 items-center justify-center border border-white/15
                                text-white/50 transition hover:border-[#22c55e] hover:text-[#22c55e]"
                     style={{ borderRadius: "6px" }}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Khám phá */}
            <div>
              <h3 className="mb-5 text-[9px] font-bold uppercase tracking-[0.26em] text-white/35">
                Khám Phá
              </h3>
              <ul className="space-y-3">
                {EXPLORE.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href}
                          className="text-[13px] text-white/55 transition hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Thông tin */}
            <div>
              <h3 className="mb-5 text-[9px] font-bold uppercase tracking-[0.26em] text-white/35">
                Thông Tin
              </h3>
              <ul className="space-y-3">
                {INFO.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href}
                          className="text-[13px] text-white/55 transition hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Liên hệ */}
            <div>
              <h3 className="mb-5 text-[9px] font-bold uppercase tracking-[0.26em] text-white/35">
                Liên Hệ
              </h3>
              <ul className="space-y-4 text-[13px] text-white/55">
                <li className="flex items-start gap-2.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mt-0.5 flex-shrink-0 text-[#22c55e]"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Xã Trường Sơn, Tỉnh Quảng Trị
                </li>
                <li className="flex items-center gap-2.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 text-[#22c55e]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.79a16 16 0 0 0 6.29 6.29l.62-.61a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/></svg>
                  <a href="tel:+84857086588" className="transition hover:text-white">0857 086 588</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 text-[#22c55e]"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  08:00 – 17:00 · Hàng ngày
                </li>
              </ul>

              <Link href="/booking"
                    className="mt-8 inline-flex border border-[#22c55e] bg-transparent px-6 py-2.5
                               text-[11px] font-bold uppercase tracking-[0.2em] text-[#22c55e]
                               transition hover:bg-[#22c55e] hover:text-[#052e16]"
                    style={{ borderRadius: 0 }}>
                Đặt Vé Ngay
              </Link>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10
                          py-6 text-[11px] text-white/35 sm:flex-row">
            <p>© {new Date().getFullYear()} Khu Du Lịch Sinh Thái Sơn Kiều</p>
            <div className="flex gap-5">
              <Link href="/privacy" className="transition hover:text-white/70">Chính sách bảo mật</Link>
              <span className="text-white/15">|</span>
              <Link href="/terms"   className="transition hover:text-white/70">Điều khoản sử dụng</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
