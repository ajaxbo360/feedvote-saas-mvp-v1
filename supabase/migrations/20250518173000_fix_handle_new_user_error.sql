-- Fix the handle_new_user function to handle errors properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- First insert the user profile without trying to add events
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
  
  -- We'll use a safer approach by removing the onboarding_events insertion
  -- from this trigger function since it's causing problems
  
  -- The onboarding events can be created on first login instead
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 