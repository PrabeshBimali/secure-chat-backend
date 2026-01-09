-- Up Migration
ALTER TABLE IF EXISTS users
DROP COLUMN IF EXISTS password_hash;

-- Down Migration
ALTER TABLE IF EXISTS users 
ADD COLUMN IF NOT EXISTS password_hash character varying(60) NOT NULL;