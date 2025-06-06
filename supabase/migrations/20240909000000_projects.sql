-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Projects are viewable by everyone
CREATE POLICY "Projects are viewable by everyone."
  ON public.projects FOR SELECT
  USING (true);

-- Projects can only be inserted by authenticated users
CREATE POLICY "Projects can be inserted by authenticated users."
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Projects can only be updated by the project owner
CREATE POLICY "Projects can be updated by the project owner."
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

-- Projects can only be deleted by the project owner
CREATE POLICY "Projects can be deleted by the project owner."
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- Create index on user_id for faster lookups
CREATE INDEX idx_projects_user_id ON public.projects(user_id);

-- Create index on slug for faster lookups
CREATE INDEX idx_projects_slug ON public.projects(slug);

-- Enable realtime subscriptions
ALTER TABLE public.projects REPLICA IDENTITY FULL; 