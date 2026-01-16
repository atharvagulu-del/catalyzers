-- Flashcard Decks Table
CREATE TABLE IF NOT EXISTS flashcard_decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    title TEXT NOT NULL,
    card_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flashcards Table
CREATE TABLE IF NOT EXISTS flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id UUID NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    hint TEXT,
    answer TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flashcard Progress Table (per student)
CREATE TABLE IF NOT EXISTS flashcard_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    deck_id UUID NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
    card_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('known', 'learning')),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, card_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_flashcard_decks_subject ON flashcard_decks(subject);
CREATE INDEX IF NOT EXISTS idx_flashcards_deck ON flashcards(deck_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_progress_student ON flashcard_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_progress_deck ON flashcard_progress(deck_id);

-- RLS Policies
ALTER TABLE flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_progress ENABLE ROW LEVEL SECURITY;

-- Decks: Anyone can read
CREATE POLICY "flashcard_decks_read" ON flashcard_decks FOR SELECT USING (true);

-- Cards: Anyone can read
CREATE POLICY "flashcards_read" ON flashcards FOR SELECT USING (true);

-- Progress: Students can only access their own progress
CREATE POLICY "flashcard_progress_read" ON flashcard_progress
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "flashcard_progress_insert" ON flashcard_progress
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "flashcard_progress_update" ON flashcard_progress
    FOR UPDATE USING (auth.uid() = student_id);

-- Seed some sample decks (Physics, Chemistry, Maths)
INSERT INTO flashcard_decks (subject, topic, title, card_count) VALUES
    ('Physics', 'Mechanics', 'Newton''s Laws of Motion', 10),
    ('Physics', 'Thermodynamics', 'Laws of Thermodynamics', 8),
    ('Chemistry', 'Chemical Bonding', 'Types of Chemical Bonds', 12),
    ('Chemistry', 'Periodic Table', 'Periodic Trends', 10),
    ('Maths', 'Calculus', 'Differentiation Basics', 10),
    ('Maths', 'Algebra', 'Quadratic Equations', 8);
