'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { OnboardingOverlay } from '@/components/onboarding/OnboardingOverlay';
import { createClient } from '@/utils/supabase/client';

// The context will provide the same interface as the store
type OnboardingContextType = ReturnType<typeof useOnboardingStore>;

// Create the context with null as initial value
const OnboardingContext = createContext<OnboardingContextType | null>(null);

interface OnboardingProviderProps {
  children: ReactNode;
}

/**
 * Provider component that makes onboarding state available to any child component
 * that calls the useOnboarding hook.
 *
 * Also renders the OnboardingOverlay when onboarding is active.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <OnboardingProvider>
 *       <YourApp />
 *     </OnboardingProvider>
 *   );
 * }
 * ```
 */
export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  const onboardingState = useOnboardingStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Single initialization effect
  useEffect(() => {
    const initializeOnboarding = async () => {
      console.log('[OnboardingProvider] 🚀 Initializing onboarding...');

      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // Initialize onboarding state regardless of auth status
        await onboardingState.initialize();

        // If we have a session and this is a new user, enable onboarding
        if (session?.user) {
          const { data: projects } = await supabase
            .from('projects')
            .select('id')
            .eq('user_id', session.user.id)
            .limit(1);

          const isNewUser = !projects || projects.length === 0;

          if (isNewUser && !onboardingState.isCompleted) {
            console.log('[OnboardingProvider] 🆕 New user detected, enabling onboarding');
            onboardingState.setEnabled(true);
            onboardingState.setCurrentStep('welcome');
          }
        }
      } catch (error) {
        console.error('[OnboardingProvider] ❌ Error initializing:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeOnboarding();
  }, []); // Run once on mount

  // Only render overlay when initialized and enabled
  return (
    <OnboardingContext.Provider value={onboardingState}>
      {children}
      {isInitialized && onboardingState.isEnabled && !onboardingState.isLoading && <OnboardingOverlay />}
    </OnboardingContext.Provider>
  );
};

/**
 * Hook to access the onboarding context
 *
 * @returns The onboarding context
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { currentStepId, setStepCompleted } = useOnboarding();
 *
 *   return (
 *     <div>
 *       {currentStepId === 'welcome' && (
 *         <button onClick={() => setStepCompleted('welcome')}>
 *           Complete Welcome Step
 *         </button>
 *       )}
 *     </div>
 *   );
 * };
 * ```
 */
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }

  return context;
};
