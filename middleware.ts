import { NextRequest, NextResponse } from 'next/server';

/**
 * DEMO MODE: All routes are publicly accessible for delivery demo.
 * Re-enable auth checks before production launch.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
