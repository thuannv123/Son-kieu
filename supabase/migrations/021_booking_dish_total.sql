-- Add dish_total column to bookings to track dining revenue separately
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS dish_total NUMERIC(10,2) NOT NULL DEFAULT 0;
