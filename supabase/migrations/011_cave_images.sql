-- Migration 011: set specific images for 3 cave activities
-- Paste into Supabase SQL Editor and Run

UPDATE activities SET image_url = 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%co tich%';

UPDATE activities SET image_url = 'https://images.unsplash.com/photo-1543726969-a1da85a6d334?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%phong nhi%';

UPDATE activities SET image_url = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80'
WHERE name ILIKE '%toi bi an%';
