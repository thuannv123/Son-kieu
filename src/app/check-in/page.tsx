import type { Metadata } from "next";
import CheckInClient from "@/components/checkin/CheckInClient";

export const metadata: Metadata = {
  title: "Check-in | Sơn Kiều",
};

export default function CheckInPage() {
  return (
    <main className="min-h-screen bg-gray-950 pt-16">
      <div className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#030f05 0%,#071a0b 55%,#040e06 100%)" }}>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[240px] w-[480px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-[80px]"
            style={{ background: "radial-gradient(ellipse,rgba(16,185,129,0.14) 0%,transparent 70%)" }} />
        </div>

        <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cidots" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cidots)" />
          </svg>
        </div>

        <div className="relative px-4 py-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10
                          bg-white/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase
                          tracking-[0.18em] text-white/60 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Nhân viên
          </div>
          <h1 className="text-2xl font-black text-white">Check-in Vé</h1>
          <p className="mt-1 text-[13px] text-white/40">Quét QR hoặc nhập mã để xác nhận vé khách</p>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-gray-950" />
      </div>
      <div className="mx-auto max-w-md px-4 py-8">
        <CheckInClient />
      </div>
    </main>
  );
}
