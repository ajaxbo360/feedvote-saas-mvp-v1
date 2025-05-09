import { Inter } from 'next/font/google';
import './globals.css';
import '../styles/layout.css';
import '../styles/theme-fixes.css';
import '../styles/home-page.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ui/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | FeedFeature - Build Trust Through User Feedback',
    default: 'FeedFeature - Build Trust Through User Feedback',
  },
  description:
    'Collect and manage user feedback, build trust, and showcase your product improvements. FeedFeature helps SaaS companies respond to user needs faster.',
  keywords: [
    'user feedback',
    'customer feedback',
    'product feedback',
    'feature requests',
    'SaaS feedback',
    'user trust',
    'product management',
  ],
  authors: [{ name: 'FeedFeature Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://feedfeature.com',
    siteName: 'FeedFeature',
    title: 'FeedFeature - Build Trust Through User Feedback',
    description:
      'Collect and manage user feedback, build trust, and showcase your product improvements. FeedFeature helps SaaS companies respond to user needs faster.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FeedFeature - User Feedback Management Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FeedFeature - Build Trust Through User Feedback',
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
        <link rel="canonical" href="https://feedfeature.com" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
