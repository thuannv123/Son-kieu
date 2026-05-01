"use client";

import { useState } from "react";

export default function SocialShare() {
  const [copied, setCopied] = useState(false);

  function shareOnFacebook() {
    const url = encodeURIComponent(window.location.origin + "/activities");
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "noopener,noreferrer,width=580,height=400"
    );
  }

  function shareOnZalo() {
    window.open("https://zalo.me/", "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for browsers that block clipboard
      const input = document.createElement("input");
      input.value = window.location.origin;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <section className="rounded-2xl bg-white shadow-[0_1px_20px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] px-6 py-5">
      <p className="mb-4 text-center text-[11px] font-bold uppercase tracking-widest text-gray-400">
        Chia sẻ trải nghiệm của bạn
      </p>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
        {/* Facebook */}
        <button
          onClick={shareOnFacebook}
          className="flex items-center justify-center gap-2.5 rounded-xl bg-[#1877f2] px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#0f65d4] hover:-translate-y-px active:translate-y-0"
        >
          <FacebookIcon />
          Chia sẻ Facebook
        </button>

        {/* Zalo */}
        <button
          onClick={shareOnZalo}
          className="flex items-center justify-center gap-2.5 rounded-xl bg-[#0068ff] px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#0057d4] hover:-translate-y-px active:translate-y-0"
        >
          <ZaloIcon />
          Chia sẻ Zalo
        </button>

        {/* Copy link */}
        <button
          onClick={copyLink}
          className={`flex items-center justify-center gap-2.5 rounded-xl border px-5 py-2.5 text-[13px] font-semibold shadow-sm transition-all duration-150 hover:-translate-y-px active:translate-y-0
            ${copied
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
        >
          {copied ? <CheckIcon /> : <LinkIcon />}
          {copied ? "Đã sao chép!" : "Sao chép link"}
        </button>
      </div>

      <p className="mt-4 text-center text-[11px] text-gray-400">
        Hãy để bạn bè cùng khám phá Sơn Kiều với bạn 🌿
      </p>
    </section>
  );
}

/* ── Inline SVG icons ────────────────────────────────────── */

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}

function ZaloIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="white" fillOpacity="0.25"/>
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="white"
        fontFamily="Arial, sans-serif"
        fontSize="14"
        fontWeight="900"
      >Z</text>
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
