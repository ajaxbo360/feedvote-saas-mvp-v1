'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

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

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-card text-card-foreground rounded-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden border border-border"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
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
            <div className="px-6 pt-4 pb-8 text-center">
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-muted-foreground mb-6">{message}</p>

              {/* Action button */}
              <motion.button
                onClick={handleAction}
                className="px-5 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-md transition-colors shadow-md"
                whileHover={{ scale: 1.05, boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)' }}
                whileTap={{ scale: 0.98 }}
              >
                {actionText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
