'use client';

import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useOnboarding } from '@/providers/OnboardingProvider';
import { WelcomeModal } from './WelcomeModal';
import { ProjectCreationTooltip } from './ProjectCreationTooltip';
import { SuccessCelebration } from './SuccessCelebration';
import { useTheme } from 'next-themes';

/**
 * The OnboardingOverlay component is responsible for managing the
 * visibility of different onboarding components based on the current step.
 *
 * It manages both modals and guided tours using Joyride.
 */
export const OnboardingOverlay = () => {
  const { currentStepId, setStepCompleted, completeOnboarding } = useOnboarding();
  const [joyrideSteps, setJoyrideSteps] = useState<Step[]>([]);
  const [runJoyride, setRunJoyride] = useState(false);
  const [showSuccessCelebration, setShowSuccessCelebration] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: 'Success!',
    message: "You've completed this step successfully.",
    actionText: 'Continue',
  });
  const { theme } = useTheme();

  // Determine which component to show based on current step
  const renderCurrentStep = () => {
    switch (currentStepId) {
      case 'welcome':
        return <WelcomeModal onStart={() => setStepCompleted('welcome')} onSkip={() => setStepCompleted('welcome')} />;

      case 'create_project':
        return (
          <ProjectCreationTooltip
            targetSelector=".create-project-button"
            onComplete={() => {
              setStepCompleted('create_project');
              setSuccessMessage({
                title: 'Project Created!',
                message: "Great job! You've created your first project. Now let's explore your dashboard.",
                actionText: 'Continue to Dashboard',
              });
              setShowSuccessCelebration(true);
            }}
            onSkip={() => setStepCompleted('create_project')}
          />
        );

      case 'dashboard_tour':
        // Will be handled by Joyride tour
        return null;

      default:
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
    const { status } = data;

    // Check if tour is finished or skipped
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunJoyride(false);
      setStepCompleted('dashboard_tour');

      // Show completion celebration when all steps are done
      setSuccessMessage({
        title: 'Onboarding Complete!',
        message: "You're all set up and ready to start collecting feedback with Feedvote.",
        actionText: 'Get Started',
      });
      setShowSuccessCelebration(true);
    }
  };

  const handleOnboardingComplete = () => {
    completeOnboarding();
  };

  return (
    <>
      {/* Render the appropriate component for the current step */}
      {renderCurrentStep()}

      {/* Success celebration for completing steps */}
      {showSuccessCelebration && (
        <SuccessCelebration
          title={successMessage.title}
          message={successMessage.message}
          actionText={successMessage.actionText}
          onComplete={handleOnboardingComplete}
          onAction={handleOnboardingComplete}
        />
      )}

      {/* Joyride tour */}
      <Joyride
        run={runJoyride}
        steps={joyrideSteps}
        continuous
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: theme === 'dark' ? '#4ade80' : '#16a34a',
            textColor: theme === 'dark' ? '#f8fafc' : '#0f172a',
            backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
            arrowColor: theme === 'dark' ? '#0f172a' : '#ffffff',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
          },
          tooltip: {
            fontSize: '14px',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          },
          buttonNext: {
            backgroundColor: theme === 'dark' ? '#4ade80' : '#16a34a',
            fontSize: '14px',
            padding: '8px 16px',
          },
          buttonBack: {
            color: theme === 'dark' ? '#f8fafc' : '#0f172a',
            marginRight: '8px',
          },
          buttonSkip: {
            color: theme === 'dark' ? '#f8fafc' : '#0f172a',
          },
        }}
      />
    </>
  );
};
