-- Add URL-friendly slug column to activities
-- Run in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS unaccent;

ALTER TABLE activities ADD COLUMN IF NOT EXISTS slug TEXT;

-- Generate slug: đ→d, then strip diacritics, lowercase, replace non-alphanumeric with hyphen
UPDATE activities
SET slug = trim(both '-' FROM
  regexp_replace(
    lower(unaccent(
      translate(name,
        'đĐơƠưƯ',
        'dDoOuU'
      )
    )),
    '[^a-z0-9]+', '-', 'g'
  )
)
WHERE slug IS NULL;

-- Append 6-char UUID prefix to any duplicates
UPDATE activities a
SET slug = a.slug || '-' || substring(a.id::text, 1, 6)
WHERE (
  SELECT count(*) FROM activities b WHERE b.slug = a.slug AND b.id != a.id
) > 0;

CREATE UNIQUE INDEX IF NOT EXISTS activities_slug_key ON activities(slug);
