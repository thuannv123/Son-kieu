-- Migration 010: add images to activities that don't have one
-- Paste into Supabase SQL Editor and Run

UPDATE activities SET image_url = CASE
  WHEN category = 'CAVE' THEN
    'https://images.unsplash.com/photo-1560472355-109703aa3240?w=800&auto=format&fit=crop&q=80'
  WHEN category = 'LAKE' THEN
    'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&auto=format&fit=crop&q=80'
  WHEN category = 'SIGHTSEEING' THEN
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80'
END
WHERE image_url IS NULL AND category IN ('CAVE', 'LAKE', 'SIGHTSEEING');
