"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

type AuthContextType = {
    session: Session | null;
    user: User | null;
    fullName: string | null;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [fullName, setFullName] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user?.user_metadata?.full_name) {
                setFullName(session.user.user_metadata.full_name);
            }
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user?.user_metadata?.full_name) {
                setFullName(session.user.user_metadata.full_name);
            } else {
                setFullName(null);
            }

            if (_event === 'SIGNED_OUT') {
                router.push('/');
                router.refresh(); // Clear Next.js cache
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    const signOut = async () => {
        // Clear local storage immediately to prevent data leakage
        localStorage.removeItem('userProfile');

        // Clear local state
        setSession(null);
        setUser(null);
        setFullName(null);

        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ session, user, fullName, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
