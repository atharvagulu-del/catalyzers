# Dashboard Redesign & Test Logic Update

- [-] **Database Schema Update**
    - [x] Create SQL to add `start_time` and `end_time` to `offline_tests`.
    - [ ] User to run migration (User encountered error, likely copy-paste).

- [x] **Library & Types**
    - [x] Update `OfflineTest` interface in `lib/offlineTests.ts` to include `start_time`, `end_time`.
    - [x] Update `createTest` function.

- [x] **Teacher Portal Updates**
    - [x] Update `app/teacher/tests/create/page.tsx` to include Start/End Time inputs.
    - [x] Update `app/teacher/tests/[testId]/marks/page.tsx` to enforce time-based locking.

- [x] **Student Dashboard UI**
    - [x] Create `components/dashboard/TestCard.tsx` (Allen-style).
    - [x] Update `app/dashboard/page.tsx` to fetch and display tests.

- [ ] **Verification**
    - [ ] Verify Dashboard UI.
    - [ ] Verify Teacher Marks Entry Lock.
