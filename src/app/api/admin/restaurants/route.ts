import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextRequest, NextResponse } from "next/server";

import { getSessionFromRequest } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabaseAdmin.from("restaurants").select("*").order("sort_order").order("created_at");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ restaurants: data });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { name, type, address, hours, tag, is_active, sort_order } = body;
  if (!name) return NextResponse.json({ error: "Thiếu tên nhà hàng" }, { status: 400 });

  const { data, error } = await supabaseAdmin.from("restaurants").insert({
    name,
    type:      type      ?? "",
    address:   address   ?? "",
    hours:     hours     ?? "",
    tag:       tag       ?? "",
    is_active: is_active ?? true,
    sort_order: Number(sort_order ?? 0),
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ restaurant: data }, { status: 201 });
}
