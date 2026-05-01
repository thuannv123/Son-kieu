"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getMockSlots } from "@/lib/mock-data";
import type { Activity, ActivitySelection } from "@/types";
import Dialog from "@/components/ui/Dialog";

type Step = 1 | 2 | 3;

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

/* ── Icons ─────────────────────────────────────────────────────── */
function UserIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function MailIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
}
function PhoneIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.27-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}
function CalendarIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function ClockIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function CheckIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
function UsersIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}

const STEPS = [
  { n: 1, label: "Chọn tour" },
  { n: 2, label: "Thông tin" },
  { n: 3, label: "Xác nhận"  },
];

const INPUT_BASE = "w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition";

interface Dish {
  id: string; name: string; description: string;
  price: string; emoji: string; color: string; image_url?: string;
}
interface DishOrder {
  dishId: string; dishName: string; price: string; qty: number;
}
interface BookingFormProps {
  activities:            Activity[];
  categoryMeta:          Record<string, { label: string; icon: string; color: string }>;
  preselectedActivityId?: string;
  dishes:                Dish[];
}
interface GuestInfo {
  guestCount: number;
  guestName:  string;
  guestEmail: string;
  guestPhone: string;
}

export default function BookingForm({ activities, categoryMeta, preselectedActivityId, dishes }: BookingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>(1);
  const [alertMsg, setAlertMsg] = useState("");

  const [selections, setSelections] = useState<ActivitySelection[]>(
    preselectedActivityId ? [{ activityId: preselectedActivityId, date: getTodayString(), slotTime: "" }] : []
  );
  const [sharedDate, setSharedDate] = useState(getTodayString());
  const [sharedSlot, setSharedSlot] = useState("");
  const [showCal, setShowCal]       = useState(false);
  const [calMonth, setCalMonth]     = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });

  const [bookingTab, setBookingTab]         = useState<"activities" | "dining">("activities");
  const [dishSelections, setDishSelections] = useState<DishOrder[]>([]);

  const [bookingRef] = useState(() =>
    "AMF-" + crypto.randomUUID().slice(0, 8).toUpperCase()
  );

  const [guest, setGuest] = useState<GuestInfo>({
    guestCount: 1, guestName: "", guestEmail: "", guestPhone: "",
  });

  /* ── Helpers ────────────────────────────────────────────────── */
  function toggleActivity(id: string) {
    setSelections(prev => {
      const exists = prev.find(s => s.activityId === id);
      if (exists) return prev.filter(s => s.activityId !== id);
      return [...prev, { activityId: id, date: sharedDate, slotTime: sharedSlot }];
    });
  }
  function handleDateChange(date: string) {
    setSharedDate(date);
    setSharedSlot("");
    setSelections(prev => prev.map(s => ({ ...s, date, slotTime: "" })));
  }
  function handleSlotChange(slot: string) {
    setSharedSlot(slot);
    setSelections(prev => prev.map(s => ({ ...s, slotTime: slot })));
  }
  function updateGuest<K extends keyof GuestInfo>(key: K, value: GuestInfo[K]) {
    setGuest(prev => ({ ...prev, [key]: value }));
  }
  function toggleDish(dish: Dish) {
    setDishSelections(prev => {
      const exists = prev.find(d => d.dishId === dish.id);
      if (exists) return prev.filter(d => d.dishId !== dish.id);
      return [...prev, { dishId: dish.id, dishName: dish.name, price: dish.price, qty: 1 }];
    });
  }
  function updateDishQty(dishId: string, qty: number) {
    if (qty <= 0) { setDishSelections(prev => prev.filter(d => d.dishId !== dishId)); return; }
    setDishSelections(prev => prev.map(d => d.dishId === dishId ? { ...d, qty } : d));
  }

  /* ── Derived ───────────────────────────────────────────────── */
  const selectedActivities = selections
    .map(s => activities.find(a => a.id === s.activityId))
    .filter(Boolean) as Activity[];

  function parseDishPrice(price: string): number {
    return Number(price.replace(/[^\d]/g, "")) || 0;
  }
  const activityTotal = selections.reduce((sum, sel) => {
    const act = activities.find(a => a.id === sel.activityId);
    return sum + (act ? act.price * guest.guestCount : 0);
  }, 0);
  const dishTotal    = dishSelections.reduce((sum, d) => sum + parseDishPrice(d.price) * d.qty, 0);
  const totalPrice   = activityTotal + dishTotal;

  function canProceedStep1() {
    const activitiesReady = selections.length === 0 || (!!sharedDate && !!sharedSlot);
    const hasSomething    = selections.length > 0 || dishSelections.length > 0;
    return hasSomething && activitiesReady;
  }
  function canProceedStep2() {
    return (
      guest.guestName.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.guestEmail) &&
      guest.guestPhone.trim().length >= 9
    );
  }

  async function handleSubmit() {
    startTransition(async () => {
      try {
        const results = await Promise.all(
          selections.map((sel, idx) =>
            fetch("/api/bookings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                activityId: sel.activityId, date: sharedDate, slotTime: sharedSlot,
                guestCount: guest.guestCount, guestName: guest.guestName,
                guestEmail: guest.guestEmail, guestPhone: guest.guestPhone,
                bookingRef,
                dishTotal: idx === 0 ? dishTotal : 0,
                dishes: idx === 0 ? dishSelections.map(d => ({ dishName: d.dishName, qty: d.qty, price: d.price })) : [],
              }),
            }).then(async r => {
              const data = await r.json();
              if (!r.ok) throw new Error(data.error ?? "Đặt vé thất bại");
              return data;
            })
          )
        );
        const bookingsForUrl = results.map((r, idx) => ({
          token: r.qrCodeToken, activity: r.activityName,
          date: sharedDate, time: sharedSlot,
          price: idx === 0 ? Number(r.totalPrice) - dishTotal : Number(r.totalPrice),
        }));
        const dishesForUrl = dishSelections.map(d => ({ dishName: d.dishName, qty: d.qty, price: d.price }));
        const grandTotal   = results.reduce((s, r) => s + Number(r.totalPrice ?? 0), 0);

        router.push(
          `/booking/success` +
          `?name=${encodeURIComponent(guest.guestName)}` +
          `&email=${encodeURIComponent(guest.guestEmail)}` +
          `&phone=${encodeURIComponent(guest.guestPhone)}` +
          `&guests=${guest.guestCount}` +
          `&total=${grandTotal}` +
          `&bookings=${encodeURIComponent(JSON.stringify(bookingsForUrl))}` +
          `&dishes=${encodeURIComponent(JSON.stringify(dishesForUrl))}` +
          `&bookingRef=${encodeURIComponent(bookingRef)}`
        );
      } catch (e: unknown) {
        setAlertMsg(e instanceof Error ? e.message : "Lỗi kết nối. Vui lòng thử lại.");
      }
    });
  }

  /* ── fmt ────────────────────────────────────────────────────── */
  const fmtVnd = (n: number) => new Intl.NumberFormat("vi-VN").format(n);

  /* ═══════════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════════ */
  return (
    <>
    <Dialog open={!!alertMsg} type="alert" title="Thông báo"
      message={alertMsg} onConfirm={() => setAlertMsg("")} onClose={() => setAlertMsg("")} />

    <div className="mx-auto max-w-5xl">

      {/* ── Stepper ─────────────────────────────────────────────── */}
      <div className="mb-10 flex items-center justify-center">
        {STEPS.map(({ n, label }, i) => {
          const done   = step > n;
          const active = step === n;
          return (
            <div key={n} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-black transition-all duration-300 ${
                  done   ? "bg-emerald-500 text-white shadow-[0_4px_12px_rgba(16,185,129,0.40)]" :
                  active ? "bg-emerald-600 text-white shadow-[0_4px_16px_rgba(16,185,129,0.45)] ring-4 ring-emerald-500/20" :
                           "bg-gray-100 text-gray-400"
                }`}>
                  {done ? <CheckIcon /> : n}
                </div>
                <span className={`text-[11px] font-bold ${active ? "text-emerald-700" : done ? "text-emerald-500" : "text-gray-400"}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mx-3 mb-5 h-0.5 w-20 rounded-full transition-all duration-500 ${step > n ? "bg-emerald-400" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Two-column layout ───────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">

        {/* ══════ LEFT: Form ══════ */}
        <div className="min-w-0 overflow-hidden rounded-3xl bg-white pb-20
                        shadow-[0_2px_24px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] md:pb-0">

          {/* Step header */}
          <div className="border-b border-gray-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl
                              bg-gradient-to-br from-emerald-500 to-teal-500 text-white
                              text-[12px] font-black shadow-[0_0_12px_rgba(16,185,129,0.35)]">
                {step}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                  Bước {step} / 3
                </p>
                <h2 className="text-[17px] font-black text-gray-900">
                  {step === 1 ? "Chọn hoạt động & thời gian" :
                   step === 2 ? "Thông tin đặt vé" : "Xác nhận đơn hàng"}
                </h2>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">

            {/* ════ STEP 1 ════ */}
            {step === 1 && (
              <div className="space-y-6">

                {/* Tab switcher */}
                <div className="flex gap-1.5 rounded-2xl bg-gray-100/80 p-1.5 w-fit">
                  {(["activities", "dining"] as const).map(t => (
                    <button key={t} type="button"
                      onClick={() => setBookingTab(t)}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold transition-all duration-200 ${
                        bookingTab === t
                          ? t === "dining"
                            ? "bg-orange-500 text-white shadow-[0_2px_8px_rgba(249,115,22,0.35)]"
                            : "bg-emerald-600 text-white shadow-[0_2px_8px_rgba(16,185,129,0.35)]"
                          : "text-gray-500 hover:text-gray-800"
                      }`}>
                      <span>{t === "activities" ? "🌿" : "🍽️"}</span>
                      {t === "activities" ? "Hoạt động" : "Ẩm thực"}
                    </button>
                  ))}
                </div>

                {/* Section label */}
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
                    {bookingTab === "dining" ? "Chọn trải nghiệm ẩm thực" : "Chọn hoạt động"}
                  </p>
                  {selections.length > 0 && bookingTab === "activities" && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                      ✓ {selections.length} đã chọn
                    </span>
                  )}
                </div>

                {/* ── Dining cards ── */}
                {bookingTab === "dining" ? (
                  dishes.length === 0 ? (
                    <div className="rounded-2xl bg-gray-50 py-12 text-center">
                      <p className="text-3xl">🍜</p>
                      <p className="mt-2 text-[13px] text-gray-400">Chưa có món ăn nào.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {dishes.map(dish => {
                        const sel = dishSelections.find(d => d.dishId === dish.id);
                        return (
                          <div key={dish.id}
                            className={`group relative flex items-center gap-3.5 overflow-hidden rounded-2xl
                                        border-2 p-3.5 transition-all duration-200 ${
                              sel ? "border-orange-400 bg-orange-50 shadow-[0_4px_16px_rgba(249,115,22,0.15)]"
                                  : "border-gray-100 bg-gray-50/50 hover:border-orange-200 hover:bg-white hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
                            }`}>
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl
                                            bg-gradient-to-br from-orange-700 to-red-900 flex items-center justify-center text-2xl">
                              {dish.image_url
                                ? <Image src={dish.image_url} alt={dish.name} fill className="object-cover" sizes="64px" />
                                : <span>{dish.emoji}</span>
                              }
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-[13px] font-black leading-snug line-clamp-2 ${sel ? "text-orange-900" : "text-gray-800"}`}>
                                {dish.name}
                              </p>
                              <p className="mt-1 text-[12px] font-bold text-orange-500">
                              {dish.price}{!dish.price.includes("/") && <span className="font-normal text-gray-400">/phần</span>}
                            </p>
                            </div>
                            {sel ? (
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button type="button" onClick={() => updateDishQty(dish.id, sel.qty - 1)}
                                  className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-black text-base hover:bg-orange-200 transition">−</button>
                                <span className="w-5 text-center text-[14px] font-black text-orange-800">{sel.qty}</span>
                                <button type="button" onClick={() => updateDishQty(dish.id, sel.qty + 1)}
                                  className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white font-black text-base hover:bg-orange-600 transition">+</button>
                              </div>
                            ) : (
                              <button type="button" onClick={() => toggleDish(dish)}
                                className="shrink-0 rounded-xl bg-orange-500 px-3.5 py-1.5 text-[12px] font-bold text-white hover:bg-orange-600 transition shadow-[0_2px_8px_rgba(249,115,22,0.30)]">
                                Chọn
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  /* ── Activity cards ── */
                  <div className="grid gap-3 sm:grid-cols-2">
                    {activities.filter(a => a.category !== "DINING").map(a => {
                      const cat      = categoryMeta[a.category] ?? { label: a.category, icon: "📌", color: "bg-gray-500 text-white" };
                      const selected = !!selections.find(s => s.activityId === a.id);
                      return (
                        <button key={a.id} type="button"
                          onClick={() => toggleActivity(a.id)}
                          className={`group relative flex w-full items-center gap-3.5 overflow-hidden rounded-2xl
                                      border-2 p-3.5 text-left transition-all duration-200 ${
                            selected
                              ? "border-emerald-500 bg-emerald-50/80 shadow-[0_4px_16px_rgba(16,185,129,0.18)]"
                              : "border-gray-100 bg-gray-50/50 hover:border-emerald-200 hover:bg-white hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
                          }`}>

                          {/* Thumbnail */}
                          <div className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${a.coverGradient} shadow-sm`}>
                            {a.image_url && (
                              <Image src={a.image_url} alt={a.name} fill className="object-cover" sizes="72px" />
                            )}
                            {selected && (
                              <div className="absolute inset-0 flex items-center justify-center bg-emerald-600/50 backdrop-blur-[1px]">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-emerald-600">
                                  <CheckIcon />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className={`text-[13px] font-black leading-snug line-clamp-2 ${selected ? "text-emerald-900" : "text-gray-900"}`}>
                              {a.name}
                            </p>
                            <p className={`mt-1 text-[15px] font-black ${selected ? "text-emerald-600" : "text-gray-800"}`}>
                              {fmtVnd(a.price)}<span className="text-[11px] font-normal text-gray-400">đ/khách</span>
                            </p>
                            <span className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${cat.color}`}>
                              {cat.icon} {cat.label}
                            </span>
                          </div>

                          {/* Checkmark */}
                          <div className={`ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                            selected
                              ? "border-emerald-500 bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.50)]"
                              : "border-gray-200 group-hover:border-emerald-300"
                          }`}>
                            {selected && <CheckIcon />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Date & time */}
                {selections.length > 0 && (
                  <div className="rounded-2xl border-2 border-emerald-100 bg-emerald-50/50 p-4 space-y-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">Chọn ngày &amp; giờ</p>

                    {/* ── Custom calendar picker ── */}
                    <div>
                      <button type="button" onClick={() => setShowCal(v => !v)}
                        className={`flex w-full items-center gap-3 rounded-xl border-2 bg-white px-4 py-3 text-left transition-all ${
                          showCal ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-emerald-200 hover:border-emerald-300"
                        }`}>
                        <span className="text-emerald-500"><CalendarIcon /></span>
                        <span className={`flex-1 text-[14px] font-semibold ${sharedDate ? "text-gray-900" : "text-gray-400"}`}>
                          {sharedDate
                            ? new Date(sharedDate + "T00:00:00").toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                            : "Chọn ngày tham quan"}
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                          className={`shrink-0 text-gray-400 transition-transform duration-200 ${showCal ? "rotate-180" : ""}`}>
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>

                      {showCal && (
                        <div className="mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.13)]">
                          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                            <button type="button"
                              onClick={() => setCalMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                            </button>
                            <p className="text-[14px] font-black text-gray-900">
                              Tháng {calMonth.getMonth() + 1} / {calMonth.getFullYear()}
                            </p>
                            <button type="button"
                              onClick={() => setCalMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                            </button>
                          </div>
                          <div className="grid grid-cols-7 px-3 pt-2">
                            {["CN","T2","T3","T4","T5","T6","T7"].map(d => (
                              <div key={d} className="py-1.5 text-center text-[10px] font-bold uppercase tracking-wide text-gray-400">{d}</div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-y-0.5 px-3 pb-3">
                            {(() => {
                              const yr = calMonth.getFullYear();
                              const mo = calMonth.getMonth();
                              const firstDay    = new Date(yr, mo, 1).getDay();
                              const daysInMonth = new Date(yr, mo + 1, 0).getDate();
                              const today = getTodayString();
                              const cells: React.ReactNode[] = [];
                              for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} />);
                              for (let d = 1; d <= daysInMonth; d++) {
                                const ds   = `${yr}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                                const past = ds < today;
                                const sel  = ds === sharedDate;
                                const tod  = ds === today;
                                cells.push(
                                  <button key={d} type="button" disabled={past}
                                    onClick={() => { handleDateChange(ds); setShowCal(false); }}
                                    className={`relative flex h-9 w-full items-center justify-center rounded-xl text-[13px] transition-all ${
                                      sel  ? "bg-emerald-600 font-black text-white shadow-[0_4px_10px_rgba(16,185,129,0.40)]" :
                                      past ? "cursor-not-allowed text-gray-300" :
                                      tod  ? "border-2 border-emerald-400 font-black text-emerald-700 hover:bg-emerald-50" :
                                             "font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                                    }`}>
                                    {d}
                                    {tod && !sel && <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-emerald-500" />}
                                  </button>
                                );
                              }
                              return cells;
                            })()}
                          </div>
                          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2.5">
                            <button type="button"
                              onClick={() => { const t = getTodayString(); handleDateChange(t); setCalMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1)); setShowCal(false); }}
                              className="text-[12px] font-bold text-emerald-600 transition hover:text-emerald-700">
                              Hôm nay
                            </button>
                            <button type="button" onClick={() => setShowCal(false)}
                              className="text-[12px] font-semibold text-gray-400 transition hover:text-gray-600">
                              Đóng
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {getMockSlots(selections[0].activityId, sharedDate).map(slot => {
                        const full     = slot.available === 0;
                        const selected = sharedSlot === slot.time;
                        return (
                          <button key={slot.id} type="button" disabled={full}
                            onClick={() => handleSlotChange(slot.time)}
                            className={`rounded-xl border-2 py-3 text-center transition-all duration-200 ${
                              full     ? "cursor-not-allowed border-gray-100 bg-white/60 text-gray-300" :
                              selected ? "border-emerald-500 bg-emerald-600 text-white shadow-[0_4px_12px_rgba(16,185,129,0.35)]" :
                                         "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50"
                            }`}>
                            <p className="text-[14px] font-black">{slot.time}</p>
                            {full && <p className="mt-0.5 text-[9px] text-gray-300">Hết chỗ</p>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Guest count input */}
                <div className="rounded-2xl border-2 border-gray-100 bg-white p-3 sm:p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <UsersIcon />
                    </div>
                    <span className="text-[12px] font-bold text-gray-700">Số lượng khách</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button type="button"
                      onClick={() => updateGuest("guestCount", Math.max(1, guest.guestCount - 1))}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-gray-200 bg-white
                                 text-[18px] font-black text-gray-500 transition hover:border-emerald-400 hover:text-emerald-600 active:scale-95">
                      −
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={guest.guestCount}
                      onChange={e => updateGuest("guestCount", Math.max(1, Number(e.target.value.replace(/\D/g, "")) || 1))}
                      className="min-w-0 flex-1 rounded-xl border-2 border-gray-100 bg-gray-50 py-2.5 text-center text-[22px] font-black
                                 text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2
                                 focus:ring-emerald-500/20 transition"
                    />
                    <button type="button"
                      onClick={() => updateGuest("guestCount", guest.guestCount + 1)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                                 bg-emerald-600 text-[18px] font-black text-white shadow-[0_4px_10px_rgba(16,185,129,0.35)]
                                 transition hover:bg-emerald-500 active:scale-95">
                      +
                    </button>
                  </div>
                  <p className="mt-2.5 text-center text-[11px] text-gray-400">
                    {guest.guestCount === 1 ? "1 người" : `${guest.guestCount} người`} · Tổng{" "}
                    <span className="font-bold text-emerald-600">{new Intl.NumberFormat("vi-VN").format(activityTotal)}đ</span>
                  </p>
                </div>

                <button onClick={() => setStep(2)} disabled={!canProceedStep1()}
                  className={`w-full rounded-2xl py-4 text-[15px] font-black transition-all duration-200 ${
                    canProceedStep1()
                      ? "bg-emerald-600 text-white shadow-[0_6px_20px_rgba(16,185,129,0.40)] hover:bg-emerald-500 hover:-translate-y-0.5"
                      : "cursor-not-allowed bg-gray-100 text-gray-400"
                  }`}>
                  Tiếp theo →
                </button>
              </div>
            )}

            {/* ════ STEP 2 ════ */}
            {step === 2 && (
              <div className="space-y-5">
                {[
                  { key: "guestName",  label: "Họ và tên",    type: "text",  placeholder: "Nguyễn Văn A",      icon: <UserIcon />  },
                  { key: "guestEmail", label: "Email",         type: "email", placeholder: "email@example.com", icon: <MailIcon />  },
                  { key: "guestPhone", label: "Số điện thoại", type: "tel",   placeholder: "0901 234 567",       icon: <PhoneIcon /> },
                ].map(({ key, label, type, placeholder, icon }) => (
                  <div key={key}>
                    <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.14em] text-gray-500">{label}</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
                      <input type={type} placeholder={placeholder}
                        value={guest[key as keyof GuestInfo] as string}
                        onChange={e => updateGuest(key as keyof GuestInfo, e.target.value)}
                        className={INPUT_BASE} />
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(1)}
                    className="flex-1 rounded-2xl border border-gray-200 py-3.5 text-[13px] font-semibold text-gray-600 transition hover:bg-gray-50">
                    ← Quay lại
                  </button>
                  <button onClick={() => setStep(3)} disabled={!canProceedStep2()}
                    className={`flex-[2] rounded-2xl py-3.5 text-[14px] font-black transition-all duration-200 ${
                      canProceedStep2()
                        ? "bg-emerald-600 text-white shadow-[0_6px_20px_rgba(16,185,129,0.40)] hover:bg-emerald-500 hover:-translate-y-0.5"
                        : "cursor-not-allowed bg-gray-100 text-gray-400"
                    }`}>
                    Xem lại →
                  </button>
                </div>
              </div>
            )}

            {/* ════ STEP 3 ════ */}
            {step === 3 && (
              <div className="space-y-5">
                {/* Ticket card */}
                <div className="overflow-hidden rounded-2xl border border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white">

                  <div className="flex items-center gap-3 border-b border-dashed border-emerald-200 px-5 py-3.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full
                                    bg-gradient-to-br from-emerald-500 to-teal-500 text-[14px] font-black text-white
                                    shadow-[0_0_12px_rgba(16,185,129,0.35)]">
                      {guest.guestName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-gray-900">{guest.guestName}</p>
                      <p className="text-[11px] text-gray-400">{guest.guestEmail} · {guest.guestPhone}</p>
                    </div>
                    <span className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                      <UsersIcon /> {guest.guestCount} khách
                    </span>
                  </div>

                  {selections.map((sel, idx) => {
                    const act = selectedActivities.find(a => a.id === sel.activityId)!;
                    if (!act) return null;
                    const cat = categoryMeta[act.category] ?? { label: act.category, icon: "📌", color: "bg-gray-500 text-white" };
                    return (
                      <div key={sel.activityId}>
                        <div className="flex gap-3 px-5 py-4">
                          <div className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${act.coverGradient} shadow-sm`}>
                            {act.image_url && (
                              <Image src={act.image_url} alt={act.name} fill className="object-cover" sizes="64px" />
                            )}
                            <div className="absolute inset-0 bg-black/10" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-[13px] font-black leading-snug text-gray-900">{act.name}</p>
                              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${cat.color}`}>
                                {cat.icon} {cat.label}
                              </span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                              <span className="flex items-center gap-1 text-[11px] text-gray-500">
                                <CalendarIcon />
                                {new Date(sel.date + "T00:00:00").toLocaleDateString("vi-VN", { dateStyle: "medium" })}
                              </span>
                              <span className="flex items-center gap-1 text-[11px] text-gray-500">
                                <ClockIcon /> {sel.slotTime}
                              </span>
                            </div>
                            <p className="mt-1.5 text-[13px] font-black text-emerald-600">
                              {fmtVnd(act.price * guest.guestCount)}đ
                            </p>
                          </div>
                        </div>
                        {idx < selections.length - 1 && (
                          <div className="mx-5 border-t border-dashed border-emerald-100" />
                        )}
                      </div>
                    );
                  })}

                  {dishSelections.length > 0 && (
                    <>
                      <div className="mx-5 border-t border-dashed border-orange-200" />
                      <div className="px-5 py-3">
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-orange-500">🍽️ Đơn ăn uống</p>
                        {dishSelections.map(d => (
                          <div key={d.dishId} className="flex items-center justify-between py-1.5">
                            <span className="text-[13px] text-gray-700">{d.dishName} <span className="text-gray-400">×{d.qty}</span></span>
                            <span className="text-[12px] font-semibold text-orange-600">
                              {fmtVnd(parseDishPrice(d.price) * d.qty)}đ
                            </span>
                          </div>
                        ))}
                        <p className="mt-2 text-[11px] italic text-orange-400">* Đơn ăn uống xác nhận khi check-in</p>
                      </div>
                    </>
                  )}

                  <div className="relative flex items-center">
                    <div className="absolute -left-3 h-6 w-6 rounded-full bg-white" />
                    <div className="absolute -right-3 h-6 w-6 rounded-full bg-white" />
                    <div className="w-full border-t border-dashed border-emerald-200" />
                  </div>

                  <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 to-teal-700 px-5 py-4">
                    <div>
                      <p className="text-[11px] font-medium text-emerald-200">Tổng thanh toán</p>
                      <p className="text-[11px] text-emerald-300">
                        {selections.length > 0 && `${selections.length} hoạt động · `}{guest.guestCount} khách
                      </p>
                    </div>
                    <p className="text-[26px] font-black text-white">
                      {fmtVnd(totalPrice)}<span className="text-sm font-normal">đ</span>
                    </p>
                  </div>
                </div>

                {/* VietQR */}
                {(() => {
                  const bankId      = process.env.NEXT_PUBLIC_BANK_ID      ?? "MB";
                  const bankAccount = process.env.NEXT_PUBLIC_BANK_ACCOUNT ?? "0000000000";
                  const bankName    = process.env.NEXT_PUBLIC_BANK_NAME    ?? "SON KIEU";
                  const addInfo     = encodeURIComponent(bookingRef);
                  const qrUrl       = `https://img.vietqr.io/image/${bankId}-${bankAccount}-compact2.png?amount=${totalPrice}&addInfo=${addInfo}&accountName=${encodeURIComponent(bankName)}`;
                  return (
                    <div className="overflow-hidden rounded-2xl ring-1 ring-blue-100">
                      <div className="bg-blue-600 px-5 py-3.5 text-center">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-100">Quét mã thanh toán</p>
                        <p className="mt-0.5 text-[12px] text-blue-200">Dùng app ngân hàng bất kỳ hỗ trợ VietQR</p>
                      </div>
                      <div className="flex flex-col items-center gap-5 bg-blue-50/40 px-5 py-5 sm:flex-row sm:gap-6">
                        <div className="shrink-0 rounded-2xl border border-blue-100 bg-white p-3 shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={qrUrl} alt="VietQR thanh toán" width={160} height={160} className="h-40 w-40 object-contain" />
                        </div>
                        <div className="flex-1 space-y-3 text-center sm:text-left">
                          {[
                            { label: "Ngân hàng",    value: bankId, mono: false },
                            { label: "Số tài khoản", value: bankAccount, mono: true },
                            { label: "Chủ tài khoản", value: bankName, mono: false },
                          ].map(({ label, value, mono }) => (
                            <div key={label}>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
                              <p className={`text-[14px] font-black text-gray-900 ${mono ? "font-mono tracking-widest" : ""}`}>{value}</p>
                            </div>
                          ))}
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Số tiền</p>
                            <p className="text-[20px] font-black text-blue-600">{fmtVnd(totalPrice)}<span className="text-sm font-normal">đ</span></p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Nội dung CK</p>
                            <p className="font-mono text-[14px] font-black tracking-widest text-blue-700">{bookingRef}</p>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-blue-100 bg-blue-50 px-5 py-3 text-center">
                        <p className="text-[11px] text-blue-600">
                          Sau khi chuyển khoản thành công, nhấn <strong>Xác nhận</strong> bên dưới
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Lưu ý chính sách hoàn tiền */}
                <div className="rounded-2xl bg-amber-50 ring-1 ring-amber-200 px-4 py-4 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚠️</span>
                    <p className="text-[12px] font-bold text-amber-900">Lưu ý chính sách hoàn tiền</p>
                  </div>
                  <div className="space-y-1.5 text-[12px] text-amber-800 leading-relaxed">
                    <div className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span><strong>Trong 24 giờ</strong> sau khi chuyển khoản: có thể hoàn tiền hoặc đổi sang ngày khác.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span><strong>Sau 24 giờ:</strong> không hoàn tiền — chỉ hỗ trợ đổi lịch trong 30 ngày (1 lần, tùy chỗ còn).</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span>Yêu cầu hoàn tiền phải kèm <strong>ảnh biên lai chuyển khoản</strong> thể hiện rõ số tiền, ngân hàng và mã giao dịch.</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-amber-700">
                    Liên hệ: <a href="tel:0857086588" className="font-semibold underline">0857 086 588</a>
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)}
                    className="flex-1 rounded-2xl border border-gray-200 py-3.5 text-[13px] font-semibold text-gray-600 transition hover:bg-gray-50">
                    ← Sửa lại
                  </button>
                  <button onClick={handleSubmit} disabled={isPending}
                    className="flex-[2] rounded-2xl bg-blue-600 py-3.5 text-[14px] font-black text-white
                               shadow-[0_6px_20px_rgba(37,99,235,0.35)] transition-all
                               hover:bg-blue-500 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0">
                    {isPending ? "Đang xử lý…" : "Tôi đã chuyển khoản → Xác nhận"}
                  </button>
                </div>

                <p className="text-center text-[11px] text-gray-400">
                  Bằng cách xác nhận, bạn đồng ý với{" "}
                  <a href="/terms" className="text-emerald-600 underline hover:text-emerald-700">điều khoản sử dụng</a>.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ══════ RIGHT: Summary ══════ */}
        <div className="space-y-4 self-start lg:sticky lg:top-24">

          {/* Booking summary */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04]">

            <div className="border-b border-gray-100 px-5 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Tóm tắt đặt vé</p>
            </div>

            {selections.length > 0 || dishSelections.length > 0 ? (
              <>
                {selections.length > 0 && (
                  <div className="divide-y divide-gray-50">
                    {selections.map(sel => {
                      const act = activities.find(a => a.id === sel.activityId);
                      if (!act) return null;
                      return (
                        <div key={sel.activityId} className="flex items-center gap-3 px-5 py-3.5">
                          <div className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${act.coverGradient} shadow-sm`}>
                            {act.image_url && (
                              <Image src={act.image_url} alt={act.name} fill className="object-cover" sizes="44px" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12px] font-bold text-gray-800">{act.name}</p>
                            <p className="text-[11px] text-gray-400">
                              {sel.date
                                ? new Date(sel.date + "T00:00:00").toLocaleDateString("vi-VN")
                                : "Chưa chọn ngày"}
                              {sel.slotTime ? ` · ${sel.slotTime}` : ""}
                            </p>
                          </div>
                          <p className="shrink-0 text-[13px] font-black text-emerald-600">
                            {fmtVnd(act.price * guest.guestCount)}đ
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {dishSelections.length > 0 && (
                  <div className="border-t border-dashed border-orange-200 bg-orange-50/40">
                    <p className="px-5 pb-1 pt-3 text-[10px] font-bold uppercase tracking-wider text-orange-400">🍽️ Ẩm thực</p>
                    <div className="divide-y divide-orange-100/60">
                      {dishSelections.map(d => (
                        <div key={d.dishId} className="flex items-center justify-between px-5 py-2.5">
                          <div>
                            <p className="text-[12px] font-semibold text-gray-800">{d.dishName}</p>
                            <p className="text-[11px] text-gray-400">{d.price} × {d.qty}</p>
                          </div>
                          <p className="text-[12px] font-bold text-orange-500">
                            {fmtVnd(parseDishPrice(d.price) * d.qty)}đ
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-100 px-5 py-3">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-gray-500">Số khách</span>
                    <span className="font-bold text-gray-900">{guest.guestCount} người</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 to-teal-700 px-5 py-4">
                  <span className="text-[12px] font-semibold text-emerald-200">Tổng cộng</span>
                  <span className="text-[20px] font-black text-white">
                    {fmtVnd(totalPrice)}<span className="text-sm font-normal">đ</span>
                  </span>
                </div>
              </>
            ) : (
              <div className="px-5 py-12 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl
                                border-2 border-dashed border-gray-200 text-3xl text-gray-300">
                  🎫
                </div>
                <p className="text-[13px] font-bold text-gray-600">Chưa chọn hoạt động</p>
                <p className="mt-1 text-[12px] text-gray-400">Chọn một hoặc nhiều tour ở bên trái</p>
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]">
            <div className="px-5 pt-4 pb-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">Cam kết của chúng tôi</p>
            </div>
            <div className="divide-y divide-gray-50 px-5 pb-4">
              {[
                { icon: "✅", label: "Xác nhận tức thì",   desc: "Nhận email & SMS ngay",     bg: "bg-emerald-100", color: "text-emerald-600" },
                { icon: "📱", label: "QR không cần in vé", desc: "Check-in bằng điện thoại",  bg: "bg-blue-100",    color: "text-blue-600"    },
                { icon: "🔄", label: "Hoàn vé 100%",       desc: "Hủy trước 24 giờ",          bg: "bg-violet-100",  color: "text-violet-600"  },
                { icon: "🔒", label: "Bảo mật SSL",        desc: "Thanh toán an toàn tuyệt đối", bg: "bg-slate-100", color: "text-slate-600"  },
              ].map(({ icon, label, desc, bg, color }) => (
                <div key={label} className="flex items-center gap-3 py-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg} text-lg`}>
                    {icon}
                  </div>
                  <div>
                    <p className={`text-[12px] font-bold ${color}`}>{label}</p>
                    <p className="text-[11px] text-gray-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>

    {/* ── Sticky mobile CTA ─────────────────────────────────────── */}
    {(() => {
      if (step === 1 && (selections.length > 0 || dishSelections.length > 0)) {
        const actCount  = selections.length;
        const dishCount = dishSelections.length;
        let summaryText = "";
        if (actCount > 0) {
          summaryText = `${actCount} hoạt động · ${fmtVnd(activityTotal)}đ`;
        } else if (dishCount > 0) {
          summaryText = `${dishCount} món · ${fmtVnd(dishTotal)}đ`;
        }
        return (
          <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-3">
              <p className="min-w-0 flex-1 truncate text-[12px] font-semibold text-gray-600">{summaryText}</p>
              <button onClick={() => setStep(2)} disabled={!canProceedStep1()}
                className={`shrink-0 rounded-xl px-5 py-2.5 text-[13px] font-black transition-all ${
                  canProceedStep1()
                    ? "bg-emerald-600 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:bg-emerald-500"
                    : "cursor-not-allowed bg-gray-200 text-gray-400"
                }`}>
                Tiếp theo →
              </button>
            </div>
          </div>
        );
      }
      if (step === 2) {
        return (
          <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
            <button onClick={() => setStep(3)} disabled={!canProceedStep2()}
              className={`w-full rounded-xl py-3 text-[13px] font-black transition-all ${
                canProceedStep2()
                  ? "bg-emerald-600 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:bg-emerald-500"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
              }`}>
              Xem lại →
            </button>
          </div>
        );
      }
      if (step === 3) {
        return (
          <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
            <button onClick={handleSubmit} disabled={isPending}
              className="w-full rounded-xl bg-blue-600 py-3 text-[13px] font-black text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition hover:bg-blue-500 disabled:opacity-60">
              {isPending ? "Đang xử lý…" : "Tôi đã chuyển khoản → Xác nhận"}
            </button>
          </div>
        );
      }
      return null;
    })()}
    </>
  );
}
