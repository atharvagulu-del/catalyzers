import { useAuth } from "@/components/auth/AuthProvider";

// Mocking useSession for compatibility with existing components mostly
// But redirecting them to using our new Supabase Auth Context
// This allows us to keep some compatibility or we can refactor usage.

export const useSession = () => {
    const { session, user, fullName } = useAuth();

    // Mimic NextAuth structure for easier refactoring
    if (!session) return { data: null, status: "unauthenticated" };

    return {
        data: {
            user: {
                name: fullName || user?.email?.split('@')[0] || "Student",
                email: user?.email,
                image: null,
                // These will be fetched from DB later, for now mock or metadata
                class: user?.user_metadata?.class || "11",
                exam: user?.user_metadata?.exam || "JEE"
            }
        },
        status: "authenticated"
    };
};

export const signOut = async () => {
    // This is a dummy export to satisfy imports, 
    // but components should use useAuth().signOut() ideally 
    // or we import the singleton supabase and sign out.
    const { supabase } = require("@/lib/supabase");
    await supabase.auth.signOut();
    window.location.href = "/";
};
