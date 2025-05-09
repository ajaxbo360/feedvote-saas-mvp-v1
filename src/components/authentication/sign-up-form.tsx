'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AuthenticationForm } from '@/components/authentication/authentication-form';
import { signup } from '@/app/signup/actions';
import { useToast } from '@/components/ui/use-toast';

export function SignupForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSignup() {
    signup({ email, password }).then((data) => {
      if (data?.error) {
        toast({ description: 'Something went wrong. Please try again', variant: 'destructive' });
      }
    });
  }

  return (
    <form action={'#'} className={'px-6 md:px-16 pb-6 py-8 gap-6 flex flex-col items-center justify-center'}>
      <Image src={'/assets/icons/logo/aeroedit-icon.svg'} alt={'FeedFeature'} width={80} height={80} />
      <div className={'text-[30px] leading-[36px] font-medium tracking-[-0.6px] text-center'}>
        Get started with FeedFeature
      </div>
      <p className="text-center text-muted-foreground mb-2">Create your account and start collecting feedback today</p>
      <AuthenticationForm
        email={email}
        onEmailChange={(email) => setEmail(email)}
        password={password}
        onPasswordChange={(password) => setPassword(password)}
      />
      <Button
        formAction={() => handleSignup()}
        type={'submit'}
        className={'w-full bg-green-500 hover:bg-green-600 text-white rounded-xl px-6 py-3 font-semibold'}
      >
        Create Free Account
      </Button>
      <div className="text-center text-sm text-muted-foreground w-full">
        <p>No credit card required. Free plan includes:</p>
        <ul className="mt-2 space-y-1">
          <li>• 1 product</li>
          <li>• Feedback collection</li>
          <li>• Public feedback portal</li>
          <li>• Up to 100 feedback items</li>
        </ul>
      </div>
    </form>
  );
}
