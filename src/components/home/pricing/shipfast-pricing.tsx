'use client';

import { useState } from 'react';
import { PricingTier, Tier } from '@/constants/pricing-tier';
import { BillingFrequency, IBillingFrequency } from '@/constants/billing-frequency';
import { Button } from '@/components/ui/button';
import { Check, X, Zap } from 'lucide-react';
import Link from 'next/link';

export function ShipfastPricing() {
  const [frequency, setFrequency] = useState<IBillingFrequency>(BillingFrequency[0]);

  return (
    <section className="py-16 relative" id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Save hours of repetitive code,
            <br />
            ship fast, get profitable!
          </h2>
          <p className="text-green-500 flex items-center justify-center gap-2 mt-4">
            <span className="inline-block">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM7 11.4L3.6 8L5 6.6L7 8.6L11 4.6L12.4 6L7 11.4Z" fill="currentColor"/>
              </svg>
            </span>
            $100 off for the first 1000 customers (1 left)
          </p>
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
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PricingTier.map((tier) => (
            <PricingCard 
              key={tier.id} 
              tier={tier} 
              frequency={frequency} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface PricingCardProps {
  tier: Tier;
  frequency: IBillingFrequency;
}

function PricingCard({ tier, frequency }: PricingCardProps) {
  // Mock prices for display
  const prices = {
    starter: { month: '$199', year: '$1,990' },
    pro: { month: '$249', year: '$2,490' },
    advanced: { month: '$299', year: '$2,990' },
  };
  
  const originalPrices = {
    starter: { month: '$299', year: '$2,990' },
    pro: { month: '$349', year: '$3,490' },
    advanced: { month: '$649', year: '$6,490' },
  };

  const price = prices[tier.id][frequency.value];
  const originalPrice = originalPrices[tier.id][frequency.value];
  
  const isBundle = tier.id === 'advanced';
  
  return (
    <div className={`rounded-lg overflow-hidden ${
      tier.featured 
        ? 'border border-green-500/50 bg-background/70' 
        : 'border border-border bg-background/50'
    }`}>
      {/* Bundle Tag */}
      {isBundle && (
        <div className="bg-green-500 text-xs font-bold uppercase tracking-wider text-center py-1">
          BUNDLE
        </div>
      )}
      
      {/* Card Header */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
        
        {/* Price */}
        <div className="flex items-end gap-2 mb-4">
          <div className="text-muted-foreground line-through text-sm">{originalPrice}</div>
          <div className="text-4xl font-bold">{price}</div>
          <div className="text-xs text-muted-foreground mb-1">USD</div>
        </div>
        
        {/* Description */}
        <p className="text-muted-foreground text-sm mb-6">{tier.description}</p>
        
        {/* CTA Button */}
        <Button 
          className={`w-full ${
            isBundle 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-yellow-500 hover:bg-yellow-600 text-black'
          }`}
          asChild
        >
          <Link href={`/checkout/${tier.priceId[frequency.value]}`}>
            {isBundle ? (
              <span className="flex items-center justify-center gap-2">
                Get {tier.name} + CodeFast
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Zap className="h-4 w-4" /> Get {tier.name}
              </span>
            )}
          </Link>
        </Button>
        
        <div className="text-xs text-center text-muted-foreground mt-2">
          Pay once. Build unlimited projects!
        </div>
      </div>
      
      {/* Features List */}
      <div className="px-6 pb-6">
        {isBundle && (
          <>
            <div className="flex items-center gap-2 mb-2 text-sm">
              <span className="text-white">← Everything in All-in, and...</span>
            </div>
            
            <div className="flex items-center gap-2 mb-2 mt-4">
              <div className="bg-green-500 rounded-full p-1 flex items-center justify-center">
                <span className="text-white font-bold text-xs">CF</span>
              </div>
              <span className="text-green-500 font-bold">CodeFast ($299 value)</span>
            </div>
            
            <p className="text-sm mb-4">Learn to code in weeks, not months</p>
            
            <ul className="space-y-2">
              {['12 hours of content', 'Build a SaaS from 0', 'Entrepreneur mindset'].map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <span className="text-white mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        
        <ul className="space-y-2 mt-6">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        {tier.id === 'starter' && (
          <ul className="space-y-2 mt-4">
            {['Discord community & Leaderboard', '$1,210 worth of discounts', 'Lifetime updates'].map((feature) => (
              <li key={feature} className="flex items-start gap-2 opacity-50">
                <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        )}
        
        {tier.id === 'pro' && (
          <div className="mt-4 text-xs py-1 px-2 bg-green-500/20 text-green-500 inline-block rounded">
            Updated 3 months ago
          </div>
        )}
      </div>
    </div>
  );
}
