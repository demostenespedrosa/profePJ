"use client";

import { useEffect, useState } from "react";
import { useFirebase, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { UserProfile, Subscription } from "@/types";
import { isPast, parseISO } from "date-fns";

export type SubscriptionAccess = {
  hasAccess: boolean;
  isTrialing: boolean;
  isActive: boolean;
  isPastDue: boolean;
  isCanceled: boolean;
  trialEnded: boolean;
  needsPayment: boolean;
  daysLeftInTrial: number | null;
  subscription: Subscription | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
};

export function useSubscription(): SubscriptionAccess {
  const { user, firestore, isUserLoading } = useFirebase();
  
  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, `users/${user.uid}`) : null),
    [firestore, user]
  );

  const subscriptionDocRef = useMemoFirebase(
    () => (user ? doc(firestore, `users/${user.uid}/subscription/current`) : null),
    [firestore, user]
  );

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);
  const { data: subscription, isLoading: isSubscriptionLoading } = useDoc<Subscription>(subscriptionDocRef);

  const [access, setAccess] = useState<SubscriptionAccess>({
    hasAccess: false,
    isTrialing: false,
    isActive: false,
    isPastDue: false,
    isCanceled: false,
    trialEnded: false,
    needsPayment: false,
    daysLeftInTrial: null,
    subscription: null,
    userProfile: null,
    isLoading: true,
  });

  useEffect(() => {
    if (isUserLoading || isProfileLoading || isSubscriptionLoading) {
      setAccess(prev => ({ ...prev, isLoading: true }));
      return;
    }

    if (!userProfile) {
      setAccess({
        hasAccess: false,
        isTrialing: false,
        isActive: false,
        isPastDue: false,
        isCanceled: false,
        trialEnded: false,
        needsPayment: true,
        daysLeftInTrial: null,
        subscription: null,
        userProfile: null,
        isLoading: false,
      });
      return;
    }

    const status = userProfile.subscriptionStatus || 'trialing';
    const isTrialing = status === 'trialing';
    const isActive = status === 'active';
    const isPastDue = status === 'past_due';
    const isCanceled = status === 'canceled' || status === 'unpaid';

    let trialEnded = false;
    let daysLeftInTrial: number | null = null;

    if (isTrialing && userProfile.trialEndsAt) {
      const trialEndDate = parseISO(userProfile.trialEndsAt);
      trialEnded = isPast(trialEndDate);
      
      if (!trialEnded) {
        const now = new Date();
        const diff = trialEndDate.getTime() - now.getTime();
        daysLeftInTrial = Math.ceil(diff / (1000 * 60 * 60 * 24));
      }
    }

    // User has access if:
    // - Trialing and trial hasn't ended
    // - Active subscription
    // - Past due (grace period)
    const hasAccess = (isTrialing && !trialEnded) || isActive || isPastDue;

    // Needs payment if:
    // - Trial ended
    // - Canceled
    // - Unpaid
    const needsPayment = (isTrialing && trialEnded) || isCanceled;

    setAccess({
      hasAccess,
      isTrialing,
      isActive,
      isPastDue,
      isCanceled,
      trialEnded,
      needsPayment,
      daysLeftInTrial,
      subscription: subscription || null,
      userProfile: userProfile || null,
      isLoading: false,
    });

  }, [userProfile, subscription, isUserLoading, isProfileLoading, isSubscriptionLoading]);

  return access;
}
