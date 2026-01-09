-- Up Migration
ALTER TABLE IF EXISTS users
ADD COLUMN IF NOT EXISTS identity_pbk CHAR(64) NOT NULL;

ALTER TABLE IF EXISTS users
ADD CONSTRAINT unique_identity_pbk UNIQUE (identity_pbk);

ALTER TABLE IF EXISTS users
ADD COLUMN IF NOT EXISTS encryption_pbk CHAR(64) NOT NULL;

ALTER TABLE IF EXISTS users
ADD CONSTRAINT unique_encryption_pbk UNIQUE (encryption_pbk);

-- Down Migration
ALTER TABLE IF EXISTS users
DROP COLUMN IF EXISTS identity_pbk;

ALTER TABLE IF EXISTS users
DROP COLUMN IF EXISTS encryption_pbk;