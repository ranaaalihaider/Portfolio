-- D1 Migration: Switch from raw API keys to SHA-256 hashed API keys for security
-- DO NOT drop the table. We only need to rename the column.

ALTER TABLE customers RENAME COLUMN api_key TO api_key_hash;
