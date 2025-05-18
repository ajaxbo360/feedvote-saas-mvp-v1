'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useOnboarding } from '@/providers/OnboardingProvider';
import { motion } from 'framer-motion';

interface WelcomeModalProps {
  onStart?: () => void;
  onSkip?: () => void;
}

interface OnboardingContextType {
  setStepCompleted: (stepId: string, metadata?: Record<string, any>) => Promise<void>;
  skipOnboarding: () => Promise<void>;
  setCurrentStep: (stepId: string) => Promise<void>;
}

/**
 * Welcome modal shown to first-time users
 *
 * This modal introduces users to the key features of Feedvote
 * and provides options to start the onboarding process or skip it.
 * It includes animations and respects the user's theme preference.
 */
export const WelcomeModal = ({ onStart, onSkip }: WelcomeModalProps) => {
  const { setStepCompleted, skipOnboarding, setCurrentStep } = useOnboarding() as OnboardingContextType;
  const [isOpen, setIsOpen] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const handleStart = async () => {
    if (hasStarted) return;
    setHasStarted(true);

    try {
      // First mark the welcome step as completed
      await setStepCompleted('welcome', {
        action: 'started',
        timestamp: new Date().toISOString(),
      });

      // Then transition to the next step
      await setCurrentStep('create_project');

      setIsOpen(false);
      onStart?.();
    } catch (error) {
      console.error('[WelcomeModal] Error starting onboarding:', error);
      setHasStarted(false);
    }
  };

  const handleSkip = async () => {
    try {
      await skipOnboarding();
      setIsOpen(false);
      onSkip?.();
    } catch (error) {
      console.error('[WelcomeModal] Error skipping onboarding:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Welcome to Feedvote! 👋</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Let's get you set up with your first project in just a few steps.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3">
              <div className="bg-teal-100 dark:bg-teal-900/30 p-2 rounded-full text-teal-600 dark:text-teal-400">
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
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create a public voting board for your product or feature ideas
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-teal-100 dark:bg-teal-900/30 p-2 rounded-full text-teal-600 dark:text-teal-400">
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
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Track feedback status with Open, In Progress, and Done columns
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-teal-100 dark:bg-teal-900/30 p-2 rounded-full text-teal-600 dark:text-teal-400">
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
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Embed the feedback board on your website or share via link
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2 justify-end">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              Skip for now
            </button>
            <button
              onClick={handleStart}
              disabled={hasStarted}
              className={`px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-md transition-colors ${
                hasStarted ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {hasStarted ? 'Starting...' : "Let's get started"}
            </button>
          </DialogFooter>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
};
