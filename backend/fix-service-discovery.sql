BEGIN;

-- Drop the existing foreign keys first
ALTER TABLE services
DROP CONSTRAINT IF EXISTS services_category_id_fkey;

ALTER TABLE provider_profiles
DROP CONSTRAINT IF EXISTS provider_profiles_user_id_fkey;

ALTER TABLE provider_services
DROP CONSTRAINT IF EXISTS provider_services_provider_id_fkey;

ALTER TABLE provider_services
DROP CONSTRAINT IF EXISTS provider_services_service_id_fkey;


-- Convert the four TEXT columns to UUID
ALTER TABLE services
ALTER COLUMN category_id TYPE uuid
USING category_id::uuid;

ALTER TABLE provider_profiles
ALTER COLUMN user_id TYPE uuid
USING user_id::uuid;

ALTER TABLE provider_services
ALTER COLUMN provider_id TYPE uuid
USING provider_id::uuid;

ALTER TABLE provider_services
ALTER COLUMN service_id TYPE uuid
USING service_id::uuid;


-- Recreate the correct foreign keys
ALTER TABLE services
ADD CONSTRAINT services_category_id_fkey
FOREIGN KEY (category_id)
REFERENCES categories(id)
ON DELETE RESTRICT;

ALTER TABLE provider_profiles
ADD CONSTRAINT provider_profiles_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE provider_services
ADD CONSTRAINT provider_services_provider_id_fkey
FOREIGN KEY (provider_id)
REFERENCES provider_profiles(id)
ON DELETE CASCADE;

ALTER TABLE provider_services
ADD CONSTRAINT provider_services_service_id_fkey
FOREIGN KEY (service_id)
REFERENCES services(id)
ON DELETE CASCADE;

COMMIT;