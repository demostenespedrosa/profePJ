import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!key) {
      console.error('Stripe publishable key not found');
      return null;
    }
    
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

export const STRIPE_CONFIG = {
  productId: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID || '',
  priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || '',
  trialDays: parseInt(process.env.NEXT_PUBLIC_TRIAL_DAYS || '14'),
  appUrl: process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:9002'),
  successUrl: '/assinatura/sucesso',
  cancelUrl: '/assinatura/cancelado',
};
