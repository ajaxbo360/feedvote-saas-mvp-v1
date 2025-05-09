'use client';

import { useState } from 'react';
import { BillingFrequency, IBillingFrequency } from '@/constants/billing-frequency';
import { Button } from '@/components/ui/button';
import { Check, Trophy, Star, Medal, Link2, BarChart2, Lock, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

// Define the pricing tiers for FeedFeature
interface PricingTier {
  name: string;
  id: string;
  monthlyPrice: string;
  annualPrice: string;
  originalMonthlyPrice?: string;
  originalAnnualPrice?: string;
  description: string;
  features: string[];
  earlyBirdOffer: string[];
  testimonial?: string;
  popular?: boolean;
  cta: string;
  ctaLink: string;
  addOns?: string[];
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    id: 'free',
    monthlyPrice: '$0',
    annualPrice: '$0',
    description: 'For indie makers and small SaaS teams testing feedback tools',
    features: [
      'Collect 100 votes/month on 1 public board to prioritize features effortlessly 🗳️',
      'Embed our widget to engage users in-app, no coding needed 🌐',
      'Share 1 user story to build trust with prospects ⭐',
      'Get listed on our leaderboard to attract early adopters 🏆',
    ],
    earlyBirdOffer: [
      'First 3 months: 200 votes/month, 2 testimonials to hook your users',
      'Refer 3 sign-ups, earn a "Community Leader" badge',
    ],
    cta: 'Start Voting Free',
    ctaLink: '/signup',
  },
  {
    name: 'Starter',
    id: 'starter',
    monthlyPrice: '$15',
    annualPrice: '$12',
    description: 'For bootstrap SaaS teams needing affordable prioritization and trust signals',
    features: [
      'Manage 500 votes/month across 3 boards (public/private) to align with user needs 🗳️',
      'Track vote trends to make data-driven decisions 📊',
      'Showcase 5 user stories to convert 20%+ more visitors ⭐',
      'Earn 1 badge (e.g., "Fast Responder") to stand out 🏅',
      'Rank higher on our leaderboard to drive organic sign-ups 🏆',
      'Connect with Slack for real-time updates 🔗',
    ],
    addOns: ['Need more votes? Add 200 for $5/month ➕'],
    earlyBirdOffer: [
      'First 500 users: 30% off first year ($10/month annually), plus a "Founder Badge"',
      'First 100 users: $149 one-time (80% savings vs. annual)',
      'Refer 3 sign-ups, get 1 month free',
    ],
    testimonial: 'Starter helped us prioritize our MVP in 2 weeks! – @IndieDev',
    popular: true,
    cta: 'Grow Your SaaS',
    ctaLink: '/checkout/starter',
  },
  {
    name: 'Pro',
    id: 'pro',
    monthlyPrice: '$39',
    annualPrice: '$31',
    description: 'For scaling SaaS teams with high feedback volume',
    features: [
      'Unlimited boards and votes to scale feedback without limits 🗳️',
      'Analyze sentiment and user segments to cut churn 📊',
      'Display 20 user stories to boost retention and referrals ⭐',
      'Earn 3 badges (e.g., "User Favorite") to dominate your niche 🏅',
      'Top-tier leaderboard ranking to increase sign-ups by 30%+ 🏆',
      'Sync with Zapier/Jira, enable SSO to save 10+ hours/month 🔗',
    ],
    addOns: ['Add premium support for $10/month, or 500 extra votes for $8/month ➕'],
    earlyBirdOffer: [
      'First 100 users: $299 one-time (80% savings vs. annual)',
      'First 500 users: 30% off first year ($27/month annually)',
      'Refer 3 sign-ups, get 1 month free',
    ],
    testimonial: 'Pro ranked us #1 on the leaderboard, doubling our sign-ups! – @SaaSGuru',
    cta: 'Rank Your SaaS',
    ctaLink: '/checkout/pro',
  },
  {
    name: 'Enterprise',
    id: 'enterprise',
    monthlyPrice: '$99+',
    annualPrice: '$99+',
    description: 'For large SaaS companies or enterprises',
    features: [
      'Unlimited feedback, badges, and top rankings for maximum impact 🗳️',
      'Integrate with internal tools to save dev costs 🔌',
      'Get personalized support to optimize feedback 👩‍💼',
      'Feature as a top SaaS to win enterprise clients 🏆',
      'Control permissions for secure feedback 🔒',
    ],
    earlyBirdOffer: [
      'First 50 enterprises: Free 1-month trial, plus a case study feature',
      'Refer 3 sign-ups, earn a "Community Leader" badge',
    ],
    testimonial: 'Enterprise streamlined feedback for our 50+ user team! – @BigSaaS',
    cta: 'Contact Sales',
    ctaLink: '/contact',
  },
];

export function FeedFeaturePricing() {
  const [frequency, setFrequency] = useState<IBillingFrequency>(BillingFrequency[0]);

  return (
    <section className="py-16 relative" id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
            Grow Your SaaS with User Votes & Trust Signals
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From free feedback to top leaderboard rankings, FeedFeature fits every bootstrap team.
            <span className="text-green-600 dark:text-green-400 font-medium">
              {' '}
              Early birds: Join the first 100 for lifetime access!
            </span>
          </p>

          <div className="mt-8">
            <Button className="gradient-button rounded-xl px-8 py-6 text-lg font-semibold shadow-md" asChild>
              <Link href="/signup">Start Voting Free</Link>
            </Button>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md p-1 bg-background/50 backdrop-blur-sm border border-border">
            {BillingFrequency.map((option) => (
              <button
                key={option.value}
                onClick={() => setFrequency(option)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  frequency.value === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {option.label}
                {option.value === 'year' && <span className="ml-1 text-xs text-green-500">Save ~20%</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingTiers.map((tier) => (
            <PricingCard key={tier.id} tier={tier} frequency={frequency} />
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-16 text-center">
          <p className="text-xl mb-4">
            <span className="text-green-500 font-medium">1,000+ founders</span> trust us on X
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="bg-background/50 backdrop-blur-sm border border-border rounded-lg px-6 py-4">
              <p className="font-medium">#1: TaskEasy – 600 votes</p>
            </div>
            <div className="bg-background/50 backdrop-blur-sm border border-border rounded-lg px-6 py-4">
              <p className="font-medium">#2: CRMPro – 450 votes</p>
            </div>
            <div className="bg-background/50 backdrop-blur-sm border border-border rounded-lg px-6 py-4">
              <p className="font-medium">#3: DevFlow – 320 votes</p>
            </div>
          </div>
        </div>

        {/* Add-Ons */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Need More? Customize Your Plan</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Add extra votes, premium support, or custom integrations
          </p>
          <Button className="gradient-button rounded-xl px-6 py-2 shadow-md">Customize Your Plan</Button>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-background/50 backdrop-blur-sm border border-border rounded-lg p-6">
              <h4 className="font-bold mb-2 text-gray-900 dark:text-white">Is the Free plan enough?</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Yes, 100 votes is perfect for startups just beginning to collect feedback. You can always upgrade as you
                grow.
              </p>
            </div>
            <div className="bg-background/50 backdrop-blur-sm border border-border rounded-lg p-6">
              <h4 className="font-bold mb-2 text-gray-900 dark:text-white">How do badges work?</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Earn badges like 'User Favorite' or 'Fast Responder' based on your feedback response metrics. They build
                trust with potential users.
              </p>
            </div>
            <div className="bg-background/50 backdrop-blur-sm border border-border rounded-lg p-6">
              <h4 className="font-bold mb-2 text-gray-900 dark:text-white">Can I add more votes?</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Yes! You can purchase additional vote packs anytime. Add 200 votes for just $5/month on any plan.
              </p>
            </div>
          </div>
        </div>

        {/* Confidence */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            No refunds, because{' '}
            <span className="text-gray-900 dark:text-white font-medium">95% see value in 7 days</span>
          </p>
        </div>
      </div>
    </section>
  );
}

interface PricingCardProps {
  tier: PricingTier;
  frequency: IBillingFrequency;
}

function PricingCard({ tier, frequency }: PricingCardProps) {
  const price = frequency.value === 'month' ? tier.monthlyPrice : tier.annualPrice;
  const originalPrice = frequency.value === 'month' ? tier.originalMonthlyPrice : tier.originalAnnualPrice;

  return (
    <div
      className={`rounded-lg overflow-hidden ${
        tier.popular ? 'border-2 border-green-500 bg-background/70 relative' : 'border border-border bg-background/50'
      }`}
    >
      {/* Popular Tag */}
      {tier.popular && (
        <div className="bg-green-500 text-xs font-bold uppercase tracking-wider text-center py-1 text-white">
          MOST POPULAR
        </div>
      )}

      {/* Card Header */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{tier.name}</h3>

        {/* Price */}
        <div className="flex items-end gap-2 mb-4">
          {originalPrice && <div className="text-muted-foreground line-through text-sm">{originalPrice}</div>}
          <div className="text-4xl font-bold text-gray-900 dark:text-white">{price}</div>
          <div className="text-xs text-muted-foreground mb-1">
            {tier.id !== 'free' && frequency.value === 'month'
              ? '/month'
              : tier.id !== 'free' && frequency.value === 'year'
                ? '/month, billed annually'
                : ''}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">{tier.description}</p>

        {/* CTA Button */}
        <Button className={`w-full gradient-button rounded-xl py-2`} asChild>
          <Link href={tier.ctaLink}>{tier.cta}</Link>
        </Button>
      </div>

      {/* Features List */}
      <div className="px-6 pb-6">
        <h4 className="font-medium mb-3 text-gray-900 dark:text-white">Features:</h4>
        <ul className="space-y-3">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-200">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Add-Ons */}
        {tier.addOns && tier.addOns.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Add-ons:</h4>
            <ul className="space-y-2">
              {tier.addOns.map((addon) => (
                <li key={addon} className="text-sm text-gray-600 dark:text-gray-300">
                  {addon}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Early Bird Offer */}
        {tier.earlyBirdOffer && tier.earlyBirdOffer.length > 0 && (
          <div className="mt-4 bg-green-500/10 rounded-md p-3 border border-green-500/20">
            <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">Early Bird Offer:</h4>
            <ul className="space-y-2">
              {tier.earlyBirdOffer.map((offer) => (
                <li key={offer} className="text-sm text-gray-700 dark:text-gray-200">
                  {offer}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Testimonial */}
        {tier.testimonial && (
          <div className="mt-4 italic text-sm text-gray-600 dark:text-gray-300">"{tier.testimonial}"</div>
        )}
      </div>
    </div>
  );
}
