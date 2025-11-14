import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import Stripe from 'stripe';
import { initializeFirebase } from '@/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

const { firestore } = initializeFirebase();

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.firebaseUserId;
  if (!userId) {
    console.error('No Firebase user ID in subscription metadata');
    return;
  }

  const subscriptionData = {
    stripeSubscriptionId: subscription.id,
    stripePriceId: subscription.items.data[0]?.price.id,
    status: subscription.status,
    currentPeriodStart: new Date((subscription as any).current_period_start * 1000).toISOString(),
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000).toISOString(),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    trialEnd: subscription.trial_end ? new Date((subscription as any).trial_end * 1000).toISOString() : null,
  };

  // Update subscription document
  const subscriptionRef = doc(firestore, `users/${userId}/subscription/current`);
  await setDoc(subscriptionRef, subscriptionData, { merge: true });

  // Update user profile
  const userRef = doc(firestore, `users/${userId}`);
  await updateDoc(userRef, {
    subscriptionStatus: subscription.status,
    stripeCustomerId: subscription.customer as string,
  });

  console.log(`Subscription ${subscription.status} for user ${userId}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.firebaseUserId;
  if (!userId) return;

  const userRef = doc(firestore, `users/${userId}`);
  await updateDoc(userRef, {
    subscriptionStatus: 'canceled',
  });

  console.log(`Subscription canceled for user ${userId}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const invoiceSubscription = (invoice as any).subscription;
  if (!invoiceSubscription) return;

  const subscription = await stripe.subscriptions.retrieve(
    invoiceSubscription as string
  );

  await handleSubscriptionChange(subscription);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const invoiceSubscription = (invoice as any).subscription;
  if (!invoiceSubscription) return;

  const subscription = await stripe.subscriptions.retrieve(
    invoiceSubscription as string
  );

  const userId = subscription.metadata.firebaseUserId;
  if (!userId) return;

  const userRef = doc(firestore, `users/${userId}`);
  await updateDoc(userRef, {
    subscriptionStatus: 'past_due',
  });

  console.log(`Payment failed for user ${userId}`);
}
