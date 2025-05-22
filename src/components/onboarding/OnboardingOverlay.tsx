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
  // Store the current project info for metadata
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  // Log current step for debugging
  useEffect(() => {
    console.log('[OnboardingOverlay] Current step:', currentStepId);
  }, [currentStepId]);

  // Extract project ID from URL if available
  useEffect(() => {
    // Try to get project ID from URL or localStorage
    const extractProjectIdFromUrl = () => {
      try {
        const path = window.location.pathname;
        const match = path.match(/\/app\/([^\/]+)/);
        if (match && match[1]) {
          console.log('[OnboardingOverlay] 🔍 Found project slug in URL:', match[1]);
          // Get project ID from local storage if available
          const projectsJson = localStorage.getItem('recent-projects');
          if (projectsJson) {
            const projects = JSON.parse(projectsJson);
            const project = projects.find((p: any) => p.slug === match[1]);
            if (project) {
              console.log('[OnboardingOverlay] 🔍 Found project ID:', project.id);
              setCurrentProjectId(project.id);
              return project.id;
            }
          }
        }
        return null;
      } catch (e) {
        console.error('[OnboardingOverlay] Error extracting project ID:', e);
        return null;
      }
    };

    extractProjectIdFromUrl();
  }, []);

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

  // Handle view project home success celebration
  useEffect(() => {
    if (currentStepId === 'view_project_home') {
      console.log('[OnboardingOverlay] 🏠 Prompting to view project home');

      // If there's a View Home button on the page, add a visual indicator
      const viewHomeButtons = document.querySelectorAll('[data-onboarding="view-home-button"]');
      if (viewHomeButtons.length > 0) {
        viewHomeButtons.forEach((button) => {
          button.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
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
              await setStepCompleted('welcome', { timestamp: new Date().toISOString() });
              await setCurrentStep('create_project');
            }}
            onSkip={async () => {
              await setStepCompleted('welcome', { skipped: true, timestamp: new Date().toISOString() });
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
              await setStepCompleted('create_project', { skipped: true, timestamp: new Date().toISOString() });
              await completeOnboarding();
            }}
          />
        );

      case 'dashboard_tour':
        // Will be handled by Joyride tour
        return null;

      case 'view_project_home':
        // Create a tooltip highlighting the View Home button
        return (
          <ProjectCreationTooltip
            targetSelector="[data-onboarding='view-home-button']"
            title="View Your Project"
            description="Click to view your project's home page and see what your users will experience."
            onComplete={async () => {
              // The click will be handled by the button itself
              // Mark as completed here as well to ensure it works
              const metadata = {
                project_id: currentProjectId,
                action: 'clicked_got_it',
                timestamp: new Date().toISOString(),
              };
              await setStepCompleted('view_project_home', metadata);
              await completeOnboarding();
            }}
            onSkip={async () => {
              await setStepCompleted('view_project_home', {
                project_id: currentProjectId,
                skipped: true,
                timestamp: new Date().toISOString(),
              });
              await completeOnboarding();
            }}
          />
        );

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
        // Removed the View Home step from here to avoid duplication
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
      setStepCompleted('dashboard_tour', {
        project_id: currentProjectId,
        completed_via: 'joyride_tour',
        timestamp: new Date().toISOString(),
      });
      // Instead of completing, move to the view_project_home step
      setCurrentStep('view_project_home');
    }

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunJoyride(false);
      // If skipped, complete onboarding
      if (status === STATUS.SKIPPED) {
        setStepCompleted('dashboard_tour', {
          project_id: currentProjectId,
          skipped: true,
          timestamp: new Date().toISOString(),
        });
        completeOnboarding();
      } else {
        // Move to view_project_home step with proper metadata
        setStepCompleted('dashboard_tour', {
          project_id: currentProjectId,
          completed_via: 'joyride_tour',
          timestamp: new Date().toISOString(),
        });
        setCurrentStep('view_project_home');
      }
    }
  };

  // Handle success celebration completion
  const handleSuccessCelebrationComplete = async () => {
    console.log('[OnboardingOverlay] 🎯 Success celebration complete, starting dashboard tour');
    setShowSuccessCelebration(false);

    // Start the dashboard tour immediately if we have a dashboard tour step
    if (currentStepId === 'dashboard_tour') {
      setTimeout(async () => {
        setRunJoyride(true);
      }, 100);
    } else {
      // Skip to view_project_home if there's no dashboard to tour
      await setStepCompleted('dashboard_tour', {
        project_id: currentProjectId,
        skipped: true,
        auto_advanced: true,
        timestamp: new Date().toISOString(),
      });
      await setCurrentStep('view_project_home');
    }
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
          duration={0} // Set duration to 0 to disable auto-dismiss
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
