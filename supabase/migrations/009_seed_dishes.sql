-- Migration 009: create dishes table + seed 3 dishes
-- Paste into Supabase SQL Editor and Run

CREATE TABLE IF NOT EXISTS dishes (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  description TEXT,
  price      TEXT,
  tag        TEXT,
  emoji      TEXT        DEFAULT '🍜',
  color      TEXT        DEFAULT 'orange',
  is_active  BOOLEAN     NOT NULL DEFAULT true,
  sort_order INTEGER     NOT NULL DEFAULT 0,
  image_url  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO dishes (name, description, price, tag, emoji, color, is_active, sort_order, image_url)
VALUES
(
  'Bánh canh cá lóc',
  'Sợi bánh canh to mịn nấu cùng cá lóc tươi, nước dùng đậm đà từ xương hầm — món sáng đặc trưng không thể thiếu của người Quảng Bình.',
  '35.000đ',
  'Đặc sản',
  '🍜',
  'amber',
  true,
  1,
  'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format&fit=crop&q=80'
),
(
  'Bún bò Lệ Thủy',
  'Bún bò đặc sắc vùng Lệ Thủy với nước dùng sả cay nồng, thịt bò tái mềm và giò heo hầm mềm rục — hương vị đậm chất miền Trung.',
  '40.000đ',
  'Nổi tiếng',
  '🥣',
  'rose',
  true,
  2,
  'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80'
),
(
  'Nem lụi Phong Nha',
  'Thịt heo xay ướp gia vị, xiên vào que sả rồi nướng than hoa — ăn kèm bánh tráng, rau sống và tương đậu phộng đặc trưng vùng Phong Nha.',
  '45.000đ',
  'Nướng than hoa',
  '🍢',
  'orange',
  true,
  3,
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80'
);
