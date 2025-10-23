-- Add widget_settings column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS widget_settings jsonb DEFAULT jsonb_build_object(
  'primaryColor', '#2dd4bf',
  'secondaryColor', '#ff6f61',
  'position', 'bottom-right',
  'theme', 'light',
  'buttonText', 'Give Feedback',
  'customClass', '',
  'userParameters', jsonb_build_object(
    'userId', jsonb_build_object('enabled', false, 'required', false),
    'userEmail', jsonb_build_object('enabled', false, 'required', false),
    'userName', jsonb_build_object('enabled', false, 'required', false),
    'imgUrl', jsonb_build_object('enabled', false, 'required', false),
    'userSpend', jsonb_build_object('enabled', false, 'required', false)
  ),
  'allowAnonymous', true,
  'whitelistedDomains', '[]'::jsonb,
  'enableAnalytics', true,
  'trackEvents', jsonb_build_object(
    'load', true,
    'open', true,
    'submit', true,
    'error', true
  )
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Done')),
  votes INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for feedback table
CREATE INDEX idx_feedback_project_id ON public.feedback(project_id);
CREATE INDEX idx_feedback_status ON public.feedback(status);
CREATE INDEX idx_feedback_votes ON public.feedback(votes DESC);
CREATE INDEX idx_feedback_created_at ON public.feedback(created_at DESC);

-- Enable RLS on feedback table
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for feedback
CREATE POLICY "Feedback is viewable by everyone"
  ON public.feedback FOR SELECT
  USING (true);

CREATE POLICY "Feedback can be created by anyone"
  ON public.feedback FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Feedback can be updated by project owners"
  ON public.feedback FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = feedback.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_feedback_timestamp
  BEFORE UPDATE ON public.feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_feedback_updated_at(); 