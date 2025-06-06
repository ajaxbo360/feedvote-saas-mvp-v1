-- Add description column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing projects to have a default description
UPDATE projects SET description = 'No description provided.' WHERE description IS NULL;
