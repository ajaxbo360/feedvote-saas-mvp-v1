-- Add a function to safely track onboarding start events
CREATE OR REPLACE FUNCTION public.track_onboarding_started()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id UUID := auth.uid();
BEGIN
  -- Record the onboarding start event
  BEGIN
    INSERT INTO onboarding_events (user_id, event_type, step_id, metadata)
    VALUES (user_id, 'onboarding_started', 'initial', '{}');
  EXCEPTION 
    WHEN OTHERS THEN
      -- Silently handle any errors to prevent signup failures
      RETURN FALSE;
  END;

  -- Update the onboarding_started_at time if it's NULL
  UPDATE profiles
  SET onboarding_started_at = COALESCE(onboarding_started_at, NOW())
  WHERE id = user_id AND onboarding_started_at IS NULL;

  RETURN TRUE;
END;
$$;

-- Add policy to allow authenticated users to execute the function
DROP POLICY IF EXISTS "Allow users to track their own onboarding events" ON onboarding_events;
CREATE POLICY "Allow users to track their own onboarding events"
  ON onboarding_events
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id); 