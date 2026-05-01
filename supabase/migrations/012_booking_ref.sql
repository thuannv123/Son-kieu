-- Migration 012: add booking_ref column + change default status to PENDING
-- Paste into Supabase SQL Editor and Run

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS booking_ref TEXT;

-- Index for fast webhook lookup
CREATE INDEX IF NOT EXISTS idx_bookings_booking_ref ON bookings(booking_ref);

-- Existing PAID bookings keep their status; new ones will arrive as PENDING
