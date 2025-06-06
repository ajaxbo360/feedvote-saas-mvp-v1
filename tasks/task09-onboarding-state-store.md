# Task 9: Create Zustand Store for Onboarding State

## Overview

Create a Zustand store to manage onboarding state across the application. This will ensure the onboarding experience only appears once per user and persists the user's progress.

## Requirements

- Store must track whether onboarding is completed
- Store must track the current onboarding step
- Store must persist state to Supabase when changes occur
- Store must load initial state from Supabase on initialization

## Technical Details

### File Structure

Create the file at:

```
src/stores/onboardingStore.ts
```

### Implementation

```typescript
// src/stores/onboardingStore.ts
import { create } from 'zustand';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { OnboardingStatus } from '@/types';

interface OnboardingState {
  // State
  isEnabled: boolean;
  isCompleted: boolean;
  currentStepId: string | null;
  steps: Record<
    string,
    {
      id: string;
      title: string;
      description: string;
      completed: boolean;
      position: number;
    }
  >;
  isLoading: boolean;

  // Actions
  initialize: () => Promise<void>;
  setStepCompleted: (stepId: string, metadata?: Record<string, any>) => Promise<void>;
  setCurrentStep: (stepId: string) => Promise<void>;
  skipOnboarding: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  // Initial state
  isEnabled: false,
  isCompleted: false,
  currentStepId: null,
  steps: {
    welcome: {
      id: 'welcome',
      title: 'Welcome to Feedvote',
      description: 'Get started with your first project',
      completed: false,
      position: 0,
    },
    create_project: {
      id: 'create_project',
      title: 'Create your first project',
      description: 'Set up a project to collect feedback',
      completed: false,
      position: 1,
    },
    dashboard_tour: {
      id: 'dashboard_tour',
      title: 'Explore your dashboard',
      description: 'Learn how to manage feedback',
      completed: false,
      position: 2,
    },
  },
  isLoading: true,

  // Actions
  initialize: async () => {
    const supabase = createClientComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      set({ isLoading: false, isEnabled: false });
      return;
    }

    // Load onboarding status from Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('onboarding_status, onboarding_completed_at')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error loading onboarding status:', error);
      set({ isLoading: false, isEnabled: false });
      return;
    }

    // If onboarding has been completed, don't show it again
    if (data.onboarding_completed_at) {
      set({
        isLoading: false,
        isEnabled: false,
        isCompleted: true,
      });
      return;
    }

    // If this is a first-time user, enable onboarding
    const onboardingStatus = (data.onboarding_status as OnboardingStatus) || {
      completed: false,
      current_step: 'welcome',
      steps: {},
    };

    // Update steps with completed status from DB
    const updatedSteps = { ...get().steps };
    Object.entries(onboardingStatus.steps || {}).forEach(([stepId, stepData]) => {
      if (updatedSteps[stepId]) {
        updatedSteps[stepId].completed = stepData.completed || false;
      }
    });

    set({
      isLoading: false,
      isEnabled: !onboardingStatus.completed,
      isCompleted: onboardingStatus.completed,
      currentStepId: onboardingStatus.current_step || 'welcome',
      steps: updatedSteps,
    });
  },

  setStepCompleted: async (stepId, metadata = {}) => {
    const supabase = createClientComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Update local state
    const updatedSteps = { ...get().steps };
    if (updatedSteps[stepId]) {
      updatedSteps[stepId].completed = true;
    }

    set({ steps: updatedSteps });

    // Update in Supabase
    await supabase.rpc('update_onboarding_step', {
      step_id: stepId,
      completed: true,
      metadata,
    });

    // Find the next incomplete step
    const nextStep = Object.values(updatedSteps)
      .filter((step) => !step.completed)
      .sort((a, b) => a.position - b.position)[0];

    if (nextStep) {
      get().setCurrentStep(nextStep.id);
    } else {
      get().completeOnboarding();
    }
  },

  setCurrentStep: async (stepId) => {
    const supabase = createClientComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    set({ currentStepId: stepId });

    // Update current step in Supabase
    const { data: profile } = await supabase.from('profiles').select('onboarding_status').eq('id', user.id).single();

    if (!profile) return;

    const onboardingStatus = profile.onboarding_status || { completed: false, steps: {} };
    onboardingStatus.current_step = stepId;

    await supabase
      .from('profiles')
      .update({
        onboarding_status: onboardingStatus,
        onboarding_started_at: new Date().toISOString(),
      })
      .eq('id', user.id);
  },

  skipOnboarding: async () => {
    const supabase = createClientComponentClient();

    set({ isEnabled: false });

    // Mark as skipped in Supabase but don't mark as completed
    // This way we can potentially re-enable it later
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from('profiles')
      .update({
        onboarding_status: {
          ...get().steps,
          completed: false,
          skipped: true,
        },
      })
      .eq('id', user.id);
  },

  completeOnboarding: async () => {
    const supabase = createClientComponentClient();

    set({
      isEnabled: false,
      isCompleted: true,
    });

    // Mark as completed in Supabase
    await supabase.rpc('complete_onboarding');
  },
}));
```

### Type Definitions

Ensure you have the following type definition in your types file:

```typescript
// src/types.ts or similar
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
  skipped?: boolean;
}
```

## Usage Example

```typescript
// In a component
import { useEffect } from 'react';
import { useOnboardingStore } from '@/stores/onboardingStore';

export function MyComponent() {
  const { initialize, isEnabled, currentStepId, setStepCompleted } = useOnboardingStore();

  // Initialize on component mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Example of marking a step as completed
  const handleCompleteStep = () => {
    if (currentStepId) {
      setStepCompleted(currentStepId);
    }
  };

  return (
    <div>
      {isEnabled && currentStepId === 'welcome' && (
        <div>
          <h2>Welcome Step UI</h2>
          <button onClick={handleCompleteStep}>Next</button>
        </div>
      )}
    </div>
  );
}
```

## Testing

- Test the store initializes correctly for new users
- Test the store loads previously saved state for returning users
- Test onboarding doesn't appear for users who have completed it
- Test step completion updates correctly in both local state and Supabase
- Test completing all steps marks onboarding as complete

## Acceptance Criteria

- [ ] Store successfully loads and saves state to/from Supabase
- [ ] Onboarding only shows for users who haven't completed it
- [ ] Step completion is properly tracked
- [ ] Onboarding can be skipped
- [ ] Onboarding completion is permanently stored

## Dependencies

- Zustand npm package (`npm install zustand`)
- Requires database functions from Task 6-7 to be implemented
- Requires Supabase client configuration

## Estimated Time

90-120 minutes
