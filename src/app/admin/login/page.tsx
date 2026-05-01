import { Suspense }  from "react";
import { cookies }   from "next/headers";
import { redirect }  from "next/navigation";
import LoginForm     from "@/components/admin/LoginForm";

export const metadata = { title: "Admin Login | Sơn Kiều" };

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value === process.env.ADMIN_SECRET_KEY) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d1117] px-4">

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-teal-500/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-emerald-500/3 blur-3xl" />
      </div>

      <div className="relative w-full max-w-[380px]">

        {/* Logo area */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 shadow-xl shadow-emerald-900/50">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M17 3C17 3 10 5 7 12C5 17 8 21 12 21C16 21 19 17 19 13C19 9 16 7 13 8C11 8.5 10 10 11 12C12 14 15 13 15 11"
                stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7 12C5 8 6 4 8 3" stroke="#a7f3d0" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-[24px] font-black text-white tracking-tight">Sơn Kiều Admin</h1>
          <p className="mt-1.5 text-[13px] text-gray-500">Khu vực quản trị nội bộ</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white/[0.06] p-7 ring-1 ring-white/10 backdrop-blur-sm">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-5 text-center text-[11px] text-gray-600">
          Mật khẩu tại{" "}
          <code className="rounded-md bg-white/10 px-1.5 py-0.5 text-gray-400">ADMIN_SECRET_KEY</code>
          {" "}trong{" "}
          <code className="rounded-md bg-white/10 px-1.5 py-0.5 text-gray-400">.env.local</code>
        </p>
      </div>
    </main>
  );
}
