'use client';

import { DashboardPageHeader } from '@/components/dashboard/layout/dashboard-page-header';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';
import { useEffect, useState } from 'react';

// Mock data - in a real app, this would come from an API call
const mockLeaderboardEntries = [
  {
    id: '1',
    rank: 1,
    productName: 'Product One',
    productSlug: 'product-one',
    logoUrl: '/assets/icons/logo/aeroedit-logo-icon.svg',
    websiteUrl: 'https://example.com/product-one',
    score: 1250,
    feedbackCount: 87,
    testimonialCount: 42,
    badgeCount: 8,
  },
  {
    id: '2',
    rank: 2,
    productName: 'Product Two',
    productSlug: 'product-two',
    logoUrl: '/assets/icons/logo/aeroedit-logo-icon.svg',
    websiteUrl: 'https://example.com/product-two',
    score: 980,
    feedbackCount: 64,
    testimonialCount: 31,
    badgeCount: 6,
  },
  {
    id: '3',
    rank: 3,
    productName: 'Product Three',
    productSlug: 'product-three',
    logoUrl: '/assets/icons/logo/aeroedit-logo-icon.svg',
    websiteUrl: 'https://example.com/product-three',
    score: 820,
    feedbackCount: 52,
    testimonialCount: 28,
    badgeCount: 5,
  },
  {
    id: '4',
    rank: 4,
    productName: 'Product Four',
    productSlug: 'product-four',
    logoUrl: '/assets/icons/logo/aeroedit-logo-icon.svg',
    websiteUrl: 'https://example.com/product-four',
    score: 750,
    feedbackCount: 48,
    testimonialCount: 22,
    badgeCount: 4,
  },
  {
    id: '5',
    rank: 5,
    productName: 'Product Five',
    productSlug: 'product-five',
    logoUrl: '/assets/icons/logo/aeroedit-logo-icon.svg',
    websiteUrl: 'https://example.com/product-five',
    score: 680,
    feedbackCount: 41,
    testimonialCount: 19,
    badgeCount: 3,
  },
];

// Interface for leaderboard entries
interface LeaderboardEntry {
  id: string;
  rank: number;
  productName: string;
  productSlug: string;
  logoUrl: string;
  websiteUrl: string;
  score: number;
  feedbackCount: number;
  testimonialCount: number;
  badgeCount: number;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEntries(mockLeaderboardEntries);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
      <DashboardPageHeader pageTitle={'Leaderboard'} />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse">Loading leaderboard data...</div>
        </div>
      ) : (
        <Leaderboard entries={entries} />
      )}
    </main>
  );
}
