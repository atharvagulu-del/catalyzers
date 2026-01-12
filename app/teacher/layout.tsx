"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { checkIsTeacher } from "@/lib/offlineTests";
import Link from "next/link";
import {
    Loader2,
    LayoutDashboard,
    Users,
    FileText,
    Plus,
    Menu,
    X,
    GraduationCap,
    LogOut,
    ChevronRight,
    Moon,
    Sun
} from "lucide-react";
import { useTheme } from "next-themes";

const teacherNavItems = [
    {
        name: "Dashboard",
        href: "/teacher",
        icon: LayoutDashboard,
    },
    {
        name: "Students",
        href: "/teacher/students",
        icon: Users,
    },
    {
        name: "All Tests",
        href: "/teacher/tests",
        icon: FileText,
    },
    {
        name: "Create Test",
        href: "/teacher/tests/create",
        icon: Plus,
    },
];

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { session, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isTeacher, setIsTeacher] = useState<boolean | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        async function verifyTeacher() {
            if (!session?.user?.id) {
                router.push("/");
                return;
            }

            if (session.user.email === "ritagulve1984@gmail.com") {
                setIsTeacher(true);
                return;
            }

            const teacherStatus = await checkIsTeacher(session.user.id);
            setIsTeacher(teacherStatus);

            if (!teacherStatus) {
                router.push("/dashboard");
            }
        }

        verifyTeacher();
    }, [session, router]);

    if (isTeacher === null) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
                    <p className="text-slate-500 mt-4">Verifying teacher access...</p>
                </div>
            </div>
        );
    }

    if (!isTeacher) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="text-center max-w-md px-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Access Denied
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        You don&apos;t have teacher privileges. Please contact an administrator
                        if you believe this is an error.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                        Go to Student Dashboard
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-50 flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                    >
                        {isSidebarOpen ? (
                            <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                        ) : (
                            <Menu className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                        )}
                    </button>
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                        <span className="font-bold text-slate-900 dark:text-white">
                            Teacher Panel
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                >
                    {theme === "dark" ? (
                        <Sun className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    ) : (
                        <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    )}
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-900 dark:text-white">
                            Catalyzers
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Teacher Panel
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {teacherNavItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/teacher" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                {session?.user?.email?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                {session?.user?.user_metadata?.name || "Teacher"}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                                {session?.user?.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
                        >
                            {theme === "dark" ? (
                                <Sun className="w-4 h-4" />
                            ) : (
                                <Moon className="w-4 h-4" />
                            )}
                        </button>
                        <button
                            onClick={() => signOut()}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
            </main>
        </div>
    );
}
