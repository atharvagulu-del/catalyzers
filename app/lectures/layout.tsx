"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function LecturesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { session } = useAuth();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // Basic auth check only for lectures - strict profile check not needed here for access 
            // but we keep consistent with dashboard for UX
            const { data } = await import("@/lib/supabase").then(m => m.supabase.auth.getSession());

            if (!data.session) {
                // If not logged in, we might allow viewing lectures or redirect? 
                // Based on Header.tsx, public can see some stuff, but Lectures usually require auth.
                // The current page.tsx uses useAuth() so it expects auth.
                // We'll enforce auth.
                router.push("/");
            }
            setCheckingAuth(false);
        }
        checkAuth();
    }, [session, router]);

    if (checkingAuth) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <DashboardHeader onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

            <div className="flex pt-0">
                {/* Sidebar - Desktop & Mobile (Restored) */}
                <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

                {/* Main Content - Unified Dashboard Layout Style */}
                <main className="flex-1 md:ml-64 bg-white dark:bg-black min-h-[calc(100vh-4rem)] relative transition-colors duration-300">
                    <div className="h-full pt-2 pl-4 pr-4 md:pt-3 md:pl-6 md:pr-6 pb-0 flex flex-col">
                        {/* White Card with Rounded Top Corners on BOTH sides */}
                        <div className="w-full h-full bg-[#F0F6FE] dark:bg-[#0A0A0A] rounded-t-[40px] border-t border-x border-slate-200 dark:border-neutral-800 overflow-hidden shadow-sm">
                            <div className="h-full p-6 md:p-8 overflow-y-auto">
                                <div className="max-w-7xl mx-auto">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
