-- Ferrivox Engineering Intake: budget & timeline fields
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard -> SQL Editor

-- Add intake fields to contact_submissions
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS budget TEXT,
  ADD COLUMN IF NOT EXISTS timeline TEXT;
