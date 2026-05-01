import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getSessionFromRequest } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";


export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const key = req.nextUrl.searchParams.get("key");

  if (key) {
    const { data } = await supabaseAdmin
      .from("site_settings").select("value").eq("key", key).maybeSingle();
    return NextResponse.json({ value: data?.value ?? null });
  }

  const { data } = await supabaseAdmin.from("site_settings").select("key,value");
  return NextResponse.json({ settings: data ?? [] });
}

export async function PUT(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { key, value } = await req.json();
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
