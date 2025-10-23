-- API Keys Migration Script
-- Create project_api_keys table and associated functions for FeedVote widget integration

-- Create API keys table
CREATE TABLE IF NOT EXISTS public.project_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  key_type TEXT NOT NULL CHECK (key_type IN ('public', 'secret', 'mobile')),
  key_value TEXT NOT NULL UNIQUE,
  name TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for efficient lookups
CREATE INDEX idx_api_keys_project_id ON public.project_api_keys(project_id);
CREATE INDEX idx_api_keys_key_value ON public.project_api_keys(key_value);
CREATE INDEX idx_api_keys_key_type ON public.project_api_keys(key_type);

-- Function to generate random API keys with prefixes based on type
CREATE OR REPLACE FUNCTION generate_api_key(key_type TEXT)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  random_part TEXT;
BEGIN
  -- Set prefix based on key type
  CASE key_type
    WHEN 'public' THEN prefix := 'pub_';
    WHEN 'secret' THEN prefix := 'sec_';
    WHEN 'mobile' THEN prefix := 'mob_';
    ELSE prefix := 'key_';
  END CASE;
  
  -- Generate random alphanumeric string (48 chars)
  random_part := encode(gen_random_bytes(24), 'hex');
  
  RETURN prefix || random_part;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically generate key_value if not provided
CREATE OR REPLACE FUNCTION set_api_key_value()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.key_value IS NULL THEN
    NEW.key_value := generate_api_key(NEW.key_type);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER project_api_keys_before_insert
  BEFORE INSERT ON public.project_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION set_api_key_value();

-- Set up Row Level Security (RLS)
ALTER TABLE public.project_api_keys ENABLE ROW LEVEL SECURITY;

-- Project owners can view their API keys
CREATE POLICY "Project owners can view their API keys"
  ON public.project_api_keys FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_api_keys.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Project owners can create API keys
CREATE POLICY "Project owners can create API keys"
  ON public.project_api_keys FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_api_keys.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Project owners can update API keys
CREATE POLICY "Project owners can update API keys"
  ON public.project_api_keys FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_api_keys.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Project owners can delete API keys
CREATE POLICY "Project owners can delete API keys"
  ON public.project_api_keys FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_api_keys.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Function to create default API keys for a project
CREATE OR REPLACE FUNCTION create_default_api_keys(project_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Create public API key
  INSERT INTO public.project_api_keys (project_id, key_type, name, description)
  VALUES (
    project_id, 
    'public', 
    'Default Public Key', 
    'Default public API key for widget integration'
  );
  
  -- Create secret API key
  INSERT INTO public.project_api_keys (project_id, key_type, name, description)
  VALUES (
    project_id, 
    'secret', 
    'Default Secret Key', 
    'Default secret API key for server-side operations'
  );
  
  -- Create mobile API key
  INSERT INTO public.project_api_keys (project_id, key_type, name, description)
  VALUES (
    project_id, 
    'mobile', 
    'Default Mobile Key', 
    'Default mobile API key for mobile app integration'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create default API keys for new projects
CREATE OR REPLACE FUNCTION create_default_api_keys_trigger()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_default_api_keys(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_after_insert
  AFTER INSERT ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION create_default_api_keys_trigger();

-- Generate API keys for existing projects
DO $$
DECLARE
  project_record RECORD;
BEGIN
  FOR project_record IN SELECT id FROM public.projects LOOP
    -- Check if keys already exist for this project
    IF NOT EXISTS (SELECT 1 FROM public.project_api_keys WHERE project_id = project_record.id) THEN
      PERFORM create_default_api_keys(project_record.id);
    END IF;
  END LOOP;
END;
$$; 