# Task 14: Build WelcomeModal Component UI

## Overview

Create the initial welcome modal component that will be shown to first-time users when they log in. This modal provides a friendly introduction to Feedvote and sets expectations for the onboarding process.

## Requirements

- Modal should appear centered on screen with a clean, modern design
- Should include a title, description, and action buttons
- Must be dismissible
- Should work on both mobile and desktop viewports
- Use Framer Motion for subtle animations (to be added in a later task)

## Technical Details

### Component Structure

Create the file at:

```
src/components/onboarding/WelcomeModal.tsx
```

### Component Implementation

```tsx
// src/components/onboarding/WelcomeModal.tsx
import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface WelcomeModalProps {
  onStart: () => void;
  onSkip: () => void;
}

export const WelcomeModal = ({ onStart, onSkip }: WelcomeModalProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleStart = () => {
    setIsOpen(false);
    onStart();
  };

  const handleSkip = () => {
    setIsOpen(false);
    onSkip();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content className="sm:max-w-md">
        <Dialog.Header>
          <Dialog.Title className="text-2xl">Welcome to Feedvote! 👋</Dialog.Title>
          <Dialog.Description className="text-gray-600">
            Let's get you set up with your first project in just a few steps.
          </Dialog.Description>
        </Dialog.Header>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3">
            <div className="bg-teal-100 p-2 rounded-full text-teal-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium">Collect feedback from users</h4>
              <p className="text-sm text-gray-500">Create a public voting board for your product or feature ideas</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-teal-100 p-2 rounded-full text-teal-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium">Prioritize with a kanban board</h4>
              <p className="text-sm text-gray-500">Track feedback status with Open, In Progress, and Done columns</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-teal-100 p-2 rounded-full text-teal-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium">Share with your audience</h4>
              <p className="text-sm text-gray-500">Embed the feedback board on your website or share via link</p>
            </div>
          </div>
        </div>

        <Dialog.Footer className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleSkip}>
            Skip for now
          </Button>
          <Button onClick={handleStart} className="bg-teal-500 hover:bg-teal-600">
            Let's get started
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
```

### Usage Example

```tsx
// Example usage in a page component
import { WelcomeModal } from '@/components/onboarding/WelcomeModal';

export default function ProjectsPage() {
  const handleStart = () => {
    console.log('User wants to start onboarding');
    // Logic to start the onboarding process
  };

  const handleSkip = () => {
    console.log('User wants to skip onboarding');
    // Logic to skip the onboarding process
  };

  return (
    <div>
      {/* Page content */}
      <WelcomeModal onStart={handleStart} onSkip={handleSkip} />
    </div>
  );
}
```

## Testing

- Test the modal appears correctly on page load
- Test the modal is dismissible
- Test the "Let's get started" button calls the onStart callback
- Test the "Skip for now" button calls the onSkip callback
- Test the component renders properly on mobile devices

## Acceptance Criteria

- [ ] Modal has clean, user-friendly appearance
- [ ] Modal includes title, description, value proposition points
- [ ] Modal has "Skip for now" and "Let's get started" buttons
- [ ] Modal is dismissible via ESC key or clicking outside
- [ ] Modal is responsive on different screen sizes

## Dependencies

- Requires UI components from component library (Dialog, Button)
- SVG icons for value proposition points

## Estimated Time

45-60 minutes
