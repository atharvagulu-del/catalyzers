-- Chapter Content Table for Admin Panel
-- This table stores dynamic content (videos, questions) for chapters
-- that can be managed via the admin panel

CREATE TABLE IF NOT EXISTS chapter_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chapter_id TEXT NOT NULL,
    subject TEXT NOT NULL CHECK (subject IN ('Physics', 'Chemistry', 'Mathematics', 'Biology')),
    grade TEXT NOT NULL CHECK (grade IN ('11', '12')),
    exam_type TEXT NOT NULL DEFAULT 'JEE' CHECK (exam_type IN ('JEE', 'NEET')),
    content_type TEXT NOT NULL CHECK (content_type IN ('video', 'quiz', 'pyq', 'article')),
    title TEXT NOT NULL,
    youtube_url TEXT,
    youtube_id TEXT, -- Extracted video ID for embedding
    duration TEXT,
    questions JSONB DEFAULT '[]'::jsonb,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_chapter_content_lookup ON chapter_content(exam_type, subject, grade, chapter_id);
CREATE INDEX IF NOT EXISTS idx_chapter_content_active ON chapter_content(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE chapter_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access for active content
CREATE POLICY "Allow public read" ON chapter_content
    FOR SELECT USING (is_active = true);

-- Allow all operations for authenticated users (admin)
CREATE POLICY "Allow admin all" ON chapter_content
    USING (true)
    WITH CHECK (true);
