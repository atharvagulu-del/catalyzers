"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader"; // Update import
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { session } = useAuth();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [checkingOnboarding, setCheckingOnboarding] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { data } = await import("@/lib/supabase").then(m => m.supabase.auth.getSession());
            const currentSession = data.session;

            if (!currentSession) {
                router.push("/");
                return;
            }

            // Enforce Onboarding: If user hasn't set class or exam, force them to onboarding
            const metadata = currentSession.user?.user_metadata || {};
            // Check if class OR exam is missing (and not explicitly marked as onboarded)
            // We use 'class' and 'exam' as the main indicators.
            if ((!metadata.class || !metadata.exam) && !metadata.onboarded) {
                // Check if we have local backup (in case Supabase is slow to update)
                const localProfile = localStorage.getItem('userProfile');
                if (!localProfile) {
                    console.log("Redirecting to onboarding due to missing profile...");
                    router.push("/onboarding");
                    return;
                }
            }
            // Only stop loading if we are safe
            setCheckingOnboarding(false);
        }

        // Check on mount and when session changes
        checkAuth();
    }, [session, router]);


    if (!session || checkingOnboarding) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#000000] transition-colors duration-300">
            {/* New Portal Header */}
            <DashboardHeader onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

            <div className="flex pt-0">
                {/* Sidebar - Desktop & Mobile */}
                <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

                {/* Main Content */}
                {/* Sidebar is fixed top-16, so main content needs left margin. 
                    Header is h-16.
                */}
                {/* Main Content - Allen Style Wrapper */}
                {/* 
                    Allen uses a specific light blue background #F0F6FE for the main content area.
                    It has a large rounded corner at the top-left where it meets the sidebar/header.
                */}
                {/* Main Content - Allen Style Wrapper */}
                {/* Deeper Blue Background #E0F2FE */}
                <main className="flex-1 md:ml-64 bg-white dark:bg-[#0A0A0A] min-h-[calc(100vh-4rem)] p-0 transition-colors duration-300">
                    <div className="h-full pt-2 pl-2 pr-2 md:pt-6 md:pl-6 md:pr-6 pb-0 flex flex-col">
                        {/* White Card with Rounded Top Corners on BOTH sides */}
                        <div className="flex-1 bg-[#F0F6FE] dark:bg-[#0A0A0A] rounded-t-[40px] border-t border-x border-slate-200 dark:border-neutral-800 shadow-sm overflow-hidden relative">
                            <div className="h-full p-4 md:p-8 overflow-y-auto">
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
