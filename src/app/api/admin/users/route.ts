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
    const status = searchParams.get('status'); // 'active', 'trialing', 'expired'
    const search = searchParams.get('search'); // search by name or email

    // Get all users
    let usersQuery = firestore.collection('users');
    const usersSnapshot = await usersQuery.get();
    let users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

    // Apply filters
    if (status) {
      if (status === 'expired') {
        const now = new Date();
        users = users.filter(u => 
          u.subscriptionStatus === 'canceled' || 
          u.subscriptionStatus === 'unpaid' ||
          (u.trialEndsAt && new Date(u.trialEndsAt) < now && u.subscriptionStatus !== 'active')
        );
      } else {
        users = users.filter(u => u.subscriptionStatus === status);
      }
    }

    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(u => 
        u.name?.toLowerCase().includes(searchLower) ||
        u.email?.toLowerCase().includes(searchLower)
      );
    }

    // Get subscription details for each user
    const usersWithSubscriptions = await Promise.all(
      users.map(async (user) => {
        try {
          const subDoc = await firestore
            .collection('users')
            .doc(user.id)
            .collection('subscription')
            .doc('current')
            .get();
          
          return {
            ...user,
            subscription: subDoc.exists ? subDoc.data() : null,
          };
        } catch (error) {
          return { ...user, subscription: null };
        }
      })
    );

    return NextResponse.json({ users: usersWithSubscriptions });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    const body = await request.json();
    const { userId, isAdmin } = body;

    if (!userId || typeof isAdmin !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Update user admin status
    await firestore.collection('users').doc(userId).update({ isAdmin });

    return NextResponse.json({ success: true, message: 'User updated successfully' });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
