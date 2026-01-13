"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import {
    getMyTestsWithResults,
    TestWithResults,
} from "@/lib/offlineTests";
import {
    Calendar as CalendarIcon,
    Clock,
    ArrowLeft,
    BookOpen,
    Loader2,
    ChevronRight,
    Timer
} from "lucide-react";
import SyllabusModal from "@/components/dashboard/SyllabusModal";

export default function CalendarPage() {
    const { session } = useAuth();
    const [tests, setTests] = useState<TestWithResults[]>([]);
    const [loading, setLoading] = useState(true);

    // Syllabus Modal State
    const [syllabusModal, setSyllabusModal] = useState<{
        isOpen: boolean;
        test: TestWithResults | null;
    }>({ isOpen: false, test: null });

    useEffect(() => {
        async function fetchData() {
            if (!session?.user?.id) return;

            try {
                const testsData = await getMyTestsWithResults(session.user.id);
                setTests(testsData);
            } catch (error) {
                console.error("Error fetching tests:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [session]);

    const now = new Date();

    // Get upcoming tests sorted by date
    const upcomingTests = tests
        .filter(t => new Date(t.start_time) > now)
        .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

    // Group tests by date
    const groupedTests: { [date: string]: TestWithResults[] } = {};
    upcomingTests.forEach(test => {
        const dateKey = new Date(test.test_date).toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        if (!groupedTests[dateKey]) {
            groupedTests[dateKey] = [];
        }
        groupedTests[dateKey].push(test);
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-5 md:space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard"
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </Link>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                        Upcoming Schedule
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-sm">
                        {upcomingTests.length} upcoming {upcomingTests.length === 1 ? 'test' : 'tests'}
                    </p>
                </div>
            </div>

            {upcomingTests.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-12 border border-slate-200 dark:border-slate-700 text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        No Upcoming Tests
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        Enjoy your free time! Your teacher will schedule tests soon.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedTests).map(([date, dateTests]) => (
                        <div key={date}>
                            {/* Date Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                    <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h2 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white">
                                    {date}
                                </h2>
                            </div>

                            {/* Tests for this date */}
                            <div className="space-y-3 ml-0 md:ml-13">
                                {dateTests.map((test) => {
                                    const startTime = new Date(test.start_time);
                                    const endTime = new Date(test.end_time);
                                    const durationMins = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

                                    return (
                                        <div
                                            key={test.id}
                                            className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                                                        {test.test_name}
                                                    </h3>
                                                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                                                        <span className="inline-flex items-center gap-1 text-xs md:text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                                            <BookOpen className="w-3.5 h-3.5" />
                                                            {test.subject}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 text-xs md:text-sm text-slate-500 dark:text-slate-400">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {startTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 text-xs md:text-sm text-slate-500 dark:text-slate-400">
                                                            <Timer className="w-3.5 h-3.5" />
                                                            {durationMins} mins
                                                        </span>
                                                    </div>
                                                    {test.chapters && test.chapters.length > 0 && (
                                                        <button
                                                            onClick={() => setSyllabusModal({ isOpen: true, test })}
                                                            className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                                        >
                                                            View Syllabus ({test.chapters.length} topics)
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                                                        {test.max_marks}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">marks</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Syllabus Modal */}
            {syllabusModal.test && (
                <SyllabusModal
                    isOpen={syllabusModal.isOpen}
                    onClose={() => setSyllabusModal({ isOpen: false, test: null })}
                    testName={syllabusModal.test.test_name}
                    subject={syllabusModal.test.subject}
                    chapters={syllabusModal.test.chapters || []}
                    customTopics={syllabusModal.test.custom_topics || []}
                    examType={syllabusModal.test.exam_type || 'JEE'}
                    grade={syllabusModal.test.class}
                />
            )}
        </div>
    );
}
