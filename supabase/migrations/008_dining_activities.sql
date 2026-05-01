-- Seed 3 dining experience activities
-- Run AFTER 007_activities_v2.sql (requires DINING enum value + extra columns)

INSERT INTO activities (
  name, category, description, safety_guideline,
  price, max_capacity, max_per_slot, duration_minutes,
  cover_gradient, image_url, rating, review_count,
  highlights, is_active
) VALUES
(
  'Bữa Tối Đặc Sản Quảng Bình',
  'DINING',
  'Thưởng thức bữa tối đặc sản giữa không gian rừng núi: bánh canh cá lóc, bún bò Huế, cơm hến và nhiều món địa phương. Bàn được bày trí dưới ánh đèn lồng ven hồ, tạo không khí lãng mạn và ấm cúng.',
  '• Vui lòng thông báo trước nếu có dị ứng thực phẩm.
• Trẻ em dưới 3 tuổi dùng bữa miễn phí.
• Đặt chỗ trước ít nhất 2 giờ.
• Phục vụ từ 18:00 – 20:30.',
  220000, 60, 12, 90,
  'from-orange-800 via-amber-700 to-yellow-800',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
  4.8, 186,
  ARRAY['Đặc sản địa phương', 'Không gian ven hồ', 'Thực đơn theo mùa'],
  true
),
(
  'Lớp Học Nấu Ăn Bản Địa',
  'DINING',
  'Học nấu 3 món đặc sản Quảng Bình cùng đầu bếp địa phương: bánh xèo miền Trung, cháo canh Lệ Thủy và chè đậu xanh truyền thống. Sau buổi học bạn thưởng thức ngay những gì vừa tự tay nấu.',
  '• Tạp dề và dụng cụ được cung cấp đầy đủ.
• Phù hợp cho mọi lứa tuổi từ 8 tuổi trở lên.
• Nhóm tối đa 8 người / lớp để đảm bảo chất lượng.
• Thông báo dị ứng thực phẩm khi đặt chỗ.',
  350000, 32, 8, 120,
  'from-rose-800 via-orange-700 to-amber-800',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80',
  4.9, 74,
  ARRAY['Học từ đầu bếp địa phương', 'Thực hành trực tiếp', 'Thưởng thức thành phẩm'],
  true
),
(
  'Buffet Sáng Ven Hồ',
  'DINING',
  'Bắt đầu ngày mới với buffet sáng phong phú ngay bên hồ nước ngọc bích. Các món từ phở, bánh mì, trái cây tươi đến cà phê đặc sản Quảng Bình — tất cả giữa không gian thiên nhiên trong lành lúc bình minh.',
  '• Phục vụ từ 06:30 – 09:30, vui lòng đến đúng giờ.
• Bàn ngoài trời, mang theo áo khoác nhẹ vào buổi sáng sớm.
• Trẻ em dưới 5 tuổi miễn phí.',
  120000, 80, 20, 60,
  'from-amber-600 via-yellow-500 to-orange-600',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=80',
  4.7, 231,
  ARRAY['View hồ bình minh', 'Đa dạng món ăn', 'Cà phê đặc sản'],
  true
);
