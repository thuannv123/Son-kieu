-- Add long-form article content field to activities
-- Run in Supabase SQL Editor

ALTER TABLE activities ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS safety_guideline TEXT;
