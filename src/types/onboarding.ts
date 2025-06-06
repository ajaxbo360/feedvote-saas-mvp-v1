/**
 * Onboarding related type definitions
 */

/**
 * Structure for an individual onboarding step in the JSONB column
 */
export interface OnboardingStep {
  completed: boolean;
  completed_at?: string;
  started_at?: string;
  metadata?: Record<string, any>;
}

/**
 * Top-level structure for the onboarding_status JSONB column
 */
export interface OnboardingStatus {
  completed: boolean;
  current_step: string | null;
  steps: Record<string, OnboardingStep>;
  skipped?: boolean;
}

/**
 * Step configuration with UI-related properties
 */
export interface OnboardingStepConfig {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  position: number;
}

/**
 * Onboarding event as stored in the onboarding_events table
 */
export interface OnboardingEvent {
  id: string;
  user_id: string;
  event_type: 'step_completed' | 'onboarding_completed' | 'onboarding_skipped';
  step_id: string;
  metadata: Record<string, any>;
  created_at: string;
}

/**
 * Extension to the Profile interface to include onboarding fields
 */
export interface ProfileWithOnboarding {
  id: string;
  // ... other profile fields
  onboarding_status: OnboardingStatus;
  onboarding_started_at: string | null;
  onboarding_completed_at: string | null;
}

/**
 * Parameters for the update_onboarding_step function
 */
export interface UpdateOnboardingStepParams {
  step_id: string;
  completed: boolean;
  metadata?: Record<string, any>;
}

/**
 * Return type from the onboarding functions
 */
export interface OnboardingActionResult {
  success: boolean;
  data?: OnboardingStatus;
  error?: string;
}
