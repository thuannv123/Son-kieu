"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/",           label: "Trang Chủ" },
  { href: "/activities", label: "Hoạt Động" },
  { href: "/dining",     label: "Ẩm Thực"   },
  { href: "/gallery",    label: "Thư Viện"  },
  { href: "/blog",       label: "Blog"       },
  { href: "/contact",    label: "Liên Hệ"   },
];

function LogoMark({ solid }: { solid: boolean }) {
  return (
    <div className={`flex h-11 w-11 items-center justify-center overflow-hidden rounded-full transition-all duration-300 ${
      solid
        ? "bg-white shadow-[0_10px_30px_rgba(15,23,42,0.10)] ring-1 ring-emerald-950/10"
        : "bg-white/95 shadow-[0_10px_34px_rgba(0,0,0,0.24)] ring-1 ring-white/60"
    }`}>
      <Image
        src="/icon.png"
        alt="Sơn Kiều"
        width={40}
        height={40}
        className="h-10 w-10 object-contain"
        priority
      />
    </div>
  );
}

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6"  x2="21" y2="6"  />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6"  x2="6"  y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
    </svg>
  );
}

export default function Navbar() {
  const pathname               = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !isHome || scrolled;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
      solid ? "bg-white/95 shadow-sm shadow-black/5 backdrop-blur-xl" : ""
    }`}>
      <nav className="mx-auto flex h-[66px] max-w-6xl items-center justify-between px-4 md:px-6">

        {/* Logo */}
        <Link href="/" className={`group flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-emerald-300/70 ${
          solid
            ? "bg-white shadow-sm ring-1 ring-emerald-900/10 hover:ring-emerald-600/25 hover:shadow-md"
            : "bg-emerald-950/[0.34] ring-1 ring-emerald-300/20 backdrop-blur-md hover:bg-emerald-950/[0.46] hover:ring-emerald-300/35"
        }`}>
          <LogoMark solid={solid} />
          <span className="flex flex-col leading-none">
            <span className={`text-[16px] font-black tracking-tight transition-colors ${
              solid ? "text-gray-950" : "text-white"
            }`}>
              Sơn Kiều
            </span>
            <span className={`mt-1 hidden text-[9px] font-bold uppercase tracking-[0.18em] transition-colors sm:block ${
              solid ? "text-emerald-700" : "text-emerald-200/90"
            }`}>
             Khu Du Lịch Sinh Thái
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link href={href} className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? solid
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-white"
                    : solid
                      ? "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                }`}>
                  {label}
                  {active && (
                    <span className={`absolute -bottom-px left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full transition-colors ${
                      solid ? "bg-emerald-600" : "bg-emerald-400"
                    }`} />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA */}
        <Link href="/booking" className={`hidden md:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
          solid
            ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
            : "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 backdrop-blur-sm"
        }`}>
          <TicketIcon />
          Đặt vé ngay
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          className={`rounded-xl p-2 transition-colors md:hidden ${
            solid ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
          }`}
        >
          {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-100/80 bg-white/98 px-4 pb-5 shadow-2xl backdrop-blur-xl md:hidden">
          <ul className="mt-2 flex flex-col gap-0.5">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} onClick={() => setMenuOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    pathname === href
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}>
                  {label}
                </Link>
              </li>
            ))}
            <li className="pt-1">
              <Link href="/booking" onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white">
                <TicketIcon />
                Đặt vé ngay
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
