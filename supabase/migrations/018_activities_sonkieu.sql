-- Migration 018: Replace placeholder activities with real Sơn Kiều services
-- Run in Supabase SQL Editor

-- Remove bookings and slots tied to old placeholder activities, then the activities
DELETE FROM bookings
  WHERE activity_id IN (
    SELECT id FROM activities WHERE category IN ('CAVE', 'LAKE', 'SIGHTSEEING')
  );

DELETE FROM activity_slots
  WHERE activity_id IN (
    SELECT id FROM activities WHERE category IN ('CAVE', 'LAKE', 'SIGHTSEEING')
  );

DELETE FROM activities WHERE category IN ('CAVE', 'LAKE', 'SIGHTSEEING');

-- Insert 3 real services
INSERT INTO activities (
  slug, name, category, description, safety_guideline,
  price, max_capacity, max_per_slot, duration_minutes,
  cover_gradient, image_url, rating, review_count,
  highlights, is_active
) VALUES
(
  'combo-tham-quan-tam-suoi',
  'Combo Tham Quan, Check-in, Tắm Suối',
  'LAKE',
  E'Gói dịch vụ chính tại Khu Du Lịch Sinh Thái Sơn Kiều — tham quan toàn khu, check-in các điểm sống ảo đẹp nhất và tắm suối thiên nhiên mát lành giữa rừng núi Trường Sơn.\n\nTrẻ em từ 1m đến 1m4: 50.000đ/vé. Trẻ em dưới 1m: MIỄN PHÍ.\n\nLưu ý: Giá vé không bao gồm dịch vụ chèo thuyền kayak và ăn uống.',
  E'• Mặc áo phao bắt buộc khi tắm suối nếu không biết bơi.\n• Không nhảy từ đá cao xuống suối.\n• Giám sát chặt trẻ em mọi lúc.\n• Không uống rượu bia trước khi xuống suối.\n• Tạm dừng hoạt động khi có mưa lớn hoặc sấm sét.',
  75000, 200, 30, 240,
  'from-teal-700 via-cyan-600 to-sky-700',
  'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&auto=format&fit=crop&q=80',
  4.8, 0,
  ARRAY['Tắm suối thiên nhiên', 'Check-in cảnh đẹp', 'Tham quan toàn khu'],
  true
),
(
  'tham-quan-3-hang-dong',
  'Tham Quan 3 Hang Động',
  'CAVE',
  E'Khám phá 3 hang động hùng vĩ tại Sơn Kiều — cảnh quan thiên nhiên triệu năm tuổi với thạch nhũ độc đáo, ánh sáng huyền ảo và không gian hang động rộng lớn nguyên sơ.\n\nĐây là dịch vụ đặc biệt, cần đặt vé trước để đảm bảo suất tham quan.',
  E'• Mang giày đế bằng, chống trượt.\n• Không tự ý rời khỏi đoàn.\n• Cấm sử dụng đèn flash gần thạch nhũ.\n• Không chạm tay vào nhũ đá.\n• Giữ trật tự, không tạo tiếng ồn lớn trong hang.',
  100000, 80, 15, 120,
  'from-slate-800 via-slate-700 to-stone-800',
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
  4.9, 0,
  ARRAY['3 hang động liên tiếp', 'Thạch nhũ nguyên sơ', 'Hướng dẫn viên đồng hành'],
  true
),
(
  'xe-dien-tham-quan',
  'Xe Điện Tham Quan Khu Du Lịch',
  'SIGHTSEEING',
  'Dịch vụ xe điện đưa đón khách tham quan toàn bộ khu du lịch Sơn Kiều một cách thoải mái và tiện lợi. Thích hợp cho người lớn tuổi, trẻ nhỏ và những ai muốn khám phá khu du lịch rộng lớn mà không mất sức.',
  E'• Ngồi đúng chỗ quy định, thắt dây an toàn.\n• Không thò tay chân ra ngoài xe khi di chuyển.\n• Trẻ em phải ngồi cùng người lớn.\n• Tuân thủ hướng dẫn của tài xế.',
  20000, 200, 20, 30,
  'from-amber-700 via-orange-600 to-yellow-700',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80',
  4.7, 0,
  ARRAY['Tiện lợi, nhanh chóng', 'Phù hợp mọi lứa tuổi', 'Tham quan toàn khu'],
  true
);
