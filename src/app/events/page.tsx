import { supabaseAdmin } from "@/lib/supabase-admin";
import EventsClient from "./EventsClient";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sự Kiện Tại Sơn Kiều | Hoạt Động Du Lịch Quảng Trị",
  description:
    "Cập nhật sự kiện, chương trình trải nghiệm và hoạt động đặc biệt tại Khu Du Lịch Sinh Thái Sơn Kiều, Trường Sơn, Quảng Trị.",
  keywords: ["sự kiện Sơn Kiều", "hoạt động du lịch Quảng Trị", "lễ hội Quảng Trị", "Khu Du Lịch Sơn Kiều"],
  alternates: { canonical: "/events" },
};

export default async function EventsPage() {
  const { data } = await supabaseAdmin
    .from("posts")
    .select("id,title,slug,excerpt,cover_image,event_date")
    .eq("category", "event")
    .eq("is_published", true)
    .order("event_date", { ascending: true, nullsFirst: false });

  const now = new Date();
  const events = (data ?? []).map(p => ({
    id:         p.id as string,
    title:      p.title as string,
    slug:       p.slug as string,
    excerpt:    (p.excerpt ?? "") as string,
    coverImage: (p.cover_image ?? null) as string | null,
    eventDate:  (p.event_date ?? null) as string | null,
    status:     (p.event_date && new Date(p.event_date) <= now
                  ? "past"
                  : "upcoming") as "upcoming" | "past",
  }));

  return <EventsClient events={events} />;
}
