"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useTheme } from "next-themes";
import { LogOut, Settings, User, Moon, Sun, ChevronDown, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfileMenu() {
    const { user, fullName, signOut } = useAuth();
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const displayName = fullName || user?.email?.split('@')[0] || "Student";
    const initial = displayName[0].toUpperCase();

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await signOut();
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-full transition-colors"
            >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
                    {initial}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-50 origin-top-right"
                    >
                        {/* User Header in Dropdown */}
                        <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 mb-2">
                            <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{displayName}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="px-2 space-y-1">
                            {user?.email === "ritagulve1984@gmail.com" && (
                                <Link
                                    href="/teacher"
                                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors mb-1"
                                >
                                    <GraduationCap className="w-4 h-4" />
                                    Teacher Panel
                                </Link>
                            )}
                            <Link
                                href="/dashboard/performance"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <User className="w-4 h-4 text-slate-400" />
                                My Profile (Performance)
                            </Link>
                            <button
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors opacity-50 cursor-not-allowed"
                                disabled
                            >
                                <Settings className="w-4 h-4 text-slate-400" />
                                Settings (Coming Soon)
                            </button>
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                {theme === "dark" ? <Sun className="w-4 h-4 text-slate-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
                                {theme === "dark" ? "Light Mode" : "Dark Mode"}
                            </button>
                        </div>

                        <div className="my-2 border-t border-slate-50 dark:border-slate-800" />

                        <div className="px-2">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
