-- Fix Row Level Security (RLS) for projects table
-- This ensures that users can only see and modify their own projects

-- 1. Enable Row Level Security on the projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 2. Drop any existing policies
DROP POLICY IF EXISTS "Projects are viewable by everyone." ON public.projects;
DROP POLICY IF EXISTS "Projects are editable by everyone." ON public.projects;
DROP POLICY IF EXISTS "Projects are viewable by their owner." ON public.projects;
DROP POLICY IF EXISTS "Projects are editable by their owner." ON public.projects;
DROP POLICY IF EXISTS "Projects are insertable by authenticated users." ON public.projects;

-- 3. Create proper RLS policies

-- SELECT: Users can only view their own projects
CREATE POLICY "Projects are viewable by their owner."
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Authenticated users can create projects (user_id will be set to their own ID)
CREATE POLICY "Projects are insertable by authenticated users."
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own projects
CREATE POLICY "Projects are editable by their owner."
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE: Users can only delete their own projects
CREATE POLICY "Projects are deletable by their owner."
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Optionally fix any "broken" projects (projects with wrong user_id)
-- UPDATE public.projects 
-- SET user_id = NULL
-- WHERE slug = 'ssss'; 