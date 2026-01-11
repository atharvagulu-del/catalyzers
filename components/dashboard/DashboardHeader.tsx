"use client";

import { Bell, Menu, ChevronRight } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
    const { user } = useAuth();
    const [userProfile, setUserProfile] = useState<{ class?: string, exam?: string } | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('userProfile');
        if (saved) {
            setUserProfile(JSON.parse(saved));
        }
    }, []);

    // Fallback if metadata is missing/loading
    const displayClass = userProfile?.class || "";
    const displayExam = userProfile?.exam || "";

    return (
        <header className="sticky top-0 z-30 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16">
            <div className="h-full px-4 md:px-6 flex items-center justify-between">

                {/* Left: Mobile Toggle & Logo */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <Link href="/dashboard" className="flex items-center gap-2">
                        {/* Catalyzer Logo (Blue text like ALLEN) */}
                        <span className="font-extrabold text-2xl tracking-tighter text-[#0056B3] dark:text-blue-500">
                            CATALYZER
                        </span>
                    </Link>
                </div>

                {/* Right: Exam Info & Profile */}
                <div className="flex items-center gap-4 md:gap-6">
                    {/* Class & Exam Info (Allen Style) */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-none">
                                {(displayClass && displayExam) ? `${displayClass} • ${displayExam}` : <span className="text-orange-600">Complete Profile</span>}
                            </p>
                            <Link href="/courses" className="text-xs font-semibold text-blue-600 hover:underline flex items-center justify-end gap-0.5 mt-0.5">
                                Explore courses <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-8 w-px bg-slate-200 hidden md:block" />

                    {/* Notifications */}
                    <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors hidden sm:block">
                        <Bell className="w-5 h-5" />
                    </button>

                    {/* Profile */}
                    <ProfileMenu />
                </div>
            </div>
        </header>
    );
}
