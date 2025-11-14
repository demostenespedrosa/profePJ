import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { STRIPE_CONFIG } from '@/lib/stripe/client';

export async function POST(request: NextRequest) {
  try {
    const { userId, email, name } = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create or retrieve Stripe customer
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    let customer;
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          firebaseUserId: userId,
        },
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_CONFIG.priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 0, // No trial on checkout (trial handled on signup)
        metadata: {
          firebaseUserId: userId,
        },
      },
      success_url: `${STRIPE_CONFIG.appUrl}${STRIPE_CONFIG.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${STRIPE_CONFIG.appUrl}${STRIPE_CONFIG.cancelUrl}`,
      metadata: {
        firebaseUserId: userId,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      customerId: customer.id,
    });

  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
