-- Enhanced Notification System with Multiple Trigger Types + Reminders
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. CREATE/UPDATE NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'general',
    data JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Allow insert from service" ON notifications;

-- Create policies
CREATE POLICY "Users can read own notifications"
ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow insert from service"
ON notifications FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- ============================================
-- 2. CREATE PUSH TOKENS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS push_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    expo_push_token TEXT NOT NULL,
    device_type TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, expo_push_token)
);

ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own push tokens" ON push_tokens;
CREATE POLICY "Users can manage own push tokens"
ON push_tokens FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 3. SCHEDULED REMINDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS scheduled_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID REFERENCES offline_tests(id) ON DELETE CASCADE,
    reminder_type TEXT NOT NULL,
    scheduled_for TIMESTAMPTZ NOT NULL,
    sent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scheduled_reminders_time ON scheduled_reminders(scheduled_for) WHERE sent = false;

-- ============================================
-- 4. HELPER: GET ENROLLED STUDENTS
-- ============================================
CREATE OR REPLACE FUNCTION get_enrolled_students(test_class TEXT, test_batch TEXT)
RETURNS TABLE(user_id UUID) AS $$
BEGIN
    RETURN QUERY
    SELECT e.user_id FROM enrollments e
    WHERE e.class = test_class 
    AND (test_batch IS NULL OR e.batch = test_batch)
    AND e.enrollment_status = 'ENROLLED';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. NOTIFICATION ON TEST CREATED + SCHEDULE REMINDERS
-- ============================================
CREATE OR REPLACE FUNCTION notify_test_scheduled()
RETURNS TRIGGER AS $$
DECLARE
    student RECORD;
    test_datetime TEXT;
    test_start TIMESTAMPTZ;
BEGIN
    -- Calculate test start time
    test_start := (NEW.test_date::date + NEW.start_time::time) AT TIME ZONE 'Asia/Kolkata';
    
    -- Format test date and time for display
    test_datetime := to_char(NEW.test_date::date, 'DD Mon') || ' at ' || 
                    to_char(NEW.start_time::time, 'HH12:MI AM');
    
    -- Notify all enrolled students about new test
    FOR student IN SELECT * FROM get_enrolled_students(NEW.class, NEW.batch)
    LOOP
        INSERT INTO notifications (user_id, title, body, type, data)
        VALUES (
            student.user_id,
            '� New Test Scheduled!',
            NEW.test_name || ' (' || NEW.subject || ') scheduled for ' || test_datetime,
            'test_scheduled',
            jsonb_build_object(
                'test_id', NEW.id,
                'test_name', NEW.test_name,
                'subject', NEW.subject,
                'test_date', NEW.test_date,
                'start_time', NEW.start_time
            )
        );
    END LOOP;
    
    -- Schedule reminders (1 day before, 1 hour before, test starting)
    IF test_start > now() + interval '1 day' THEN
        INSERT INTO scheduled_reminders (test_id, reminder_type, scheduled_for)
        VALUES (NEW.id, '1_day', test_start - interval '1 day');
    END IF;
    
    IF test_start > now() + interval '1 hour' THEN
        INSERT INTO scheduled_reminders (test_id, reminder_type, scheduled_for)
        VALUES (NEW.id, '1_hour', test_start - interval '1 hour');
    END IF;
    
    IF test_start > now() + interval '5 minutes' THEN
        INSERT INTO scheduled_reminders (test_id, reminder_type, scheduled_for)
        VALUES (NEW.id, 'test_starting', test_start - interval '5 minutes');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_test_scheduled ON offline_tests;
CREATE TRIGGER on_test_scheduled
    AFTER INSERT ON offline_tests
    FOR EACH ROW
    EXECUTE FUNCTION notify_test_scheduled();

-- ============================================
-- 6. FUNCTION TO SEND SCHEDULED REMINDERS
-- ============================================
CREATE OR REPLACE FUNCTION send_scheduled_reminders()
RETURNS INTEGER AS $$
DECLARE
    reminder RECORD;
    student RECORD;
    reminder_title TEXT;
    reminder_body TEXT;
    sent_count INTEGER := 0;
BEGIN
    FOR reminder IN 
        SELECT sr.*, ot.test_name, ot.subject, ot.class, ot.batch, ot.start_time
        FROM scheduled_reminders sr
        JOIN offline_tests ot ON ot.id = sr.test_id
        WHERE sr.sent = false 
        AND sr.scheduled_for <= now()
    LOOP
        CASE reminder.reminder_type
            WHEN '1_day' THEN
                reminder_title := '📢 Test Tomorrow!';
                reminder_body := reminder.test_name || ' (' || reminder.subject || ') is tomorrow at ' || to_char(reminder.start_time::time, 'HH12:MI AM');
            WHEN '1_hour' THEN
                reminder_title := '⏰ Test in 1 Hour!';
                reminder_body := reminder.test_name || ' (' || reminder.subject || ') starts in 1 hour!';
            WHEN 'test_starting' THEN
                reminder_title := '🚀 Test Starting Soon!';
                reminder_body := reminder.test_name || ' starts in 5 minutes!';
        END CASE;
        
        FOR student IN SELECT * FROM get_enrolled_students(reminder.class, reminder.batch)
        LOOP
            INSERT INTO notifications (user_id, title, body, type, data)
            VALUES (
                student.user_id,
                reminder_title,
                reminder_body,
                'test_reminder',
                jsonb_build_object('test_id', reminder.test_id, 'test_name', reminder.test_name, 'reminder_type', reminder.reminder_type)
            );
        END LOOP;
        
        UPDATE scheduled_reminders SET sent = true WHERE id = reminder.id;
        sent_count := sent_count + 1;
    END LOOP;
    
    RETURN sent_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. NOTIFICATION ON RESULTS UPLOADED
-- ============================================
CREATE OR REPLACE FUNCTION notify_results_out()
RETURNS TRIGGER AS $$
DECLARE
    student RECORD;
BEGIN
    IF NEW.is_marks_entered = true AND (OLD.is_marks_entered IS NULL OR OLD.is_marks_entered = false) THEN
        FOR student IN SELECT * FROM get_enrolled_students(NEW.class, NEW.batch)
        LOOP
            INSERT INTO notifications (user_id, title, body, type, data)
            VALUES (
                student.user_id,
                '📊 Results Out!',
                'Results for ' || NEW.test_name || ' are now available. Check your score!',
                'result_out',
                jsonb_build_object('test_id', NEW.id, 'test_name', NEW.test_name, 'subject', NEW.subject)
            );
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_results_uploaded ON offline_tests;
CREATE TRIGGER on_results_uploaded
    AFTER UPDATE ON offline_tests
    FOR EACH ROW
    EXECUTE FUNCTION notify_results_out();

-- ============================================
-- 8. NOTIFICATION ON TEST PAPER UPLOADED
-- ============================================
CREATE OR REPLACE FUNCTION notify_test_paper_uploaded()
RETURNS TRIGGER AS $$
DECLARE
    student RECORD;
BEGIN
    IF (OLD.test_paper IS NULL OR array_length(OLD.test_paper, 1) IS NULL) 
       AND NEW.test_paper IS NOT NULL AND array_length(NEW.test_paper, 1) > 0 THEN
        FOR student IN SELECT * FROM get_enrolled_students(NEW.class, NEW.batch)
        LOOP
            INSERT INTO notifications (user_id, title, body, type, data)
            VALUES (
                student.user_id,
                '📄 Question Paper Uploaded!',
                'Question paper for ' || NEW.test_name || ' is now available.',
                'paper_uploaded',
                jsonb_build_object('test_id', NEW.id, 'test_name', NEW.test_name, 'subject', NEW.subject)
            );
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_test_paper_uploaded ON offline_tests;
CREATE TRIGGER on_test_paper_uploaded
    AFTER UPDATE ON offline_tests
    FOR EACH ROW
    EXECUTE FUNCTION notify_test_paper_uploaded();

-- ============================================
-- 9. NOTIFICATION ON SOLUTION UPLOADED
-- ============================================
CREATE OR REPLACE FUNCTION notify_solution_uploaded()
RETURNS TRIGGER AS $$
DECLARE
    student RECORD;
BEGIN
    IF (OLD.solution_paper IS NULL OR array_length(OLD.solution_paper, 1) IS NULL) 
       AND NEW.solution_paper IS NOT NULL AND array_length(NEW.solution_paper, 1) > 0 THEN
        FOR student IN SELECT * FROM get_enrolled_students(NEW.class, NEW.batch)
        LOOP
            INSERT INTO notifications (user_id, title, body, type, data)
            VALUES (
                student.user_id,
                '✅ Solutions Uploaded!',
                'Solutions for ' || NEW.test_name || ' are now available.',
                'solution_uploaded',
                jsonb_build_object('test_id', NEW.id, 'test_name', NEW.test_name, 'subject', NEW.subject)
            );
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_solution_uploaded ON offline_tests;
CREATE TRIGGER on_solution_uploaded
    AFTER UPDATE ON offline_tests
    FOR EACH ROW
    EXECUTE FUNCTION notify_solution_uploaded();

-- ============================================
-- 10. ENABLE REALTIME (safely - skip if already added)
-- ============================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'notifications'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
    END IF;
END $$;

-- ============================================
-- NOTIFICATION TYPES SUMMARY:
-- 'test_scheduled' - New test created
-- 'test_reminder' - 1 day, 1 hour, 5 mins before
-- 'result_out' - Marks entered
-- 'paper_uploaded' - Test paper added
-- 'solution_uploaded' - Solution added
-- ============================================

-- TO RUN REMINDERS, CALL THIS EVERY MINUTE:
-- SELECT send_scheduled_reminders();
