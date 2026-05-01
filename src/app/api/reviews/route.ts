import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

/* GET /api/reviews?activityId=xxx — approved reviews only */
export async function GET(req: NextRequest) {
  const activityId = req.nextUrl.searchParams.get("activityId");
  if (!activityId) {
    return NextResponse.json({ error: "activityId required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("id, guest_name, rating, comment, created_at")
    .eq("activity_id", activityId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ reviews: [] });
  return NextResponse.json({ reviews: data ?? [] });
}

/* POST /api/reviews — submit new review (pending approval) */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { activityId, guestName, guestEmail, rating, comment } = body;

  if (!activityId || !guestName?.trim() || !comment?.trim() || !rating) {
    return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Đánh giá từ 1–5 sao" }, { status: 400 });
  }
  if (comment.trim().length < 10) {
    return NextResponse.json({ error: "Nhận xét phải có ít nhất 10 ký tự" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("reviews").insert({
    activity_id: activityId,
    guest_name:  guestName.trim(),
    guest_email: guestEmail?.trim() || null,
    rating:      Number(rating),
    comment:     comment.trim(),
    is_approved: false,
  });

  if (error) return NextResponse.json({ error: "Không thể gửi đánh giá" }, { status: 500 });

  return NextResponse.json({ success: true, message: "Đánh giá của bạn đã được gửi và đang chờ duyệt. Cảm ơn!" });
}
