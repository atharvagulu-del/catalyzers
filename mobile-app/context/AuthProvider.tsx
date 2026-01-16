import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
    session: Session | null;
    user: User | null;
    fullName: string | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [fullName, setFullName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user?.user_metadata?.full_name) {
                setFullName(session.user.user_metadata.full_name);
            }
            setIsLoading(false);
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
                router.replace('/login');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        // Clear local storage
        await AsyncStorage.removeItem('userProfile');

        // Clear local state
        setSession(null);
        setUser(null);
        setFullName(null);

        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ session, user, fullName, isLoading, signOut }}>
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
