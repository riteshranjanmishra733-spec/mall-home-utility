DO $$
BEGIN
  CREATE TYPE booking_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  provider_id uuid NOT NULL REFERENCES provider_profiles(id) ON DELETE RESTRICT,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  booking_date date NOT NULL,
  booking_time text,
  address text NOT NULL,
  notes text,
  status booking_status NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_customer_created_at ON bookings(customer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_created_at ON bookings(provider_id, created_at);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
