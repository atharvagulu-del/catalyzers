import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Hardcoded keys to match client config (User's setup)
    // In production, these should be env vars.
    const supabase = createServerClient(
        "https://rnoxehthfxffirafloth.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJub3hlaHRoZnhmZmlyYWZsb3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMjEzNzQsImV4cCI6MjA4MzU5NzM3NH0.9HqDWUW6iYUL6tIkiY3PnJ1vYJobWEunoeMi1XQkV9A",
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { session } } = await supabase.auth.getSession()

    // Role-based routing: Check user_metadata.role
    const userRole = session?.user?.user_metadata?.role;

    // Teachers: redirect from / or /dashboard to /teacher
    if (userRole === 'teacher') {
        if (request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/dashboard')) {
            return NextResponse.redirect(new URL('/teacher', request.url))
        }
    }

    // 1. Redirect Home ("/") to Dashboard if logged in (non-teachers)
    if (request.nextUrl.pathname === '/' && session) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // 2. Protect teacher routes - require login
    if (request.nextUrl.pathname.startsWith('/teacher')) {
        if (!session) {
            return NextResponse.redirect(new URL('/', request.url))
        }
        // Teacher role check is handled in the layout component
        return response
    }

    // 3. Redirect Dashboard/Lectures to Onboarding if NOT onboarded
    // Note: Middleware can't easily check localStorage, so we rely on user_metadata.
    if (session &&
        (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/lectures')) &&
        !request.nextUrl.pathname.startsWith('/dashboard/profile')) { // Allow profile access just in case

        const metadata = session.user.user_metadata;
        // If missing class/exam and not marked onboarded
        if ((!metadata?.class || !metadata?.exam) && !metadata?.onboarded) {
            // Prevent infinite loop if we are already on onboarding
            // Oh wait, route is /onboarding, not /dashboard/onboarding
            return NextResponse.redirect(new URL('/onboarding', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - auth/callback (auth callback)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|auth/callback|onboarding|teacher).*)',
    ],
}
