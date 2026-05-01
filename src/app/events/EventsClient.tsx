"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type EventStatus = "upcoming" | "past";

export interface CmsEvent {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  eventDate: string | null;
  status: EventStatus;
}

const TAB_LABELS: { key: EventStatus; label: string; icon: string }[] = [
  { key: "upcoming", label: "Sắp diễn ra", icon: "🗓️" },
  { key: "past",     label: "Đã qua",       icon: "📁" },
];

function formatDate(iso: string | null): string {
  if (!iso) return "Sắp cập nhật";
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });
}

export default function EventsClient({ events }: { events: CmsEvent[] }) {
  const [activeTab, setActiveTab]   = useState<EventStatus>("upcoming");
  const [emailInput, setEmailInput] = useState("");
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const upcomingCount = events.filter(e => e.status === "upcoming").length;
  const pastCount     = events.filter(e => e.status === "past").length;
  const filtered      = events.filter(e => e.status === activeTab);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput.trim() }),
      });
      if (res.ok || res.status === 409) setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

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
              <pattern id="edots" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#edots)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center md:px-6 md:py-20">
          <div className="mb-6 flex items-center justify-center gap-2 text-[12px] text-white/40">
            <Link href="/" className="transition hover:text-white/70">Trang chủ</Link>
            <span>/</span>
            <span className="text-white/60">Sự kiện</span>
          </div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10
                          bg-white/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase
                          tracking-[0.18em] text-white/60 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Sự kiện &amp; Lịch trình
          </div>

          <h1 className="text-4xl font-black leading-none text-white md:text-[3.2rem]">
            Khám Phá &amp;{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Trải Nghiệm
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/50">
            Các sự kiện đặc sắc, hoạt động định kỳ và lễ hội tại Khu Du Lịch Sinh Thái Sơn Kiều.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {[
              { val: String(upcomingCount), label: "Sắp diễn ra" },
              { val: String(pastCount),     label: "Đã kết thúc" },
              { val: `${events.length}+`,   label: "Tổng sự kiện" },
            ].map(({ val, label }) => (
              <div key={label} className="flex flex-col items-center rounded-2xl border border-white/[0.08]
                                          bg-white/[0.04] px-6 py-3 backdrop-blur-sm">
                <span className="text-[1.4rem] font-black text-white">{val}</span>
                <span className="text-[11px] text-white/40">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* ── Content ── */}
      <div className="bg-white">
        <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 md:px-6">

          {/* Tabs */}
          <div className="mb-8 flex flex-wrap items-center gap-2.5">
            {TAB_LABELS.map(({ key, label, icon }) => {
              const count = events.filter(e => e.status === key).length;
              const isActive = activeTab === key;
              return (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px]
                              font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)]"
                      : "bg-gray-50 text-gray-600 ring-1 ring-gray-200 hover:bg-white hover:ring-emerald-300 hover:text-emerald-700"
                  }`}>
                  <span>{icon}</span>
                  {label}
                  {count > 0 && (
                    <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
                    }`}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Event grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-4xl">
                🗓️
              </div>
              <p className="mt-4 text-[16px] font-bold text-gray-700">
                {activeTab === "upcoming" ? "Chưa có sự kiện sắp diễn ra" : "Chưa có sự kiện đã qua"}
              </p>
              <p className="mt-1 text-[14px] text-gray-400">
                {activeTab === "upcoming"
                  ? "Các sự kiện mới sẽ được cập nhật sớm."
                  : "Các sự kiện sau khi kết thúc sẽ được lưu trữ tại đây."}
              </p>
              {activeTab === "past" && (
                <button onClick={() => setActiveTab("upcoming")}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600
                             px-6 py-2.5 text-[13px] font-bold text-white transition hover:bg-emerald-500">
                  Xem sự kiện sắp diễn ra
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(event => <EventCard key={event.id} event={event} />)}
            </div>
          )}

          {/* Newsletter */}
          <div className="mt-14 overflow-hidden rounded-3xl shadow-[0_2px_24px_rgba(0,0,0,0.08)]
                          ring-1 ring-black/[0.04] relative"
            style={{ background: "linear-gradient(160deg,#030f05 0%,#071a0b 55%,#040e06 100%)" }}>

            <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs><pattern id="ndots" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="white"/></pattern></defs>
                <rect width="100%" height="100%" fill="url(#ndots)" />
              </svg>
            </div>

            <div className="relative px-8 py-10 text-center">
              {submitted ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full
                                  bg-emerald-500/20 text-3xl">✅</div>
                  <h3 className="text-[18px] font-black text-white">Đăng ký thành công!</h3>
                  <p className="max-w-sm text-[14px] text-white/50">
                    Cảm ơn bạn! Chúng tôi sẽ gửi thông báo sự kiện mới nhất qua email.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10
                                  bg-white/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase
                                  tracking-[0.18em] text-white/60 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Thông báo sự kiện
                  </div>
                  <h3 className="text-[22px] font-black text-white">
                    Nhận thông báo{" "}
                    <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                      sự kiện mới
                    </span>
                  </h3>
                  <p className="mx-auto mt-2 mb-6 max-w-md text-[14px] leading-relaxed text-white/50">
                    Đăng ký email để không bỏ lỡ bất kỳ sự kiện đặc biệt nào tại Sơn Kiều.
                  </p>
                  <form onSubmit={handleEmailSubmit}
                    className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                    <input type="email" required value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      placeholder="email@example.com"
                      className="flex-1 rounded-xl border border-white/10 bg-white/[0.08] px-4 py-3
                                 text-[14px] text-white placeholder:text-white/30 backdrop-blur-sm
                                 focus:border-emerald-500/50 focus:bg-white/[0.12] focus:outline-none
                                 transition" />
                    <button type="submit" disabled={submitting}
                      className="shrink-0 rounded-xl bg-emerald-600 px-6 py-3 text-[14px] font-bold
                                 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition
                                 hover:bg-emerald-500 disabled:opacity-70">
                      {submitting ? "Đang gửi…" : "Đăng ký"}
                    </button>
                  </form>
                  <p className="mt-3 text-[12px] text-white/30">Không spam. Hủy đăng ký bất cứ lúc nào.</p>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

function EventCard({ event }: { event: CmsEvent }) {
  const dateLabel = formatDate(event.eventDate);
  const isUpcoming = event.status === "upcoming";

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white
                         shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]
                         transition-all duration-300 hover:-translate-y-1.5
                         hover:shadow-[0_12px_40px_rgba(0,0,0,0.11)]
                         hover:ring-emerald-200/60">

      {/* Cover image */}
      <div className="relative h-44 overflow-hidden">
        {event.coverImage ? (
          <Image src={event.coverImage} alt={event.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="h-full w-full" style={{ background: "linear-gradient(135deg,#071a0b 0%,#0d2b10 100%)" }}>
            <div className="flex h-full items-center justify-center text-5xl opacity-30">🎉</div>
          </div>
        )}
        {/* Status badge overlay */}
        <div className="absolute left-3 top-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm ${
            isUpcoming
              ? "bg-emerald-600/90 text-white"
              : "bg-black/50 text-white/80"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isUpcoming ? "bg-white animate-pulse" : "bg-white/50"}`} />
            {isUpcoming ? "Sắp diễn ra" : "Đã qua"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
          <span>🗓️</span>
          <span>{dateLabel}</span>
        </div>
        <h2 className="text-[15px] font-black leading-snug text-gray-900
                       transition-colors group-hover:text-emerald-700">
          {event.title}
        </h2>
        {event.excerpt && (
          <p className="text-[13px] leading-relaxed text-gray-500 line-clamp-3">
            {event.excerpt}
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <Link href="/booking"
          className="block w-full rounded-xl bg-emerald-600 py-2.5 text-center text-[13px]
                     font-bold text-white shadow-[0_4px_14px_rgba(16,185,129,0.25)] transition
                     hover:bg-emerald-500 hover:shadow-[0_4px_14px_rgba(16,185,129,0.40)]">
          Đăng ký →
        </Link>
      </div>
    </article>
  );
}
