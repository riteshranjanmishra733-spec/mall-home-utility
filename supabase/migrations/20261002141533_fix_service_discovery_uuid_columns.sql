/*
# Corrective Migration: Ensure UUID types on Service Discovery FK columns

## Purpose
Ensures the four foreign-key columns in the Service Discovery tables are
UUID type (matching their referenced primary keys) and that the FK constraints
are valid. This migration is idempotent — if the columns are already UUID
(as is currently the case), each step is a no-op.

## Background
The original migration (20261002131123_create_service_discovery_tables.sql)
created these columns as UUID correctly. However, the Prisma schema was
missing @db.Uuid annotations on the relation fields, causing Prisma to
treat them as TEXT and producing a type mismatch on `prisma db push`.
The Prisma schema has since been corrected. This migration serves as a
verifying corrective step.

## Columns verified/corrected:
1. services.category_id            -> categories.id          (uuid)
2. provider_profiles.user_id       -> users.id               (uuid)
3. provider_services.provider_id   -> provider_profiles.id   (uuid)
4. provider_services.service_id    -> services.id            (uuid)

## Steps
For each affected table:
  a) Drop existing FK constraint (if any)
  b) Convert column to UUID using ALTER COLUMN ... TYPE uuid USING ...
     (safe cast: text::uuid works when values are valid UUIDs)
  c) Recreate FK constraint with correct types

All steps are wrapped in DO blocks that check current column type
before attempting conversion, making the migration fully idempotent.
*/

-- ============================================================
-- 1. services.category_id -> categories.id
-- ============================================================
DO $$
BEGIN
  -- Drop existing FK if present
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'services_category_id_fkey'
      AND table_name = 'services'
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE services DROP CONSTRAINT services_category_id_fkey;
  END IF;

  -- Convert to UUID if currently text
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'category_id'
      AND data_type = 'text'
  ) THEN
    ALTER TABLE services ALTER COLUMN category_id TYPE uuid USING category_id::uuid;
  END IF;

  -- Recreate FK constraint
  ALTER TABLE services
    ADD CONSTRAINT services_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT;
END $$;

-- ============================================================
-- 2. provider_profiles.user_id -> users.id
-- ============================================================
DO $$
BEGIN
  -- Drop existing FK if present
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'provider_profiles_user_id_fkey'
      AND table_name = 'provider_profiles'
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE provider_profiles DROP CONSTRAINT provider_profiles_user_id_fkey;
  END IF;

  -- Convert to UUID if currently text
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'provider_profiles' AND column_name = 'user_id'
      AND data_type = 'text'
  ) THEN
    ALTER TABLE provider_profiles ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
  END IF;

  -- Recreate FK constraint
  ALTER TABLE provider_profiles
    ADD CONSTRAINT provider_profiles_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
END $$;

-- ============================================================
-- 3. provider_services.provider_id -> provider_profiles.id
-- ============================================================
DO $$
BEGIN
  -- Drop existing FK if present
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'provider_services_provider_id_fkey'
      AND table_name = 'provider_services'
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE provider_services DROP CONSTRAINT provider_services_provider_id_fkey;
  END IF;

  -- Convert to UUID if currently text
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'provider_services' AND column_name = 'provider_id'
      AND data_type = 'text'
  ) THEN
    ALTER TABLE provider_services ALTER COLUMN provider_id TYPE uuid USING provider_id::uuid;
  END IF;

  -- Recreate FK constraint
  ALTER TABLE provider_services
    ADD CONSTRAINT provider_services_provider_id_fkey
    FOREIGN KEY (provider_id) REFERENCES provider_profiles(id) ON DELETE CASCADE;
END $$;

-- ============================================================
-- 4. provider_services.service_id -> services.id
-- ============================================================
DO $$
BEGIN
  -- Drop existing FK if present
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'provider_services_service_id_fkey'
      AND table_name = 'provider_services'
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE provider_services DROP CONSTRAINT provider_services_service_id_fkey;
  END IF;

  -- Convert to UUID if currently text
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'provider_services' AND column_name = 'service_id'
      AND data_type = 'text'
  ) THEN
    ALTER TABLE provider_services ALTER COLUMN service_id TYPE uuid USING service_id::uuid;
  END IF;

  -- Recreate FK constraint
  ALTER TABLE provider_services
    ADD CONSTRAINT provider_services_service_id_fkey
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE;
END $$;
