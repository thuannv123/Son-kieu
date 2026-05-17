"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";

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

const TAB_LABELS: { key: EventStatus; label: string }[] = [
  { key: "upcoming", label: "Sắp Diễn Ra" },
  { key: "past",     label: "Đã Qua" },
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

      <PageHero
        title="Sự Kiện & Lễ Hội"
        eyebrow="Sự Kiện · Sơn Kiều"
        subtitle="Các sự kiện đặc sắc, hoạt động định kỳ và lễ hội tại Khu Du Lịch Sinh Thái Sơn Kiều."
        crumbs={[{ label: "Sự Kiện" }]}
        size="compact"
      />

      {/* ── Content ── */}
      <div className="bg-white">
        <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 md:px-6">

          {/* Stats + Tabs row */}
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {TAB_LABELS.map(({ key, label }) => {
                const count = events.filter(e => e.status === key).length;
                const isActive = activeTab === key;
                return (
                  <button key={key} onClick={() => setActiveTab(key)}
                    className={`inline-flex items-center gap-2 border px-5 py-2.5 text-[11px]
                                font-bold uppercase tracking-[0.18em] transition-colors ${
                      isActive
                        ? "border-[#052e16] bg-[#052e16] text-white"
                        : "border-gray-200 bg-white text-gray-500 hover:border-[#052e16]/40 hover:text-[#052e16]"
                    }`}
                    style={{ borderRadius: 0 }}>
                    {label}
                    <span className={`text-[10px] font-bold ${
                      isActive ? "text-white/60" : "text-gray-400"
                    }`}>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Stats */}
            <div className="flex gap-px bg-gray-100">
              {[
                { val: String(upcomingCount), label: "Sắp diễn ra" },
                { val: String(pastCount),     label: "Đã kết thúc" },
                { val: `${events.length}`,    label: "Tổng sự kiện" },
              ].map(({ val, label }) => (
                <div key={label} className="flex flex-col items-center bg-white px-5 py-3">
                  <span className="text-[18px] font-black text-[#052e16]">{val}</span>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Event grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-center">
              <div className="flex h-20 w-20 items-center justify-center border border-gray-200 text-4xl">
                🗓️
              </div>
              <p className="mt-4 font-display text-[18px] font-normal italic text-gray-700">
                {activeTab === "upcoming" ? "Chưa có sự kiện sắp diễn ra" : "Chưa có sự kiện đã qua"}
              </p>
              <p className="mt-1 text-[14px] text-gray-400">
                {activeTab === "upcoming"
                  ? "Các sự kiện mới sẽ được cập nhật sớm."
                  : "Các sự kiện sau khi kết thúc sẽ được lưu trữ tại đây."}
              </p>
              {activeTab === "past" && (
                <button onClick={() => setActiveTab("upcoming")}
                  className="mt-6 inline-flex items-center gap-2 bg-[#052e16]
                             px-6 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#052e16]/90"
                  style={{ borderRadius: 0 }}>
                  Xem sự kiện sắp diễn ra
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-px bg-gray-100 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(event => <EventCard key={event.id} event={event} />)}
            </div>
          )}

          {/* Newsletter */}
          <div className="mt-14 overflow-hidden bg-[#052e16]">
            <div className="relative px-8 py-10 text-center">
              {submitted ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="flex h-14 w-14 items-center justify-center border border-emerald-500/30
                                  bg-emerald-500/20 text-3xl">✅</div>
                  <h3 className="font-display text-[20px] font-normal italic text-white">Đăng ký thành công!</h3>
                  <p className="max-w-sm text-[14px] text-white/50">
                    Cảm ơn bạn! Chúng tôi sẽ gửi thông báo sự kiện mới nhất qua email.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4 inline-flex items-center gap-2 border border-white/10
                                  bg-white/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase
                                  tracking-[0.18em] text-white/60"
                    style={{ borderRadius: 0 }}>
                    <span className="h-1.5 w-1.5 animate-pulse bg-emerald-400" />
                    Thông báo sự kiện
                  </div>
                  <h3 className="font-display text-[24px] font-normal italic text-white">
                    Nhận thông báo sự kiện mới
                  </h3>
                  <p className="mx-auto mt-2 mb-6 max-w-md text-[14px] leading-relaxed text-white/50">
                    Đăng ký email để không bỏ lỡ bất kỳ sự kiện đặc biệt nào tại Sơn Kiều.
                  </p>
                  <form onSubmit={handleEmailSubmit}
                    className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                    <input type="email" required value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      placeholder="email@example.com"
                      className="flex-1 border border-white/10 bg-white/[0.08] px-4 py-3
                                 text-[14px] text-white placeholder:text-white/30
                                 focus:border-emerald-500/50 focus:bg-white/[0.12] focus:outline-none
                                 transition"
                      style={{ borderRadius: 0 }} />
                    <button type="submit" disabled={submitting}
                      className="shrink-0 bg-emerald-600 px-6 py-3 text-[14px] font-bold
                                 text-white transition hover:bg-emerald-500 disabled:opacity-70"
                      style={{ borderRadius: 0 }}>
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
    <article className="group flex flex-col overflow-hidden bg-white
                         transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">

      {/* Cover image */}
      <div className="relative h-44 overflow-hidden bg-[#052e16]">
        {event.coverImage ? (
          <Image src={event.coverImage} alt={event.title} fill
            className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl opacity-30">🎉</div>
        )}
        {/* Status badge */}
        <div className="absolute left-3 top-3">
          <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-bold
                            uppercase tracking-[0.1em] backdrop-blur-sm ${
            isUpcoming
              ? "border-emerald-500/40 bg-emerald-600/90 text-white"
              : "border-white/20 bg-black/50 text-white/80"
          }`} style={{ borderRadius: 0 }}>
            <span className={`h-1.5 w-1.5 ${isUpcoming ? "bg-white animate-pulse" : "bg-white/50"}`} />
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
        <h2 className="font-display text-[16px] font-normal italic leading-snug text-gray-900
                       transition-colors group-hover:text-[#052e16]">
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
          className="block w-full bg-[#052e16] py-2.5 text-center text-[13px]
                     font-bold text-white transition hover:bg-[#052e16]/90"
          style={{ borderRadius: 0 }}>
          Đăng ký →
        </Link>
      </div>
    </article>
  );
}
