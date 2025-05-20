-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS "vector";

-- Add new columns to feedback table
ALTER TABLE feedback
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS attachment_url text;

-- Create storage bucket for attachments if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('feedback-attachments', 'feedback-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public access to attachments
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'feedback-attachments');

-- Create policy to allow authenticated uploads
CREATE POLICY "Authenticated Uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'feedback-attachments');

-- Update RLS policies
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access"
ON feedback FOR SELECT
TO public
USING (true);

CREATE POLICY "Project-based Insert Access"
ON feedback FOR INSERT
TO public
WITH CHECK (true);

-- Create index on tags for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_tags ON feedback USING GIN (tags); 