"use client";

import { useState, useTransition } from "react";
import { useRouter }               from "next/navigation";
import Dialog from "@/components/ui/Dialog";

const CAT_META: Record<string, { icon: string; label: string; gradient: string; iconBg: string }> = {
  CAVE:        { icon: "🦇", label: "Hang Động", gradient: "from-slate-600 to-slate-800",   iconBg: "bg-slate-100"   },
  LAKE:        { icon: "🏊", label: "Hồ Bơi",    gradient: "from-cyan-500 to-blue-600",     iconBg: "bg-cyan-100"    },
  SIGHTSEEING: { icon: "🌄", label: "Tham Quan", gradient: "from-emerald-500 to-teal-700",  iconBg: "bg-emerald-100" },
  ALL:         { icon: "🚨", label: "Tất cả",     gradient: "from-red-500 to-rose-700",      iconBg: "bg-red-100"     },
};

interface Activity { id: string; name: string; is_active: boolean }

interface EmergencyPanelProps {
  category:      "CAVE" | "LAKE" | "SIGHTSEEING" | "ALL";
  activities:    Activity[];
  showAsButton?: boolean;
}

function getToken() {
  return document.cookie.match(/admin_session=([^;]+)/)?.[1] ?? "";
}

export default function EmergencyPanel({ category, activities, showAsButton }: EmergencyPanelProps) {
  const router           = useRouter();
  const [pending, start] = useTransition();
  const meta             = CAT_META[category];
  const allOpen          = activities.length > 0 && activities.every(a => a.is_active);
  const allClosed        = activities.length > 0 && activities.every(a => !a.is_active);
  const openCount        = activities.filter(a => a.is_active).length;

  const [confirmClose, setConfirmClose] = useState(false);
  const [alertMsg,     setAlertMsg]     = useState("");

  function doToggle(action: "open" | "close") {
    start(async () => {
      const res  = await fetch("/api/admin/emergency", {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` },
        body:    JSON.stringify({ category, action }),
      });
      const data = await res.json();
      if (res.ok) { setAlertMsg(data.message); router.refresh(); }
      else setAlertMsg(data.error ?? "Thao tác thất bại");
    });
  }

  if (showAsButton) {
    return (
      <>
        <Dialog open={confirmClose} title="Đóng tất cả khu vực"
          message="Tất cả hoạt động sẽ đóng cửa ngay. Khách đang chờ sẽ thấy thông báo."
          danger onConfirm={() => doToggle("close")} onClose={() => setConfirmClose(false)} />
        <Dialog open={!!alertMsg} type="alert" title="Kết quả" message={alertMsg}
          onConfirm={() => setAlertMsg("")} onClose={() => setAlertMsg("")} />
        <button
          onClick={() => setConfirmClose(true)}
          disabled={pending || allClosed}
          className="flex items-center gap-2.5 rounded-xl bg-red-600 px-6 py-3
                     text-[13px] font-bold text-white shadow-lg shadow-red-500/30
                     transition hover:bg-red-700 active:scale-95 disabled:opacity-50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          {pending ? "Đang xử lý..." : "Đóng tất cả ngay"}
        </button>
      </>
    );
  }

  return (
    <>
      <Dialog open={confirmClose} title={`Đóng ${meta.label}`}
        message={`Tất cả ${activities.length} khu vực ${meta.label} sẽ đóng cửa ngay. Khách đang chờ sẽ thấy thông báo.`}
        danger onConfirm={() => doToggle("close")} onClose={() => setConfirmClose(false)} />
      <Dialog open={!!alertMsg} type="alert" title="Kết quả" message={alertMsg}
        onConfirm={() => setAlertMsg("")} onClose={() => setAlertMsg("")} />

      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">

        {/* Header gradient */}
        <div className={`bg-gradient-to-r ${meta.gradient} px-5 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-xl">
                {meta.icon}
              </div>
              <div>
                <p className="text-[15px] font-black text-white">{meta.label}</p>
                <p className="text-[11px] text-white/60">{activities.length} khu vực</p>
              </div>
            </div>
            <div className={`rounded-full px-3 py-1 text-[11px] font-black ${
              allOpen   ? "bg-white/20 text-white" :
              allClosed ? "bg-black/20 text-white/70" :
                          "bg-white/20 text-white"
            }`}>
              {allOpen ? `${openCount}/${activities.length} mở` :
               allClosed ? "Đang đóng" :
               `${openCount}/${activities.length} mở`}
            </div>
          </div>
        </div>

        {/* Activity list */}
        <div className="p-3 space-y-1.5">
          {activities.map((a) => (
            <div key={a.id}
              className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 transition ${
                a.is_active ? "bg-emerald-50 ring-1 ring-emerald-200/60" : "bg-gray-50 ring-1 ring-gray-100"
              }`}>
              <span className={`text-[12px] font-semibold truncate max-w-[160px] ${
                a.is_active ? "text-emerald-900" : "text-gray-500"
              }`} title={a.name}>
                {a.name}
              </span>
              <span className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${
                a.is_active ? "bg-emerald-500 text-white" : "bg-gray-300 text-gray-600"
              }`}>
                {a.is_active ? "● Mở" : "○ Đóng"}
              </span>
            </div>
          ))}
          {activities.length === 0 && (
            <p className="py-4 text-center text-[12px] text-gray-400">Chưa có khu vực</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 border-t border-gray-100 p-3">
          <button onClick={() => setConfirmClose(true)} disabled={pending || allClosed}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-500 py-2.5
                       text-[12px] font-bold text-white transition hover:bg-red-600 active:scale-95
                       disabled:opacity-30 disabled:cursor-not-allowed">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            {pending ? "..." : "Đóng"}
          </button>
          <button onClick={() => doToggle("open")} disabled={pending || allOpen}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-2.5
                       text-[12px] font-bold text-white transition hover:bg-emerald-600 active:scale-95
                       disabled:opacity-30 disabled:cursor-not-allowed">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            {pending ? "..." : "Mở"}
          </button>
        </div>
      </div>
    </>
  );
}
