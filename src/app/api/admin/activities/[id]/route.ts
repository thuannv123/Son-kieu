import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/admin-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { data, error } = await supabaseAdmin.from("activities").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ activity: data });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body   = await req.json();

  const numericFields = ["price","duration_minutes","max_capacity","max_per_slot"];
  const allowed = [
    "name","category","description","content","slug",
    "price","duration_minutes","max_capacity","max_per_slot",
    "difficulty_level","is_active","highlights","safety_guideline","image_url","cover_gradient",
  ] as const;

  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      update[key] = numericFields.includes(key) ? Number(body[key]) : body[key];
    }
  }

  const { data, error } = await supabaseAdmin.from("activities").update(update).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ activity: data });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Chỉ Super Admin mới có thể xóa" }, { status: 403 });

  const { id } = await params;
  const { error } = await supabaseAdmin.from("activities").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
