import { Metadata } from 'next';
import { LandingPage } from '@/components/home/landing-page';

export const metadata: Metadata = {
  title: 'FeedVote - Build Trust Through User Feedback',
  description:
    'Collect and manage user feedback, build trust, and showcase your product improvements. FeedVote helps SaaS companies respond to user needs faster.',
  alternates: {
    canonical: 'https://FeedVote.com',
  },
  openGraph: {
    type: 'website',
    url: 'https://FeedVote.com',
    title: 'FeedVote - User Feedback Management Platform',
    description:
      'Transform user feedback into product growth with FeedVote. Collect, manage, and showcase your product improvements.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FeedVote Dashboard',
      },
    ],
  },
};

// Enhanced JSON-LD Schema for better SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'FeedVote',
      description: 'User feedback management platform for SaaS companies',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free forever for the first 1000 customers',
        availability: 'https://schema.org/InStock',
        url: 'https://FeedVote.com/pricing',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1000',
        bestRating: '5',
        worstRating: '1',
      },
      featureList: ['User feedback collection', 'Feature voting system', 'Trust badges', 'Leaderboard ranking'],
      screenshot: 'https://FeedVote.com/assets/screenshots/dashboard.jpg',
    },
    {
      '@type': 'Organization',
      name: 'FeedVote',
      url: 'https://FeedVote.com',
      logo: 'https://FeedVote.com/logo.png',
      sameAs: ['https://twitter.com/FeedVote', 'https://linkedin.com/company/FeedVote'],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'support@FeedVote.com',
        availableLanguage: ['English'],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is FeedVote free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, FeedVote offers a free plan with all core features. Premium plans are available for additional features and higher usage limits.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the leaderboard work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our leaderboard ranks products based on how well they respond to user feedback. We measure response time, implementation rate of requested features, and user satisfaction with those implementations.',
          },
        },
      ],
    },
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: 'Sarah Chen',
      },
      reviewBody:
        'FeedVote helped us build exactly what our users wanted. Our customer satisfaction increased by 47% in just 3 months.',
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingPage />
    </>
  );
}
