import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;

    if (code) {
        const cookieStore = cookies();

        // Using explicit keys to match client-side config
        const supabase = createServerClient(
            "https://rnoxehthfxffirafloth.supabase.co",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJub3hlaHRoZnhmZmlyYWZsb3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMjEzNzQsImV4cCI6MjA4MzU5NzM3NH0.9HqDWUW6iYUL6tIkiY3PnJ1vYJobWEunoeMi1XQkV9A",
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name: string, options: CookieOptions) {
                        try {
                            cookieStore.set({ name, value: '', ...options });
                        } catch (error) {
                            // Start transition, ignore write in strict mode
                        }
                    },
                },
            }
        );

        await supabase.auth.exchangeCodeForSession(code);

        return NextResponse.redirect(`${origin}/onboarding`);
    }

    return NextResponse.redirect(`${origin}/dashboard`);
}
