import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getSessionFromRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body   = await req.json().catch(() => ({}));

  const { error } = await supabaseAdmin
    .from("gallery_photos")
    .update({
      ...(body.label      !== undefined && { label:      body.label.trim()       }),
      ...(body.sublabel   !== undefined && { sublabel:   body.sublabel.trim()    }),
      ...(body.category   !== undefined && { category:   body.category           }),
      ...(body.sort_order !== undefined && { sort_order: Number(body.sort_order) }),
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Chỉ Super Admin mới có thể xóa" }, { status: 403 });

  const { id } = await params;

  const { data: photo } = await supabaseAdmin
    .from("gallery_photos")
    .select("src")
    .eq("id", id)
    .maybeSingle();

  if (photo?.src) {
    const url      = new URL(photo.src);
    const pathPart = url.pathname.split("/object/public/media/")[1];
    if (pathPart) await supabaseAdmin.storage.from("media").remove([pathPart]);
  }

  const { error } = await supabaseAdmin.from("gallery_photos").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
