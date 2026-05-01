-- Migration 019: Gắn ảnh placeholder Unsplash cho các món ăn
-- Chạy trong Supabase SQL Editor

UPDATE dishes SET image_url = CASE name
  -- Combo
  WHEN 'Combo Đặc Biệt'   THEN 'https://images.unsplash.com/photo-1544025162-d76538571dbe?w=800&auto=format&fit=crop&q=80'
  WHEN 'Combo Lớn'        THEN 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80'
  WHEN 'Combo Nhỏ'        THEN 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80'

  -- Đặc Sản Rừng
  WHEN 'Thịt heo bản'     THEN 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&auto=format&fit=crop&q=80'
  WHEN 'Bò xào lá lốt'   THEN 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&auto=format&fit=crop&q=80'
  WHEN 'Trâu xào lá trộng' THEN 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&auto=format&fit=crop&q=80'
  WHEN 'Cua đá rang muối' THEN 'https://images.unsplash.com/photo-1565680018434-b5b3f8c0c9e2?w=800&auto=format&fit=crop&q=80'
  WHEN 'Dê'               THEN 'https://images.unsplash.com/photo-1558030137-a56c1b004fa6?w=800&auto=format&fit=crop&q=80'

  -- Món Lẻ
  WHEN 'Gà nướng'         THEN 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&auto=format&fit=crop&q=80'
  WHEN 'Thịt xiên nướng'  THEN 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80'
  WHEN 'Cá lóc nướng'    THEN 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80'
  WHEN 'Tôm nướng'        THEN 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80'
  WHEN 'Bò lá lốt'        THEN 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&auto=format&fit=crop&q=80'
  WHEN 'Xôi nếp dẻo'     THEN 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&auto=format&fit=crop&q=80'
  WHEN 'Cơm nếp than'     THEN 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&auto=format&fit=crop&q=80'
  WHEN 'Dưa leo / rau luộc' THEN 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80'
  WHEN 'Mì xào'           THEN 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format&fit=crop&q=80'
  WHEN 'Cháo gà đồi'      THEN 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80'

  -- Đồ Uống
  WHEN 'Tiger Beer'           THEN 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&auto=format&fit=crop&q=80'
  WHEN 'Saigon Beer'          THEN 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&auto=format&fit=crop&q=80'
  WHEN 'Huda Beer'            THEN 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&auto=format&fit=crop&q=80'
  WHEN 'Bò húc (Red Bull)'    THEN 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80'
  WHEN 'Nước suối'            THEN 'https://images.unsplash.com/photo-1562887231-2f1e9fa6bad7?w=800&auto=format&fit=crop&q=80'
  WHEN 'Nước ngọt các loại'   THEN 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80'

  ELSE image_url
END
WHERE image_url IS NULL OR image_url = '';
