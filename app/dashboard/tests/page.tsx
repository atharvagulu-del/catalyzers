"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import {
    getMyEnrollment,
    getMyTestsWithResults,
    TestWithResults,
    Enrollment,
} from "@/lib/offlineTests";
import {
    Calendar,
    Clock,
    Award,
    TrendingUp,
    BookOpen,
    ChevronRight,
    Target,
    Loader2,
    BarChart3,
    CheckCircle,
    Timer,
    Filter,
    Image as ImageIcon,
    X,
    ChevronLeft,
    ChevronRightIcon,
    AlertCircle,
    PlayCircle
} from "lucide-react";
import SyllabusModal from "@/components/dashboard/SyllabusModal";
import TestPaperModal from "@/components/dashboard/TestPaperModal";
import Image from "next/image";

// Helper to determine test status
type TestStatus = 'upcoming' | 'live' | 'ended' | 'results_out';

function getTestStatus(test: TestWithResults): TestStatus {
    const now = new Date();
    const start = new Date(test.start_time);
    const end = new Date(test.end_time);

    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'live';
    if (test.is_marks_entered && test.my_result?.marks_obtained !== null && test.my_result?.marks_obtained !== undefined) return 'results_out';
    return 'ended';
}



export default function StudentTestsPage() {
    const { session, user } = useAuth();
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [tests, setTests] = useState<TestWithResults[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter state
    const [subjectFilter, setSubjectFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Syllabus Modal State
    const [syllabusModal, setSyllabusModal] = useState<{
        isOpen: boolean;
        test: TestWithResults | null;
    }>({ isOpen: false, test: null });

    // Test Paper Modal State
    const [testPaperModal, setTestPaperModal] = useState<{
        isOpen: boolean;
        testName: string;
        images: string[];
    }>({ isOpen: false, testName: '', images: [] });

    // Get user exam type from profile
    const userExam = useMemo(() => {
        if (typeof window === 'undefined') return 'JEE';
        const saved = localStorage.getItem('userProfile');
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.exam || 'JEE';
        }
        return user?.user_metadata?.exam || 'JEE';
    }, [user]);

    // Get subjects based on exam type
    const subjectOptions = useMemo(() => {
        if (userExam === 'NEET') {
            return ['Physics', 'Chemistry', 'Biology'];
        }
        return ['Physics', 'Chemistry', 'Mathematics'];
    }, [userExam]);

    const fetchData = useCallback(async () => {
        if (!session?.user?.id) return;

        try {
            setLoading(true);
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
    }, [session]);

    useEffect(() => {
        fetchData();

        // Refresh data every 30 seconds for real-time updates
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    // Filter tests by subject and status
    const filteredTests = useMemo(() => {
        return tests.filter(t => {
            // Subject filter
            if (subjectFilter !== "all" && t.subject.toLowerCase() !== subjectFilter.toLowerCase()) {
                return false;
            }

            // Status filter
            if (statusFilter !== "all") {
                const status = getTestStatus(t);
                if (statusFilter !== status) return false;
            }

            return true;
        });
    }, [tests, subjectFilter, statusFilter]);

    // Group tests by status
    const liveTests = filteredTests.filter(t => getTestStatus(t) === 'live');
    const upcomingTests = filteredTests.filter(t => getTestStatus(t) === 'upcoming');
    const resultsOutTests = filteredTests.filter(t => getTestStatus(t) === 'results_out');
    const endedTests = filteredTests.filter(t => getTestStatus(t) === 'ended');

    // Stats calculations from ALL tests (not filtered)
    const allResultsOut = tests.filter(t => getTestStatus(t) === 'results_out');
    const avgPercentile = allResultsOut.length > 0
        ? Math.round(allResultsOut.reduce((sum, t) => sum + (t.my_percentile || 0), 0) / allResultsOut.length)
        : null;

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
            <div className="space-y-6 p-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                        My Tests
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
                        View your test schedule and results
                    </p>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 rounded-2xl p-6 md:p-8 border border-indigo-100 dark:border-indigo-800">
                    <div className="text-center max-w-md mx-auto">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-slate-800 shadow-sm rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-7 h-7 md:w-8 md:h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">
                            Unlock Offline Tests
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
                            Join our offline classroom program to access exclusive tests and personalized feedback.
                        </p>
                        <Link
                            href="/courses"
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20"
                        >
                            Explore Offline Courses
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Render test card based on status
    const renderTestCard = (test: TestWithResults) => {
        const status = getTestStatus(test);
        const score = test.my_result?.marks_obtained;
        const hasScore = score !== null && score !== undefined;
        const hasTestPaper = test.test_paper && test.test_paper.length > 0;

        return (
            <div
                key={test.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all"
            >
                {/* Status Header */}
                <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${status === 'live' ? 'bg-red-500 text-white' :
                    status === 'results_out' ? 'bg-emerald-500 text-white' :
                        status === 'ended' ? 'bg-amber-500 text-white' :
                            'bg-blue-500 text-white'
                    }`}>
                    <div className="flex items-center gap-2">
                        {status === 'live' && <><span className="w-2 h-2 bg-white rounded-full animate-pulse" /> Live Now</>}
                        {status === 'results_out' && <><CheckCircle className="w-3.5 h-3.5" /> Results Out</>}
                        {status === 'ended' && <><Timer className="w-3.5 h-3.5" /> Awaiting Results</>}
                        {status === 'upcoming' && <><Clock className="w-3.5 h-3.5" /> Upcoming</>}
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg truncate">
                                {test.test_name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                                    {test.subject}
                                </span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    {test.max_marks} marks
                                </span>
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                                {new Date(test.test_date).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                })}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                Class {test.class}
                            </div>
                        </div>
                    </div>

                    {/* Score Display (only for results_out) */}
                    {status === 'results_out' && hasScore && (
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 mb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                                        {score}/{test.max_marks}
                                    </div>
                                    <div className="text-sm text-emerald-600 dark:text-emerald-500">
                                        Your Score ({Math.round((score / test.max_marks) * 100)}%)
                                    </div>
                                </div>
                                {test.my_percentile !== undefined && (
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                            {test.my_percentile}%ile
                                        </div>
                                        <div className="text-sm text-purple-500 dark:text-purple-400">
                                            Percentile
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                        {/* View Syllabus */}
                        {test.chapters && test.chapters.length > 0 && (
                            <button
                                onClick={() => setSyllabusModal({ isOpen: true, test })}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <BookOpen className="w-4 h-4" />
                                Syllabus
                            </button>
                        )}

                        {/* View Test Paper (only when results are out) */}
                        {status === 'results_out' && (
                            hasTestPaper ? (
                                <button
                                    onClick={() => setTestPaperModal({
                                        isOpen: true,
                                        testName: test.test_name,
                                        images: test.test_paper || []
                                    })}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg text-sm font-medium transition-colors border border-indigo-200 dark:border-indigo-800"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    View Paper
                                </button>
                            ) : (
                                <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 cursor-not-allowed" title="No test paper uploaded">
                                    <ImageIcon className="w-4 h-4" />
                                    No Paper
                                </div>
                            )
                        )}

                        {/* View Results */}
                        {status === 'results_out' && (
                            <Link
                                href={`/dashboard/performance/test/${test.id}`}
                                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors ml-auto"
                            >
                                <BarChart3 className="w-4 h-4" />
                                View Analysis
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        )}

                        {/* Live Test CTA */}
                        {status === 'live' && (
                            <div className="flex items-center gap-2 ml-auto">
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    Ends at {new Date(test.end_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-5 md:space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                        My Tests
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
                        View your test schedule and results
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 w-fit">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        Enrolled • {userExam}
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="space-y-3">
                {/* Subject Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 flex-shrink-0">
                        <Filter className="w-4 h-4" />
                        <span>Subject:</span>
                    </div>
                    <button
                        onClick={() => setSubjectFilter("all")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${subjectFilter === "all"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                    >
                        All
                    </button>
                    {subjectOptions.map(subject => (
                        <button
                            key={subject}
                            onClick={() => setSubjectFilter(subject)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${subjectFilter === subject
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                }`}
                        >
                            {subject}
                        </button>
                    ))}
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 flex-shrink-0">
                        <Target className="w-4 h-4" />
                        <span>Status:</span>
                    </div>
                    {[
                        { key: 'all', label: 'All' },
                        { key: 'results_out', label: 'Results Out' },
                        { key: 'ended', label: 'Awaiting Results' },
                        { key: 'upcoming', label: 'Upcoming' },
                    ].map(item => (
                        <button
                            key={item.key}
                            onClick={() => setStatusFilter(item.key)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${statusFilter === item.key
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-3 md:p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                                {tests.filter(t => getTestStatus(t) === 'upcoming').length}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Upcoming</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-3 md:p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                                {allResultsOut.length}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Results Out</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-3 md:p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                                {avgPercentile !== null ? `${avgPercentile}` : "-"}
                                {avgPercentile !== null && <span className="text-sm font-normal">%ile</span>}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Avg Percentile</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-3 md:p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Timer className="w-4 h-4 md:w-5 md:h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                                {tests.filter(t => getTestStatus(t) === 'ended').length}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Awaiting</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Tests */}
            {liveTests.length > 0 && (
                <div>
                    <h2 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-red-500" />
                        Live Now
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {liveTests.map(renderTestCard)}
                    </div>
                </div>
            )}

            {/* Results Out */}
            {resultsOutTests.length > 0 && (
                <div>
                    <h2 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-emerald-600" />
                        Results Out
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {resultsOutTests.map(renderTestCard)}
                    </div>
                </div>
            )}

            {/* Awaiting Results */}
            {endedTests.length > 0 && (
                <div>
                    <h2 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        Awaiting Results
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {endedTests.map(renderTestCard)}
                    </div>
                </div>
            )}

            {/* Upcoming Tests */}
            {upcomingTests.length > 0 && (
                <div>
                    <h2 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        Upcoming Tests
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {upcomingTests.map(renderTestCard)}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {filteredTests.length === 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 text-center">
                    <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400">
                        No tests found for the selected filters.
                    </p>
                    <button
                        onClick={() => { setSubjectFilter("all"); setStatusFilter("all"); }}
                        className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                    >
                        Clear Filters
                    </button>
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

            {/* Test Paper Modal */}
            <TestPaperModal
                isOpen={testPaperModal.isOpen}
                onClose={() => setTestPaperModal({ isOpen: false, testName: '', images: [] })}
                testName={testPaperModal.testName}
                images={testPaperModal.images}
            />
        </div>
    );
}
