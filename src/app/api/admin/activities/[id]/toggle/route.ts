import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

import { getSessionFromRequest } from "@/lib/admin-auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { isActive } = await req.json().catch(() => ({ isActive: null }));

  if (typeof isActive !== "boolean") {
    return NextResponse.json({ error: "isActive (boolean) is required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("activities")
    .update({ is_active: isActive })
    .eq("id", id)
    .select("id, name, is_active")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Activity not found" }, { status: 404 });
  }

  return NextResponse.json({
    success:  true,
    activity: data,
    message:  `${data.name} is now ${isActive ? "active" : "inactive"}`,
  });
}
