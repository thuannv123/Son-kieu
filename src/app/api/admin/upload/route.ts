import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextRequest, NextResponse } from "next/server";

import { getSessionFromRequest } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file     = formData.get("file") as File | null;
  const folder   = (formData.get("folder") as string | null) ?? "misc";

  if (!file) return NextResponse.json({ error: "Không có file" }, { status: 400 });

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type))
    return NextResponse.json({ error: "Chỉ hỗ trợ JPG, PNG, WebP, GIF" }, { status: 400 });

  if (file.size > 5 * 1024 * 1024)
    return NextResponse.json({ error: "Ảnh tối đa 5MB" }, { status: 400 });

  const ext      = file.name.split(".").pop() ?? "jpg";
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer   = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from("media")
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = supabaseAdmin.storage.from("media").getPublicUrl(filename);

  return NextResponse.json({ url: publicUrl });
}
