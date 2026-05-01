import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

import { getSessionFromRequest } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { category, action } = await req.json().catch(() => ({}));
  const isActive = action === "open";
  const validCategories = ["CAVE", "LAKE", "SIGHTSEEING", "ALL"];

  if (!validCategories.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  if (action !== "open" && action !== "close") {
    return NextResponse.json({ error: "action must be 'open' or 'close'" }, { status: 400 });
  }

  let query = supabaseAdmin.from("activities").update({ is_active: isActive });
  if (category !== "ALL") query = query.eq("category", category);

  const { data, error } = await query.select("id, name, is_active");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    success:  true,
    affected: data?.length ?? 0,
    action,
    category,
    message:  `${data?.length ?? 0} hoạt động đã được ${isActive ? "mở lại" : "đóng khẩn cấp"}`,
  });
}
