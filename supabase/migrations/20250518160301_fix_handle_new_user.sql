-- Update handle_new_user function to initialize the onboarding_status field
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    avatar_url, 
    email,
    onboarding_status,
    onboarding_started_at
  )
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url', 
    new.email,
    '{"completed": false, "steps": {}}',
    NOW()
  );
  
  -- Also record the onboarding start event
  INSERT INTO onboarding_events (user_id, event_type, step_id, metadata)
  VALUES (new.id, 'onboarding_started', 'initial', '{}');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 