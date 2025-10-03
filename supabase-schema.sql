-- Supabase Database Schema for LearnFlow
-- Run this in your Supabase SQL Editor

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  outline TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('generating', 'generated', 'failed')),
  content TEXT, -- The generated TypeScript code
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (no auth for this project)
CREATE POLICY "Public Access" ON lessons
  FOR ALL USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lessons_status ON lessons(status);
CREATE INDEX IF NOT EXISTS idx_lessons_created_at ON lessons(created_at DESC);

-- Enable Realtime for the lessons table
ALTER PUBLICATION supabase_realtime ADD TABLE lessons;