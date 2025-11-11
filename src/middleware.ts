import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const token = request.cookies.get('firebase-auth-token');

  // Allow access to login, signup, and static assets
  if (url.pathname.startsWith('/login') || url.pathname.startsWith('/cadastro') || url.pathname.startsWith('/_next') || url.pathname.startsWith('/static')) {
    return NextResponse.next();
  }

  // If no token and not on a public page, redirect to login
  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If token exists, allow the request
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