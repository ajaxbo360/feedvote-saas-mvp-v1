'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HomePageBackground } from '@/components/gradients/home-page-background';
import { MessageSquare, Star, Award, BarChart2, ArrowRight, Check, Clock, ThumbsUp } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { FeedVotePricing } from '@/components/home/pricing/feedvote-pricing';
import { FeedVoteLeaderboard } from '@/components/home/leaderboard/feed-vote-leaderboard';
import { LeaderboardButton } from '@/components/home/leaderboard/leaderboard-button';
import Header from '@/components/home/header/header';
import { CurvedArrow } from '@/components/ui/curved-arrow';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { signInWithGoogle } from '@/utils/auth-helper';

export function LandingPage() {
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCTA(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();

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

  return (
    <div className="relative">
      <HomePageBackground />

      {/* Header */}
      <Header user={user} />

      {/* Leaderboard Button */}
      <LeaderboardButton />

      {/* Hero Section */}
      <main>
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white">
                You&apos;ve built a SaaS product.
                <br />
                <span className="inline-block bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/20 px-4 py-1 mt-2 rounded-lg">
                  Now build <span className="text-green-600 dark:text-green-400">trust</span> with feedback
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                In less than 3 minutes, drop in our widget and start collecting real user feedback — organized by type.
                Users can upvote features, you can track progress, and build a public trust engine that proves
                you&apos;re listening.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Button
                    className="h-11 gradient-button rounded-xl px-6 py-3 font-semibold text-sm shadow-md bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                    asChild
                  >
                    <Link href="/app">Open Dashboard</Link>
                  </Button>
                ) : (
                  <Button
                    className="h-11 gradient-button rounded-xl px-6 py-3 font-semibold text-sm shadow-md bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                    onClick={handleGoogleLogin}
                  >
                    Get Started for free
                  </Button>
                )}

                <div className="text-sm text-muted mt-2 sm:mt-4">
                  <span className="text-green-600 dark:text-green-400 font-medium">$0 forever</span> for the first 1000
                  customers
                </div>
              </div>

              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2" aria-label="Customer avatars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-background/80 border-2 border-green-500/30 overflow-hidden"
                    >
                      <Image
                        src={`/assets/avatars/avatar-${i + 5}.png`}
                        alt={`Customer ${i}`}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="ml-4 text-sm text-muted-foreground">
                  <span className="font-semibold">1,000+</span> founders ship faster
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 translate-y-full lg:block hidden">
                <CurvedArrow className="w-32 h-32 rotate-[145deg]" color="#64748b" />
              </div>

              <div
                className="absolute -top-10 -left-10 w-full h-full bg-gradient-to-br from-green-500/10 via-blue-500/10 to-transparent rounded-full blur-3xl"
                aria-hidden="true"
              />
              <div className="relative">
                <div
                  className="absolute inset-0 bg-gradient-to-tr from-green-500/5 to-blue-500/5 rounded-xl"
                  aria-hidden="true"
                ></div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-xl border border-border shadow-xl relative z-10 w-full"
                  aria-label="Product demo video"
                >
                  <source src="/assets/videos/hero-video.mp4" type="video/mp4" />
                  <p>Your browser does not support the video tag.</p>
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="text-center select-text">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">Trust Is Everything</h2>

            <div className="bg-background/30 backdrop-blur-sm border border-border rounded-xl p-6 mb-8 max-w-3xl mx-auto">
              <p className="text-lg italic text-gray-600 dark:text-gray-300 mb-4">
                "You've got to start with the customer experience and work backwards to the technology. You can't start
                with the technology and try to figure out where to sell it."
              </p>
              <p className="text-gray-900 dark:text-white font-medium">— Steve Jobs</p>
            </div>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
              Founders who <span className="text-gray-900 dark:text-white font-medium">respond quickly</span> to user
              feedback build trust faster. FeedVote helps you collect feedback, prioritize features, and{' '}
              <span className="text-gray-900 dark:text-white font-medium">showcase improvements</span> that prove you're
              listening.
            </p>
            <Button
              className="h-11 gradient-button rounded-xl px-6 py-3 font-semibold text-sm shadow-md bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
              onClick={handleGoogleLogin}
            >
              Get Started Free
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 relative mt-12">
          <div className="text-center mb-12">
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Key Features That Drive Growth
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our powerful tools help you collect feedback, build trust, and showcase your responsiveness
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Feature cards with semantic markup */}
            <article className="bg-background/50 backdrop-blur-sm relative">
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div
                    className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4"
                    aria-hidden="true"
                  >
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Feedback Voting</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Users submit and vote on features that actually matter to them.
                  </p>
                </div>
              </div>
              {/* Arrow */}
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 hidden lg:block z-10"
                style={{ marginLeft: '-0.5rem' }}
              >
                <CurvedArrow className="w-16 h-16" color="#16a34a" aria-hidden="true" />
              </div>
            </article>

            <article className="bg-background/50 backdrop-blur-sm relative">
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div
                    className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4"
                    aria-hidden="true"
                  >
                    <BarChart2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Progress Tracking</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Show users exactly where their requested features are in development.
                  </p>
                </div>
              </div>
              {/* Arrow */}
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 hidden lg:block z-10"
                style={{ marginLeft: '-0.5rem' }}
              >
                <CurvedArrow className="w-16 h-16" color="#16a34a" aria-hidden="true" />
              </div>
            </article>

            <article className="bg-background/50 backdrop-blur-sm relative">
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div
                    className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4"
                    aria-hidden="true"
                  >
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Trust Building</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Build credibility by showcasing your responsiveness to user needs.
                  </p>
                </div>
              </div>
              {/* Arrow */}
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 hidden lg:block z-10"
                style={{ marginLeft: '-0.5rem' }}
              >
                <CurvedArrow className="w-16 h-16" color="#16a34a" aria-hidden="true" />
              </div>
            </article>

            <article className="bg-background/50 backdrop-blur-sm relative">
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div
                    className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4"
                    aria-hidden="true"
                  >
                    <ThumbsUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">User Satisfaction</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Increase satisfaction by delivering features users actually want.
                  </p>
                </div>
              </div>
            </article>
          </div>

          <div className="text-center mt-12">
            <Button
              className="h-11 gradient-button rounded-xl px-6 py-3 font-semibold text-sm shadow-md bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
              onClick={handleGoogleLogin}
            >
              Try FeedVote Free
            </Button>
          </div>
        </section>

        {/* Social Proof Section */}
        <section
          aria-labelledby="testimonials-heading"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative"
        >
          <h2
            id="testimonials-heading"
            className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white"
          >
            Building Trust Through Feedback
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="bg-background/50 backdrop-blur-sm col-span-1 lg:col-span-2">
              <CardContent className="p-8">
                <div className="flex flex-col select-text">
                  <div className="flex items-center mb-4">
                    <div className="relative mr-4">
                      <Image
                        src="/assets/avatars/avatar-1.png"
                        alt="Sarah Chen"
                        width={64}
                        height={64}
                        className="rounded-full border-2 border-green-500/30"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <Check className="h-3 w-3 text-black" />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold">Sarah Chen</p>
                      <p className="text-sm text-muted-foreground">Founder of TaskEasy</p>
                    </div>
                  </div>
                  <p className="text-xl mb-4">
                    "FeedVote helped us build exactly what our users wanted. Our customer satisfaction increased by 47%
                    in just 3 months because they saw we were actually listening. The improvement points system gamified
                    our development process in a way that aligned perfectly with user needs."
                  </p>
                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">Verified Customer</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              <Card className="bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                        <span className="font-bold text-yellow-500">#1</span>
                      </div>
                      <div>
                        <span className="font-bold text-lg">TaskEasy</span>
                        <div className="flex items-center">
                          <span className="text-sm text-green-500 font-medium mr-1">98</span>
                          <span className="text-xs text-muted-foreground">improvement points</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Response time:</span>
                      <span className="font-medium">2h avg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipped features:</span>
                      <span className="font-medium">32 this month</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">User testimonials:</span>
                      <span className="font-medium">45 verified</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 py-2 px-3">
                  <Award className="h-4 w-4 mr-1" /> Fast Responder
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-500 border border-blue-500/50 py-2 px-3">
                  <Star className="h-4 w-4 mr-1" /> User Favorite
                </Badge>
                <Badge className="bg-green-500/20 text-green-500 border border-green-500/50 py-2 px-3">
                  <Check className="h-4 w-4 mr-1" /> Trusted Builder
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-background/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <Image
                    src="/assets/avatars/avatar-2.png"
                    alt="Alex Rivera"
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-blue-500/30 mr-3"
                  />
                  <div>
                    <p className="font-medium">Alex Rivera</p>
                    <p className="text-xs text-muted-foreground">CRMPro</p>
                  </div>
                </div>
                <p className="text-sm mb-3">
                  "The feedback-to-testimonial pipeline is genius. We've collected 36 high-quality testimonials in just
                  two months."
                </p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <Image
                    src="/assets/avatars/avatar-3.png"
                    alt="Jamie Wong"
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-purple-500/30 mr-3"
                  />
                  <div>
                    <p className="font-medium">Jamie Wong</p>
                    <p className="text-xs text-muted-foreground">DevFlow</p>
                  </div>
                </div>
                <p className="text-sm mb-3">
                  "Our users love seeing their feedback turn into actual features. It's created a community around our
                  product."
                </p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <Image
                    src="/assets/avatars/avatar-4.png"
                    alt="Michael Scott"
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-green-500/30 mr-3"
                  />
                  <div>
                    <p className="font-medium">Michael Scott</p>
                    <p className="text-xs text-muted-foreground">AnalyticsPro</p>
                  </div>
                </div>
                <p className="text-sm mb-3">
                  "The leaderboard creates healthy competition. We've improved our response time from 24h to just 4h on
                  average."
                </p>
                <div className="flex">
                  {[1, 2, 3, 4, 4.5].map((star, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 text-yellow-500 ${star === 5 ? 'fill-yellow-500' : star > 4 ? 'fill-yellow-500/50' : 'fill-yellow-500'}`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button
              className="h-11 gradient-button rounded-xl px-6 py-3 font-semibold text-sm shadow-md bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
              onClick={handleGoogleLogin}
            >
              Join 1,000+ Founders Free
            </Button>
          </div>
        </section>
        {/* How It Works Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">
            How to Build Trust with Feedback
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* First Step */}
            <div className="flex flex-col items-center text-center relative select-text">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Collect Real Feedback</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our widget makes it easy for users to tell you what they actually need
              </p>
              {/* Arrow after first step */}
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 hidden lg:block z-10"
                style={{ marginLeft: '-0.5rem' }}
              >
                <CurvedArrow className="w-16 h-16" color="#16a34a" />
              </div>
            </div>

            {/* Second Step */}
            <div className="flex flex-col items-center text-center relative select-text">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Ship Based on Votes</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Prioritize features that users actually want, not what you think they want
              </p>
              {/* Arrow after second step */}
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 hidden lg:block z-10"
                style={{ marginLeft: '-0.5rem' }}
              >
                <CurvedArrow className="w-16 h-16" color="#16a34a" />
              </div>
            </div>

            {/* Third Step */}
            <div className="flex flex-col items-center text-center select-text">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Showcase Your Responsiveness</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Earn badges and climb our leaderboard by proving you listen to users
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              className="h-11 gradient-button rounded-xl px-6 py-3 font-semibold text-sm shadow-md bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
              onClick={handleGoogleLogin}
            >
              Start Free Now
            </Button>
          </div>
        </section>

        {/* Pricing Section */}
        <FeedVotePricing />

        {/* FAQ Section */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">
            Common Questions
          </h2>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border border-border rounded-lg overflow-hidden">
              <AccordionTrigger className="text-lg font-medium px-6 [&[data-state=open]>div]:bg-background/50">
                <div className="py-4 w-full text-left hover:bg-background/30 transition-colors select-text">
                  Is it free?
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600 dark:text-gray-300 select-text">
                Yes, FeedVote offers a free plan with all core features. Premium plans are available for additional
                features and higher usage limits.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-border rounded-lg overflow-hidden">
              <AccordionTrigger className="text-lg font-medium px-6 [&[data-state=open]>div]:bg-background/50">
                <div className="py-4 w-full text-left hover:bg-background/30 transition-colors select-text">
                  How does the leaderboard work?
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600 dark:text-gray-300 select-text">
                Unlike traditional rankings based only on revenue or user count, our leaderboard ranks products based on
                how well they respond to user feedback. We measure response time, implementation rate of requested
                features, and user satisfaction with those implementations. This creates a true measure of which
                products actually listen to their users.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-border rounded-lg overflow-hidden">
              <AccordionTrigger className="text-lg font-medium px-6 [&[data-state=open]>div]:bg-background/50">
                <div className="py-4 w-full text-left hover:bg-background/30 transition-colors select-text">
                  Login needed?
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600 dark:text-gray-300 select-text">
                No, users can submit feedback and vote anonymously. However, creating an account provides additional
                benefits like tracking your feedback and receiving updates.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-border rounded-lg overflow-hidden">
              <AccordionTrigger className="text-lg font-medium px-6 [&[data-state=open]>div]:bg-background/50">
                <div className="py-4 w-full text-left hover:bg-background/30 transition-colors select-text">
                  How does this build trust?
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600 dark:text-gray-300 select-text">
                Trust is built when users see that their feedback matters. Our platform creates a transparent feedback
                loop where users can submit ideas, vote on features, and see when you implement them. This visible
                responsiveness builds trust faster than any marketing claim ever could. As Steve Jobs said, you need to
                "start with the customer experience" - and that means listening to what they actually want.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Footer */}
        <footer className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center select-text">
            <div className="mb-4 md:mb-0">
              <p className="text-lg font-semibold">FeedVote</p>
              <p className="text-sm text-muted-foreground">Shape Your SaaS with User Feedback</p>
            </div>

            <div className="flex gap-6">
              <Link href="https://twitter.com" className="text-muted-foreground hover:text-primary transition-colors">
                <ExternalLink className="h-5 w-5" />
              </Link>
              <Link
                href="mailto:contact@feedvote.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                contact@feedvote.com
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
