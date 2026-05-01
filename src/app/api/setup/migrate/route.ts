import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

/* One-shot migration endpoint — protected by ADMIN_SECRET_KEY
   Call: GET /api/setup/migrate?key=<ADMIN_SECRET_KEY>
   Delete this file after running. */

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // DIRECT_URL is blocked on free tier — use session-mode pooler (port 5432)
  const poolerUrl = process.env.DATABASE_URL
    ?.replace(":6543/", ":5432/")
    .replace("?pgbouncer=true", "");

  const client = new Client({
    connectionString: poolerUrl,
    ssl: { rejectUnauthorized: false },
  });

  const log: string[] = [];

  try {
    await client.connect();
    log.push("✓ Connected to database");

    /* ── Migration 004: add image columns ─────────────────────────── */
    await client.query(`
      ALTER TABLE activities ADD COLUMN IF NOT EXISTS image_url text;
      ALTER TABLE dishes     ADD COLUMN IF NOT EXISTS image_url text;
      ALTER TABLE posts      ADD COLUMN IF NOT EXISTS cover_image text;
    `);
    log.push("✓ Migration 004: image columns added");

    /* ── Migration 007: DINING enum + extra activity columns ─────── */
    await client.query(`ALTER TYPE activity_category ADD VALUE IF NOT EXISTS 'DINING'`);
    log.push("✓ Migration 007: DINING enum value added");

    await client.query(`
      ALTER TABLE activities ADD COLUMN IF NOT EXISTS duration_minutes INTEGER      DEFAULT 60;
      ALTER TABLE activities ADD COLUMN IF NOT EXISTS cover_gradient   TEXT         DEFAULT 'from-emerald-800 via-emerald-700 to-teal-800';
      ALTER TABLE activities ADD COLUMN IF NOT EXISTS rating           NUMERIC(3,1) DEFAULT 4.5;
      ALTER TABLE activities ADD COLUMN IF NOT EXISTS review_count     INTEGER      DEFAULT 0;
      ALTER TABLE activities ADD COLUMN IF NOT EXISTS highlights       TEXT[]       DEFAULT '{}';
    `);
    log.push("✓ Migration 007: extra columns added to activities");

    /* ── Migration 008: seed dining activities ────────────────────── */
    const { rows: existing } = await client.query(
      `SELECT id FROM activities WHERE category = 'DINING'`
    );
    if (existing.length > 0) {
      log.push(`⚠ Skipped: ${existing.length} DINING activities already exist`);
    } else {
      await client.query(`
        INSERT INTO activities (
          name, category, description, safety_guideline,
          price, max_capacity, max_per_slot, duration_minutes,
          cover_gradient, image_url, rating, review_count,
          highlights, is_active
        ) VALUES
        (
          'Bữa Tối Đặc Sản Quảng Bình', 'DINING',
          'Thưởng thức bữa tối đặc sản giữa không gian rừng núi: bánh canh cá lóc, bún bò Huế, cơm hến và nhiều món địa phương. Bàn được bày trí dưới ánh đèn lồng ven hồ, tạo không khí lãng mạn và ấm cúng.',
          E'• Vui lòng thông báo trước nếu có dị ứng thực phẩm.\n• Trẻ em dưới 3 tuổi dùng bữa miễn phí.\n• Đặt chỗ trước ít nhất 2 giờ.\n• Phục vụ từ 18:00 – 20:30.',
          220000, 60, 12, 90,
          'from-orange-800 via-amber-700 to-yellow-800',
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
          4.8, 186,
          ARRAY['Đặc sản địa phương', 'Không gian ven hồ', 'Thực đơn theo mùa'],
          true
        ),
        (
          'Lớp Học Nấu Ăn Bản Địa', 'DINING',
          'Học nấu 3 món đặc sản Quảng Bình cùng đầu bếp địa phương: bánh xèo miền Trung, cháo canh Lệ Thủy và chè đậu xanh truyền thống. Sau buổi học bạn thưởng thức ngay những gì vừa tự tay nấu.',
          E'• Tạp dề và dụng cụ được cung cấp đầy đủ.\n• Phù hợp cho mọi lứa tuổi từ 8 tuổi trở lên.\n• Nhóm tối đa 8 người / lớp để đảm bảo chất lượng.\n• Thông báo dị ứng thực phẩm khi đặt chỗ.',
          350000, 32, 8, 120,
          'from-rose-800 via-orange-700 to-amber-800',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80',
          4.9, 74,
          ARRAY['Học từ đầu bếp địa phương', 'Thực hành trực tiếp', 'Thưởng thức thành phẩm'],
          true
        ),
        (
          'Buffet Sáng Ven Hồ', 'DINING',
          'Bắt đầu ngày mới với buffet sáng phong phú ngay bên hồ nước ngọc bích. Các món từ phở, bánh mì, trái cây tươi đến cà phê đặc sản Quảng Bình — tất cả giữa không gian thiên nhiên trong lành lúc bình minh.',
          E'• Phục vụ từ 06:30 – 09:30, vui lòng đến đúng giờ.\n• Bàn ngoài trời, mang theo áo khoác nhẹ vào buổi sáng sớm.\n• Trẻ em dưới 5 tuổi miễn phí.',
          120000, 80, 20, 60,
          'from-amber-600 via-yellow-500 to-orange-600',
          'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=80',
          4.7, 231,
          ARRAY['View hồ bình minh', 'Đa dạng món ăn', 'Cà phê đặc sản'],
          true
        )
      `);
      log.push("✓ Migration 008: 3 DINING activities inserted");
    }

    /* ── Verify ───────────────────────────────────────────────────── */
    const { rows } = await client.query(
      `SELECT name, category, price, image_url FROM activities WHERE category = 'DINING' ORDER BY name`
    );
    log.push(`✓ DINING activities in DB: ${rows.map(r => r.name).join(", ")}`);

    await client.end();
    return NextResponse.json({ success: true, log, dining: rows });

  } catch (err: unknown) {
    await client.end().catch(() => {});
    const msg = err instanceof Error ? err.message : String(err);
    log.push(`✗ Error: ${msg}`);
    return NextResponse.json({ success: false, log, error: msg }, { status: 500 });
  }
}
