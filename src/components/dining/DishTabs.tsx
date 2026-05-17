"use client";

import { useState } from "react";
import Image from "next/image";

interface Category { id: number; name: string; slug: string; emoji: string; sort_order: number; }
interface Dish {
  id: string; name: string; description: string; price: string;
  tag: string; category: string | null; emoji: string; color: string; image_url?: string | null;
}

export default function DishTabs({ dishes, categories }: { dishes: Dish[]; categories: Category[] }) {
  const [active, setActive] = useState("all");

  const visible = active === "all" ? dishes : dishes.filter(d => d.category === active);

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActive("all")}
          className={`inline-flex items-center gap-2 border px-5 py-2.5 text-[11px]
                      font-bold uppercase tracking-[0.16em] transition-colors ${
            active === "all"
              ? "border-[#052e16] bg-[#052e16] text-white"
              : "border-gray-200 bg-white text-gray-500 hover:border-[#052e16]/40 hover:text-[#052e16]"
          }`}
          style={{ borderRadius: 0 }}>
          Tất cả
          <span className={`text-[10px] font-bold ${
            active === "all" ? "text-white/60" : "text-gray-400"
          }`}>
            {dishes.length}
          </span>
        </button>
        {categories.map(c => {
          const count = dishes.filter(d => d.category === c.slug).length;
          return (
            <button
              key={c.slug}
              onClick={() => setActive(c.slug)}
              className={`inline-flex items-center gap-2 border px-5 py-2.5 text-[11px]
                          font-bold uppercase tracking-[0.16em] transition-colors ${
                active === c.slug
                  ? "border-[#052e16] bg-[#052e16] text-white"
                  : "border-gray-200 bg-white text-gray-500 hover:border-[#052e16]/40 hover:text-[#052e16]"
              }`}
              style={{ borderRadius: 0 }}>
              {c.emoji} {c.name}
              <span className={`text-[10px] font-bold ${
                active === c.slug ? "text-white/60" : "text-gray-400"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid gap-px bg-gray-100 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((dish, i) => (
          <div key={dish.id}
            className="group flex flex-col overflow-hidden bg-white
                       transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">

            {/* Image */}
            <div className="relative h-52 overflow-hidden bg-[#052e16]">
              {dish.image_url ? (
                <Image src={dish.image_url} alt={dish.name} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center
                                text-6xl opacity-15">
                  {dish.emoji}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#052e16]/70 via-black/10 to-transparent" />

              {/* Tag badge */}
              {dish.tag && (
                <div className="absolute left-3 top-3">
                  <span className="border border-white/20 bg-[#052e16]/60 px-2.5 py-0.5
                                   text-[9px] font-bold uppercase tracking-[0.18em]
                                   text-white/85 backdrop-blur-sm"
                    style={{ borderRadius: 0 }}>
                    {dish.tag}
                  </span>
                </div>
              )}

              {/* Bestseller on first item */}
              {i === 0 && active === "all" && (
                <div className="absolute right-3 top-3">
                  <span className="border border-[#22c55e]/40 bg-[#052e16]/70 px-2.5 py-0.5
                                   text-[9px] font-bold uppercase tracking-[0.18em]
                                   text-[#22c55e] backdrop-blur-sm"
                    style={{ borderRadius: 0 }}>
                    ★ Bán chạy
                  </span>
                </div>
              )}

              {/* Name + price at bottom */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="flex items-end justify-between gap-2">
                  <h3 className="font-display text-[16px] font-normal italic leading-tight
                                 tracking-[0.03em] text-white drop-shadow line-clamp-2">
                    {dish.name}
                  </h3>
                  <span className="shrink-0 border border-[#22c55e]/50 bg-[#052e16]/70 px-3 py-1
                                   font-display text-[13px] font-normal italic text-[#22c55e]
                                   backdrop-blur-sm"
                    style={{ borderRadius: 0 }}>
                    {dish.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-3 p-5">
              <p className="text-[13px] leading-relaxed text-gray-500">
                {dish.description}
              </p>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <p className="font-display text-[18px] font-normal italic tracking-[0.03em] text-[#052e16]">
                  {dish.price}
                  {!dish.price.includes("/") && (
                    <span className="text-[11px] font-normal not-italic text-gray-400"> /phần</span>
                  )}
                </p>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                  {dish.tag || "Món ăn"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center border border-gray-200 text-3xl">
            🍽️
          </div>
          <p className="mt-4 font-display text-[16px] font-normal italic text-gray-600">
            Không có món nào trong danh mục này
          </p>
          <button onClick={() => setActive("all")}
            className="mt-4 border border-[#052e16] bg-[#052e16] px-5 py-2.5
                       text-[11px] font-bold uppercase tracking-[0.18em] text-white
                       transition hover:bg-[#073d1e]"
            style={{ borderRadius: 0 }}>
            Xem tất cả
          </button>
        </div>
      )}
    </div>
  );
}
