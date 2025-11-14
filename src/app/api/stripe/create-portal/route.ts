import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';

export async function POST(request: NextRequest) {
  try {
    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json(
        { error: 'Missing customer ID' },
        { status: 400 }
      );
    }

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/perfil`,
    });

    return NextResponse.json({
      url: session.url,
    });

  } catch (error: any) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
