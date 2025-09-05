-- Up Migration
ALTER TABLE IF EXISTS users
ADD COLUMN IF NOT EXISTS email_verified boolean NOT NULL DEFAULT false;

-- Down Migration
ALTER TABLE IF EXISTS users
DROP COLUMN IF EXISTS email_verified;