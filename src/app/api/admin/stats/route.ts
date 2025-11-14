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

    // Get all users
    const usersSnapshot = await firestore.collection('users').get();
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Calculate metrics
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.subscriptionStatus === 'active').length;
    const trialingUsers = users.filter(u => u.subscriptionStatus === 'trialing').length;
    const expiredUsers = users.filter(u => 
      u.subscriptionStatus === 'canceled' || 
      u.subscriptionStatus === 'unpaid' ||
      (u.trialEndsAt && new Date(u.trialEndsAt) < now && u.subscriptionStatus !== 'active')
    ).length;

    const newUsersLast7Days = users.filter(u => 
      u.createdAt && new Date(u.createdAt) >= sevenDaysAgo
    ).length;

    const newUsersLast30Days = users.filter(u => 
      u.createdAt && new Date(u.createdAt) >= thirtyDaysAgo
    ).length;

    // Get all subscriptions for MRR calculation
    let totalMRR = 0;
    let activeSubscriptions = 0;

    for (const user of users) {
      if (user.subscriptionStatus === 'active') {
        const subDoc = await firestore
          .collection('users')
          .doc(user.id)
          .collection('subscription')
          .doc('current')
          .get();
        
        const subData = subDoc.data();
        if (subData?.amount) {
          // Stripe stores amounts in cents, assuming monthly billing
          totalMRR += subData.amount / 100;
          activeSubscriptions++;
        }
      }
    }

    // Calculate churn rate (simplified: expired users / total users)
    const churnRate = totalUsers > 0 ? (expiredUsers / totalUsers) * 100 : 0;

    return NextResponse.json({
      totalUsers,
      activeUsers,
      trialingUsers,
      expiredUsers,
      newUsersLast7Days,
      newUsersLast30Days,
      totalMRR: Math.round(totalMRR * 100) / 100,
      activeSubscriptions,
      churnRate: Math.round(churnRate * 100) / 100,
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
