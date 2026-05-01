-- Add DINING category to the enum
ALTER TYPE activity_category ADD VALUE IF NOT EXISTS 'DINING';

-- Add columns that the admin form and booking form need
ALTER TABLE activities ADD COLUMN IF NOT EXISTS duration_minutes INTEGER      DEFAULT 60;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS cover_gradient   TEXT         DEFAULT 'from-emerald-800 via-emerald-700 to-teal-800';
ALTER TABLE activities ADD COLUMN IF NOT EXISTS rating           NUMERIC(3,1) DEFAULT 4.5;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS review_count     INTEGER      DEFAULT 0;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS highlights       TEXT[]       DEFAULT '{}';
