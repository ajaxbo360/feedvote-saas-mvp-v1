-- Migration to delete problematic users and their related data
-- This migration will delete users that can't be deleted through the dashboard

-- First, delete any onboarding events related to the users
DELETE FROM public.onboarding_events 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email LIKE 'ajakak.brahim0@gmail.com'  -- Update this with your actual user criteria
);

-- Then, delete any profile data
DELETE FROM public.profiles 
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email LIKE 'ajakak.brahim0@gmail.com'  -- Update this with your actual user criteria
);

-- Finally, delete the users
-- Note: This requires elevated permissions
DELETE FROM auth.users 
WHERE email LIKE 'ajakak.brahim0@gmail.com';  -- Update this with your actual user criteria

-- Alternatively, we can mark users as deleted without actually removing them
-- UPDATE auth.users 
-- SET is_sso_user = false, 
--     email = 'deleted_' || email,
--     raw_app_meta_data = raw_app_meta_data || '{"deleted": true}'::jsonb
-- WHERE email LIKE '%@gmail.com'; -- Update this with your actual user criteria 