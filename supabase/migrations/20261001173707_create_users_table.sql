/*
# Create users table for authentication

## Purpose
Stores application-level user accounts for the Mall & Home Utility Services app.
Each user has a role (CUSTOMER, PROVIDER, ADMIN) that determines their access level.
This table is separate from Supabase auth.users — the backend manages its own
password hashing (bcrypt) and JWT issuance, so this table stores the hashed password directly.

## New Tables
- `users`
  - `id` (uuid, primary key, auto-generated)
  - `name` (text, not null) — user's display name
  - `email` (text, unique, not null) — login email
  - `password` (text, not null) — bcrypt-hashed password
  - `role` (text, not null, default 'CUSTOMER') — one of CUSTOMER, PROVIDER, ADMIN
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

## Security
- RLS enabled on `users`.
- The backend uses the Supabase service role key (via Prisma with direct connection),
  which bypasses RLS. RLS policies are added as a defense-in-depth measure:
  anon/authenticated roles get no access (deny by default), since all data access
  is mediated by the Express backend.

## Notes
- The `updated_at` column is updated via a trigger whenever a row is modified.
- A CHECK constraint ensures `role` is one of the three allowed values.
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  role text NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'PROVIDER', 'ADMIN')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable RLS (deny by default — backend uses service role key which bypasses RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- No policies: the Express backend handles all access control via JWT auth.
-- RLS is enabled as defense-in-depth; anon/authenticated roles get no direct access.
