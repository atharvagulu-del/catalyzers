"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import {
    getMyEnrollment,
    getMyTestsWithResults,
    TestWithResults,
    Enrollment,
    getTestResultsWithRankings
} from "@/lib/offlineTests";
import {
    Calendar,
    Clock,
    Award,
    TrendingUp,
    BookOpen,
    ChevronRight,
    Trophy,
    Users,
    Target,
    Loader2,
    X,
    Medal
} from "lucide-react";

export default function StudentTestsPage() {
    const { session } = useAuth();
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [tests, setTests] = useState<TestWithResults[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTest, setSelectedTest] = useState<TestWithResults | null>(null);
    const [showRankings, setShowRankings] = useState(false);
    const [rankingsData, setRankingsData] = useState<{
        test: TestWithResults | null;
        results: { rank: number; percentile: number; marks_obtained: number | null; student_id: string; enrollment?: { name: string } }[];
    } | null>(null);
    const [loadingRankings, setLoadingRankings] = useState(false);

    useEffect(() => {
        async function fetchData() {
            if (!session?.user?.id) return;

            try {
                const [enrollmentData, testsData] = await Promise.all([
                    getMyEnrollment(session.user.id),
                    getMyTestsWithResults(session.user.id),
                ]);

                setEnrollment(enrollmentData);
                setTests(testsData);
            } catch (error) {
                console.error("Error fetching tests:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [session]);

    const handleViewRankings = async (test: TestWithResults) => {
        setLoadingRankings(true);
        setShowRankings(true);
        setSelectedTest(test);

        try {
            const data = await getTestResultsWithRankings(test.id);
            setRankingsData({ ...data, test: test });
        } catch (error) {
            console.error("Error fetching rankings:", error);
        } finally {
            setLoadingRankings(false);
        }
    };

    const today = new Date().toISOString().split("T")[0];
    const upcomingTests = tests.filter((t) => t.test_date >= today);
    const pastTests = tests.filter((t) => t.test_date < today);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    // Not enrolled state
    if (!enrollment || enrollment.enrollment_status !== "ENROLLED") {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        My Tests
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        View your test schedule and results
                    </p>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-800">
                    <div className="text-center max-w-md mx-auto">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 shadow-sm rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            Unlock Offline Tests
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
                            Join our offline classroom program to access exclusive tests,
                            performance analysis, and personalized feedback.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/courses"
                                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20"
                            >
                                Explore Offline Courses
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                            <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <span>Already enrolled?</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                    Contact your admin
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        My Tests
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        View your test schedule, results, and rankings
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        Enrolled
                    </span>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {upcomingTests.length}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Upcoming
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {pastTests.filter((t) => t.my_result).length}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Completed
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {pastTests.filter((t) => t.my_percentile !== undefined).length > 0
                                    ? Math.round(
                                        pastTests
                                            .filter((t) => t.my_percentile !== undefined)
                                            .reduce((sum, t) => sum + (t.my_percentile || 0), 0) /
                                        pastTests.filter((t) => t.my_percentile !== undefined).length
                                    )
                                    : "-"}
                                {pastTests.filter((t) => t.my_percentile !== undefined).length > 0 && (
                                    <span className="text-sm font-normal">%ile</span>
                                )}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Avg Percentile
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {pastTests.filter((t) => t.my_rank === 1).length}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Top Ranks
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Tests */}
            <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Upcoming Tests
                </h2>
                {upcomingTests.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 text-center">
                        <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400">
                            No upcoming tests scheduled
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {upcomingTests.map((test) => (
                            <div
                                key={test.id}
                                className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                {test.test_name}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    {test.subject}
                                                </span>
                                                <span className="text-slate-300 dark:text-slate-600">
                                                    •
                                                </span>
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    Max: {test.max_marks} marks
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                            {new Date(test.test_date).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            Class {test.class}
                                            {test.batch && ` • ${test.batch}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Past Tests */}
            <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    Past Tests & Results
                </h2>
                {pastTests.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 text-center">
                        <Award className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400">
                            No past tests yet
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pastTests.map((test) => (
                            <div
                                key={test.id}
                                className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${test.my_result
                                                ? "bg-emerald-100 dark:bg-emerald-900/30"
                                                : "bg-slate-100 dark:bg-slate-700"
                                                }`}
                                        >
                                            {test.my_result ? (
                                                <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                            ) : (
                                                <Clock className="w-6 h-6 text-slate-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                {test.test_name}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    {test.subject}
                                                </span>
                                                <span className="text-slate-300 dark:text-slate-600">
                                                    •
                                                </span>
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    {new Date(test.test_date).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {test.my_result?.marks_obtained !== null &&
                                            test.my_result?.marks_obtained !== undefined ? (
                                            <>
                                                {/* Score */}
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                                                        {test.my_result.marks_obtained}/{test.max_marks}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        Score
                                                    </div>
                                                </div>
                                                {/* Rank */}
                                                {test.my_rank && (
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-1">
                                                            {test.my_rank <= 3 ? (
                                                                <Medal
                                                                    className={`w-4 h-4 ${test.my_rank === 1
                                                                        ? "text-yellow-500"
                                                                        : test.my_rank === 2
                                                                            ? "text-slate-400"
                                                                            : "text-amber-600"
                                                                        }`}
                                                                />
                                                            ) : null}
                                                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                                                #{test.my_rank}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                                            of {test.total_students}
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Percentile */}
                                                {test.my_percentile !== undefined && (
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                                            {test.my_percentile}%
                                                        </div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                                            Percentile
                                                        </div>
                                                    </div>
                                                )}
                                                {/* View Rankings Button */}
                                                <button
                                                    onClick={() => handleViewRankings(test)}
                                                    className="flex items-center gap-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm font-medium"
                                                >
                                                    <Users className="w-4 h-4" />
                                                    Rankings
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="text-sm text-slate-500 dark:text-slate-400 italic">
                                                Results pending
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Rankings Modal */}
            {showRankings && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {selectedTest?.test_name}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {selectedTest?.subject} • Class {selectedTest?.class}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowRankings(false);
                                    setSelectedTest(null);
                                    setRankingsData(null);
                                }}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[60vh]">
                            {loadingRankings ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                </div>
                            ) : rankingsData?.results.length === 0 ? (
                                <div className="text-center py-12">
                                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500">No results available yet</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {rankingsData?.results.map((result, index) => {
                                        const isMe = result.student_id === session?.user?.id;
                                        return (
                                            <div
                                                key={result.student_id}
                                                className={`flex items-center justify-between p-3 rounded-xl ${isMe
                                                    ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800"
                                                    : "bg-slate-50 dark:bg-slate-700/50"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${result.rank === 1
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : result.rank === 2
                                                                ? "bg-slate-200 text-slate-700"
                                                                : result.rank === 3
                                                                    ? "bg-amber-100 text-amber-700"
                                                                    : "bg-slate-100 text-slate-600"
                                                            }`}
                                                    >
                                                        {result.rank <= 3 ? (
                                                            <Medal className="w-4 h-4" />
                                                        ) : (
                                                            result.rank
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className={`font-medium ${isMe ? "text-blue-700 dark:text-blue-300" : "text-slate-900 dark:text-white"}`}>
                                                            {result.enrollment?.name || "Unknown Student"}
                                                            {isMe && (
                                                                <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                                                    You
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-right">
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white">
                                                            {result.marks_obtained}/{selectedTest?.max_marks}
                                                        </p>
                                                        <p className="text-xs text-slate-500">Score</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-purple-600 dark:text-purple-400">
                                                            {result.percentile}%
                                                        </p>
                                                        <p className="text-xs text-slate-500">Percentile</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
