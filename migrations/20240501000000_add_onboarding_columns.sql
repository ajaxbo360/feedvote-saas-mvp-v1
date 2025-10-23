-- migrate:up
-- Add onboarding_status column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_status JSONB DEFAULT '{"completed": false, "steps": {}}';

-- Add timestamp columns for tracking onboarding process
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- migrate:down
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS onboarding_status,
DROP COLUMN IF EXISTS onboarding_started_at,
DROP COLUMN IF EXISTS onboarding_completed_at; 