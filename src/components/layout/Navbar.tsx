"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/* ── Navigation links ─────────────────────────────────── */
const NAV_LINKS = [
  { href: "/activities", label: "Hoạt Động"  },
  { href: "/dining",     label: "Ẩm Thực"    },
  { href: "/gallery",    label: "Thư Viện"   },
  { href: "/pricing",    label: "Bảng Giá"   },
  { href: "/blog",       label: "Tin Tức"    },
  { href: "/about",      label: "Giới Thiệu" },
];

const MORE_LINKS = [
  { href: "/events",     label: "Sự Kiện"     },
  { href: "/directions", label: "Đường Đến"   },
  { href: "/faq",        label: "FAQ"          },
  { href: "/contact",    label: "Liên Hệ"     },
];

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="3" y1="7"  x2="21" y2="7"  />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="17" x2="21" y2="17" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  /* Block body scroll when menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ── Header bar — always dark (Keemala style) ─────── */}
      <header className="fixed inset-x-0 top-0 z-50 bg-[#052e16]">
        {/* Top micro-bar */}
        <div className="hidden border-b border-white/8 md:block">
          <div className="ds-container-wide flex h-8 items-center justify-end gap-6">
            <a href="tel:+84857086588"
               className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/45 transition hover:text-white/80">
              +84 857 086 588
            </a>
            <span className="text-white/20">|</span>
            <Link href="/contact"
               className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/45 transition hover:text-white/80">
              Liên hệ
            </Link>
          </div>
        </div>

        {/* Main nav bar */}
        <nav className="ds-container-wide flex h-[68px] items-center justify-between">

          {/* Left — Logo */}
          <Link href="/" className="flex flex-shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full
                             bg-white/10 ring-1 ring-white/20">
              <Image
                src="/icon.png"
                alt="Sơn Kiều"
                width={36} height={36}
                className="h-9 w-9 object-contain"
                priority
              />
            </span>
            <span className="hidden leading-none sm:block">
              <span className="block font-display text-[22px] font-normal tracking-[0.1em] text-white">
                Sơn Kiều
              </span>
              <span className="mt-0.5 block text-[8px] font-semibold uppercase tracking-[0.32em] text-white/45">
                Eco Resort
              </span>
            </span>
          </Link>

          {/* Center — Nav links (Keemala: UPPERCASE | pipe separated) */}
          <div className="hidden items-center gap-0 lg:flex">
            {NAV_LINKS.map((link, i) => (
              <span key={link.href} className="flex items-center">
                {i > 0 && (
                  <span className="mx-3 text-white/20 text-[13px]">|</span>
                )}
                <Link
                  href={link.href}
                  className={`text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                    isActive(link.href)
                      ? "text-[#22c55e]"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>

          {/* Right — Book Now + mobile menu */}
          <div className="flex items-center gap-3">
            {/* Book Now — Keemala gold-outlined style */}
            <Link
              href="/booking"
              className="hidden border border-[#22c55e] bg-transparent px-5 py-2
                         text-[10px] font-bold uppercase tracking-[0.22em] text-[#22c55e]
                         transition hover:bg-[#22c55e] hover:text-[#052e16] md:inline-flex"
            >
              Book Now
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="flex h-10 w-10 items-center justify-center text-white/80
                         transition hover:text-white lg:hidden"
              aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>
        </nav>
      </header>

      {/* ── Full-screen mobile / mega menu ───────────────── */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-[#052e16] pt-[100px]">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-[0.04]"
               style={{
                 backgroundImage:
                   "radial-gradient(circle at 20% 30%, #22c55e 0%, transparent 50%), " +
                   "radial-gradient(circle at 80% 70%, #16a34a 0%, transparent 50%)",
               }}
          />

          <div className="relative flex flex-1 flex-col overflow-y-auto px-6 pb-10">
            {/* Brand statement */}
            <div className="mb-10 border-b border-white/10 pb-10">
              <p className="ds-label-white mb-3">Sơn Kiều</p>
              <h2 className="font-display text-[2.6rem] font-normal italic leading-[1.1]
                             tracking-[0.04em] text-white">
                Khu nghỉ sinh thái giữa rừng, suối và hang động Trường Sơn.
              </h2>
            </div>

            {/* Primary links */}
            <div className="mb-8 grid gap-5">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-display text-[2rem] font-normal italic leading-none
                               tracking-[0.04em] transition-colors ${
                    isActive(link.href) ? "text-[#22c55e]" : "text-white hover:text-[#22c55e]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Secondary links */}
            <div className="mb-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6">
              {MORE_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] text-white/50 transition hover:text-white/90"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/booking"
              className="ds-btn w-full justify-center border border-[#22c55e]
                         bg-[#22c55e] text-[#052e16] hover:bg-[#16a34a]"
            >
              Đặt Vé Ngay
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
