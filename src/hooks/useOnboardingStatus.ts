import { useState, useEffect } from 'react';
import { onboardingService } from '@/services/onboardingService';
import { OnboardingStatus } from '@/types/onboarding';

interface UseOnboardingStatusResult {
  status: OnboardingStatus | null;
  isCompleted: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and monitor onboarding status from Supabase
 *
 * @returns The current onboarding status, loading state, and refetch function
 *
 * @example
 * ```tsx
 * const { status, isCompleted, isLoading } = useOnboardingStatus();
 *
 * if (isLoading) return <LoadingSpinner />;
 *
 * return (
 *   <div>
 *     {!isCompleted && status?.current_step === 'welcome' && (
 *       <WelcomeModal />
 *     )}
 *   </div>
 * );
 * ```
 */
export const useOnboardingStatus = (): UseOnboardingStatusResult => {
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setIsLoading(true);

    try {
      const result = await onboardingService.getOnboardingStatus();

      setStatus(result.status);
      setIsCompleted(result.completed);
      setError(result.error || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch onboarding status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return {
    status,
    isCompleted,
    isLoading,
    error,
    refetch: fetchStatus,
  };
};
