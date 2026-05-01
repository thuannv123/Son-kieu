import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { hashPassword } from "@/lib/password";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body   = await req.json().catch(() => ({})) as Record<string, unknown>;
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (body.name      !== undefined) updates.name      = body.name;
  if (body.email     !== undefined) updates.email     = (body.email as string).toLowerCase().trim();
  if (body.phone     !== undefined) updates.phone     = body.phone;
  if (body.role      !== undefined) updates.role      = body.role;
  if (body.is_active !== undefined) updates.is_active = body.is_active;
  if (body.note      !== undefined) updates.note      = body.note;
  if (body.password)                updates.password_hash = await hashPassword(body.password as string);

  const { data, error } = await supabaseAdmin
    .from("staff_accounts")
    .update(updates)
    .eq("id", id)
    .select("id, name, email, phone, role, is_active, note")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  if (!session.isLegacy && session.staffId === id) {
    return NextResponse.json({ error: "Không thể xóa tài khoản đang đăng nhập" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("staff_accounts")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
