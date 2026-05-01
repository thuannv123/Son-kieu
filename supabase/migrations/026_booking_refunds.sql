CREATE TABLE IF NOT EXISTS booking_refunds (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref text        NOT NULL,
  proof_url   text        NOT NULL,
  note        text,
  created_by  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS booking_refunds_ref_idx ON booking_refunds (booking_ref);
