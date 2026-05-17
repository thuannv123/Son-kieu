"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";

interface FormData {
  name: string; email: string; phone: string; subject: string; message: string;
}
const INITIAL: FormData = { name: "", email: "", phone: "", subject: "", message: "" };

const CONTACT_CARDS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    gradient: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.35)",
    label: "Địa Chỉ",
    value: " Xã Trường Sơn, Tỉnh Quảng Trị",
    sub: "Cách Đồng Hới ~60km về phía Tây",
    href: undefined as string | undefined,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.09 6.09l1.19-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    gradient: "from-blue-500 to-indigo-600",
    glow: "rgba(99,102,241,0.35)",
    label: "Điện Thoại",
    value: " 0857 086 588",
    sub: "Hỗ trợ 08:00 – 17:00 hàng ngày",
    href: "tel:0857086588",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
    gradient: "from-violet-500 to-purple-600",
    glow: "rgba(139,92,246,0.35)",
    label: "Email",
    value: "thuannv0602@gmail.com",
    sub: "Phản hồi trong vòng 24 giờ",
    href: "mailto:thuannv06022001@gmail.com",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    gradient: "from-amber-500 to-orange-600",
    glow: "rgba(249,115,22,0.35)",
    label: "Giờ Làm Việc",
    value: "08:00 – 17:00",
    sub: "Mở cửa tất cả các ngày trong tuần",
    href: undefined,
  },
];

const inputBase = "w-full border bg-gray-50 px-4 py-3 text-[14px] text-gray-900 placeholder-gray-400 outline-none transition-all hover:border-gray-300 focus:border-emerald-500 focus:bg-white";
const inputError = "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-400/20";
const inputOk    = "border-gray-200";

export default function ContactPage() {
  const [form,      setForm]      = useState<FormData>(INITIAL);
  const [errors,    setErrors]    = useState<Partial<FormData>>({});
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    const e: Partial<FormData> = {};
    if (!form.name.trim())   e.name    = "Vui lòng nhập họ tên.";
    if (!form.email.trim())  e.email   = "Vui lòng nhập email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                              e.email   = "Email không hợp lệ.";
    if (!form.subject)        e.subject = "Vui lòng chọn chủ đề.";
    if (!form.message.trim()) e.message = "Vui lòng nhập nội dung.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) setErrors(prev => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  }

  return (
    <main className="min-h-screen">

      <PageHero
        title="Liên Hệ Với Chúng Tôi"
        eyebrow="Luôn Sẵn Sàng Hỗ Trợ"
        subtitle="Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại tin nhắn — phản hồi trong vòng 24 giờ."
        crumbs={[{ label: "Liên Hệ" }]}
        size="compact"
        cta={{ label: "0857 086 588", href: "tel:0857086588" }}
      />

      {/* ── Contact info cards ── */}
      <div className="bg-white px-4 pb-0 pt-12 md:px-6">
        <div className="mx-auto max-w-5xl grid grid-cols-2 gap-px bg-gray-100 lg:grid-cols-4">
          {CONTACT_CARDS.map(card => (
            <div key={card.label}
              className="group flex flex-col gap-5 bg-white p-6
                         transition-colors hover:bg-[#052e16]/[0.02]">
              <div className="flex h-11 w-11 items-center justify-center border border-gray-200
                              text-[#052e16]/50 transition-colors
                              group-hover:border-[#22c55e] group-hover:text-[#22c55e]">
                {card.icon}
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-gray-400">
                  {card.label}
                </p>
                {card.href ? (
                  <a href={card.href}
                    className="mt-1.5 block font-display text-[15px] font-normal italic
                               tracking-[0.03em] text-gray-900 break-words
                               transition-colors hover:text-[#16a34a]">
                    {card.value}
                  </a>
                ) : (
                  <p className="mt-1.5 font-display text-[15px] font-normal italic
                                tracking-[0.03em] text-gray-900 break-words">
                    {card.value}
                  </p>
                )}
                <p className="mt-0.5 text-[11px] text-gray-400">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Form + Map ── */}
      <section className="bg-gray-50 px-4 py-10 md:px-6 pb-20">
        <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-5">

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="border border-gray-100 bg-white p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="mb-5 flex h-20 w-20 items-center justify-center border border-emerald-100
                                  bg-emerald-50">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                      stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="9 12 11 14 15 10"/>
                    </svg>
                  </div>
                  <h2 className="text-[22px] font-black text-gray-900">Gửi thành công!</h2>
                  <p className="mt-3 max-w-sm text-[14px] text-gray-500">
                    Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng{" "}
                    <strong className="text-gray-700">24 giờ</strong> làm việc.
                  </p>
                  <button
                    onClick={() => { setForm(INITIAL); setSubmitted(false); }}
                    className="mt-8 bg-emerald-600 px-6 py-2.5 text-[13px]
                               font-bold text-white transition hover:bg-emerald-500"
                    style={{ borderRadius: 0 }}>
                    Gửi tin nhắn khác
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-7">
                    <h2 className="text-[20px] font-black text-gray-900">Gửi Tin Nhắn</h2>
                    <p className="mt-1 text-[13px] text-gray-400">Điền thông tin bên dưới — chúng tôi sẽ liên hệ lại sớm nhất.</p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input name="name" value={form.name} onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        className={`${inputBase} ${errors.name ? inputError : inputOk}`} />
                      {errors.name && <p className="mt-1 text-[12px] text-red-500">{errors.name}</p>}
                    </div>

                    {/* Email + Phone */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input name="email" type="email" value={form.email} onChange={handleChange}
                          placeholder="you@example.com"
                          className={`${inputBase} ${errors.email ? inputError : inputOk}`} />
                        {errors.email && <p className="mt-1 text-[12px] text-red-500">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
                          Số điện thoại
                        </label>
                        <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                          placeholder="0912 345 678"
                          className={`${inputBase} ${inputOk}`} />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
                        Chủ đề <span className="text-red-500">*</span>
                      </label>
                      <select name="subject" value={form.subject} onChange={handleChange}
                        className={`${inputBase} ${errors.subject ? inputError : inputOk} ${!form.subject ? "text-gray-400" : "text-gray-900"}`}>
                        <option value="" disabled>Chọn chủ đề...</option>
                        <option value="booking">Đặt vé</option>
                        <option value="support">Hỗ trợ</option>
                        <option value="feedback">Phản hồi</option>
                        <option value="partnership">Hợp tác</option>
                      </select>
                      {errors.subject && <p className="mt-1 text-[12px] text-red-500">{errors.subject}</p>}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
                        Nội dung <span className="text-red-500">*</span>
                      </label>
                      <textarea name="message" rows={5} value={form.message} onChange={handleChange}
                        placeholder="Nhập nội dung bạn muốn trao đổi..."
                        className={`${inputBase} resize-none ${errors.message ? inputError : inputOk}`} />
                      {errors.message && <p className="mt-1 text-[12px] text-red-500">{errors.message}</p>}
                    </div>

                    <button type="submit" disabled={loading}
                      className="w-full bg-emerald-600 py-3.5 text-[14px] font-bold text-white
                                 transition hover:bg-emerald-500
                                 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                      style={{ borderRadius: 0 }}>
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          Đang gửi...
                        </span>
                      ) : "Gửi Tin Nhắn →"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Map + directions */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            <div className="overflow-hidden border border-gray-200">
              <iframe
                src="https://maps.google.com/maps?q=Khu+Du+Lich+Sinh+Thai+Son+Kieu,+Truong+Son,+Quang+Tri&output=embed"
                width="100%" height="320"
                style={{ border: 0, display: "block" }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ Khu Du Lịch Sơn Kiều"
              />
            </div>

            <Link href="/directions"
              className="flex w-full items-center justify-center gap-2 border border-emerald-200
                         bg-white px-4 py-3.5 text-[13px] font-bold text-emerald-700
                         transition hover:border-emerald-400 hover:bg-emerald-50"
              style={{ borderRadius: 0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              Xem hướng dẫn đường đến
            </Link>

            {/* Trust row */}
            <div className="border border-gray-100 bg-white p-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
                Cam kết của chúng tôi
              </p>
              {[
                "Phản hồi trong vòng 24 giờ",
                "Hỗ trợ 7 ngày / tuần",
                "Tư vấn miễn phí",
                "Bảo mật thông tin",
              ].map(item => (
                <div key={item} className="flex items-center gap-2 py-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span className="text-[13px] text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
