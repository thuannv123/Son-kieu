import { Suspense }             from "react";
import { supabaseAdmin }        from "@/lib/supabase-admin";
import BookingFilters           from "@/components/admin/BookingFilters";
import BookingsTableClient, { OrderGroup } from "@/components/admin/BookingsTableClient";

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ q?: string; status?: string; date?: string; category?: string }>;
}

type RawBooking = {
  id: string;
  guest_name: string; guest_email: string; guest_phone: string;
  guest_count: number; booking_date: string; slot_time: string;
  total_price: number; status: string; created_at: string;
  qr_code_token: string | null; booking_ref: string | null;
  activities: { name: string; category: string } | null;
};


function groupByRef(bookings: RawBooking[]): OrderGroup[] {
  const map = new Map<string, RawBooking[]>();
  for (const b of bookings) {
    const key = b.booking_ref ?? b.id;
    const arr = map.get(key) ?? [];
    arr.push(b);
    map.set(key, arr);
  }
  return Array.from(map.values()).map(arr => {
    const first = arr[0];
    return {
      key:        first.booking_ref ?? first.id,
      bookingRef: first.booking_ref ?? null,
      ids:        arr.map(b => b.id),
      qrTokens:   arr.map(b => b.qr_code_token).filter(Boolean) as string[],
      guest: {
        name:  first.guest_name,
        phone: first.guest_phone,
        email: first.guest_email,
        count: first.guest_count,
      },
      activities: arr
        .map(b => (b.activities as { name: string } | null)?.name)
        .filter(Boolean) as string[],
      date:      first.booking_date,
      time:      first.slot_time,
      createdAt: first.created_at,
      total:  arr.reduce((s, b) => s + Number(b.total_price), 0),
      status: first.status,
    };
  });
}

export default async function BookingsPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const { data: bookings } = await supabaseAdmin
    .from("bookings")
    .select("id, guest_name, guest_email, guest_phone, guest_count, booking_date, slot_time, total_price, status, created_at, qr_code_token, booking_ref, activities(name, category)")
    .order("created_at", { ascending: false })
    .limit(500);

  const filtered = ((bookings ?? []) as RawBooking[]).filter((b) => {
    const act  = b.activities as { name: string; category: string } | null;
    const matchQ   = !sp.q || [b.guest_name, b.guest_phone, b.guest_email]
                       .some(f => f?.toLowerCase().includes(sp.q!.toLowerCase()));
    const matchSt  = !sp.status   || b.status     === sp.status;
    const matchDt  = !sp.date     || b.booking_date === sp.date;
    const matchCat = !sp.category || act?.category === sp.category;
    return matchQ && matchSt && matchDt && matchCat;
  });

  const groups = groupByRef(filtered);

  const totalRevenue = groups
    .filter(g => ["PAID", "CHECKED_IN"].includes(g.status))
    .reduce((s, g) => s + g.total, 0);

  return (
    <div className="space-y-5 max-w-[1400px]">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-black text-gray-900">Đặt chỗ</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">{groups.length} đơn · Doanh thu xác nhận: <span className="font-bold text-emerald-700">{new Intl.NumberFormat("vi-VN").format(totalRevenue)}đ</span></p>
        </div>
      </div>

      <Suspense>
        <BookingFilters />
      </Suspense>

      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
        <BookingsTableClient groups={groups as OrderGroup[]} />
      </div>
    </div>
  );
}
