import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface BookingItem { activity: string; date: string; time: string; price: number; token: string; }
interface DishItem    { dishName: string; qty: number; price: string; }

interface NotifyBody {
  guestName:  string;
  guestEmail: string;
  guestPhone: string;
  guests:     number;
  bookings:   BookingItem[];
  dishes:     DishItem[];
  total:      number;
  bookingRef?: string;
}

export async function POST(req: NextRequest) {
  const body: NotifyBody = await req.json();

  await Promise.allSettled([
    sendEmail(body),
    sendZalo(body),
  ]);

  return NextResponse.json({ ok: true });
}

/* ── Email via Resend ────────────────────────────────────────────── */
async function sendEmail(d: NotifyBody) {
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from:    process.env.EMAIL_FROM ?? "Sơn Kiều <onboarding@resend.dev>",
    to:      [d.guestEmail],
    subject: `✅ Xác nhận đặt vé – Khu Du Lịch Sinh Thái Sơn Kiều`,
    html:    buildHtml(d),
  });
}

/* ── Zalo ZNS ────────────────────────────────────────────────────── */
async function sendZalo(d: NotifyBody) {
  const token      = process.env.ZALO_OA_ACCESS_TOKEN;
  const templateId = process.env.ZALO_ZNS_TEMPLATE_ID;
  if (!token || !templateId) return;

  const phone = d.guestPhone.startsWith("0") ? "84" + d.guestPhone.slice(1) : d.guestPhone;

  await fetch("https://business.openapi.zalo.me/message/template", {
    method:  "POST",
    headers: { "Content-Type": "application/json", "access_token": token },
    body: JSON.stringify({
      phone,
      template_id: templateId,
      template_data: {
        customer_name:  d.guestName,
        activity_names: d.bookings.map(b => b.activity).join(", ") || "Đơn ăn uống",
        visit_date:     d.bookings[0]?.date ?? "—",
        visit_time:     d.bookings[0]?.time ?? "—",
        total_amount:   new Intl.NumberFormat("vi-VN").format(d.total) + "đ",
      },
      tracking_id: `amf-${Date.now()}`,
    }),
  });
}

/* ── Email HTML ──────────────────────────────────────────────────── */
function fmt(n: number) { return new Intl.NumberFormat("vi-VN").format(n); }

function buildHtml(d: NotifyBody): string {
  const activitiesRows = d.bookings.map(b => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0fdf4;">
        <strong style="color:#166534;font-size:14px;">${b.activity}</strong><br>
        <small style="color:#6b7280;">${b.date} · ${b.time}</small>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #f0fdf4;text-align:right;font-weight:700;color:#16a34a;font-size:14px;">
        ${fmt(b.price)}đ
      </td>
    </tr>`).join("");

  const dishesBlock = d.dishes.length > 0 ? `
    <div style="margin:0 32px 16px;padding:14px 16px;background:#fff7ed;border-radius:12px;border:1px solid #fed7aa;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;color:#ea580c;letter-spacing:.08em;">🍽️ Đơn ăn uống</p>
      ${d.dishes.map(dish => `
        <div style="display:flex;justify-content:space-between;padding:3px 0;font-size:13px;">
          <span style="color:#374151;">${dish.dishName}</span>
          <span style="color:#6b7280;">x${dish.qty} · ${dish.price}</span>
        </div>`).join("")}
      <p style="margin:8px 0 0;font-size:11px;color:#ea580c;font-style:italic;">* Xác nhận khi check-in</p>
    </div>` : "";

  return `<!DOCTYPE html><html><body style="font-family:-apple-system,Arial,sans-serif;background:#f3f4f6;margin:0;padding:24px;">
  <div style="max-width:560px;margin:0 auto;">
    <div style="background:linear-gradient(135deg,#14532d,#166534);border-radius:20px 20px 0 0;padding:40px 32px;text-align:center;">
      <div style="font-size:52px;margin-bottom:8px;">🌿</div>
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:900;letter-spacing:-.5px;">SƠN KIỀU</h1>
      <div style="margin-top:16px;background:rgba(255,255,255,.15);display:inline-block;border-radius:50px;padding:8px 24px;">
        <span style="color:#86efac;font-size:13px;font-weight:700;">✓ Đặt vé thành công</span>
      </div>
    </div>

    <div style="background:#fff;padding:28px 32px 16px;">
      <h2 style="margin:0;font-size:20px;color:#111827;">Xin chào, <span style="color:#16a34a;">${d.guestName}</span>!</h2>
      <p style="color:#6b7280;margin:8px 0 20px;font-size:14px;line-height:1.6;">
        Cảm ơn bạn đã đặt vé tại Khu Du Lịch Sinh Thái Sơn Kiều. Dưới đây là thông tin chi tiết chuyến tham quan.
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
        <div style="background:#f0fdf4;border-radius:10px;padding:12px 14px;">
          <p style="margin:0;font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;">Khách hàng</p>
          <p style="margin:4px 0 0;font-size:13px;font-weight:700;color:#111827;">${d.guestName}</p>
        </div>
        <div style="background:#f0fdf4;border-radius:10px;padding:12px 14px;">
          <p style="margin:0;font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;">Số khách</p>
          <p style="margin:4px 0 0;font-size:13px;font-weight:700;color:#111827;">${d.guests} người</p>
        </div>
      </div>

      ${(d.bookingRef || d.bookings.some(b => b.token)) ? `
      <div style="background:#f8fafc;border:1.5px dashed #cbd5e1;border-radius:12px;padding:14px 16px;margin-bottom:20px;">
        <p style="margin:0 0 10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#64748b;">Mã tra cứu vé</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          ${d.bookingRef ? `
          <div>
            <p style="margin:0;font-size:10px;color:#94a3b8;">Mã thanh toán</p>
            <p style="margin:3px 0 0;font-family:monospace;font-size:15px;font-weight:900;letter-spacing:.08em;color:#166534;">${d.bookingRef}</p>
          </div>` : ""}
          ${d.bookings[0]?.token ? `
          <div>
            <p style="margin:0;font-size:10px;color:#94a3b8;">Mã vé check-in</p>
            <p style="margin:3px 0 0;font-family:monospace;font-size:15px;font-weight:900;letter-spacing:.08em;color:#1e40af;">${d.bookings[0].token.slice(0,8).toUpperCase()}</p>
            <p style="margin:2px 0 0;font-family:monospace;font-size:9px;color:#cbd5e1;">${d.bookings[0].token}</p>
          </div>` : ""}
        </div>
        <p style="margin:10px 0 0;font-size:11px;color:#94a3b8;">Dùng mã này để tra cứu vé tại cổng check-in hoặc khi cần hỗ trợ.</p>
      </div>` : ""}
      ${d.bookings.length > 0 ? `
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <th style="text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;padding-bottom:8px;">Hoạt động</th>
          <th style="text-align:right;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;padding-bottom:8px;">Giá</th>
        </tr>
        ${activitiesRows}
      </table>` : ""}
    </div>

    ${dishesBlock}

    <div style="background:#166534;padding:20px 32px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <p style="margin:0;color:#86efac;font-size:11px;text-transform:uppercase;letter-spacing:.06em;">Tổng thanh toán</p>
        <p style="margin:2px 0 0;color:#a7f3d0;font-size:12px;">${d.guests} khách · ${d.bookings.length} hoạt động</p>
      </div>
      <p style="margin:0;color:#fff;font-size:26px;font-weight:900;">${fmt(d.total)}<span style="font-size:14px;font-weight:400;">đ</span></p>
    </div>

    <div style="background:#fff;padding:20px 32px;border-radius:0 0 20px 20px;">
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px;margin-bottom:16px;">
        <p style="margin:0;color:#92400e;font-size:13px;line-height:1.7;">
          📍 Có mặt trước giờ tham quan <strong>15 phút</strong> để hoàn tất check-in tại cổng.<br>
          📱 Xuất trình mã QR trên trang đặt vé khi đến nơi.
        </p>
      </div>
      <p style="margin:0;color:#9ca3af;font-size:11px;text-align:center;">
        © Khu Du Lịch Sinh Thái Sơn Kiều · Trường Sơn, Quảng Ninh, tỉnh Quảng Trị · 0857 086 588
      </p>
    </div>
  </div>
</body></html>`;
}
