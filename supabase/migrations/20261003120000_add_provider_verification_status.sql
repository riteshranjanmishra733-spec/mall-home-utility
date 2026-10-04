DO $$
BEGIN
  CREATE TYPE provider_verification_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'provider_profiles'
      AND column_name = 'verification_status'
  ) THEN
    ALTER TABLE provider_profiles
      ADD COLUMN verification_status provider_verification_status NOT NULL DEFAULT 'PENDING';

    UPDATE provider_profiles
    SET verification_status = 'APPROVED';
  END IF;
END
$$;