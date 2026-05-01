-- Add sample Unsplash images to seed dishes (run after 003 + 004 migrations)
UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80'
  WHERE name = 'Bún bò Huế';

UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1559742811-822873691df8?w=800&auto=format&fit=crop&q=80'
  WHERE name = 'Bánh xèo Quảng Bình';

UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80'
  WHERE name = 'Cháo canh Lệ Thủy';

UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=800&auto=format&fit=crop&q=80'
  WHERE name = 'Cơm hến Đồng Hới';

UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&auto=format&fit=crop&q=80'
  WHERE name = 'Bánh canh cá lóc';

UPDATE dishes SET image_url = 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=800&auto=format&fit=crop&q=80'
  WHERE name = 'Khoai deo Đồng Hới';
