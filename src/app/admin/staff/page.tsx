"use client";

import { useState, useEffect, useTransition } from "react";

type Role = "SUPER_ADMIN" | "MANAGER";

interface Staff {
  id:         string;
  name:       string;
  email:      string;
  phone:      string | null;
  role:       Role;
  is_active:  boolean;
  note:       string | null;
  created_at: string;
}

const ROLE_CFG: Record<Role, { label: string; color: string; icon: string; desc: string }> = {
  SUPER_ADMIN: { label: "Super Admin", icon: "👑", color: "bg-purple-100 text-purple-700 ring-purple-200", desc: "Toàn quyền hệ thống — báo cáo, nhân sự, cài đặt, xử lý khẩn cấp." },
  MANAGER:     { label: "Quản lý",     icon: "💼", color: "bg-blue-100 text-blue-700 ring-blue-200",       desc: "Xem toàn bộ hệ thống, check-in khách. Không thể hủy đơn hoặc quản lý nhân sự." },
};

const AVATAR_COLORS = [
  "from-emerald-400 to-teal-500",
  "from-blue-400 to-indigo-500",
  "from-amber-400 to-orange-500",
  "from-violet-400 to-purple-500",
  "from-rose-400 to-pink-500",
];

function initials(name: string) {
  return name.split(" ").slice(-2).map(w => w[0]).join("").toUpperCase();
}

const EMPTY_FORM = { name: "", email: "", phone: "", role: "RECEPTIONIST" as Role, password: "", note: "" };

export default function StaffPage() {
  const [staff,    setStaff]    = useState<Staff[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [myRole,   setMyRole]   = useState<Role | null>(null);
  const [modal,    setModal]    = useState<"create" | "edit" | null>(null);
  const [editing,  setEditing]  = useState<Staff | null>(null);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [formErr,  setFormErr]  = useState("");
  const [pending,  start]       = useTransition();
  const [filter,   setFilter]   = useState<Role | "ALL">("ALL");

  useEffect(() => {
    fetch("/api/admin/me").then(r => r.json()).then(d => setMyRole(d.role ?? null));
  }, []);

  function load() {
    setLoading(true);
    fetch("/api/admin/staff")
      .then(r => r.json())
      .then(d => setStaff(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormErr("");
    setModal("create");
  }

  function openEdit(s: Staff) {
    setEditing(s);
    setForm({ name: s.name, email: s.email, phone: s.phone ?? "", role: s.role, password: "", note: s.note ?? "" });
    setFormErr("");
    setModal("edit");
  }

  function closeModal() { setModal(null); setFormErr(""); }

  function submit() {
    start(async () => {
      setFormErr("");
      if (!form.name.trim() || !form.email.trim()) { setFormErr("Tên và email là bắt buộc"); return; }
      if (modal === "create" && !form.password) { setFormErr("Mật khẩu là bắt buộc khi tạo mới"); return; }

      const url    = modal === "create" ? "/api/admin/staff" : `/api/admin/staff/${editing!.id}`;
      const method = modal === "create" ? "POST" : "PATCH";
      const body: Record<string, unknown> = { name: form.name, email: form.email, phone: form.phone || null, role: form.role, note: form.note || null };
      if (form.password) body.password = form.password;

      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) { closeModal(); load(); }
      else { const d = await res.json(); setFormErr(d.error ?? "Thao tác thất bại"); }
    });
  }

  function toggleActive(s: Staff) {
    start(async () => {
      await fetch(`/api/admin/staff/${s.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !s.is_active }),
      });
      load();
    });
  }

  const isSuperAdmin = myRole === "SUPER_ADMIN";
  const displayed    = filter === "ALL" ? staff : staff.filter(s => s.role === filter);

  return (
    <div className="space-y-6 max-w-[1000px]">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-black text-gray-900">Nhân sự</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">Quản lý tài khoản và phân quyền truy cập hệ thống</p>
        </div>
        {isSuperAdmin && (
          <button onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-[13px] font-bold text-white
                       shadow-sm shadow-emerald-200 transition hover:bg-emerald-700">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Thêm nhân viên
          </button>
        )}
      </div>

      {/* Role matrix */}
      <div className="rounded-2xl bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
        <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">Ma trận phân quyền</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.entries(ROLE_CFG) as [Role, typeof ROLE_CFG[Role]][]).map(([key, cfg]) => (
            <div key={key} className="rounded-xl bg-gray-50 p-3.5 ring-1 ring-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{cfg.icon}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${cfg.color}`}>{cfg.label}</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">{cfg.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Staff table */}
      <div className="rounded-2xl bg-white shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04] overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-bold text-gray-900">Danh sách nhân viên</h2>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600">
              {staff.filter(s => s.is_active).length} đang hoạt động
            </span>
          </div>
          {/* Role filter */}
          <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
            {(["ALL", "SUPER_ADMIN", "MANAGER"] as const).map(r => (
              <button key={r} onClick={() => setFilter(r)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                  filter === r ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}>
                {r === "ALL" ? "Tất cả" : ROLE_CFG[r].label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-gray-200 border-t-emerald-600" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[13px] text-gray-400">Chưa có nhân viên nào.</p>
            {isSuperAdmin && <button onClick={openCreate} className="mt-3 text-[13px] font-semibold text-emerald-600 hover:underline">Thêm ngay →</button>}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {displayed.map((s, i) => {
              const cfg = ROLE_CFG[s.role];
              return (
                <div key={s.id} className={`flex items-center gap-4 px-5 py-3.5 transition hover:bg-gray-50/60 ${!s.is_active ? "opacity-50" : ""}`}>
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} text-[11px] font-black text-white`}>
                    {initials(s.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-900 truncate">{s.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{s.email}{s.phone ? ` · ${s.phone}` : ""}</p>
                  </div>
                  <span className={`hidden sm:inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ring-1 ${cfg.color}`}>
                    {cfg.icon} {cfg.label}
                  </span>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    s.is_active ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-gray-100 text-gray-500"
                  }`}>
                    {s.is_active ? "Hoạt động" : "Tạm dừng"}
                  </span>
                  {isSuperAdmin && (
                    <div className="flex shrink-0 items-center gap-1">
                      <button onClick={() => openEdit(s)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button onClick={() => toggleActive(s)} disabled={pending}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
                        {s.is_active
                          ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                          : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 8 16 12 12 16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                        }
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={closeModal} />
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/[0.08]">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <p className="text-[15px] font-black text-gray-900">
                  {modal === "create" ? "Thêm nhân viên mới" : "Chỉnh sửa nhân viên"}
                </p>
                {modal === "edit" && editing && (
                  <p className="text-[11px] text-gray-400 mt-0.5">{editing.email}</p>
                )}
              </div>
              <button onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">Họ tên *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Nguyễn Văn A"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-[13px] focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">Email *</label>
                  <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    type="email" placeholder="nhanvien@sonkieu.vn"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-[13px] focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">Điện thoại</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="0912 345 678"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-[13px] focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">Vai trò *</label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as Role }))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-[13px] focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                    {(Object.entries(ROLE_CFG) as [Role, typeof ROLE_CFG[Role]][]).map(([key, cfg]) => (
                      <option key={key} value={key}>{cfg.icon} {cfg.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Mật khẩu {modal === "create" ? "*" : "(để trống nếu không đổi)"}
                  </label>
                  <input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    type="password" placeholder={modal === "create" ? "Tối thiểu 8 ký tự" : "••••••••"}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-[13px] focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">Ghi chú</label>
                  <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                    placeholder="Ca sáng, bộ phận lễ tân..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-[13px] focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
              </div>

              {formErr && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-[12px] font-medium text-red-600 ring-1 ring-red-200">{formErr}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button onClick={closeModal}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-[13px] font-semibold text-gray-600 transition hover:bg-gray-50">
                  Hủy
                </button>
                <button onClick={submit} disabled={pending}
                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-[13px] font-bold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700 disabled:opacity-50">
                  {pending ? "Đang lưu..." : modal === "create" ? "Tạo tài khoản" : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
