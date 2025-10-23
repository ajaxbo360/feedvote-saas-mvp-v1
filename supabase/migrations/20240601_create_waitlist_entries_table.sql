-- 20240601_create_waitlist_entries_table.sql

CREATE TYPE waitlist_status AS ENUM ('pending', 'approved', 'invited');

CREATE TABLE IF NOT EXISTS public.waitlist_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    status waitlist_status NOT NULL DEFAULT 'pending',
    signed_up BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invited_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Optional: Index for faster lookups by email
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_email ON public.waitlist_entries(email);

-- Optional: Index for status queries
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_status ON public.waitlist_entries(status);