-- Add start_time and end_time columns to offline_tests
ALTER TABLE offline_tests 
ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS end_time TIMESTAMPTZ;

-- Backfill existing data (Assuming 10 AM - 1 PM IST for existing tests)
-- Adjust the timezone if necessary. Using 'Asia/Kolkata' as implied by context (JEE/NEET).
UPDATE offline_tests
SET 
  start_time = (test_date::date + time '10:00:00') AT TIME ZONE 'Asia/Kolkata',
  end_time = (test_date::date + time '13:00:00') AT TIME ZONE 'Asia/Kolkata'
WHERE start_time IS NULL AND test_date IS NOT NULL;

-- Make columns not null after backfill (Optional, simpler to leave nullable for now)
-- ALTER TABLE offline_tests ALTER COLUMN start_time SET NOT NULL;
-- ALTER TABLE offline_tests ALTER COLUMN end_time SET NOT NULL;
