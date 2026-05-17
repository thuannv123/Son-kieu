"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";

type Category = "all" | "cave" | "lake" | "tour" | "food" | "resort";

interface Photo {
  id: string;
  src: string;
  label: string;
  sublabel: string;
  category: Category;
}

const TABS: { key: Category; label: string; icon: string }[] = [
  { key: "all",    label: "Tất cả",    icon: "🌿" },
  { key: "cave",   label: "Hang Động", icon: "🦇" },
  { key: "lake",   label: "Hồ & Suối", icon: "💧" },
  { key: "tour",   label: "Tham Quan", icon: "🥾" },
  { key: "food",   label: "Ẩm Thực",   icon: "🍖" },
  { key: "resort", label: "Resort",    icon: "🏕️" },
];

/* ── Lightbox ─────────────────────────────────────────────────────── */
function Lightbox({
  photo,
  photos,
  onClose,
  onPrev,
  onNext,
}: {
  photo: Photo;
  photos: Photo[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const idx = photos.indexOf(photo);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 backdrop-blur-md"
      onClick={onClose}>

      {/* Close */}
      <button onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center
                   rounded-full bg-white/10 text-white transition hover:bg-white/20"
        aria-label="Đóng">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      {/* Counter */}
      <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white/10
                      px-3 py-1 text-[12px] text-white/60 backdrop-blur-sm">
        {idx + 1} / {photos.length}
      </div>

      {/* Prev */}
      {idx > 0 && (
        <button onClick={e => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center
                     justify-center rounded-full bg-white/10 text-white transition
                     hover:bg-white/20 hover:scale-110">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      )}

      {/* Next */}
      {idx < photos.length - 1 && (
        <button onClick={e => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center
                     justify-center rounded-full bg-white/10 text-white transition
                     hover:bg-white/20 hover:scale-110">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      )}

      {/* Image */}
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="relative aspect-[4/3] w-full bg-gray-900">
          <Image src={photo.src} alt={photo.label} fill
            className="object-cover" sizes="768px" priority />
        </div>

        {/* Info bar */}
        <div className="flex items-center justify-between bg-gray-950 px-6 py-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">
              {photo.sublabel}
            </p>
            <h3 className="mt-0.5 text-[16px] font-black text-white">{photo.label}</h3>
            <p className="mt-0.5 text-[12px] text-white/40">
              Khu Du Lịch Sinh Thái Sơn Kiều · Trường Sơn, Quảng Trị
            </p>
          </div>
          <Link href="/booking"
            className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2 text-[12px]
                       font-bold text-white transition hover:bg-emerald-500">
            Đặt vé →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default function GalleryPage() {
  const [photos,   setPhotos]   = useState<Photo[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [active,   setActive]   = useState<Category>("all");
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then(r => r.json())
      .then(d => setPhotos(d.photos ?? []))
      .finally(() => setLoading(false));
  }, []);

  const visible = active === "all" ? photos : photos.filter(p => p.category === active);

  const openAt = useCallback((photo: Photo) => setLightbox(photo), []);

  const movePrev = useCallback(() => {
    if (!lightbox) return;
    const idx = visible.indexOf(lightbox);
    if (idx > 0) setLightbox(visible[idx - 1]);
  }, [lightbox, visible]);

  const moveNext = useCallback(() => {
    if (!lightbox) return;
    const idx = visible.indexOf(lightbox);
    if (idx < visible.length - 1) setLightbox(visible[idx + 1]);
  }, [lightbox, visible]);

  return (
    <main className="min-h-screen">

      <PageHero
        title="Khoảnh Khắc Hoang Sơ"
        eyebrow="Thư Viện Ảnh · Sơn Kiều"
        subtitle="Hang động huyền bí, hồ suối trong xanh và những trải nghiệm sinh thái không thể quên."
        crumbs={[{ label: "Thư Viện Ảnh" }]}
        size="compact"
      />

      {/* ── Filter + Grid ── */}
      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 md:px-6">

          {/* Filter tabs */}
          <div className="mb-10 flex flex-wrap gap-2">
            {TABS.map(({ key, label }) => {
              const count = key === "all" ? photos.length : photos.filter(p => p.category === key).length;
              return (
                <button key={key} onClick={() => setActive(key)}
                  className={`inline-flex items-center gap-2 border px-5 py-2.5 text-[11px]
                              font-bold uppercase tracking-[0.18em] transition-colors ${
                    active === key
                      ? "border-[#052e16] bg-[#052e16] text-white"
                      : "border-gray-200 bg-white text-gray-500 hover:border-[#052e16]/40 hover:text-[#052e16]"
                  }`}
                  style={{ borderRadius: 0 }}>
                  {label}
                  <span className={`text-[10px] font-bold ${
                    active === key ? "text-white/60" : "text-gray-400"
                  }`}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 gap-px bg-gray-100 sm:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse bg-gray-100" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-4xl">
                🖼️
              </div>
              <p className="mt-4 text-[16px] font-bold text-gray-700">
                {photos.length === 0 ? "Thư viện đang được cập nhật" : "Không có ảnh trong danh mục này"}
              </p>
              <p className="mt-1 text-[14px] text-gray-400">
                {photos.length === 0 ? "Quay lại sau nhé!" : "Thử chọn danh mục khác"}
              </p>
              {photos.length > 0 && (
                <button onClick={() => setActive("all")}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600
                             px-6 py-2.5 text-[13px] font-bold text-white transition
                             hover:bg-emerald-500">
                  Xem tất cả
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-px bg-gray-100 sm:grid-cols-3 lg:grid-cols-4">
              {visible.map((photo) => (
                <button key={photo.id} onClick={() => openAt(photo)}
                  className="group relative aspect-[4/3] overflow-hidden bg-[#052e16]
                             transition-all duration-300
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]">
                  <Image src={photo.src} alt={photo.label} fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw" />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10
                                  to-transparent opacity-0 transition-opacity duration-300
                                  group-hover:opacity-100" />

                  {/* Label */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4
                                  opacity-0 transition-all duration-300
                                  group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                      {photo.sublabel}
                    </p>
                    <p className="mt-0.5 text-[13px] font-black leading-tight text-white">
                      {photo.label}
                    </p>
                  </div>

                  {/* Zoom icon */}
                  <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center
                                  rounded-full bg-white/20 backdrop-blur-sm opacity-0
                                  transition-opacity duration-300 group-hover:opacity-100">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      <line x1="11" y1="8" x2="11" y2="14"/>
                      <line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Count */}
          {!loading && photos.length > 0 && (
            <p className="mt-10 text-center text-[13px] text-gray-400">
              Hiển thị <span className="font-bold text-gray-600">{visible.length}</span> / {photos.length} ảnh
            </p>
          )}
        </div>
      </div>

      {lightbox && (
        <Lightbox
          photo={lightbox}
          photos={visible}
          onClose={() => setLightbox(null)}
          onPrev={movePrev}
          onNext={moveNext}
        />
      )}
    </main>
  );
}
