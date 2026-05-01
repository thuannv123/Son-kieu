-- Seed activities — run after 001_init.sql
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO activities (id, name, category, description, safety_guideline, difficulty_level, price, max_capacity, max_per_slot) VALUES

('a0000000-0000-0000-0000-000000000001',
 'Hang Phong Nhĩ', 'CAVE',
 'Hang động nguyên sinh dài hơn 3km với những thạch nhũ triệu năm tuổi. Ánh đèn chiếu vào tạo ra những hình thù kỳ ảo như bức tranh thiên nhiên điêu khắc từ thời tiền sử.',
 E'• Đội mũ bảo hiểm bắt buộc trong toàn bộ hành trình.\n• Không tự ý rời khỏi đoàn, luôn bám theo hướng dẫn viên.\n• Cấm sử dụng đèn flash chụp ảnh gần thạch nhũ.\n• Trẻ em dưới 6 tuổi không được tham gia.',
 'Trung bình', 250000, 80, 10),

('a0000000-0000-0000-0000-000000000002',
 'Hang Cổ Tích', 'CAVE',
 'Hang động có chiều cao vòm lên tới 40m, ánh sáng tự nhiên xuyên qua khe đá tạo ra hiệu ứng cung điện ánh sáng vô cùng huyền bí.',
 E'• Mang giày đế bằng, chống trượt.\n• Cẩn thận các đoạn đường ẩm ướt.\n• Không thả vật phẩm xuống lòng hang.',
 'Dễ', 180000, 100, 12),

('a0000000-0000-0000-0000-000000000003',
 'Hang Tối Bí Ẩn', 'CAVE',
 'Trải nghiệm thám hiểm hang động theo phong cách chuyên nghiệp với thiết bị đèn đầu, bò qua các khe đá hẹp. Chỉ dành cho người trưởng thành khỏe mạnh.',
 E'• Bắt buộc khám sức khỏe cơ bản trước khi tham gia.\n• Chỉ nhận người từ 18 tuổi trở lên.\n• Không phù hợp với người bị claustrophobia.',
 'Khó', 350000, 40, 8),

('a0000000-0000-0000-0000-000000000004',
 'Hồ Bơi Thiên Nhiên Ngọc Bích', 'LAKE',
 'Hồ nước tự nhiên màu xanh ngọc bích hình thành từ mạch nước ngầm núi đá vôi, nhiệt độ duy trì 22–24°C quanh năm.',
 E'• Bắt buộc mặc áo phao nếu không biết bơi.\n• Không nhảy từ đá vào hồ.\n• Tạm dừng hoạt động khi có mưa lớn hoặc sấm sét.',
 NULL, 150000, 60, 15),

('a0000000-0000-0000-0000-000000000005',
 'Suối Mát Rừng Già', 'LAKE',
 'Suối nước chảy tự nhiên băng qua rừng già nguyên sinh, với nhiều đoạn thác nhỏ và vũng bơi lộ thiên.',
 E'• Mang giày chống trượt cho đoạn đi bộ trong rừng.\n• Không bơi khi mực nước suối dâng cao sau mưa.',
 NULL, 120000, 40, 10),

('a0000000-0000-0000-0000-000000000006',
 'Đỉnh Vọng Cảnh Mây Ngàn', 'SIGHTSEEING',
 'Điểm ngắm cảnh ở độ cao 650m với tầm nhìn bao quát toàn bộ thung lũng và dãy núi đá vôi hùng vĩ.',
 E'• Bám chắc tay vịn tại các điểm ngắm cảnh trên cao.\n• Không vượt rào chắn an toàn.',
 NULL, 80000, 120, 20),

('a0000000-0000-0000-0000-000000000007',
 'Rừng Nguyên Sinh Xanh Thẳm', 'SIGHTSEEING',
 'Hành trình khám phá rừng nguyên sinh với hướng dẫn viên sinh thái, tìm hiểu về hệ thực vật nhiệt đới.',
 E'• Mặc quần áo dài và giày bít mũi để bảo vệ khỏi côn trùng.\n• Bôi kem chống muỗi trước khi xuất phát.',
 NULL, 140000, 50, 10)

ON CONFLICT (id) DO NOTHING;
