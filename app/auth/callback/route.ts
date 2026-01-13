import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = "https://rnoxehthfxffirafloth.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJub3hlaHRoZnhmZmlyYWZsb3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMjEzNzQsImV4cCI6MjA4MzU5NzM3NH0.9HqDWUW6iYUL6tIkiY3PnJ1vYJobWEunoeMi1XQkV9A";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;

    if (code) {
        const cookieStore = cookies();

        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
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
                            // Ignore write errors in strict mode
                        }
                    },
                },
            }
        );

        const { data: { session } } = await supabase.auth.exchangeCodeForSession(code);

        if (session?.user) {
            // Check if user is a teacher
            const { data: teacherProfile } = await supabase
                .from('teacher_profiles')
                .select('id')
                .eq('user_id', session.user.id)
                .single();

            if (teacherProfile) {
                // Teacher - go directly to teacher dashboard
                return NextResponse.redirect(`${origin}/teacher`);
            }

            // Check if user has completed onboarding (has enrollment)
            const { data: enrollment } = await supabase
                .from('enrollments')
                .select('id')
                .eq('user_id', session.user.id)
                .single();

            if (enrollment) {
                // Already onboarded - go to dashboard
                return NextResponse.redirect(`${origin}/dashboard`);
            }
        }

        // New user - go to onboarding
        return NextResponse.redirect(`${origin}/onboarding`);
    }

    return NextResponse.redirect(`${origin}/dashboard`);
}
