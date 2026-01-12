"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
    getTeacherProfile,
    getTeacherDashboardStats,
    getAllTests,
    TeacherProfile,
    OfflineTest
} from "@/lib/offlineTests";
import {
    Users,
    FileText,
    Award,
    TrendingUp,
    Calendar,
    Plus,
    ChevronRight,
    Loader2,
    BookOpen
} from "lucide-react";
import Link from "next/link";

export default function TeacherDashboard() {
    const { session } = useAuth();
    const [profile, setProfile] = useState<TeacherProfile | null>(null);
    const [stats, setStats] = useState({
        totalStudents: 0,
        enrolledStudents: 0,
        totalTests: 0,
        testsWithMarks: 0,
    });
    const [recentTests, setRecentTests] = useState<OfflineTest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!session?.user?.id) return;

            try {
                const [profileData, statsData, testsData] = await Promise.all([
                    getTeacherProfile(session.user.id),
                    getTeacherDashboardStats(),
                    getAllTests(),
                ]);

                setProfile(profileData);
                setStats(statsData);
                setRecentTests(testsData.slice(0, 5));
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [session]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-blue-100 mb-1">Welcome back,</p>
                        <h1 className="text-2xl md:text-3xl font-bold">
                            {profile?.name || session?.user?.user_metadata?.name || "Teacher"}
                        </h1>
                        {profile?.subjects && profile.subjects.length > 0 && (
                            <div className="flex items-center gap-2 mt-3">
                                <BookOpen className="w-4 h-4 text-blue-200" />
                                <span className="text-blue-100 text-sm">
                                    {profile.subjects.join(", ")}
                                </span>
                            </div>
                        )}
                    </div>
                    <Link
                        href="/teacher/tests/create"
                        className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create Test
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.totalStudents}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Total Students
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                            <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.enrolledStudents}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Enrolled
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.totalTests}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Total Tests
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.testsWithMarks}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Marks Entered
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
                <Link
                    href="/teacher/students"
                    className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                    Manage Students
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    View and edit enrollments
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                </Link>
                <Link
                    href="/teacher/tests/create"
                    className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                    Create Test
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Schedule a new test
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                    </div>
                </Link>
                <Link
                    href="/teacher/tests"
                    className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700 transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                    View All Tests
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Manage existing tests
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                    </div>
                </Link>
            </div>

            {/* Recent Tests */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Recent Tests
                    </h2>
                    <Link
                        href="/teacher/tests"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                        View All
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                {recentTests.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 text-center">
                        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                            No tests created yet
                        </p>
                        <Link
                            href="/teacher/tests/create"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Create Your First Test
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Test Name
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Subject
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Class
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {recentTests.map((test) => (
                                        <tr
                                            key={test.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                        >
                                            <td className="px-4 py-4">
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {test.test_name}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-slate-600 dark:text-slate-400">
                                                    {test.subject}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300">
                                                    Class {test.class}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-slate-600 dark:text-slate-400">
                                                    {new Date(test.test_date).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                {test.is_marks_entered ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                                        <Award className="w-3 h-3" />
                                                        Marks Entered
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30 text-xs font-medium text-amber-700 dark:text-amber-400">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <Link
                                                    href={`/teacher/tests/${test.id}/marks`}
                                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    {test.is_marks_entered ? "View/Edit" : "Enter Marks"}
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
