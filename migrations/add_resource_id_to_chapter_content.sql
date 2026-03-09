-- Add resource_id column to link dynamic content to static resources
ALTER TABLE chapter_content ADD COLUMN IF NOT EXISTS resource_id TEXT;

-- Create index for faster lookups by resource_id
CREATE INDEX IF NOT EXISTS idx_chapter_content_resource_id ON chapter_content(resource_id) WHERE resource_id IS NOT NULL;
