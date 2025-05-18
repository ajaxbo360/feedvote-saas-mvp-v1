import { Inter } from 'next/font/google';
import './globals.css';
import '../styles/layout.css';
import '../styles/theme-fixes.css';
import '../styles/home-page.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { OnboardingProvider } from '@/providers/OnboardingProvider';

const inter = Inter({ subsets: ['latin'] });

// Dynamically set the base URL based on environment
const getBaseUrl = () => {
  // Check for environment variables
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Fallback to environment-specific defaults
  if (process.env.NODE_ENV === 'production') {
    // Check for Vercel environment to determine if staging or production
    return process.env.VERCEL_ENV === 'preview' ? 'https://staging.feedvote.com' : 'https://feedvote.com';
  }

  // Local development
  return 'http://localhost:3000';
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    template: '%s | FeedVote - Build Trust Through User Feedback',
    default: 'FeedVote - Build Trust Through User Feedback',
  },
  description:
    'Collect and manage user feedback, build trust, and showcase your product improvements. FeedVote helps SaaS companies respond to user needs faster.',
  keywords: [
    'user feedback',
    'customer feedback',
    'product feedback',
    'feature requests',
    'SaaS feedback',
    'user trust',
    'product management',
  ],
  authors: [{ name: 'FeedVote Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: getBaseUrl(),
    siteName: 'FeedVote',
    title: 'FeedVote - Build Trust Through User Feedback',
    description:
      'Collect and manage user feedback, build trust, and showcase your product improvements. FeedVote helps SaaS companies respond to user needs faster.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FeedVote - User Feedback Management Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FeedVote - Build Trust Through User Feedback',
    description: 'Collect and manage user feedback, build trust, and showcase your product improvements.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={getBaseUrl()} />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <OnboardingProvider>{children}</OnboardingProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
