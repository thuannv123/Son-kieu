import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { hashPassword } from "@/lib/password";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "SUPER_ADMIN" && session.role !== "MANAGER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("staff_accounts")
    .select("id, name, email, phone, role, is_active, note, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Chỉ Super Admin mới có thể tạo tài khoản" }, { status: 403 });
  }

  const { name, email, phone, role, password, note } = await req.json().catch(() => ({}));
  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
  }

  const password_hash = await hashPassword(password as string);
  const { data, error } = await supabaseAdmin
    .from("staff_accounts")
    .insert({ name, email: (email as string).toLowerCase().trim(), phone, role, password_hash, note })
    .select("id, name, email, phone, role, is_active, created_at")
    .single();

  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Email này đã được sử dụng" }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
