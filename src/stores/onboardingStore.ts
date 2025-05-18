'use client';

import { create } from 'zustand';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { OnboardingStepConfig } from '@/types/onboarding';

interface StepStatus {
  completed: boolean;
  metadata?: Record<string, any>;
}

interface OnboardingStateData {
  completed: boolean;
  current_step: string;
  steps: Record<string, StepStatus>;
}

interface OnboardingState {
  // State
  isEnabled: boolean;
  isCompleted: boolean;
  currentStepId: string | null;
  steps: Record<string, OnboardingStepConfig>;
  isLoading: boolean;

  // Actions
  initialize: () => Promise<void>;
  setEnabled: (enabled: boolean) => void;
  setStepCompleted: (stepId: string, metadata?: Record<string, any>) => Promise<void>;
  setCurrentStep: (stepId: string) => Promise<void>;
  skipOnboarding: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

/**
 * Zustand store for managing onboarding state
 *
 * Handles both local state management and persistence to Supabase
 */
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
    console.log('[OnboardingStore] 🚀 Starting initialization...');

    try {
      // Check localStorage first for any forced/persistent state
      if (typeof window !== 'undefined') {
        const forcedState = localStorage.getItem('onboarding-state');
        if (forcedState) {
          try {
            const parsedState = JSON.parse(forcedState);
            console.log('[OnboardingStore] 📌 Found state in localStorage:', parsedState);

            set({
              isLoading: false,
              isEnabled: parsedState.isEnabled,
              isCompleted: parsedState.isCompleted,
              currentStepId: parsedState.currentStepId,
              steps: parsedState.steps || get().steps,
            });

            return;
          } catch (e) {
            console.error('[OnboardingStore] ❌ Error parsing localStorage state:', e);
          }
        }
      }

      // Try to get user session
      const supabase = createClientComponentClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        console.log('[OnboardingStore] ℹ️ No authenticated user, using default state');
        set({
          isLoading: false,
          isEnabled: false,
          isCompleted: false,
          currentStepId: 'welcome',
        });
        return;
      }

      // Load onboarding status from Supabase
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_status, onboarding_completed_at')
        .eq('id', session.user.id)
        .single();

      if (profile?.onboarding_completed_at) {
        console.log('[OnboardingStore] ✓ Onboarding previously completed');
        set({
          isLoading: false,
          isEnabled: false,
          isCompleted: true,
        });
        return;
      }

      // Use profile status or default state
      const status =
        profile?.onboarding_status ||
        ({
          completed: false,
          current_step: 'welcome',
          steps: {},
        } as OnboardingStateData);

      // Update steps with completed status from DB
      const updatedSteps = { ...get().steps };
      Object.entries((status.steps || {}) as Record<string, StepStatus>).forEach(([stepId, stepData]) => {
        if (updatedSteps[stepId]) {
          updatedSteps[stepId].completed = stepData.completed || false;
        }
      });

      set({
        isLoading: false,
        isEnabled: !status.completed,
        isCompleted: status.completed,
        currentStepId: status.current_step || 'welcome',
        steps: updatedSteps,
      });

      console.log('[OnboardingStore] ✅ Initialization complete');
    } catch (error) {
      console.error('[OnboardingStore] ❌ Error in initialization:', error);
      // Set safe defaults on error
      set({
        isLoading: false,
        isEnabled: false,
        currentStepId: 'welcome',
      });
    }
  },

  setEnabled: (enabled: boolean) => {
    set({ isEnabled: enabled });
  },

  setStepCompleted: async (stepId, metadata = {}) => {
    const supabase = createClientComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Update local state
    const updatedSteps = { ...get().steps };
    if (updatedSteps[stepId]) {
      updatedSteps[stepId].completed = true;
    }

    set({ steps: updatedSteps });

    // If this was from a persistent forced state in localStorage, update it
    if (typeof window !== 'undefined') {
      const forcedState = localStorage.getItem('onboarding-state');
      if (forcedState) {
        try {
          const parsedState = JSON.parse(forcedState);
          if (parsedState.persistent) {
            console.log('[OnboardingStore] 📌 Updating persistent state with completed step:', stepId);
            const updatedParsedSteps = { ...parsedState.steps };
            if (updatedParsedSteps[stepId]) {
              updatedParsedSteps[stepId].completed = true;
            }

            localStorage.setItem(
              'onboarding-state',
              JSON.stringify({
                ...parsedState,
                steps: updatedParsedSteps,
              }),
            );
          }
        } catch (e) {
          console.error('[OnboardingStore] ❌ Error updating persistent state:', e);
        }
      }
    }

    if (!user) return;

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
    console.log('[OnboardingStore] Setting current step:', stepId);

    const supabase = createClientComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Always update local state immediately
    set({ currentStepId: stepId });

    // If this is the welcome step, we should also enable onboarding
    if (stepId === 'welcome') {
      set({ isEnabled: true });
    }

    if (!user) {
      console.log('[OnboardingStore] No user found, skipping Supabase update');
      return;
    }

    try {
      // Update current step in Supabase
      const { data: profile } = await supabase.from('profiles').select('onboarding_status').eq('id', user.id).single();

      if (!profile) {
        console.log('[OnboardingStore] No profile found, creating new one');
        await supabase.from('profiles').insert({
          id: user.id,
          onboarding_status: {
            completed: false,
            current_step: stepId,
            steps: {},
          },
          onboarding_started_at: new Date().toISOString(),
        });
        return;
      }

      const onboardingStatus = profile.onboarding_status || { completed: false, steps: {} };
      onboardingStatus.current_step = stepId;

      await supabase
        .from('profiles')
        .update({
          onboarding_status: onboardingStatus,
          onboarding_started_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      console.log('[OnboardingStore] Successfully updated current step in Supabase');
    } catch (error) {
      console.error('[OnboardingStore] Error updating current step:', error);
    }
  },

  skipOnboarding: async () => {
    const supabase = createClientComponentClient();

    set({ isEnabled: false });

    // Clean up persistent state if it exists
    if (typeof window !== 'undefined') {
      const forcedState = localStorage.getItem('onboarding-state');
      if (forcedState) {
        try {
          const parsedState = JSON.parse(forcedState);
          if (parsedState.persistent) {
            console.log('[OnboardingStore] 🧹 Removing persistent state from localStorage');
            localStorage.removeItem('onboarding-state');
          }
        } catch (e) {
          console.error('[OnboardingStore] ❌ Error cleaning up persistent state:', e);
        }
      }
    }

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

    // Clean up persistent state if it exists
    if (typeof window !== 'undefined') {
      const forcedState = localStorage.getItem('onboarding-state');
      if (forcedState) {
        try {
          const parsedState = JSON.parse(forcedState);
          if (parsedState.persistent) {
            console.log('[OnboardingStore] 🧹 Removing persistent state from localStorage');
            localStorage.removeItem('onboarding-state');
          }
        } catch (e) {
          console.error('[OnboardingStore] ❌ Error cleaning up persistent state:', e);
        }
      }
    }

    try {
      // Mark as completed in Supabase
      const { error } = await supabase.rpc('complete_onboarding');

      if (error) {
        console.error('[OnboardingStore] ❌ Error completing onboarding via RPC:', error);

        // Fallback: Try to update the profile directly
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const now = new Date().toISOString();
          await supabase
            .from('profiles')
            .update({
              onboarding_completed_at: now,
              onboarding_status: {
                completed: true,
                current_step: 'completed',
                completed_at: now,
              },
            })
            .eq('id', user.id);

          console.log('[OnboardingStore] ✅ Onboarding completed via direct profile update');
        }
      } else {
        console.log('[OnboardingStore] ✅ Onboarding completed successfully via RPC');
      }
    } catch (err) {
      console.error('[OnboardingStore] 💥 Error in completeOnboarding:', err);
    }
  },
}));
