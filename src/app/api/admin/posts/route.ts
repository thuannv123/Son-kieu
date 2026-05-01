import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/admin-auth";


function toSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim().replace(/\s+/g, "-");
}

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("id,title,slug,excerpt,category,author,is_published,published_at,created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ posts: data });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, excerpt, content, category, author, cover_image, is_published, seo_keywords, event_date } = body;

  if (!title) return NextResponse.json({ error: "Tiêu đề không được để trống" }, { status: 400 });

  const slug = body.slug?.trim() || toSlug(title);

  const { data, error } = await supabaseAdmin
    .from("posts")
    .insert({
      title,
      slug,
      excerpt:      excerpt      ?? "",
      content:      content      ?? "",
      category:     category     ?? "news",
      author:       author       ?? "Sơn Kiều",
      cover_image:  cover_image  ?? null,
      seo_keywords: seo_keywords ?? "",
      is_published: is_published ?? false,
      published_at: is_published ? new Date().toISOString() : null,
      event_date:   event_date   ? new Date(event_date).toISOString() : null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ post: data }, { status: 201 });
}
