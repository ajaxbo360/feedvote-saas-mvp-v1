# Task 1: Add `onboarding_status` JSONB Column to Profiles Table

## Overview

Add a JSONB column to the profiles table to store the user's onboarding progress and status.

## Requirements

- The column should be named `onboarding_status`
- Default value should be a JSON object with `completed: false` and an empty `steps` object
- Must be properly typed as JSONB for efficient querying and updates

## Technical Details

### SQL Migration

```sql
-- Add onboarding_status column to profiles table
ALTER TABLE profiles
ADD COLUMN onboarding_status JSONB DEFAULT '{"completed": false, "steps": {}}';
```

### Sample Data Structure

The column will store data in this format:

```json
{
  "completed": false,
  "current_step": "welcome",
  "steps": {
    "welcome": {
      "completed": true,
      "completed_at": "2023-08-01T12:00:00Z"
    },
    "create_project": {
      "completed": false,
      "started_at": "2023-08-01T12:01:00Z"
    }
  }
}
```

### TypeScript Type Definition

```typescript
// Add this to your types.ts file
export interface OnboardingStatus {
  completed: boolean;
  current_step: string | null;
  steps: {
    [key: string]: {
      completed: boolean;
      completed_at?: string;
      started_at?: string;
      metadata?: Record<string, any>;
    };
  };
}

// Update your Profile interface
export interface Profile {
  id: string;
  // existing fields...
  onboarding_status: OnboardingStatus;
}
```

## Testing

After applying the migration, verify the column was added correctly:

```sql
-- Check column exists with correct type and default value
SELECT
  column_name,
  data_type,
  column_default
FROM
  information_schema.columns
WHERE
  table_name = 'profiles' AND
  column_name = 'onboarding_status';
```

## Acceptance Criteria

- [x] SQL migration successfully adds the column
- [ ] Default value is correctly set for all existing profiles
- [ ] Column is properly typed as JSONB
- [ ] TypeScript type definition is added to the codebase

## Dependencies

- None (this is the first task)

## Estimated Time

15-30 minutes
