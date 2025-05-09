'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LeaderboardPopup } from './leaderboard-popup';

export function LeaderboardButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Show the button after scrolling down a bit
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard shortcut (L key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'l') {
        setIsPopupOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {isVisible && (
        <div
          className="select-none max-lg:hidden z-[99] fixed top-6 right-6 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900/70 px-4 py-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 duration-200 cursor-pointer text-gray-700 dark:text-gray-200"
          onClick={() => setIsPopupOpen(true)}
        >
          Press
          <span className="font-bold bg-white dark:bg-gray-800 px-2.5 py-1.5 rounded border border-gray-200 dark:border-gray-700 font-mono mx-1 capitalize text-gray-900 dark:text-gray-100">
            l
          </span>
          to see the Leaderboards
        </div>
      )}
      <LeaderboardPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </>
  );
}
