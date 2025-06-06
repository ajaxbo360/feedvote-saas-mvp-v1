# Onboarding Component Structure

## Core Components

### 1. OnboardingProvider

```typescript
// src/providers/OnboardingProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { createStore } from 'zustand';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  position: number;
}

interface OnboardingState {
  isEnabled: boolean;
  isCompleted: boolean;
  currentStepId: string | null;
  steps: Record<string, OnboardingStep>;
  setStepCompleted: (stepId: string) => void;
  setCurrentStep: (stepId: string) => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingState | null>(null);

export const OnboardingProvider = ({ children }) => {
  // Implementation details here

  return (
    <OnboardingContext.Provider value={onboardingState}>
      {children}
      {onboardingState.isEnabled && !onboardingState.isCompleted && (
        <OnboardingOverlay />
      )}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
```

### 2. OnboardingOverlay

```typescript
// src/components/onboarding/OnboardingOverlay.tsx
import { useOnboarding } from '@/providers/OnboardingProvider';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { useState, useEffect } from 'react';

export const OnboardingOverlay = () => {
  const { steps, currentStepId, setStepCompleted, completeOnboarding } = useOnboarding();
  const [tourSteps, setTourSteps] = useState([]);

  // Convert steps to Joyride format
  useEffect(() => {
    // Implementation
  }, [steps, currentStepId]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, type } = data;

    if (type === 'step:after' && steps[index]) {
      setStepCompleted(steps[index].id);
    }

    if (status === STATUS.FINISHED) {
      completeOnboarding();
    }
  };

  return (
    <Joyride
      steps={tourSteps}
      callback={handleJoyrideCallback}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: {
          primaryColor: '#2dd4bf',
        },
      }}
    />
  );
};
```

### 3. WelcomeModal

```typescript
// src/components/onboarding/WelcomeModal.tsx
import { useOnboarding } from '@/providers/OnboardingProvider';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export const WelcomeModal = () => {
  const { setCurrentStep, skipOnboarding } = useOnboarding();
  const [isOpen, setIsOpen] = useState(true);

  const handleStart = () => {
    setIsOpen(false);
    setCurrentStep('create_project');
  };

  const handleSkip = () => {
    setIsOpen(false);
    skipOnboarding();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Dialog.Content className="sm:max-w-md">
          <Dialog.Header>
            <Dialog.Title>Welcome to Feedvote! 👋</Dialog.Title>
            <Dialog.Description>
              Let's get you set up with your first project in just a few steps.
            </Dialog.Description>
          </Dialog.Header>

          <div className="space-y-4 py-4">
            {/* Value proposition points */}
          </div>

          <Dialog.Footer>
            <Button variant="outline" onClick={handleSkip}>
              Skip for now
            </Button>
            <Button onClick={handleStart}>
              Let's get started
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </motion.div>
    </Dialog>
  );
};
```

### 4. ProjectCreationTooltip

```typescript
// src/components/onboarding/ProjectCreationTooltip.tsx
import { useOnboarding } from '@/providers/OnboardingProvider';
import { motion } from 'framer-motion';

export const ProjectCreationTooltip = () => {
  const { currentStepId } = useOnboarding();

  if (currentStepId !== 'create_project') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute top-[calc(100%+8px)] right-0 bg-white rounded-md shadow-lg p-4 w-64 z-50"
    >
      <div className="font-medium text-sm mb-2">Create your first project</div>
      <p className="text-sm text-gray-500">
        Click here to create a new project and start collecting feedback.
      </p>
    </motion.div>
  );
};
```

### 5. SuccessCelebration

```typescript
// src/components/onboarding/SuccessCelebration.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/useWindowSize';

export const SuccessCelebration = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(true);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(false);
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={500}
      />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        className="bg-white rounded-lg p-8 max-w-md text-center"
      >
        <h2 className="text-2xl font-bold mb-4">
          🎉 Project Created Successfully!
        </h2>
        <p className="text-gray-600 mb-6">
          Your project is ready to go. Let's explore your new dashboard.
        </p>
        <button
          onClick={() => {
            setIsActive(false);
            onComplete();
          }}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-md"
        >
          Continue to Dashboard
        </button>
      </motion.div>
    </div>
  );
};
```

## Integration Points

### 1. Projects Page Integration

```typescript
// src/app/projects/page.tsx
import { OnboardingProvider } from '@/providers/OnboardingProvider';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { WelcomeModal } from '@/components/onboarding/WelcomeModal';

export default function ProjectsPage() {
  return (
    <OnboardingProvider>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold text-teal-500 mb-2">Projects</h1>
        <p className="text-gray-600 mb-8">
          Each project has its own public voting board on Feedvote.
        </p>

        <ProjectsList />
        <WelcomeModal />
      </div>
    </OnboardingProvider>
  );
}
```

### 2. Project Creation Modal Integration

```typescript
// src/components/projects/CreateProjectModal.tsx
import { useOnboarding } from '@/providers/OnboardingProvider';
import { SuccessCelebration } from '@/components/onboarding/SuccessCelebration';

export const CreateProjectModal = ({ isOpen, onClose }) => {
  const { currentStepId, setStepCompleted } = useOnboarding();
  const [showCelebration, setShowCelebration] = useState(false);

  const handleSubmit = async (event) => {
    // Project creation logic

    // Onboarding integration
    if (currentStepId === 'create_project') {
      setStepCompleted('create_project');
      setShowCelebration(true);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        {/* Modal content */}
      </Dialog>

      {showCelebration && (
        <SuccessCelebration
          onComplete={() => {
            setShowCelebration(false);
            // Redirect to dashboard with tour
          }}
        />
      )}
    </>
  );
};
```

### 3. Dashboard Integration

```typescript
// src/app/[slug]/dashboard/page.tsx
import { useOnboarding } from '@/providers/OnboardingProvider';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { currentStepId, setCurrentStep } = useOnboarding();

  useEffect(() => {
    if (currentStepId === 'dashboard_tour') {
      setCurrentStep('dashboard_tour');
    }
  }, [currentStepId, setCurrentStep]);

  return (
    // Dashboard content
  );
}
```

## Hooks and Utilities

### 1. useOnboardingStatus

```typescript
// src/hooks/useOnboardingStatus.ts
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';

export const useOnboardingStatus = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [status, setStatus] = useState({
    isLoading: true,
    isCompleted: false,
    currentStep: null,
    steps: {},
  });

  useEffect(() => {
    if (!user) return;

    const fetchOnboardingStatus = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_status, onboarding_completed_at')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching onboarding status:', error);
        return;
      }

      setStatus({
        isLoading: false,
        isCompleted: !!data.onboarding_completed_at,
        currentStep: data.onboarding_status?.current_step || null,
        steps: data.onboarding_status?.steps || {},
      });
    };

    fetchOnboardingStatus();
  }, [supabase, user]);

  return status;
};
```

### 2. Onboarding API Service

```typescript
// src/services/onboardingService.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const onboardingService = {
  async updateStep(stepId: string, completed: boolean, metadata = {}) {
    const supabase = createClientComponentClient();

    const { data, error } = await supabase.rpc('update_onboarding_step', {
      step_id: stepId,
      completed,
      metadata,
    });

    if (error) {
      console.error('Error updating onboarding step:', error);
      throw error;
    }

    return data;
  },

  async completeOnboarding() {
    const supabase = createClientComponentClient();

    const { data, error } = await supabase.rpc('complete_onboarding');

    if (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }

    return data;
  },
};
```
