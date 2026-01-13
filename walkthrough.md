# Dashboard Redesign & Test Logic Walkthrough

I have implemented strict test timing logic and a redesigned student dashboard.

## 1. Database Changes (Important)
You must run the migration script to add `start_time` and `end_time` columns to the `offline_tests` table.

```sql
-- Run this in Supabase SQL Editor
ALTER TABLE offline_tests 
ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS end_time TIMESTAMPTZ;

-- Backfill existing tests (Default: 10 AM - 1 PM on the test date)
UPDATE offline_tests
SET 
  start_time = (test_date::date + time '10:00:00') AT TIME ZONE 'Asia/Kolkata',
  end_time = (test_date::date + time '13:00:00') AT TIME ZONE 'Asia/Kolkata'
WHERE start_time IS NULL AND test_date IS NOT NULL;
```

## 2. Teacher Portal Updates
### Test Creation
- **New Fields**: Instead of a simple "Date", you now select **Start Time** and **End Time**.
- **Validation**: Ensures End Time is after Start Time.

### Marks Entry
- **Time Lock**: The "Save Marks" button and input fields are **disabled** if the test is currently "Live" (Current Time < End Time).
- **Warning Banner**: A banner appears showing when marks entry will be enabled.

## 3. Student Dashboard
- **Dynamic Content**: Replaced the static "No Tests Scheduled" placeholder.
- **Allen-Style Cards**:
    - **Upcoming**: Blue card with "Starts in X hrs".
    - **Live**: Pulsing Red card with "Test in Progress".
    - **Result**: Green card with "View Result" button (only appears after marks are entered).
    - **Ended**: Gray card (awaiting results).

## Verification
1.  **Run the SQL**.
2.  **Create a Test** for the future (e.g. 5 mins later). Check Student Dashboard -> "Upcoming".
3.  **Create a Test** for now. Check Student Dashboard -> "Live". Try to enter marks as Teacher -> "Test in Progress".
4.  **Wait for test to end** (or edit DB/Time). Enter marks as Teacher. Check Student Dashboard -> "Result".
