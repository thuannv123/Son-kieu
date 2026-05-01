-- Dishes
CREATE TABLE IF NOT EXISTS dishes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text NOT NULL DEFAULT '',
  price       text NOT NULL DEFAULT '',
  tag         text NOT NULL DEFAULT '',
  emoji       text NOT NULL DEFAULT '🍜',
  color       text NOT NULL DEFAULT 'orange',
  is_active   boolean NOT NULL DEFAULT true,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Restaurants
CREATE TABLE IF NOT EXISTS restaurants (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  type       text NOT NULL DEFAULT '',
  address    text NOT NULL DEFAULT '',
  hours      text NOT NULL DEFAULT '',
  tag        text NOT NULL DEFAULT '',
  is_active  boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE dishes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read dishes"
  ON dishes FOR SELECT USING (is_active = true);
CREATE POLICY "service dishes"
  ON dishes FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "public read restaurants"
  ON restaurants FOR SELECT USING (is_active = true);
CREATE POLICY "service restaurants"
  ON restaurants FOR ALL USING (auth.role() = 'service_role');

-- Seed dishes
INSERT INTO dishes (name, description, price, tag, emoji, color, sort_order) VALUES
  ('Bún bò Huế',           'Súp bò cay nồng với sợi bún tươi, thịt bò và chả cua – linh hồn ẩm thực miền Trung.', '35.000đ',   'Đặc sản địa phương', '🍜', 'orange', 1),
  ('Bánh xèo Quảng Bình',  'Bánh xèo giòn tan nhân tôm thịt, ăn kèm rau sống và tương đậu phộng truyền thống.',   '45.000đ',   'Món chiên',          '🥘', 'amber',  2),
  ('Cháo canh Lệ Thủy',    'Cháo đặc với hải sản tươi và rau thơm – món ăn sáng chuẩn vị của người Quảng Bình.',  '30.000đ',   'Ẩm thực buổi sáng',  '🍲', 'teal',   3),
  ('Cơm hến Đồng Hới',     'Cơm trắng ăn kèm hến xào, ruốc sống, lạc rang và tương ớt – vị cay thú vị đặc trưng.','25.000đ',  'Hải sản',            '🍚', 'cyan',   4),
  ('Bánh canh cá lóc',     'Sợi bột gạo, nước dùng ngọt từ cá lóc tươi, chan cùng hành và tiêu thơm.',             '40.000đ',   'Đặc sản địa phương', '🥣', 'lime',   5),
  ('Khoai deo Đồng Hới',   'Khoai lang vàng nướng mật – đặc sản ngọt ngào làm quà biếu không thể thiếu.',         '60.000đ/gói','Quà đặc sản',        '🍠', 'yellow', 6);

-- Seed restaurants
INSERT INTO restaurants (name, type, address, hours, tag, sort_order) VALUES
  ('Nhà hàng Sơn Kiều',   'Hải sản & Đặc sản vùng',      '12 Lý Thái Tổ, Đồng Hới',  '10:00 – 22:00', 'Được đề xuất', 1),
  ('Quán Bún Bò Cô Liên', 'Bún bò Huế truyền thống',      'Chợ Đồng Hới, sạp 42',     '06:00 – 11:00', 'Sáng sớm',    2),
  ('Biển Xanh Seafood',   'Hải sản tươi sống & nướng',    'Bãi Nhật Lệ, Đồng Hới',    '11:00 – 23:00', 'Ven biển',    3);
