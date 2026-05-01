-- Migration 016: Cập nhật menu thực tế của Khu Du Lịch Sinh Thái Sơn Kiều

-- Xóa dữ liệu cũ (placeholder)
DELETE FROM dishes;
DELETE FROM restaurants;

-- ── COMBO ──────────────────────────────────────────────────────────────────
INSERT INTO dishes (name, description, price, tag, emoji, color, is_active, sort_order) VALUES
(
  'Combo Đặc Biệt',
  'Gà nướng · Bò lá lốt · Cá lóc nướng · Cá suối nướng · Thịt xiên nướng · Tôm nướng · Xôi nếp dẻo · Cơm nắm tím than · Rau sống',
  '1.300.000đ', 'Combo Đặc Biệt', '🍱', 'amber', true, 1
),
(
  'Combo Lớn',
  'Gà nướng · Bò lá lốt · Cá lóc nướng · Thịt xiên nướng · Xôi nếp dẻo · Cơm nắm tím than · Rau sống',
  '1.000.000đ', 'Combo Lớn', '🍱', 'orange', true, 2
),
(
  'Combo Nhỏ',
  'Gà nướng ½ con · Thịt xiên nướng · Xôi nếp dẻo · Rau, dưa leo · Cá lóc nướng',
  '600.000đ', 'Combo Nhỏ', '🍱', 'lime', true, 3
),

-- ── ĐẶC SẢN RỪNG ───────────────────────────────────────────────────────────
(
  'Thịt heo bản',
  'Local Pork — heo nuôi thả rừng, thịt chắc ngon, đậm vị bản địa.',
  '250.000đ', 'Đặc Sản Rừng', '🥩', 'rose', true, 4
),
(
  'Bò xào lá lốt',
  'Stir-fried Beef in Lolot Leaves — thịt bò xào thơm lá lốt, đặc sản không thể bỏ qua.',
  '300.000đ', 'Đặc Sản Rừng', '🥩', 'orange', true, 5
),
(
  'Trâu xào lá trộng',
  'Stir-fried Buffalo with Wild Leaves — trâu xào cùng lá rừng đặc trưng, vị đậm đà khó quên.',
  '250.000đ', 'Đặc Sản Rừng', '🐃', 'amber', true, 6
),
(
  'Cua đá rang muối',
  'Salt-roasted Mountain Crab — cua đá rang muối ớt, thịt chắc ngọt tự nhiên.',
  '200.000đ', 'Đặc Sản Rừng', '🦀', 'teal', true, 7
),
(
  'Dê',
  'Goat Meat — thịt dê tươi chế biến theo mùa, hỏi nhân viên về cách làm hôm nay.',
  'Tùy thời giá', 'Đặc Sản Rừng', '🐐', 'violet', true, 8
),

-- ── MÓN LẺ ─────────────────────────────────────────────────────────────────
(
  'Gà nướng',
  'Grilled Chicken — gà đồi nướng than hoa, da giòn thịt mềm.',
  '350.000đ', 'Món Lẻ', '🍗', 'amber', true, 9
),
(
  'Thịt xiên nướng',
  'Grilled Meat Skewers — xiên thịt nướng than hoa ướp sả ớt thơm lừng.',
  '200.000đ', 'Món Lẻ', '🍢', 'orange', true, 10
),
(
  'Cá lóc nướng',
  'Grilled Snakehead Fish — cá lóc nướng trui hoặc nướng than, ăn kèm rau sống.',
  '150.000đ', 'Món Lẻ', '🐟', 'teal', true, 11
),
(
  'Tôm nướng',
  'Grilled Prawns — tôm sông tươi nướng muối sả, ngọt thịt tự nhiên.',
  '300.000đ', 'Món Lẻ', '🦐', 'cyan', true, 12
),
(
  'Bò lá lốt',
  'Beef in Lolot Leaves — bò cuộn lá lốt nướng than, thơm đặc trưng.',
  '300.000đ', 'Món Lẻ', '🥩', 'lime', true, 13
),
(
  'Xôi nếp dẻo',
  'Sticky Rice — xôi nếp nấu mềm dẻo, ăn kèm muối vừng hoặc đậu phộng.',
  '50.000đ', 'Món Lẻ', '🍚', 'yellow', true, 14
),
(
  'Cơm nếp than',
  'Charcoal Sticky Rice Balls — cơm nếp nắm tím than độc đáo, đẹp mắt.',
  '50.000đ', 'Món Lẻ', '🍙', 'violet', true, 15
),
(
  'Dưa leo / rau luộc',
  'Cucumber / Boiled Vegetables — rau tươi ăn kèm, thanh mát.',
  '40.000đ', 'Món Lẻ', '🥗', 'lime', true, 16
),
(
  'Mì xào',
  'Fried Noodles — mì xào thập cẩm rau củ và trứng.',
  '50.000đ', 'Món Lẻ', '🍜', 'orange', true, 17
),
(
  'Cháo gà đồi',
  'Free-range Chicken Porridge — cháo gà đồi nấu chậm, đậm vị ngọt tự nhiên. Tính theo kg.',
  'Tùy kg', 'Món Lẻ', '🍲', 'amber', true, 18
),

-- ── ĐỒ UỐNG ────────────────────────────────────────────────────────────────
(
  'Tiger Beer',
  'Tiger Beer — bia lon lạnh.',
  '21.000đ/lon', 'Đồ Uống', '🍺', 'amber', true, 19
),
(
  'Saigon Beer',
  'Saigon Beer — bia lon lạnh.',
  '16.000đ/lon', 'Đồ Uống', '🍺', 'yellow', true, 20
),
(
  'Huda Beer',
  'Huda Beer — bia đặc trưng miền Trung.',
  '18.000đ/lon', 'Đồ Uống', '🍺', 'lime', true, 21
),
(
  'Bò húc (Red Bull)',
  'Red Bull Energy Drink.',
  '20.000đ/lon', 'Đồ Uống', '🥤', 'rose', true, 22
),
(
  'Nước suối',
  'Mineral Water — nước khoáng tinh khiết.',
  '10.000đ', 'Đồ Uống', '💧', 'cyan', true, 23
),
(
  'Nước ngọt các loại',
  'Soft Drinks — Pepsi, 7Up, Mirinda...',
  '15.000đ/lon', 'Đồ Uống', '🥤', 'violet', true, 24
);

-- ── NHÀ HÀNG ───────────────────────────────────────────────────────────────
INSERT INTO restaurants (name, type, address, hours, tag, sort_order) VALUES
(
  'Nhà hàng Sơn Kiều',
  'Đặc sản rừng & nướng than hoa',
  'Xã Trường Sơn, tỉnh Quảng Trị',
  '8:00 – 17:00 · Hàng ngày',
  'Tại khu du lịch', 1
);
