'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectCreationTooltipProps {
  targetSelector: string;
  onComplete?: () => Promise<void>;
  onSkip?: () => Promise<void>;
}

/**
 * A tooltip component that highlights the project creation button
 * and guides users to create their first project.
 *
 * It automatically positions itself near the target element
 * and includes animations for entrance and exit.
 */
export const ProjectCreationTooltip = ({ targetSelector, onComplete, onSkip }: ProjectCreationTooltipProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = () => {
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const tooltipHeight = 120; // Approximate height of tooltip
        const spacing = 16; // Space between tooltip and target

        setPosition({
          top: window.scrollY + rect.top - tooltipHeight - spacing,
          left: rect.left + rect.width / 2,
          width: rect.width,
        });

        // Add highlight effect to the card with a pulsing animation
        targetElement.classList.add(
          'ring-2',
          'ring-teal-500',
          'ring-offset-2',
          'ring-offset-background',
          'animate-pulse',
        );

        // Show tooltip after a small delay to ensure smooth animation
        setTimeout(() => setIsVisible(true), 100);
      }
    };

    // Initial position
    updatePosition();

    // Update position on resize and scroll
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        targetElement.classList.remove(
          'ring-2',
          'ring-teal-500',
          'ring-offset-2',
          'ring-offset-background',
          'animate-pulse',
        );
      }
    };
  }, [targetSelector]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="fixed z-50 transform -translate-x-1/2"
        style={{ top: position.top, left: position.left }}
      >
        <div className="bg-popover text-popover-foreground p-4 rounded-lg shadow-lg max-w-xs">
          <div className="text-sm font-medium mb-2">Create your first project</div>
          <p className="text-sm text-muted-foreground mb-4">Click here to set up your first feedback board</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => onSkip?.()}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip
            </button>
            <button
              onClick={() => onComplete?.()}
              className="text-sm bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-3 py-1 rounded-md"
            >
              Got it
            </button>
          </div>
        </div>
        <div className="w-3 h-3 bg-popover rotate-45 absolute left-1/2 -bottom-1.5 -translate-x-1/2" />
      </motion.div>
    </AnimatePresence>
  );
};
