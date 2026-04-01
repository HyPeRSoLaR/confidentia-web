import { NextRequest, NextResponse } from 'next/server';

/**
 * Route protection middleware.
 * Protected role prefixes redirect to /login if no session cookie is present.
 * /select-role is explicitly exempt so users can switch roles freely.
 */

const PROTECTED_PREFIXES = [
  '/consumer',
  '/employee',
  '/hr',
  '/therapist',
  '/admin',
  '/onboarding',
];

// These paths are accessible regardless of session state
const PUBLIC_PATHS = [
  '/login',
  '/select-role', // role-switch exception — accessible to any authenticated session
  '/api',
  '/_next',
  '/favicon.ico',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths through always
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Root path → landing page (handled by app/page.tsx, not redirected)
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Check if path requires protection
  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Read session cookie (set by localStorage-based session when we move to httpOnly cookies,
  // or by Supabase auth cookies when backend is wired)
  const sessionCookie = request.cookies.get('confidentia_role');

  if (!sessionCookie) {
    // No session — redirect to login, preserving the intended destination
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Session cookie present — role mismatch check
  const userRole = sessionCookie.value as string;
  const rolePrefix = `/${userRole}`;

  // Allow access to own role routes and shared routes (onboarding, select-role)
  const isOwnRole = pathname.startsWith(rolePrefix);
  const isShared  = ['/onboarding', '/select-role'].some(p => pathname.startsWith(p));
  // Allow admin to access all routes
  const isAdmin   = userRole === 'admin';

  if (!isOwnRole && !isShared && !isAdmin) {
    // Wrong role — redirect to their own dashboard
    return NextResponse.redirect(new URL(`/${userRole}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except static files and Next.js internals
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
