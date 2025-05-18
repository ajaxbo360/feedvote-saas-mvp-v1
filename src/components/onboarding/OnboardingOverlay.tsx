'use client';

import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useOnboarding } from '@/providers/OnboardingProvider';
import { WelcomeModal } from './WelcomeModal';
import { ProjectCreationTooltip } from './ProjectCreationTooltip';
import { SuccessCelebration } from './SuccessCelebration';
import { useTheme } from 'next-themes';

interface OnboardingContextType {
  currentStepId: string | null;
  setStepCompleted: (stepId: string, metadata?: Record<string, any>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  setCurrentStep: (stepId: string) => Promise<void>;
}

interface SuccessMessageType {
  title: string;
  message: string;
  actionText: string;
  projectName?: string;
  projectSlug?: string;
}

/**
 * The OnboardingOverlay component is responsible for managing the
 * visibility of different onboarding components based on the current step.
 *
 * It manages both modals and guided tours using Joyride.
 */
export const OnboardingOverlay = () => {
  const { currentStepId, setStepCompleted, completeOnboarding, setCurrentStep } =
    useOnboarding() as OnboardingContextType;
  const [joyrideSteps, setJoyrideSteps] = useState<Step[]>([]);
  const [runJoyride, setRunJoyride] = useState(false);
  const [showSuccessCelebration, setShowSuccessCelebration] = useState(false);
  const [successMessage, setSuccessMessage] = useState<SuccessMessageType>({
    title: 'Success!',
    message: "You've completed this step successfully.",
    actionText: 'Continue',
  });
  const { theme } = useTheme();

  // Log current step for debugging
  useEffect(() => {
    console.log('[OnboardingOverlay] Current step:', currentStepId);
  }, [currentStepId]);

  // Handle success celebration when project is created
  useEffect(() => {
    if (currentStepId === 'dashboard_tour') {
      console.log('[OnboardingOverlay] 🎉 Showing success celebration');
      setShowSuccessCelebration(true);
      setSuccessMessage({
        title: 'Project Created Successfully! 🎉',
        message: "Great job! You've created your first project. Now let's explore your dashboard.",
        actionText: 'Got it',
      });
    }
  }, [currentStepId]);

  // Determine which component to show based on current step
  const renderCurrentStep = () => {
    console.log('[OnboardingOverlay] Rendering step:', currentStepId);

    switch (currentStepId) {
      case 'welcome':
        return (
          <WelcomeModal
            onStart={async () => {
              await setStepCompleted('welcome');
              await setCurrentStep('create_project');
            }}
            onSkip={async () => {
              await setStepCompleted('welcome');
              await completeOnboarding();
            }}
          />
        );

      case 'create_project':
        return (
          <ProjectCreationTooltip
            targetSelector=".create-project-button"
            onComplete={async () => {
              // Just open the create project modal
              const createProjectButton = document.querySelector('.create-project-button') as HTMLElement;
              createProjectButton?.click();
            }}
            onSkip={async () => {
              await setStepCompleted('create_project');
              await completeOnboarding();
            }}
          />
        );

      case 'dashboard_tour':
        // Will be handled by Joyride tour
        return null;

      default:
        console.log('[OnboardingOverlay] Unknown step:', currentStepId);
        return null;
    }
  };

  // Configure and start Joyride tour when needed
  useEffect(() => {
    if (currentStepId === 'dashboard_tour') {
      // Define dashboard tour steps - these will be expanded in future tasks
      setJoyrideSteps([
        {
          target: '.dashboard-header',
          content: 'This is your project dashboard where you can manage all feedback.',
          disableBeacon: true,
        },
        {
          target: '.kanban-board',
          content: 'Your feedback is organized in a Kanban board with different status columns.',
          disableBeacon: true,
        },
      ]);

      setRunJoyride(true);
    } else {
      setRunJoyride(false);
    }
  }, [currentStepId]);

  // Handle Joyride callbacks
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index } = data;

    if (type === 'step:after' && index === joyrideSteps.length - 1) {
      setStepCompleted('dashboard_tour');
      completeOnboarding();
    }

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunJoyride(false);
      completeOnboarding();
    }
  };

  // Handle success celebration completion
  const handleSuccessCelebrationComplete = async () => {
    console.log('[OnboardingOverlay] 🎯 Success celebration complete, transitioning to welcome');
    setShowSuccessCelebration(false);
    // Add a small delay before showing welcome modal
    setTimeout(async () => {
      await setCurrentStep('welcome');
    }, 100);
  };

  return (
    <>
      {renderCurrentStep()}

      {showSuccessCelebration && (
        <SuccessCelebration
          title={successMessage.title}
          message={successMessage.message}
          actionText={successMessage.actionText}
          onComplete={handleSuccessCelebrationComplete}
          onAction={handleSuccessCelebrationComplete}
          duration={0} // Disable auto-dismiss
        />
      )}

      {runJoyride && (
        <Joyride
          steps={joyrideSteps}
          continuous
          showProgress
          showSkipButton
          callback={handleJoyrideCallback}
          styles={{
            options: {
              primaryColor: theme === 'dark' ? '#2dd4bf' : '#0ea5e9',
              textColor: theme === 'dark' ? '#ffffff' : '#1f2937',
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            },
          }}
        />
      )}
    </>
  );
};
