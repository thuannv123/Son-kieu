-- Migration 024: Lưu chi tiết từng món ăn/uống trong đơn đặt vé
CREATE TABLE IF NOT EXISTS booking_dishes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_ref TEXT NOT NULL,
  dish_name   TEXT NOT NULL,
  qty         INTEGER NOT NULL DEFAULT 1,
  unit_price  TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS booking_dishes_ref_idx ON booking_dishes(booking_ref);
