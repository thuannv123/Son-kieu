import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyPassword } from "@/lib/password";
import { buildSessionToken, AdminRole } from "@/lib/admin-auth";

const COOKIE_OPTS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path:     "/",
  maxAge:   60 * 60 * 8,
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { email?: string; password?: string };
  const { email = "", password = "" } = body;
  const secret = process.env.ADMIN_SECRET_KEY;

  // Legacy: shared-secret login (no email)
  if (!email && password && secret && password === secret) {
    const res = NextResponse.json({ ok: true, role: "SUPER_ADMIN", name: "Super Admin" });
    res.cookies.set("admin_session", secret, COOKIE_OPTS);
    return res;
  }

  if (!email || !password) {
    return NextResponse.json({ error: "Vui lòng nhập email và mật khẩu" }, { status: 400 });
  }

  const { data: staff, error: dbErr } = await supabaseAdmin
    .from("staff_accounts")
    .select("id, password_hash, role, is_active, name")
    .eq("email", email.toLowerCase().trim())
    .single();

  if (dbErr) {
    console.error("[auth] db error:", dbErr.message, dbErr.code);
    if (dbErr.code === "42P01") {
      return NextResponse.json({ error: "Bảng staff_accounts chưa được tạo. Chạy migration 025 trong Supabase." }, { status: 500 });
    }
  }

  if (!staff) {
    return NextResponse.json({ error: "Không tìm thấy tài khoản với email này" }, { status: 401 });
  }
  if (!staff.is_active) {
    return NextResponse.json({ error: "Tài khoản đã bị tạm khóa" }, { status: 401 });
  }

  const valid = await verifyPassword(password, staff.password_hash as string);
  if (!valid) {
    return NextResponse.json({ error: "Mật khẩu không đúng" }, { status: 401 });
  }

  const token = await buildSessionToken(staff.id as string, staff.role as AdminRole);
  const res   = NextResponse.json({ ok: true, role: staff.role, name: staff.name });
  res.cookies.set("admin_session", token, COOKIE_OPTS);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("admin_session");
  return res;
}
