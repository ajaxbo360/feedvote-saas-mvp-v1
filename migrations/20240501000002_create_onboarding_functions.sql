-- migrate:up
-- Function to update onboarding step status
CREATE OR REPLACE FUNCTION public.update_onboarding_step(
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
  
  -- Initialize if null
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
  SET 
    onboarding_status = updated_status,
    onboarding_started_at = COALESCE(profiles.onboarding_started_at, NOW())
  WHERE id = user_id;
  
  RETURN updated_status;
END;
$$;

-- Function to mark onboarding as complete
CREATE OR REPLACE FUNCTION public.complete_onboarding()
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
  
  -- Initialize if null
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

-- Ensure RLS policies on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create or update RLS policies for profiles table
DO $$
BEGIN
  -- Check if the policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can view their own onboarding status'
  ) THEN
    -- Create policy if it doesn't exist
    CREATE POLICY "Users can view their own onboarding status"
      ON profiles
      FOR SELECT
      USING (auth.uid() = id);
  END IF;
  
  -- Check if the policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can update their own onboarding status'
  ) THEN
    -- Create policy if it doesn't exist
    CREATE POLICY "Users can update their own onboarding status"
      ON profiles
      FOR UPDATE
      USING (auth.uid() = id);
  END IF;
END
$$;

-- migrate:down
-- Drop the functions
DROP FUNCTION IF EXISTS public.update_onboarding_step;
DROP FUNCTION IF EXISTS public.complete_onboarding;

-- Drop the policies - only if they exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can view their own onboarding status'
  ) THEN
    DROP POLICY "Users can view their own onboarding status" ON profiles;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can update their own onboarding status'
  ) THEN
    DROP POLICY "Users can update their own onboarding status" ON profiles;
  END IF;
END
$$; 