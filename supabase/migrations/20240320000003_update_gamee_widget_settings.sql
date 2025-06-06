-- Update widget settings for gamee project
UPDATE projects
SET widget_settings = jsonb_build_object(
  'primaryColor', '#2dd4bf',
  'secondaryColor', '#ff6f61',
  'position', 'bottom-right',
  'theme', 'light',
  'buttonText', 'Share Feedback',
  'customClass', '',
  'userParameters', jsonb_build_object(
    'userId', jsonb_build_object('enabled', true, 'required', false),
    'userEmail', jsonb_build_object('enabled', true, 'required', false),
    'userName', jsonb_build_object('enabled', true, 'required', false),
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
)
WHERE slug = 'gamee'; 