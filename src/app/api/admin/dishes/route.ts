import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextRequest, NextResponse } from "next/server";

import { getSessionFromRequest } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabaseAdmin.from("dishes").select("*").order("sort_order").order("created_at");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dishes: data });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { name, description, price, tag, category, emoji, color, is_active, sort_order, image_url } = body;
  if (!name) return NextResponse.json({ error: "Thiếu tên món" }, { status: 400 });

  const { data, error } = await supabaseAdmin.from("dishes").insert({
    name,
    description: description ?? "",
    price:       price       ?? "",
    tag:         tag         ?? "",
    category:    category    ?? null,
    emoji:       emoji       ?? "🍜",
    color:       color       ?? "orange",
    is_active:   is_active   ?? true,
    sort_order:  Number(sort_order ?? 0),
    image_url:   image_url   ?? null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dish: data }, { status: 201 });
}
