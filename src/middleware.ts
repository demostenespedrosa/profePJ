import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const token = request.cookies.get('firebase-auth-token');

  // Only protect routes that MUST require authentication
  // Everything else is public by default
  const protectedRoutes = ['/agenda', '/perfil', '/potinhos', '/instituicoes', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route));

  // If accessing a protected route without token, redirect to home (landing page)
  if (isProtectedRoute && !token) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

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