"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { AdminRole } from "@/lib/admin-auth";
import { NAV_ROLES } from "@/lib/admin-auth";

const I = {
  dashboard: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  bookings:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/><line x1="9" y1="12" x2="15" y2="12"/></svg>,
  checkin:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  safety:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  activities:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  dining:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  gallery:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  staff:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  analytics: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  cms:       <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  reviews:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  settings:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  logout:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

const ALL_NAV_GROUPS = [
  {
    label: "Vận hành",
    items: [
      { href: "/admin/dashboard", label: "Tổng quan",    icon: I.dashboard  },
      { href: "/admin/bookings",  label: "Đặt chỗ",      icon: I.bookings   },
      { href: "/admin/checkin",   label: "Check-in QR",  icon: I.checkin    },
      { href: "/admin/safety",    label: "An toàn",      icon: I.safety     },
    ],
  },
  {
    label: "Quản lý",
    items: [
      { href: "/admin/resources", label: "Hoạt Động",    icon: I.activities },
      { href: "/admin/dining",    label: "Ẩm thực",      icon: I.dining     },
      { href: "/admin/gallery",   label: "Thư viện ảnh", icon: I.gallery    },
      { href: "/admin/staff",     label: "Nhân sự",      icon: I.staff      },
    ],
  },
  {
    label: "Dữ liệu",
    items: [
      { href: "/admin/analytics", label: "Thống kê",     icon: I.analytics  },
      { href: "/admin/cms",       label: "Nội dung",     icon: I.cms        },
      { href: "/admin/reviews",   label: "Đánh giá",     icon: I.reviews    },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      { href: "/admin/settings",  label: "Cài đặt",      icon: I.settings   },
    ],
  },
];

const ROLE_LABEL: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super Admin",
  MANAGER:     "Quản lý",
};

const PAGE_TITLE: Record<string, { title: string; sub: string }> = {
  dashboard:  { title: "Tổng quan",             sub: "Xem nhanh hoạt động hôm nay"      },
  bookings:   { title: "Quản lý Đặt chỗ",       sub: "Danh sách và xác nhận đơn đặt"    },
  checkin:    { title: "Check-in QR",            sub: "Quét mã xác nhận khách vào cổng"  },
  safety:     { title: "Điều phối An toàn",      sub: "Trạng thái khu vực và cảnh báo"   },
  resources:  { title: "Quản lý Hoạt Động",      sub: "Cấu hình dịch vụ và giá"          },
  staff:      { title: "Quản lý Nhân sự",        sub: "Danh sách và phân công nhân viên" },
  analytics:  { title: "Thống kê & Báo cáo",     sub: "Doanh thu, lượt khách, xu hướng"  },
  cms:        { title: "Quản lý Nội dung",        sub: "Bài viết, blog và trang tĩnh"     },
  reviews:    { title: "Quản lý Đánh Giá",       sub: "Phản hồi và xếp hạng từ khách"   },
  gallery:    { title: "Thư Viện Ảnh",            sub: "Hình ảnh và media"                },
  dining:     { title: "Quản lý Ẩm thực",         sub: "Menu, món ăn và thức uống"        },
  settings:   { title: "Cài đặt Website",         sub: "Cấu hình hệ thống và thông tin"   },
};

function initials(name: string) {
  return name.split(" ").slice(-2).map((w: string) => w[0]).join("").toUpperCase();
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  const [me, setMe] = useState<{ name: string; role: AdminRole } | null>(null);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    fetch("/api/admin/me")
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setMe({ name: d.name, role: d.role }))
      .catch(() => {});
  }, [pathname]);

  if (pathname === "/admin/login") return <>{children}</>;

  const segment  = pathname.split("/")[2] ?? "dashboard";
  const page     = PAGE_TITLE[segment] ?? { title: segment, sub: "" };

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  // Filter nav by role (default to showing all until role is known)
  const navGroups = ALL_NAV_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => {
      if (!me) return true; // show all while loading
      const allowed = NAV_ROLES[item.href];
      return !allowed || allowed.includes(me.role);
    }),
  })).filter(group => group.items.length > 0);

  const displayName = me?.name ?? "Admin";
  const displayRole = me ? ROLE_LABEL[me.role] ?? me.role : "";

  return (
    <div className="flex min-h-screen bg-[#f0f4f3]">

      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className="flex w-60 shrink-0 flex-col bg-[#0d1117]">

        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-white/[0.06]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-900/40">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M17 3C17 3 10 5 7 12C5 17 8 21 12 21C16 21 19 17 19 13C19 9 16 7 13 8C11 8.5 10 10 11 12C12 14 15 13 15 11"
                stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7 12C5 8 6 4 8 3" stroke="#a7f3d0" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p className="text-[14px] font-black text-white tracking-tight">Sơn Kiều</p>
            <p className="text-[10px] text-emerald-500/70 font-medium">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-1.5 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ href, icon, label }) => {
                  const active = pathname.startsWith(href);
                  return (
                    <Link key={href} href={href}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                        active
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "text-gray-500 hover:bg-white/[0.05] hover:text-gray-200"
                      }`}>
                      <span className={`transition-colors ${active ? "text-emerald-400" : "text-gray-600 group-hover:text-gray-300"}`}>
                        {icon}
                      </span>
                      <span>{label}</span>
                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User + logout */}
        <div className="border-t border-white/[0.06] px-3 pb-4 pt-3 space-y-0.5">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-[11px] font-black text-white">
              {initials(displayName)}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0d1117] bg-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-white truncate">{displayName}</p>
              <p className="text-[10px] text-emerald-500/60 truncate">{displayRole}</p>
            </div>
          </div>
          <button onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[12px] text-gray-600 transition hover:bg-white/[0.05] hover:text-gray-300">
            {I.logout}
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex h-16 items-center justify-between bg-white px-7 shadow-[0_1px_0_#e5e7eb]">
          <div>
            <h1 className="text-[15px] font-bold text-gray-900 leading-tight">{page.title}</h1>
            {page.sub && <p className="text-[11px] text-gray-400 mt-0.5">{page.sub}</p>}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-1.5 text-[11px] text-gray-500 ring-1 ring-gray-200/80">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className="font-medium text-gray-600" suppressHydrationWarning>
                {new Date().toLocaleDateString("vi-VN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-[11px] font-black text-white">
              {initials(displayName)}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-7">{children}</main>
      </div>
    </div>
  );
}
