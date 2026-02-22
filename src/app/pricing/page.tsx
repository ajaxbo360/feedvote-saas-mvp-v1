import { FeedVotePricing } from '@/components/home/pricing/feedvote-pricing';
import { Metadata } from 'next';
import Header from '@/components/home/header/header';
import { createClient } from '@/utils/supabase/server-internal';

export const metadata: Metadata = {
  title: 'Pricing - FeedVote',
  description: 'Simple, transparent pricing for FeedVote',
};

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <main className="pt-20">
        <FeedVotePricing />
      </main>
    </div>
  );
}
