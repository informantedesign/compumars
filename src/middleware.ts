
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Secret key for JWT signing/verification - should use environment variable
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'default_secret_key_change_me_in_production'
);

// Paths that require authentication
const PROTECTED_PATHS = ['/dashboard', '/orders', '/admin', '/finance', '/inventory', '/clients', '/drivers', '/users', '/reports'];

// Paths that are public (e.g., login, static assets)
const PUBLIC_PATHS = ['/login', '/api/auth/login']; // Added public API route for login

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Check if the path requires protection
    const isProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path));

    if (!isProtected) {
        return NextResponse.next();
    }

    // 2. Check for auth cookie
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
        // Redirect to login if no token
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        // 3. Verify JWT
        const { payload } = await jwtVerify(token, JWT_SECRET);

        // Check for expiration (optional as verify throws if expired, but good to be explicit)
        // Add custom claims checks here if needed (e.g., role-based access)

        // Add user info to headers for downstream access if needed
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', payload.sub as string);
        requestHeaders.set('x-user-role', payload.role as string);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

    } catch (error) {
        console.error("Token verification failed:", error);
        // Token valid format but verification failed (expired, invalid signature, etc.)
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('error', 'session_expired');
        return NextResponse.redirect(loginUrl);
    }
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
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
        // Also explicitly match protected paths to be sure
        '/dashboard/:path*',
        '/orders/:path*',
        '/admin/:path*'
    ],
};
