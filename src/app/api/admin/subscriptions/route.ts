import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const firestore = getFirestore();
const auth = getAuth();

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    
    // Verify admin status
    const userDoc = await firestore.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();
    
    if (!userData?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status'); // 'active', 'trialing', 'canceled', etc.

    // Get all users
    const usersSnapshot = await firestore.collection('users').get();
    const subscriptions = [];

    // Get subscription for each user
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const user = userDoc.data();

      const subDoc = await firestore
        .collection('users')
        .doc(userId)
        .collection('subscription')
        .doc('current')
        .get();

      if (subDoc.exists) {
        const subData = subDoc.data();
        
        // Apply status filter
        if (status && subData && subData.status !== status) {
          continue;
        }

        subscriptions.push({
          id: subDoc.id,
          userId,
          userName: user.name,
          userEmail: user.email,
          ...subData,
        });
      } else if (user.subscriptionStatus === 'trialing') {
        // Include users on trial even without subscription doc
        if (status && status !== 'trialing') {
          continue;
        }

        subscriptions.push({
          id: 'trial',
          userId,
          userName: user.name,
          userEmail: user.email,
          status: 'trialing',
          trialEnd: user.trialEndsAt,
          amount: 0,
        });
      }
    }

    // Sort by creation date (most recent first)
    subscriptions.sort((a: any, b: any) => {
      const dateA = new Date(a.currentPeriodStart || a.trialEnd || 0);
      const dateB = new Date(b.currentPeriodStart || b.trialEnd || 0);
      return dateB.getTime() - dateA.getTime();
    });

    return NextResponse.json({ subscriptions });

  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
