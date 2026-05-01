import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export const revalidate = 60;

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sonkieu.vn";

const CAT_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  news:  { label: "Tin tức",  color: "text-blue-700",   bg: "bg-blue-50",   icon: "📰" },
  guide: { label: "Cẩm nang", color: "text-violet-700", bg: "bg-violet-50", icon: "🗺️" },
  food:  { label: "Ẩm thực",  color: "text-orange-700", bg: "bg-orange-50", icon: "🍖" },
  event: { label: "Sự kiện",  color: "text-rose-700",   bg: "bg-rose-50",   icon: "🎉" },
};

const CAT_GRADIENT: Record<string, string> = {
  news:  "from-blue-700 to-blue-950",
  guide: "from-violet-700 to-violet-950",
  food:  "from-orange-700 to-orange-950",
  event: "from-rose-700 to-rose-950",
};

function bold(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => i % 2 === 1 ? <strong key={i}>{p}</strong> : p);
}

function renderContent(content: string) {
  return content
    .split(/\n\n+/)
    .map((block, i) => {
      if (block.startsWith("# "))
        return <h2 key={i} className="mt-10 mb-4 text-2xl font-black text-gray-900 leading-tight">{block.slice(2)}</h2>;
      if (block.startsWith("## "))
        return <h3 key={i} className="mt-8 mb-3 text-xl font-bold text-gray-900">{block.slice(3)}</h3>;
      if (block.startsWith("### "))
        return <h4 key={i} className="mt-6 mb-2 text-lg font-bold text-gray-800">{block.slice(4)}</h4>;
      if (block.startsWith("- ") || block.startsWith("* ")) {
        const items = block.split("\n").filter(l => l.startsWith("- ") || l.startsWith("* "));
        return (
          <ul key={i} className="my-4 space-y-2 pl-1">
            {items.map((item, j) => (
              <li key={j} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-gray-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {bold(item.slice(2))}
              </li>
            ))}
          </ul>
        );
      }
      if (block.startsWith("|")) {
        const rows = block.split("\n").filter(l => l.startsWith("|"));
        const header = rows[0]?.split("|").filter(Boolean).map(c => c.trim());
        const body   = rows.slice(2);
        return (
          <div key={i} className="my-6 overflow-x-auto rounded-2xl ring-1 ring-gray-200">
            <table className="w-full text-[14px]">
              <thead className="bg-gray-50">
                <tr>
                  {header?.map((h, j) => (
                    <th key={j} className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wide text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, j) => {
                  const cells = row.split("|").filter(Boolean).map(c => c.trim());
                  return (
                    <tr key={j} className={j % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                      {cells.map((cell, k) => (
                        <td key={k} className="px-4 py-3 text-gray-700">{bold(cell)}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
      return <p key={i} className="my-4 text-[15px] leading-[1.85] text-gray-700">{bold(block)}</p>;
    });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await supabaseAdmin
    .from("posts")
    .select("title,excerpt,author,published_at,cover_image,seo_keywords")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!post) return {};

  const description = post.excerpt?.slice(0, 155) ?? post.title;
  const url         = `${SITE}/blog/${slug}`;
  const image       = post.cover_image ? [{ url: post.cover_image }] : [{ url: "/og.jpg" }];

  return {
    title:       post.title,
    description,
    keywords:    post.seo_keywords || undefined,
    alternates:  { canonical: url },
    openGraph: {
      type: "article", title: post.title, description, url, images: image,
      publishedTime: post.published_at,
      authors:       post.author ? [post.author] : undefined,
      siteName:      "Khu Du Lịch Sinh Thái Sơn Kiều",
    },
    twitter: { card: "summary_large_image", title: post.title, description, images: image.map(i => i.url) },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: post } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  const { data: related } = await supabaseAdmin
    .from("posts")
    .select("id,title,slug,excerpt,category,author,published_at,cover_image")
    .eq("is_published", true)
    .eq("category", post.category)
    .neq("id", post.id)
    .limit(3);

  const pageUrl = `${SITE}/blog/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    "headline": post.title, "description": post.excerpt ?? "", "url": pageUrl,
    "datePublished": post.published_at, "dateModified": post.updated_at ?? post.published_at,
    "author": { "@type": "Person", "name": post.author },
    "publisher": { "@type": "Organization", "name": "Khu Du Lịch Sinh Thái Sơn Kiều", "url": SITE },
    "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl },
    ...(post.cover_image  ? { "image":    post.cover_image  } : {}),
    ...(post.seo_keywords ? { "keywords": post.seo_keywords } : {}),
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Cover ── */}
      <div className={`relative w-full overflow-hidden pt-16 ${
        post.cover_image ? "h-[60vh] min-h-[340px]" : "h-48"
      } bg-gradient-to-br ${CAT_GRADIENT[post.category] ?? "from-emerald-900 to-emerald-950"}`}>
        {post.cover_image && (
          <Image src={post.cover_image} alt={post.title} fill
            className="object-cover" sizes="100vw" priority
            unoptimized={post.cover_image.startsWith("http")} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        {/* Back + breadcrumb */}
        <div className="absolute left-0 right-0 top-20 px-4">
          <div className="mx-auto max-w-3xl">
            <Link href="/blog"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5
                         text-[12px] font-semibold text-white backdrop-blur-sm
                         transition hover:bg-white/25">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Blog
            </Link>
          </div>
        </div>

        {/* Title overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-3 flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold
                ${CAT_META[post.category]?.bg ?? "bg-white/20"}
                ${CAT_META[post.category]?.color ?? "text-white"}`}>
                {CAT_META[post.category]?.icon} {CAT_META[post.category]?.label ?? post.category}
              </span>
              {post.published_at && (
                <span className="text-[11px] text-white/60">
                  {new Date(post.published_at).toLocaleDateString("vi-VN", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black leading-tight text-white drop-shadow sm:text-3xl">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* ── Author strip ── */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full
                              bg-gradient-to-br from-emerald-400 to-teal-500
                              text-[14px] font-black text-white shadow-sm">
                {post.author?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-[13px] font-bold text-gray-900">{post.author}</p>
                <p className="text-[11px] text-gray-400">Tác giả · Sơn Kiều</p>
              </div>
            </div>
            {post.excerpt && (
              <p className="hidden max-w-sm text-[13px] leading-relaxed text-gray-500 line-clamp-2 sm:block">
                {post.excerpt}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-3xl px-4 py-10">
        <article className="rounded-3xl bg-white px-7 py-8 shadow-[0_2px_20px_rgba(0,0,0,0.06)]
                            ring-1 ring-black/[0.04] sm:px-10 sm:py-10">
          {post.content
            ? renderContent(post.content)
            : <p className="text-[15px] text-gray-400">Bài viết chưa có nội dung.</p>
          }
        </article>

        {/* ── Related posts ── */}
        {(related?.length ?? 0) > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-[18px] font-black text-gray-900">Bài Viết Liên Quan</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related!.map(r => (
                <Link key={r.id} href={`/blog/${r.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white
                             shadow-[0_1px_10px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]
                             transition-all hover:-translate-y-0.5
                             hover:shadow-[0_8px_28px_rgba(0,0,0,0.10)]
                             hover:ring-emerald-200">
                  <div className={`relative h-32 overflow-hidden bg-gradient-to-br
                    ${CAT_GRADIENT[r.category] ?? "from-emerald-700 to-emerald-950"}`}>
                    {r.cover_image && (
                      <Image src={r.cover_image} alt={r.title} fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="33vw" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <span className={`w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold
                      ${CAT_META[r.category]?.bg ?? "bg-gray-100"}
                      ${CAT_META[r.category]?.color ?? "text-gray-600"}`}>
                      {CAT_META[r.category]?.icon} {CAT_META[r.category]?.label ?? r.category}
                    </span>
                    <h3 className="mt-2 text-[13px] font-bold leading-snug text-gray-900 line-clamp-2
                                   transition-colors group-hover:text-emerald-700">
                      {r.title}
                    </h3>
                    <p className="mt-2 text-[11px] text-gray-400">{r.author}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="mt-10 flex justify-center">
          <Link href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white
                       px-6 py-3 text-[13px] font-semibold text-gray-700 shadow-sm
                       transition hover:border-emerald-300 hover:text-emerald-700
                       hover:shadow-[0_4px_14px_rgba(16,185,129,0.12)]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Xem tất cả bài viết
          </Link>
        </div>
      </div>
    </main>
  );
}
