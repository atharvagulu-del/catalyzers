"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { getPerformanceStats, PerformanceStats } from "@/lib/performanceTracking";
import { Clock, Trophy, HelpCircle, TrendingUp, Edit3, Loader2, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function PerformancePage() {
    const router = useRouter();
    const { user, fullName } = useAuth();
    const [stats, setStats] = useState<PerformanceStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<{ exam?: string; name?: string }>({});
    const [showAllTests, setShowAllTests] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('userProfile');
        if (saved) {
            setUserProfile(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        const loadStats = async () => {
            if (!user) return;
            setIsLoading(true);
            const data = await getPerformanceStats(user.id);
            setStats(data);
            setIsLoading(false);
        };
        loadStats();
    }, [user]);

    const displayName = fullName || userProfile.name || user?.email?.split('@')[0] || 'Student';
    const displayExam = userProfile.exam || 'JEE (Main + Adv)';

    // Show only 3 recent tests in main view
    const displayedTests = stats?.recentTests?.slice(0, 3) || [];
    const hasMoreTests = (stats?.recentTests?.length || 0) > 3;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-slate-900 dark:bg-slate-900 rounded-3xl p-6 md:p-8 text-white">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl md:text-4xl font-bold">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">{displayName}</h1>
                            <p className="text-slate-400 flex items-center gap-2 mt-1">
                                <span>✉️ {user?.email}</span>
                                <span className="text-slate-600">•</span>
                                <span>Class 11 - {displayExam}</span>
                            </p>
                            <span className="inline-block mt-3 px-3 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-full">
                                Active Student
                            </span>
                        </div>
                    </div>
                    <Link
                        href="/dashboard/profile"
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
                    >
                        <Edit3 className="w-4 h-4" />
                        Edit Profile
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 md:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                        <Trophy className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{stats?.testsTaken || 0}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Tests Taken</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 md:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                        <Clock className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{stats?.lectureHours || 0}h</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Lecture Hours</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 md:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                        <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{stats?.questionsSolved || 0}+</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Questions Solved</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 md:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                        <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{stats?.averageAccuracy || 0}%</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Avg. Accuracy</p>
                </div>
            </div>

            {/* Recent Tests Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-5 md:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Tests</h2>
                    {hasMoreTests && (
                        <button
                            onClick={() => setShowAllTests(true)}
                            className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline"
                        >
                            View Full Report
                        </button>
                    )}
                </div>

                {displayedTests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800">
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-400">Test</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-400">Subject</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-400">Score</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-400">Accuracy</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-400">When</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedTests.map((test) => (
                                    <tr
                                        key={test.id}
                                        className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                        onClick={() => router.push(`/dashboard/performance/test/${test.id}`)}
                                    >
                                        <td className="py-4 px-6">
                                            <span className="font-semibold text-slate-900 dark:text-white">{test.testTitle}</span>
                                        </td>
                                        <td className="py-4 px-6 text-slate-600 dark:text-slate-300">{test.subject}</td>
                                        <td className="py-4 px-6">
                                            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-lg">
                                                {Math.round(test.effectiveScore)}/{test.totalQuestions}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${test.scorePercentage >= 80 ? 'bg-green-500' : test.scorePercentage >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                        style={{ width: `${Math.min(100, test.scorePercentage)}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-slate-600 dark:text-slate-300">{Math.round(test.scorePercentage)}%</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-sm">{test.lastActivity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Tests Taken Yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                            Complete some tests to see your progress here!
                        </p>
                        <Link
                            href="/lectures"
                            className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                        >
                            Start Learning
                        </Link>
                    </div>
                )}
            </div>

            {/* Full Report Modal */}
            <AnimatePresence>
                {showAllTests && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowAllTests(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">All Test Results</h2>
                                <button onClick={() => setShowAllTests(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[60vh]">
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-white dark:bg-slate-900">
                                        <tr className="border-b border-slate-200 dark:border-slate-800">
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-400">Test</th>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-400">Subject</th>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-400">Score</th>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-400">Accuracy</th>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-400">When</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats?.recentTests?.map((test) => (
                                            <tr
                                                key={test.id}
                                                className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                                onClick={() => router.push(`/dashboard/performance/test/${test.id}`)}
                                            >
                                                <td className="py-4 px-6">
                                                    <span className="font-semibold text-slate-900 dark:text-white">{test.testTitle}</span>
                                                </td>
                                                <td className="py-4 px-6 text-slate-600 dark:text-slate-300">{test.subject}</td>
                                                <td className="py-4 px-6">
                                                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-lg">
                                                        {Math.round(test.effectiveScore)}/{test.totalQuestions}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`font-medium ${test.scorePercentage >= 80 ? 'text-green-600' : test.scorePercentage >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                                        {Math.round(test.scorePercentage)}%
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-sm">{test.lastActivity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
