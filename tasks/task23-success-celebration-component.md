# Task 23: Build SuccessCelebration Component

## Overview

Create an animated success celebration component that appears after a user completes their first project creation. This component will provide visual feedback, celebrate the milestone, and guide the user to their next step.

## Requirements

- Component should overlay the entire screen
- Should include confetti animation effect
- Should display a success message and next steps
- Should auto-dismiss after a short period
- Should have a manual dismiss option
- Should provide clear navigation to the dashboard

## Technical Details

### File Structure

Create the file at:

```
src/components/onboarding/SuccessCelebration.tsx
```

### Dependencies

Install the required packages:

```bash
npm install react-confetti framer-motion
```

### Component Implementation

```tsx
// src/components/onboarding/SuccessCelebration.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/useWindowSize';
import { Button } from '@/components/ui/button';

interface SuccessCelebrationProps {
  projectName: string;
  projectSlug: string;
  onComplete: () => void;
}

export const SuccessCelebration = ({ projectName, projectSlug, onComplete }: SuccessCelebrationProps) => {
  const [isActive, setIsActive] = useState(true);
  const { width, height } = useWindowSize();

  // Auto-dismiss after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(false);
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Handle manual dismiss
  const handleContinue = () => {
    setIsActive(false);
    onComplete();
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.15}
        colors={['#2dd4bf', '#0ea5e9', '#8b5cf6', '#f43f5e', '#f59e0b']}
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        className="bg-white rounded-lg p-8 max-w-md text-center shadow-xl"
      >
        <div className="bg-teal-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-teal-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold mb-2">🎉 Project Created Successfully!</h2>

        <p className="text-gray-600 mb-4">
          <span className="font-semibold text-teal-600">{projectName}</span> is now ready for feedback. Let's explore
          your new dashboard.
        </p>

        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <p className="text-sm text-gray-500 mb-2">Your public feedback board is available at:</p>
          <p className="text-sm font-mono bg-white p-2 rounded border border-gray-200">
            feedvote.com/app/{projectSlug}/board
          </p>
        </div>

        <Button
          onClick={handleContinue}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-md w-full"
        >
          Continue to Dashboard
        </Button>
      </motion.div>
    </div>
  );
};
```

### Window Size Hook

Create a custom hook for tracking window dimensions:

```tsx
// src/hooks/useWindowSize.ts
import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Initial size
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
```

### Usage Example

```tsx
// Example usage in the CreateProjectModal component
import { useState } from 'react';
import { SuccessCelebration } from '@/components/onboarding/SuccessCelebration';
import { useRouter } from 'next/navigation';

export const CreateProjectModal = () => {
  const router = useRouter();
  const [showCelebration, setShowCelebration] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectSlug, setProjectSlug] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Project creation logic...

    // Show celebration on success
    setShowCelebration(true);
  };

  return (
    <>
      {/* Modal content with form */}

      {showCelebration && (
        <SuccessCelebration
          projectName={projectName}
          projectSlug={projectSlug}
          onComplete={() => {
            router.push(`/app/${projectSlug}/home`);
          }}
        />
      )}
    </>
  );
};
```

## Testing

- Test the component appears correctly after project creation
- Test the confetti animation renders properly
- Test the auto-dismiss timer works
- Test the manual Continue button works
- Test project information is displayed correctly

## Accessibility Considerations

- Ensure the component is keyboard navigable
- Provide a way to dismiss for users who may find animations distracting
- Ensure text contrast meets WCAG standards
- Consider reduced motion preferences by checking `prefers-reduced-motion` media query

## Acceptance Criteria

- [ ] Component displays a celebratory animation with confetti
- [ ] Component shows the project name and board URL
- [ ] Component auto-dismisses after 5 seconds
- [ ] Component has a manual "Continue to Dashboard" button
- [ ] Component redirects to the dashboard when complete
- [ ] Animation is smooth and doesn't cause performance issues

## Dependencies

- Framer Motion for animations (`npm install framer-motion`)
- React Confetti for celebration effect (`npm install react-confetti`)
- UI components from component library (Button)
- Custom useWindowSize hook

## Estimated Time

60-90 minutes
