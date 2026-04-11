// src/middleware.ts
import authConfig from '../auth.config';
import NextAuth from 'next-auth';

// We use the Edge-compatible config here (no Prisma)
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // 1. Define your route types
  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');
  const isAuthRoute = ['/login', '/signup'].includes(nextUrl.pathname);
  const isPublicRoute = ['/'].includes(nextUrl.pathname); // Landing page

  // 2. Allow API auth routes always
  if (isApiAuthRoute) return null;

  // 3. Logic for Auth Pages (Login/Register)
  if (isAuthRoute) {
    if (isLoggedIn) {
      // If logged in and trying to go to login page, redirect to chat
      return Response.redirect(new URL('/chat', nextUrl));
    }
    return null; // Let them stay on the login page
  }

  // 4. Protection Logic
  if (!isLoggedIn && !isPublicRoute) {
    // Save the intended destination to redirect back after login
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) callbackUrl += nextUrl.search;

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
  }

  return null;
});

// Optionally, don't run middleware on static files/images
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
