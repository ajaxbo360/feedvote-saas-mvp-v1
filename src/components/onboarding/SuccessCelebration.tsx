'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';

interface SuccessCelebrationProps {
  title?: string;
  message?: string;
  actionText?: string;
  duration?: number;
  onComplete?: () => void;
  onAction?: () => void;
}

/**
 * A celebration component that displays a success message with confetti effects
 *
 * Used to reward users for completing important actions like creating their first project
 * or completing the onboarding process.
 */
export const SuccessCelebration = ({
  title = 'Success!',
  message = "You've completed this step successfully.",
  actionText = 'Continue',
  duration = 4000,
  onComplete,
  onAction,
}: SuccessCelebrationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  // Trigger confetti animation on mount
  useEffect(() => {
    const triggerConfetti = () => {
      const canvas = document.createElement('canvas');
      canvas.style.position = 'fixed';
      canvas.style.inset = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.zIndex = '100';
      canvas.style.pointerEvents = 'none';
      document.body.appendChild(canvas);

      const myConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true,
      });

      // First burst
      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4ade80', '#22d3ee', '#60a5fa', '#818cf8'],
      });

      // Second burst after a short delay
      setTimeout(() => {
        myConfetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#4ade80', '#22d3ee', '#60a5fa', '#818cf8'],
        });
      }, 250);

      // Third burst from the other side
      setTimeout(() => {
        myConfetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#4ade80', '#22d3ee', '#60a5fa', '#818cf8'],
        });
      }, 400);

      // Clean up
      setTimeout(() => {
        document.body.removeChild(canvas);
      }, 3000);
    };

    triggerConfetti();

    // Auto-dismiss after specified duration
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete?.();
    }, 300); // Give time for exit animation to finish
  };

  const handleAction = () => {
    handleClose();
    onAction?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            {/* Success Icon */}
            <div className="flex justify-center pt-8">
              <div className="relative">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-600 dark:text-green-400"
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
                {/* Animated rings */}
                <div
                  className="absolute inset-0 rounded-full border-4 border-green-500/30 animate-ping"
                  style={{ animationDuration: '2s' }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pt-6 pb-8 text-center">
              <h3 className="text-2xl font-bold mb-2 dark:text-white">{title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>

              {/* Action button */}
              <Button
                onClick={handleAction}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                size="lg"
              >
                {actionText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
