-- ═══════════════════════════════════════════════════════════════════
-- Paste toàn bộ file này vào Supabase Dashboard → SQL Editor → Run
-- ═══════════════════════════════════════════════════════════════════

-- 1. Thêm cột image_url cho activities, dishes, posts
ALTER TABLE activities ADD COLUMN IF NOT EXISTS image_url    TEXT;
ALTER TABLE dishes     ADD COLUMN IF NOT EXISTS image_url    TEXT;
ALTER TABLE posts      ADD COLUMN IF NOT EXISTS cover_image  TEXT;

-- 2. Thêm category DINING
ALTER TYPE activity_category ADD VALUE IF NOT EXISTS 'DINING';

-- 3. Thêm các cột còn thiếu cho activities
ALTER TABLE activities ADD COLUMN IF NOT EXISTS duration_minutes INTEGER      DEFAULT 60;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS cover_gradient   TEXT         DEFAULT 'from-emerald-800 via-emerald-700 to-teal-800';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS rating           NUMERIC(3,1) DEFAULT 4.5;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS review_count     INTEGER      DEFAULT 0;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS highlights       TEXT[]       DEFAULT '{}';

-- 4. Insert 3 hoạt động ẩm thực (bỏ qua nếu đã tồn tại)
INSERT INTO activities (
  name, category, description, safety_guideline,
  price, max_capacity, max_per_slot, duration_minutes,
  cover_gradient, image_url, rating, review_count,
  highlights, is_active
)
SELECT * FROM (VALUES
  (
    'Bữa Tối Đặc Sản Quảng Bình', 'DINING'::activity_category,
    'Thưởng thức bữa tối đặc sản giữa không gian rừng núi: bánh canh cá lóc, bún bò Huế, cơm hến và nhiều món địa phương. Bàn được bày trí dưới ánh đèn lồng ven hồ, tạo không khí lãng mạn và ấm cúng.',
    E'• Vui lòng thông báo nếu có dị ứng thực phẩm.\n• Trẻ em dưới 3 tuổi miễn phí.\n• Đặt chỗ trước ít nhất 2 giờ.\n• Phục vụ 18:00 – 20:30.',
    220000::numeric, 60, 12, 90,
    'from-orange-800 via-amber-700 to-yellow-800',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
    4.8::numeric, 186,
    ARRAY['Đặc sản địa phương','Không gian ven hồ','Thực đơn theo mùa'],
    true
  ),
  (
    'Lớp Học Nấu Ăn Bản Địa', 'DINING'::activity_category,
    'Học nấu 3 món đặc sản Quảng Bình cùng đầu bếp địa phương: bánh xèo miền Trung, cháo canh Lệ Thủy và chè đậu xanh. Sau buổi học bạn thưởng thức ngay những gì vừa tự tay nấu.',
    E'• Tạp dề và dụng cụ được cung cấp.\n• Phù hợp từ 8 tuổi trở lên.\n• Tối đa 8 người / lớp.\n• Thông báo dị ứng khi đặt chỗ.',
    350000::numeric, 32, 8, 120,
    'from-rose-800 via-orange-700 to-amber-800',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80',
    4.9::numeric, 74,
    ARRAY['Học từ đầu bếp địa phương','Thực hành trực tiếp','Thưởng thức thành phẩm'],
    true
  ),
  (
    'Buffet Sáng Ven Hồ', 'DINING'::activity_category,
    'Bắt đầu ngày mới với buffet sáng phong phú ngay bên hồ nước ngọc bích. Phở, bánh mì, trái cây tươi, cà phê đặc sản Quảng Bình — giữa không gian thiên nhiên lúc bình minh.',
    E'• Phục vụ 06:30 – 09:30.\n• Bàn ngoài trời, nên mang áo khoác nhẹ.\n• Trẻ em dưới 5 tuổi miễn phí.',
    120000::numeric, 80, 20, 60,
    'from-amber-600 via-yellow-500 to-orange-600',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=80',
    4.7::numeric, 231,
    ARRAY['View hồ bình minh','Đa dạng món ăn','Cà phê đặc sản'],
    true
  )
) AS v(name,category,description,safety_guideline,price,max_capacity,max_per_slot,duration_minutes,cover_gradient,image_url,rating,review_count,highlights,is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM activities WHERE category = 'DINING'
);
