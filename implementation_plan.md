# Student Dashboard Redesign & Test Timing Logic

## Goal
Revamp the Student Dashboard to feature "Allen-style" test cards for upcoming and past tests. Implement strict start/end time logic for tests, ensuring teachers can only enter marks after a test has concluded.

## User Review Required
> [!IMPORTANT]
> **Database Migration Required**: You must run the SQL script `supabase_migration_test_times.sql` in your Supabase SQL Editor to add `start_time` and `end_time` columns.

## Proposed Changes

### Database Schema (SQL)
- Add `start_time` (timestamp) and `end_time` (timestamp) to `offline_tests` table.
- Migrate existing data (optional default values).

### 1. Library & Types
#### [MODIFY] [offlineTests.ts](file:///e:/New%20folder%20(17)/lib/offlineTests.ts)
- Update `OfflineTest` interface to include `start_time` and `end_time`.
- *Remove* `test_date` usage in favor of `start_time` (or keep as fallback, but `start_time` is more precise).
- Update `createTest` function to accept newly added fields.

### 2. Teacher Portal (Test Creation)
#### [MODIFY] [create/page.tsx](file:///e:/New%20folder%20(17)/app/teacher/tests/create/page.tsx)
- Replace single "Test Date" input with "Start Time" and "End Time" (datetime-local inputs).
- precise validation (End needs to be after Start).

### 3. Teacher Portal (Marks Entry)
#### [MODIFY] [marks/page.tsx](file:///e:/New%20folder%20(17)/app/teacher/tests/[testId]/marks/page.tsx)
- Add check: If `current_time < end_time`, disable "Save Marks" and show a "Test in Progress" message.

### 4. Student Dashboard UI
#### [NEW] [TestCard.tsx](file:///e:/New%20folder%20(17)/components/dashboard/TestCard.tsx)
- Component to render a test card.
- Variants: `upcoming` (Blue/Yellow), `live` (Red pulsing), `result` (Green "Results Out").
- Layout matching the "Allen" screenshot: 
    - Header with Status
    - Title (Test Name)
    - Metadata Row (Date | Duration | Mode)
    - Action Buttons (Syllabus, Re-attempt, View Result)

#### [MODIFY] [dashboard/page.tsx](file:///e:/New%20folder%20(17)/app/dashboard/page.tsx)
- Fetch student's tests using `getMyTestsWithResults`.
- Filter into `upcoming`, `live` (now -> end), `past`.
- Render `TestCard` components in a horizontal scroll or grid.
- Remove the static "No Tests Scheduled" placeholder unless truly empty.

## Verification Plan
### Automated
- None (UI & Logic heavy).

### Manual
1. **Migration**: Run SQL.
2. **Teacher**: Create a test starting in 5 mins, ending in 10 mins.
3. **Student**: Verify dashboard shows "Upcoming" card with correct start time.
4. **Teacher**: Try to enter marks immediately -> Should be blocked.
5. **Wait**: Wait for test to "start" -> Student shows "Live".
6. **Wait**: Wait for test to "end" -> Teacher can now enter marks.
7. **Student**: Verify dashboard shows "Result" card once marks are entered.
