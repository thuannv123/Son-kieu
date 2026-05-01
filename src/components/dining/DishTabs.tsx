"use client";

import { useState } from "react";
import Image from "next/image";

interface Category { id: number; name: string; slug: string; emoji: string; sort_order: number; }
interface Dish {
  id: string; name: string; description: string; price: string;
  tag: string; category: string | null; emoji: string; color: string; image_url?: string | null;
}

const COLOR_GRADIENT: Record<string, string> = {
  orange: "from-orange-700 to-red-900",
  amber:  "from-amber-700 to-orange-900",
  teal:   "from-teal-700 to-cyan-900",
  cyan:   "from-cyan-700 to-blue-900",
  lime:   "from-lime-700 to-green-900",
  yellow: "from-yellow-700 to-amber-900",
  violet: "from-violet-700 to-purple-900",
  rose:   "from-rose-700 to-pink-900",
};

export default function DishTabs({ dishes, categories }: { dishes: Dish[]; categories: Category[] }) {
  const [active, setActive] = useState("all");

  const visible = active === "all" ? dishes : dishes.filter(d => d.category === active);

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActive("all")}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px]
                      font-semibold transition-all duration-200 ${
            active === "all"
              ? "bg-orange-500 text-white shadow-[0_4px_14px_rgba(249,115,22,0.35)]"
              : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-orange-300 hover:text-orange-600"
          }`}>
          🍴 Tất cả
          <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
            active === "all" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
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
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px]
                          font-semibold transition-all duration-200 ${
                active === c.slug
                  ? "bg-orange-500 text-white shadow-[0_4px_14px_rgba(249,115,22,0.35)]"
                  : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-orange-300 hover:text-orange-600"
              }`}>
              {c.emoji} {c.name}
              <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                active === c.slug ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((dish, i) => (
          <div key={dish.id}
            className="group flex flex-col overflow-hidden rounded-3xl bg-white
                       shadow-[0_2px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]
                       transition-all duration-300 hover:-translate-y-1.5
                       hover:shadow-[0_16px_48px_rgba(249,115,22,0.12)]
                       hover:ring-orange-200/60">

            {/* Image */}
            <div className={`relative h-52 overflow-hidden bg-gradient-to-br
              ${COLOR_GRADIENT[dish.color] ?? "from-orange-700 to-red-900"}`}>
              {dish.image_url ? (
                <Image src={dish.image_url} alt={dish.name} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center
                                text-6xl opacity-20 transition duration-500
                                group-hover:scale-110 group-hover:opacity-30">
                  {dish.emoji}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

              {/* Tag badge top-left */}
              {dish.tag && (
                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-orange-500/90 px-2.5 py-0.5
                                   text-[10px] font-bold uppercase tracking-wider
                                   text-white shadow-sm">
                    {dish.tag}
                  </span>
                </div>
              )}

              {/* Bestseller crown on first item */}
              {i === 0 && active === "all" && (
                <div className="absolute right-3 top-3">
                  <span className="rounded-full bg-amber-400/95 px-2 py-0.5
                                   text-[10px] font-black text-amber-900">
                    ★ Bán chạy
                  </span>
                </div>
              )}

              {/* Price + name at bottom */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="flex items-end justify-between gap-2">
                  <h3 className="text-[15px] font-black leading-tight text-white
                                 drop-shadow line-clamp-2">
                    {dish.name}
                  </h3>
                  <span className="shrink-0 rounded-full bg-orange-500 px-3 py-1
                                   text-[13px] font-black text-white shadow-sm">
                    {dish.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col p-5 gap-3">
              <p className="text-[13px] leading-relaxed text-gray-500">
                {dish.description}
              </p>
              <div className="flex items-center border-t border-gray-50 pt-3">
                <p className="text-[15px] font-black text-orange-500">
                  {dish.price}{!dish.price.includes("/") && <span className="text-[11px] font-normal text-gray-400"> /phần</span>}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="mb-3 text-4xl">🍽️</div>
          <p className="text-[14px] font-bold text-gray-600">Không có món nào trong danh mục này</p>
          <button onClick={() => setActive("all")}
            className="mt-4 rounded-full bg-orange-500 px-5 py-2 text-[13px]
                       font-bold text-white transition hover:bg-orange-400">
            Xem tất cả
          </button>
        </div>
      )}
    </div>
  );
}
