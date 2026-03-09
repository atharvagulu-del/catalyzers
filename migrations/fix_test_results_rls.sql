-- Fix RLS policy to allow students to see all test results for ranking/percentile calculation
-- Run this in your Supabase SQL Editor

-- First, check if RLS is enabled
-- SELECT relrowsecurity FROM pg_class WHERE relname = 'test_results';

-- Option 1: Allow all authenticated users to read test results (for ranking)
-- This is the simplest solution and allows the app to calculate percentile correctly

-- Drop existing restrictive policy if any
DROP POLICY IF EXISTS "Students can only view their own results" ON test_results;
DROP POLICY IF EXISTS "Users can view own results" ON test_results;

-- Create new policy: Allow reading ALL test results (for ranking calculation)
-- Students can see all results to calculate their rank/percentile
CREATE POLICY "Allow reading all test results for ranking"
ON test_results
FOR SELECT
USING (true);  -- Allow all authenticated users to read

-- Alternative: If you want to restrict to only tests the student is enrolled in:
-- CREATE POLICY "Students can view results for their class tests"
-- ON test_results
-- FOR SELECT
-- USING (
--   EXISTS (
--     SELECT 1 FROM offline_tests t
--     JOIN enrollments e ON e.class = t.class
--     WHERE t.id = test_results.test_id
--     AND e.user_id = auth.uid()
--   )
-- );

-- Keep existing INSERT/UPDATE policies for teachers only
-- (These should already exist from your initial setup)
