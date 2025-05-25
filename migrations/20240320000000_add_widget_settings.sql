-- Add widget_settings column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS widget_settings jsonb DEFAULT jsonb_build_object(
  'primaryColor', '#2dd4bf',
  'secondaryColor', '#ff6f61',
  'position', 'bottom-right',
  'theme', 'light',
  'buttonText', 'Give Feedback',
  'customClass', '',
  'userParameters', jsonb_build_object(
    'userId', jsonb_build_object('enabled', false, 'required', false),
    'userEmail', jsonb_build_object('enabled', false, 'required', false),
    'userName', jsonb_build_object('enabled', false, 'required', false),
    'imgUrl', jsonb_build_object('enabled', false, 'required', false),
    'userSpend', jsonb_build_object('enabled', false, 'required', false)
  ),
  'allowAnonymous', true,
  'whitelistedDomains', '[]'::jsonb,
  'enableAnalytics', true,
  'trackEvents', jsonb_build_object(
    'load', true,
    'open', true,
    'submit', true,
    'error', true
  )
);

-- Create function to validate widget settings
CREATE OR REPLACE FUNCTION validate_widget_settings()
RETURNS trigger AS $$
BEGIN
  -- Validate required fields
  IF NOT (NEW.widget_settings ? 'primaryColor' AND 
          NEW.widget_settings ? 'secondaryColor' AND 
          NEW.widget_settings ? 'position' AND 
          NEW.widget_settings ? 'theme' AND 
          NEW.widget_settings ? 'buttonText' AND 
          NEW.widget_settings ? 'userParameters' AND 
          NEW.widget_settings ? 'allowAnonymous' AND 
          NEW.widget_settings ? 'whitelistedDomains' AND 
          NEW.widget_settings ? 'enableAnalytics' AND 
          NEW.widget_settings ? 'trackEvents') THEN
    RAISE EXCEPTION 'Invalid widget settings structure';
  END IF;

  -- Validate position values
  IF NOT (NEW.widget_settings->>'position' IN ('bottom-right', 'bottom-left', 'top-right', 'top-left')) THEN
    RAISE EXCEPTION 'Invalid widget position';
  END IF;

  -- Validate theme values
  IF NOT (NEW.widget_settings->>'theme' IN ('light', 'dark')) THEN
    RAISE EXCEPTION 'Invalid widget theme';
  END IF;

  -- Validate color formats (basic hex validation)
  IF NOT (NEW.widget_settings->>'primaryColor' ~ '^#[0-9a-fA-F]{6}$') THEN
    RAISE EXCEPTION 'Invalid primary color format';
  END IF;
  
  IF NOT (NEW.widget_settings->>'secondaryColor' ~ '^#[0-9a-fA-F]{6}$') THEN
    RAISE EXCEPTION 'Invalid secondary color format';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for widget settings validation
DROP TRIGGER IF EXISTS validate_widget_settings_trigger ON projects;
CREATE TRIGGER validate_widget_settings_trigger
  BEFORE INSERT OR UPDATE OF widget_settings
  ON projects
  FOR EACH ROW
  EXECUTE FUNCTION validate_widget_settings(); 