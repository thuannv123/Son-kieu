-- Migration 028: Add event_date column to posts for scheduling events
ALTER TABLE posts ADD COLUMN IF NOT EXISTS event_date TIMESTAMPTZ;
