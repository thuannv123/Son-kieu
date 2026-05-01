import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sonkieu.vn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE,                    lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${SITE}/activities`,    lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE}/booking`,       lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE}/dining`,        lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE}/gallery`,       lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE}/blog`,          lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${SITE}/about`,         lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/contact`,       lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/pricing`,       lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE}/events`,        lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE}/faq`,           lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/directions`,    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/privacy`,       lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${SITE}/terms`,         lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  const [{ data: activities }, { data: posts }] = await Promise.all([
    supabaseAdmin
      .from("activities")
      .select("slug, updated_at")
      .eq("is_active", true)
      .not("slug", "is", null),
    supabaseAdmin
      .from("posts")
      .select("slug, published_at, updated_at")
      .eq("is_published", true),
  ]);

  const activityRoutes: MetadataRoute.Sitemap = (activities ?? []).map(a => ({
    url:             `${SITE}/activities/${a.slug}`,
    lastModified:    a.updated_at ? new Date(a.updated_at) : now,
    changeFrequency: "weekly",
    priority:        0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map(p => ({
    url:             `${SITE}/blog/${p.slug}`,
    lastModified:    p.updated_at ? new Date(p.updated_at) : new Date(p.published_at),
    changeFrequency: "weekly",
    priority:        0.7,
  }));

  return [...staticRoutes, ...activityRoutes, ...blogRoutes];
}
