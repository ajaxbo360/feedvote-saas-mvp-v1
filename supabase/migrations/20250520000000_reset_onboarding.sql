-- Create function to reset onboarding status
CREATE OR REPLACE FUNCTION reset_user_onboarding()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id UUID := auth.uid();
BEGIN
  -- Reset onboarding status
  UPDATE profiles
  SET 
    onboarding_status = '{"completed": false, "steps": {}}',
    onboarding_completed_at = NULL,
    onboarding_started_at = NOW()
  WHERE id = user_id;
  
  -- Delete onboarding events for this user
  DELETE FROM onboarding_events
  WHERE user_id = user_id;
  
  -- Record a new onboarding start event
  INSERT INTO onboarding_events (user_id, event_type, step_id, metadata)
  VALUES (user_id, 'onboarding_started', 'initial', '{}');
  
  RETURN TRUE;
END;
$$; 