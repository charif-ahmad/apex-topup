import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register', '/'];
const ADMIN_PATHS = ['/admin'];
const AUTH_PATHS = ['/dashboard', '/wallet', '/services', '/transactions', '/profile', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('apex_token')?.value;
  const role = request.cookies.get('apex_role')?.value;

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
  const isProtected = AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
  const isAdminPath = ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAdminPath && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isPublic && pathname !== '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
