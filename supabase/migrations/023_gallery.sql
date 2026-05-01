CREATE TABLE IF NOT EXISTS gallery_photos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  src        TEXT NOT NULL,
  label      TEXT NOT NULL,
  sublabel   TEXT NOT NULL DEFAULT '',
  category   TEXT NOT NULL DEFAULT 'resort'
               CHECK (category IN ('cave','lake','tour','food','resort')),
  sort_order INT  NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS gallery_category_idx   ON gallery_photos(category);
CREATE INDEX IF NOT EXISTS gallery_sort_order_idx ON gallery_photos(sort_order);
