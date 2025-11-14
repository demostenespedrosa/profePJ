import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const token = request.cookies.get('firebase-auth-token');

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/cadastro', '/assinatura'];
  const isPublicRoute = publicRoutes.some(route => url.pathname.startsWith(route));

  // Allow access to public routes and static assets
  if (isPublicRoute || url.pathname.startsWith('/_next') || url.pathname.startsWith('/static') || url.pathname.startsWith('/offline') || url.pathname.includes('.')) {
    return NextResponse.next();
  }

  // If no token and not on a public page, redirect to login
  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Note: Subscription access control is handled client-side with useSubscription hook
  // and in components with SubscriptionGate (Edge middleware can't access Firestore)
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/image|favicon.ico).*)',
  ],
};