CREATE TABLE IF NOT EXISTS staff_accounts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  phone         TEXT,
  role          TEXT NOT NULL DEFAULT 'MANAGER'
                  CHECK (role IN ('SUPER_ADMIN', 'MANAGER')),
  password_hash TEXT NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  note          TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS staff_accounts_email_idx ON staff_accounts (email);
CREATE INDEX IF NOT EXISTS staff_accounts_role_idx  ON staff_accounts (role);

ALTER TABLE staff_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_only" ON staff_accounts
  USING (auth.role() = 'service_role');
