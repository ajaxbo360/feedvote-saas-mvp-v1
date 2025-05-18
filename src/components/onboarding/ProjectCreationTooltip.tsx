'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowSize } from '@/hooks/useWindowSize';

interface ProjectCreationTooltipProps {
  targetSelector: string;
  onComplete?: () => void;
  onSkip?: () => void;
}

/**
 * A tooltip component that highlights the project creation button
 * and guides users to create their first project.
 *
 * It automatically positions itself near the target element
 * and includes animations for entrance and exit.
 */
export const ProjectCreationTooltip = ({ targetSelector, onComplete, onSkip }: ProjectCreationTooltipProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { width: windowWidth } = useWindowSize();

  // Calculate position relative to target element
  useEffect(() => {
    const calculatePosition = () => {
      const targetElement = document.querySelector(targetSelector) as HTMLElement;

      if (!targetElement || !tooltipRef.current) return;

      const targetRect = targetElement.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      // Position the tooltip above the target element
      let top = targetRect.top - tooltipRect.height - 12;
      let left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;

      // Keep tooltip within viewport bounds
      if (left < 20) left = 20;
      if (left + tooltipRect.width > windowWidth - 20) {
        left = windowWidth - tooltipRect.width - 20;
      }

      // If tooltip would appear above viewport, place it below the target
      if (top < 20) {
        top = targetRect.bottom + 12;
      }

      setPosition({ top, left });
    };

    // Calculate initial position after a short delay to allow DOM to be ready
    const timer = setTimeout(() => {
      calculatePosition();
      setIsVisible(true);
    }, 500);

    // Recalculate on window resize
    window.addEventListener('resize', calculatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [targetSelector, windowWidth]);

  // Animation variants
  const tooltipVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  const handleSkip = () => {
    setIsVisible(false);
    onSkip?.();
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          className="fixed z-50 w-64 bg-card text-card-foreground rounded-lg shadow-lg border border-border p-4"
          style={{
            top: position.top,
            left: position.left,
          }}
          variants={tooltipVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Tooltip arrow */}
          <div className="absolute w-4 h-4 bg-card border-l border-t border-border transform rotate-45 -bottom-2 left-1/2 -translate-x-1/2" />

          {/* Content */}
          <div className="text-center">
            <h4 className="font-semibold text-foreground text-base mb-2">Create your first project</h4>
            <p className="text-muted-foreground text-sm mb-4">Click here to set up your first feedback board</p>

            {/* Actions */}
            <div className="flex justify-between">
              <motion.button
                onClick={handleSkip}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Skip
              </motion.button>
              <motion.button
                onClick={handleComplete}
                className="text-xs bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-3 py-1 rounded"
                whileHover={{ scale: 1.05, boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                Got it
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
