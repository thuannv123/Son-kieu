-- Migration 017: dish_categories table + category column on dishes

CREATE TABLE IF NOT EXISTS dish_categories (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  emoji      TEXT NOT NULL DEFAULT '🍽️',
  sort_order INT  NOT NULL DEFAULT 0
);

ALTER TABLE dish_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read dish_categories"  ON dish_categories FOR SELECT USING (true);
CREATE POLICY "service dish_categories"      ON dish_categories FOR ALL    USING (auth.role() = 'service_role');

INSERT INTO dish_categories (name, slug, emoji, sort_order) VALUES
  ('Combo',          'combo',         '🍱', 1),
  ('Đặc Sản Rừng',   'dac-san-rung',  '🌿', 2),
  ('Món Lẻ',         'mon-le',        '🍽️', 3),
  ('Đồ Uống',        'do-uong',       '🥤', 4)
ON CONFLICT (slug) DO NOTHING;

-- Add category column to dishes
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS category TEXT;

-- Map existing tag values → category slug
UPDATE dishes SET category = 'combo'        WHERE tag IN ('Combo Đặc Biệt','Combo Lớn','Combo Nhỏ');
UPDATE dishes SET category = 'dac-san-rung' WHERE tag = 'Đặc Sản Rừng';
UPDATE dishes SET category = 'mon-le'       WHERE tag = 'Món Lẻ';
UPDATE dishes SET category = 'do-uong'      WHERE tag = 'Đồ Uống';
