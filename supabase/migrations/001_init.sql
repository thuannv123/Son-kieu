-- Run this in Supabase Dashboard → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
DO $$ BEGIN
  CREATE TYPE activity_category AS ENUM ('CAVE', 'LAKE', 'SIGHTSEEING');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'CHECKED_IN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  phone      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── activities ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activities (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  category         activity_category NOT NULL,
  description      TEXT,
  safety_guideline TEXT,
  difficulty_level TEXT,
  virtual_tour_url TEXT,
  max_capacity     INTEGER NOT NULL DEFAULT 50,
  max_per_slot     INTEGER NOT NULL DEFAULT 10,
  price            NUMERIC(10,2) NOT NULL,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── activity_slots ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_slots (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id  UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  slot_date    DATE NOT NULL,
  slot_time    TIME NOT NULL,
  booked_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(activity_id, slot_date, slot_time)
);

-- ── bookings ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id),
  activity_id   UUID NOT NULL REFERENCES activities(id),
  slot_id       UUID REFERENCES activity_slots(id),
  booking_date  DATE NOT NULL,
  slot_time     TIME NOT NULL,
  guest_count   INTEGER NOT NULL DEFAULT 1,
  total_price   NUMERIC(10,2) NOT NULL,
  status        booking_status NOT NULL DEFAULT 'PENDING',
  qr_code_token TEXT UNIQUE,
  guest_name    TEXT NOT NULL,
  guest_email   TEXT NOT NULL,
  guest_phone   TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── weather_logs ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS weather_logs (
  id          BIGSERIAL PRIMARY KEY,
  location    TEXT NOT NULL DEFAULT 'resort',
  status      TEXT NOT NULL,
  description TEXT,
  temperature FLOAT,
  is_safe     BOOLEAN NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── auto-update updated_at ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_activities_updated_at ON activities;
CREATE TRIGGER trg_activities_updated_at
  BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_bookings_updated_at ON bookings;
CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security (public read, service_role full access) ────────────────
ALTER TABLE activities     ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_logs   ENABLE ROW LEVEL SECURITY;

-- Anyone can read activities and slots
CREATE POLICY "public_read_activities"     ON activities     FOR SELECT USING (true);
CREATE POLICY "public_read_slots"          ON activity_slots FOR SELECT USING (true);
CREATE POLICY "public_read_weather"        ON weather_logs   FOR SELECT USING (true);

-- Only service_role (backend) can mutate
CREATE POLICY "service_insert_activities"  ON activities     FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "service_update_activities"  ON activities     FOR UPDATE USING   (auth.role() = 'service_role');
CREATE POLICY "service_manage_slots"       ON activity_slots FOR ALL   USING    (auth.role() = 'service_role');
CREATE POLICY "service_manage_bookings"    ON bookings       FOR ALL   USING    (auth.role() = 'service_role');
CREATE POLICY "service_manage_weather"     ON weather_logs   FOR ALL   USING    (auth.role() = 'service_role');
