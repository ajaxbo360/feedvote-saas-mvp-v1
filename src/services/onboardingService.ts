import { createClient } from '@/utils/supabase/client';
import { OnboardingStatus, UpdateOnboardingStepParams, OnboardingActionResult } from '@/types/onboarding';

/**
 * Service for interacting with onboarding-related database functions
 */
export const onboardingService = {
  /**
   * Updates a specific onboarding step's status
   *
   * @param stepId The ID of the step to update
   * @param completed Whether the step is completed
   * @param metadata Optional metadata to store with the step
   * @returns Result of the operation
   */
  async updateStep(stepId: string, completed: boolean, metadata = {}): Promise<OnboardingActionResult> {
    const supabase = createClient();

    try {
      const { data, error } = await supabase.rpc('update_onboarding_step', {
        step_id: stepId,
        completed,
        metadata,
      } as UpdateOnboardingStepParams);

      if (error) {
        console.error('Error updating onboarding step:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data as OnboardingStatus };
    } catch (error) {
      console.error('Error updating onboarding step:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  /**
   * Marks the onboarding process as complete
   *
   * @returns Result of the operation
   */
  async completeOnboarding(): Promise<OnboardingActionResult> {
    const supabase = createClient();

    try {
      const { data, error } = await supabase.rpc('complete_onboarding');

      if (error) {
        console.error('Error completing onboarding:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  /**
   * Fetches the onboarding status for the current user
   *
   * @returns The onboarding status
   */
  async getOnboardingStatus(): Promise<{
    status: OnboardingStatus | null;
    completed: boolean;
    error?: string;
  }> {
    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { status: null, completed: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_status, onboarding_completed_at')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching onboarding status:', error);
        return { status: null, completed: false, error: error.message };
      }

      return {
        status: data.onboarding_status as OnboardingStatus,
        completed: !!data.onboarding_completed_at,
      };
    } catch (error) {
      console.error('Error fetching onboarding status:', error);
      return {
        status: null,
        completed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
};
