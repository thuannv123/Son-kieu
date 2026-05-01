-- Migration 020: Tạo bảng posts (nếu chưa có) + thêm cột seo_keywords
-- Chạy trong Supabase SQL Editor

-- Extension cần thiết cho auto-update updated_at
CREATE EXTENSION IF NOT EXISTS moddatetime;

-- Tạo bảng posts
CREATE TABLE IF NOT EXISTS posts (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT        NOT NULL,
  slug          TEXT        UNIQUE NOT NULL,
  excerpt       TEXT,
  content       TEXT,
  category      TEXT        NOT NULL DEFAULT 'news',
  author        TEXT        NOT NULL DEFAULT 'Sơn Kiều',
  cover_image   TEXT,
  seo_keywords  TEXT        DEFAULT '',
  is_published  BOOLEAN     NOT NULL DEFAULT false,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Thêm cột seo_keywords nếu bảng đã tồn tại từ trước (chạy an toàn nếu đã có bảng)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_image  TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_keywords TEXT DEFAULT '';

-- Auto-update updated_at trigger
DROP TRIGGER IF EXISTS set_posts_updated_at ON posts;
CREATE TRIGGER set_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);

-- RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published posts" ON posts;
CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Service role full access on posts" ON posts;
CREATE POLICY "Service role full access on posts"
  ON posts FOR ALL USING (auth.role() = 'service_role');
