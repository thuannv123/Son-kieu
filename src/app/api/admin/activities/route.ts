import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/admin-auth";


export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, category, description, content, slug, safety_guideline, highlights, price, duration_minutes, max_capacity, max_per_slot, difficulty_level, is_active, image_url } = body;

  if (!name || !category || price == null)
    return NextResponse.json({ error: "Thiếu trường bắt buộc" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("activities")
    .insert({
      name,
      category,
      description:      description ?? "",
      content:          content ?? null,
      slug:             slug || null,
      safety_guideline: safety_guideline ?? null,
      highlights:       highlights ?? [],
      image_url:        image_url ?? null,
      price:            Number(price),
      duration_minutes: Number(duration_minutes ?? 60),
      max_capacity:     Number(max_capacity ?? 50),
      max_per_slot:     Number(max_per_slot ?? 10),
      difficulty_level: difficulty_level || null,
      is_active:        is_active ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ activity: data }, { status: 201 });
}
