-- Add onboarding_status column to existing profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_status JSONB DEFAULT '{"completed": false, "steps": {}}';

-- Add onboarding_started_at and onboarding_completed_at timestamps
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- Create a table to track detailed onboarding analytics
CREATE TABLE IF NOT EXISTS onboarding_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  event_type TEXT NOT NULL,
  step_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS onboarding_events_user_id_idx ON onboarding_events(user_id);
CREATE INDEX IF NOT EXISTS onboarding_events_event_type_idx ON onboarding_events(event_type);

-- Allow users to read and update their own onboarding status
DROP POLICY IF EXISTS "Users can view their own onboarding status" ON profiles;
CREATE POLICY "Users can view their own onboarding status"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own onboarding status" ON profiles;
CREATE POLICY "Users can update their own onboarding status"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow users to create their own onboarding events
DROP POLICY IF EXISTS "Users can create their own onboarding events" ON onboarding_events;
CREATE POLICY "Users can create their own onboarding events"
  ON onboarding_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own onboarding events
DROP POLICY IF EXISTS "Users can view their own onboarding events" ON onboarding_events;
CREATE POLICY "Users can view their own onboarding events"
  ON onboarding_events
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create function to update onboarding step
CREATE OR REPLACE FUNCTION update_onboarding_step(
  step_id TEXT,
  completed BOOLEAN,
  metadata JSONB DEFAULT '{}'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id UUID := auth.uid();
  current_status JSONB;
  updated_status JSONB;
BEGIN
  -- Get current onboarding status
  SELECT onboarding_status INTO current_status
  FROM profiles
  WHERE id = user_id;
  
  -- Default if null
  IF current_status IS NULL THEN
    current_status := '{"completed": false, "steps": {}}';
  END IF;

  -- Update the specific step
  updated_status := jsonb_set(
    current_status,
    '{steps, ' || step_id || '}',
    jsonb_build_object(
      'completed', completed,
      'completed_at', CASE WHEN completed THEN to_jsonb(now()) ELSE NULL END,
      'metadata', metadata
    )
  );

  -- If marking a step as completed, also record an onboarding event
  IF completed THEN
    INSERT INTO onboarding_events (user_id, event_type, step_id, metadata)
    VALUES (user_id, 'step_completed', step_id, metadata);
  END IF;

  -- Update the profiles table
  UPDATE profiles
  SET onboarding_status = updated_status
  WHERE id = user_id;

  RETURN updated_status;
END;
$$;

-- Create function to complete onboarding
CREATE OR REPLACE FUNCTION complete_onboarding()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id UUID := auth.uid();
  current_status JSONB;
BEGIN
  -- Get current onboarding status
  SELECT onboarding_status INTO current_status
  FROM profiles
  WHERE id = user_id;
  
  -- Default if null
  IF current_status IS NULL THEN
    current_status := '{"completed": false, "steps": {}}';
  END IF;

  -- Set the completed flag to true
  current_status := jsonb_set(current_status, '{completed}', 'true');

  -- Update the profiles table
  UPDATE profiles
  SET
    onboarding_status = current_status,
    onboarding_completed_at = NOW()
  WHERE id = user_id;

  -- Record completion event
  INSERT INTO onboarding_events (user_id, event_type, step_id, metadata)
  VALUES (user_id, 'onboarding_completed', 'all', '{}');

  RETURN TRUE;
END;
$$;
