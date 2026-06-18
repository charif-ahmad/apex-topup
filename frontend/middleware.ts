import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register', '/'];
const AUTH_PATHS = ['/dashboard', '/wallet', '/services', '/transactions', '/profile', '/admin'];

// Admin authorization is enforced in the (admin) layout via getProfileAction()
// which verifies the JWT token server-side. The unsigned apex_role cookie must
// not be used as a security boundary here.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('apex_token')?.value;

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
  const isProtected = AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublic && pathname !== '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
