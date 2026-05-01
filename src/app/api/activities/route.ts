import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");

  let query = supabaseAdmin
    .from("activities")
    .select("*")
    .eq("is_active", true)
    .order("category")
    .order("name");

  if (category) {
    query = query.eq("category", category.toUpperCase());
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
