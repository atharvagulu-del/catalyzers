-- SQL to add test_paper column to offline_tests table
-- Run this in your Supabase SQL Editor

-- Add test_paper column (array of image URLs)
ALTER TABLE offline_tests 
ADD COLUMN IF NOT EXISTS test_paper TEXT[] DEFAULT NULL;

-- Add status column for better tracking
ALTER TABLE offline_tests 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'scheduled' 
CHECK (status IN ('scheduled', 'ongoing', 'ended', 'results_out'));

-- ============================================
-- STORAGE BUCKET SETUP
-- ============================================
-- Go to Supabase Dashboard > Storage and create a new bucket called "test-papers"
-- Make sure to set it as PUBLIC for easy access
-- Or run these SQL commands:

-- Insert the bucket (you might need to do this via Dashboard if SQL fails)
INSERT INTO storage.buckets (id, name, public)
VALUES ('test-papers', 'test-papers', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public read access for test papers" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'test-papers');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload test papers" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'test-papers' AND auth.role() = 'authenticated');

-- Allow file owners to delete
CREATE POLICY "Owner can delete test papers" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'test-papers' AND auth.role() = 'authenticated');
