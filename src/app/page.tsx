import { Metadata } from 'next';
import { LandingPage } from '@/components/home/landing-page';

export const metadata: Metadata = {
  title: 'FeedFeature - Build Trust Through User Feedback',
  description:
    'Collect and manage user feedback, build trust, and showcase your product improvements. FeedFeature helps SaaS companies respond to user needs faster.',
  alternates: {
    canonical: 'https://feedfeature.com',
  },
  openGraph: {
    type: 'website',
    url: 'https://feedfeature.com',
    title: 'FeedFeature - User Feedback Management Platform',
    description:
      'Transform user feedback into product growth with FeedFeature. Collect, manage, and showcase your product improvements.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FeedFeature Dashboard',
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
      name: 'FeedFeature',
      description: 'User feedback management platform for SaaS companies',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free forever for the first 1000 customers',
        availability: 'https://schema.org/InStock',
        url: 'https://feedfeature.com/pricing',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1000',
        bestRating: '5',
        worstRating: '1',
      },
      featureList: ['User feedback collection', 'Feature voting system', 'Trust badges', 'Leaderboard ranking'],
      screenshot: 'https://feedfeature.com/assets/screenshots/dashboard.jpg',
    },
    {
      '@type': 'Organization',
      name: 'FeedFeature',
      url: 'https://feedfeature.com',
      logo: 'https://feedfeature.com/logo.png',
      sameAs: ['https://twitter.com/feedfeature', 'https://linkedin.com/company/feedfeature'],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'support@feedfeature.com',
        availableLanguage: ['English'],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is FeedFeature free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, FeedFeature offers a free plan with all core features. Premium plans are available for additional features and higher usage limits.',
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
        'FeedFeature helped us build exactly what our users wanted. Our customer satisfaction increased by 47% in just 3 months.',
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
