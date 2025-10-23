'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { getAuthRedirectUrl } from '@/utils/url-helper';

export function FeedVotePricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const { toast } = useToast();

  const handleGoogleLogin = async (planName?: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAuthRedirectUrl(),
          queryParams: planName ? { plan: planName.toLowerCase() } : undefined,
        },
      });

      if (error) {
        toast({
          description: `Authentication error: ${error.message}`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        description: 'Failed to connect to authentication service',
        variant: 'destructive',
      });
    }
  };

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for early stage startups',
      price: {
        monthly: 0,
        annual: 0,
      },
      features: [
        'Collect unlimited feedback',
        'Public feedback portal',
        'Up to 3 team members',
        'Basic analytics',
        'Standard support',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      description: 'For growing teams',
      price: {
        monthly: 49,
        annual: 39,
      },
      features: [
        'Everything in Free',
        'Unlimited team members',
        'Advanced analytics',
        'Custom branding',
        'Priority support',
        'API access',
      ],
      cta: 'Start 14-Day Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'For large organizations',
      price: {
        monthly: 199,
        annual: 159,
      },
      features: [
        'Everything in Pro',
        'SSO authentication',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantees',
        'On-boarding assistance',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          From free feedback to top leaderboard rankings, FeedVote fits every bootstrap team.
        </p>

        <div className="flex justify-center mt-6">
          <div className="bg-background/50 backdrop-blur-sm rounded-full p-1 border border-border">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
              className={`rounded-full ${billingCycle === 'monthly' ? '' : 'hover:bg-background/80'}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === 'annual' ? 'default' : 'ghost'}
              className={`rounded-full ${billingCycle === 'annual' ? '' : 'hover:bg-background/80'}`}
              onClick={() => setBillingCycle('annual')}
            >
              Annual <span className="ml-1 text-xs text-green-500 font-medium">Save 20%</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative overflow-hidden border ${
              plan.popular ? 'border-green-500/50 shadow-lg shadow-green-500/10' : 'border-border'
            } backdrop-blur-sm bg-background/50`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0">
                <div className="bg-green-500 text-xs text-white px-3 py-1 rounded-bl-lg font-medium">Most Popular</div>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price[billingCycle]}</span>
                <span className="text-muted-foreground ml-2">/month</span>
                {billingCycle === 'annual' && plan.price.annual > 0 && (
                  <div className="text-xs text-green-500 font-medium mt-1">Billed annually</div>
                )}
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full h-11 gradient-button rounded-xl px-6 py-3 font-semibold text-sm shadow-md ${
                  plan.popular
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white'
                }`}
                onClick={() =>
                  plan.name === 'Enterprise' ? (window.location.href = '/contact') : handleGoogleLogin(plan.name)
                }
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
