-- migrate:up
-- Create a table to track detailed onboarding analytics
CREATE TABLE IF NOT EXISTS public.onboarding_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  event_type TEXT NOT NULL,
  step_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS onboarding_events_user_id_idx ON public.onboarding_events(user_id);
CREATE INDEX IF NOT EXISTS onboarding_events_event_type_idx ON public.onboarding_events(event_type);

-- Set up RLS policies
ALTER TABLE public.onboarding_events ENABLE ROW LEVEL SECURITY;

-- Allow users to create their own onboarding events
CREATE POLICY "Users can create their own onboarding events"
  ON public.onboarding_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own onboarding events
CREATE POLICY "Users can view their own onboarding events"
  ON public.onboarding_events
  FOR SELECT
  USING (auth.uid() = user_id);

-- migrate:down
DROP POLICY IF EXISTS "Users can view their own onboarding events" ON public.onboarding_events;
DROP POLICY IF EXISTS "Users can create their own onboarding events" ON public.onboarding_events;
DROP INDEX IF EXISTS onboarding_events_event_type_idx;
DROP INDEX IF EXISTS onboarding_events_user_id_idx;
DROP TABLE IF EXISTS public.onboarding_events; 