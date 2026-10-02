/*
# Service Discovery Module — Categories, Services, Provider Profiles

## Purpose
Adds the core data model for browsing service categories, viewing services,
and discovering providers who offer those services, including location-based search.

## New Tables

### categories
- `id` (uuid, primary key, auto-generated)
- `name` (text, unique, not null) — e.g. "Plumbing", "Electrical"
- `description` (text, nullable) — short description of the category
- `icon` (text, nullable) — optional icon identifier for frontend use
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### services
- `id` (uuid, primary key, auto-generated)
- `name` (text, not null) — e.g. "Pipe Leak Repair"
- `description` (text, nullable) — short description
- `category_id` (uuid, foreign key → categories.id, not null)
- `is_active` (boolean, default true) — whether this service is currently offered/listed
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### provider_profiles
- `id` (uuid, primary key, auto-generated)
- `user_id` (uuid, foreign key → users.id, unique, not null) — one profile per provider user
- `bio` (text, nullable) — provider bio / description
- `city` (text, nullable) — e.g. "Mumbai"
- `area` (text, nullable) — e.g. "Andheri West"
- `pincode` (text, nullable) — e.g. "400058"
- `is_available` (boolean, default true) — current availability flag
- `phone` (text, nullable) — contact phone (safe to expose publicly)
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### provider_services
- `id` (uuid, primary key, auto-generated)
- `provider_id` (uuid, foreign key → provider_profiles.id, not null)
- `service_id` (uuid, foreign key → services.id, not null)
- `is_available` (boolean, default true) — per-service availability override
- `created_at` (timestamptz, default now())
- Unique constraint on (provider_id, service_id) to prevent duplicates

## Security
- RLS enabled on all new tables (deny by default — backend mediates access via Prisma with service role key).
- No policies added: the Express backend handles all access control via JWT auth and role checks.

## Notes
- `provider_profiles.user_id` references the existing `users` table (Task 2) — no changes to `users`.
- `provider_services` is a many-to-many join table linking providers to the services they offer.
- Per-service availability can be overridden at the join level, or the provider's overall `is_available` flag controls global availability.
- Triggers auto-update `updated_at` on all four tables.
*/

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  icon text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Services
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_services_category_id ON services(category_id);

-- Provider profiles
CREATE TABLE IF NOT EXISTS provider_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio text,
  city text,
  area text,
  pincode text,
  is_available boolean NOT NULL DEFAULT true,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_provider_profiles_user_id ON provider_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_provider_profiles_city ON provider_profiles(city);
CREATE INDEX IF NOT EXISTS idx_provider_profiles_pincode ON provider_profiles(pincode);

-- Provider-Services join table
CREATE TABLE IF NOT EXISTS provider_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(provider_id, service_id)
);

ALTER TABLE provider_services ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_provider_services_provider_id ON provider_services(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_services_service_id ON provider_services(service_id);

-- updated_at trigger for all new tables
-- (update_updated_at function already exists from Task 2 migration)

DROP TRIGGER IF EXISTS categories_updated_at ON categories;
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS services_updated_at ON services;
CREATE TRIGGER services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS provider_profiles_updated_at ON provider_profiles;
CREATE TRIGGER provider_profiles_updated_at BEFORE UPDATE ON provider_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- provider_services has no updated_at column, so no trigger needed
