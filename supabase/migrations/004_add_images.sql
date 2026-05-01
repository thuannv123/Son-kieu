ALTER TABLE activities  ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE dishes      ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE posts       ADD COLUMN IF NOT EXISTS cover_image text;
