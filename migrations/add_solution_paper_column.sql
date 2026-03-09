-- SQL to add solution_paper column to offline_tests table
-- Run this in your Supabase SQL Editor

-- Add solution_paper column (array of image URLs for solutions)
ALTER TABLE offline_tests 
ADD COLUMN IF NOT EXISTS solution_paper TEXT[] DEFAULT NULL;

-- ============================================
-- VERIFICATION
-- ============================================
-- After running this, verify by running:
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'offline_tests' AND column_name = 'solution_paper';
