
-- Add new columns to profiles table if they don't exist yet
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS creci TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS agency_name TEXT;
