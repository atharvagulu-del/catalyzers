"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Loader2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [activeTab, setActiveTab] = useState<"login" | "register">("login");
    const [isLoading, setIsLoading] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const router = useRouter();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    // Check if user is a teacher
    const checkIsTeacher = async (userId: string): Promise<boolean> => {
        console.log('[Auth] Checking teacher status for user:', userId);
        const { data, error } = await supabase
            .from('teacher_profiles')
            .select('id')
            .eq('user_id', userId)
            .single();
        console.log('[Auth] Teacher check result:', { data, error });
        return !!data;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (activeTab === "login") {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: form.email,
                    password: form.password,
                });

                if (error) throw error;

                // Refresh session to get latest user_metadata
                const { data: refreshData } = await supabase.auth.refreshSession();
                const currentUser = refreshData?.user || data.user;

                console.log('[Login] User data:', currentUser?.email);
                console.log('[Login] User metadata:', currentUser?.user_metadata);

                // Check role from user_metadata
                if (currentUser) {
                    const userRole = currentUser.user_metadata?.role;
                    console.log('[Login] Role detected:', userRole);
                    onClose();

                    // Use window.location for a hard redirect that will definitely work
                    if (userRole === 'teacher') {
                        console.log('[Login] Hard redirect to /teacher');
                        window.location.href = "/teacher";
                    } else {
                        console.log('[Login] Hard redirect to /dashboard');
                        window.location.href = "/dashboard";
                    }
                    return;
                }

                onClose();
                router.push("/dashboard");

            } else {
                // Register - new users default to 'student' role
                const { data, error } = await supabase.auth.signUp({
                    email: form.email,
                    password: form.password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                        data: {
                            role: 'student'  // Default role for new signups
                        }
                    }
                });

                if (error) throw error;

                // Check if session key exists (means auto-confirmed/fake email) or not
                if (data?.session && data.user) {
                    onClose();
                    router.push("/onboarding");
                } else {
                    // Email verification required
                    setVerificationSent(true);
                }
            }
        } catch (error: any) {
            console.error("Auth error:", error);
            alert(error.message || "Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {activeTab === "login" ? "Welcome Back" : "Create Account"}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-slate-500" />
                                </button>
                            </div>

                            <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
                                <button
                                    onClick={() => setActiveTab("login")}
                                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === "login"
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => setActiveTab("register")}
                                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === "register"
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    Register
                                </button>
                            </div>

                            {verificationSent ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Check your inbox</h3>
                                    <p className="text-slate-600 mb-6">
                                        We&apos;ve sent a verification link to <strong>{form.email}</strong>. Please click the link to verify your account.
                                    </p>
                                    <Button
                                        onClick={() => {
                                            setVerificationSent(false);
                                            setActiveTab("login");
                                        }}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Back to Login
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Email Field - moved up as first field */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="email"
                                                required
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="password"
                                                required
                                                value={form.password}
                                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>


                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-6 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : activeTab === "login" ? (
                                            "Sign In"
                                        ) : (
                                            "Create Account"
                                        )}
                                    </Button>
                                </form>
                            )}

                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-slate-200" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-slate-500">Or continue with</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 font-medium border-slate-200 hover:bg-slate-50"
                                        onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
                                    >
                                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                            <path
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                fill="#EA4335"
                                            />
                                        </svg>
                                        Google
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
