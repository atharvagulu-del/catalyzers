"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
    getTestWithFullDetails,
    OfflineTest,
    TestResult
} from "@/lib/offlineTests";
import {
    ArrowLeft,
    TrendingUp,
    Target,
    BookOpen,
    Loader2,
    PlayCircle,
    Sparkles,
    ChevronRight,
    Award,
    BarChart3,
    Share2,
    Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import TestPaperModal from "@/components/dashboard/TestPaperModal";

// Subject breakdown helper
const getSubjectBreakdown = (totalMarks: number, maxMarks: number, subject: string) => {
    if (subject !== "Full Test") {
        return [{ name: subject, score: totalMarks, max: maxMarks }];
    }

    const part = Math.floor(totalMarks / 3);
    const remainder = totalMarks % 3;
    const maxPart = Math.floor(maxMarks / 3);

    return [
        { name: "Physics", score: part + (remainder > 0 ? 1 : 0), max: maxPart },
        { name: "Chemistry", score: part + (remainder > 1 ? 1 : 0), max: maxPart },
        { name: "Mathematics", score: part, max: maxPart }
    ];
};

// Recommendation type
interface Recommendation {
    chapterTitle: string;
    reason: string;
    resources: {
        title: string;
        type: 'video' | 'quiz' | 'pyq';
        id: string;
    }[];
}

export default function TestResultPage({ params }: { params: { testId: string } }) {
    const { testId } = params;
    const { session } = useAuth();
    const router = useRouter();

    const [test, setTest] = useState<OfflineTest | null>(null);
    const [myResult, setMyResult] = useState<TestResult | null>(null);
    const [classAverage, setClassAverage] = useState<number>(0);
    const [totalStudents, setTotalStudents] = useState<number>(0);
    const [myPercentile, setMyPercentile] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Overview");

    // Test Paper Modal State
    const [testPaperModal, setTestPaperModal] = useState<{
        isOpen: boolean;
        images: string[];
    }>({ isOpen: false, images: [] });

    // Recommendations
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);

    useEffect(() => {
        async function loadTest() {
            if (!session?.user) return;
            try {
                const data = await getTestWithFullDetails(testId, session.user.id);
                if (data) {
                    setTest(data.test);
                    setMyResult(data.myResult);
                    setClassAverage(data.classAverage);
                    setTotalStudents(data.totalStudents);
                    setMyPercentile(data.myPercentile);
                }
            } catch (err) {
                console.error("Failed to load test", err);
            } finally {
                setLoading(false);
            }
        }
        loadTest();
    }, [session, testId]);

    // Fetch recommendations
    useEffect(() => {
        async function fetchRecommendations() {
            if (!test || !myResult) return;

            setLoadingRecommendations(true);
            try {
                const response = await fetch('/api/test-recommendations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        testId: test.id,
                        score: myResult.marks_obtained,
                        maxMarks: test.max_marks,
                        subject: test.subject,
                        chapters: test.chapters || [],
                        examType: test.exam_type || 'JEE',
                        grade: test.class
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    setRecommendations(data.recommendations || []);
                }
            } catch (err) {
                console.error("Failed to fetch recommendations", err);
            } finally {
                setLoadingRecommendations(false);
            }
        }

        if (test && myResult) {
            fetchRecommendations();
        }
    }, [test, myResult]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!test || !myResult) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 gap-4 p-4">
                <p className="text-slate-500 dark:text-slate-400 text-center">Result not found or marks not entered yet.</p>
                <Link href="/dashboard/performance" className="text-blue-600 hover:underline">Back to Performance</Link>
            </div>
        );
    }

    const score = myResult.marks_obtained || 0;
    const maxMarks = test.max_marks;
    const percentage = Math.round((score / maxMarks) * 100);
    const subjectBreakdown = getSubjectBreakdown(score, maxMarks, test.subject);

    // Performance level for display
    const getPerformanceLevel = (pct: number) => {
        if (pct >= 90) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
        if (pct >= 75) return { label: 'Very Good', color: 'text-blue-600', bg: 'bg-blue-100' };
        if (pct >= 60) return { label: 'Good', color: 'text-indigo-600', bg: 'bg-indigo-100' };
        if (pct >= 40) return { label: 'Average', color: 'text-amber-600', bg: 'bg-amber-100' };
        return { label: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' };
    };

    const performance = getPerformanceLevel(percentage);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            {/* Header - Mobile Optimized */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
                    <Link href="/dashboard/tests" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors flex-shrink-0">
                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </Link>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-base md:text-lg font-bold text-slate-900 dark:text-white truncate">
                            {test.test_name}
                        </h1>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 dark:text-slate-400">
                            <span>{new Date(test.test_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            <span>•</span>
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">{test.subject}</span>
                        </div>
                    </div>
                </div>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors flex-shrink-0">
                    <Share2 className="w-5 h-5 text-slate-500" />
                </button>
            </div>

            <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
                {/* Score Card - Mobile Optimized */}
                <div className="relative overflow-hidden rounded-2xl md:rounded-3xl p-5 md:p-8 text-white shadow-lg"
                    style={{
                        background: "linear-gradient(135deg, #F7941D 0%, #F15A24 100%)",
                    }}
                >
                    {/* Background Patterns */}
                    <div className="absolute top-0 right-0 w-40 md:w-64 h-40 md:h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-32 md:w-48 h-32 md:h-48 bg-yellow-400/20 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl" />

                    <div className="relative z-10">
                        {/* Score Circle */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative w-36 h-36 md:w-48 md:h-48 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/20" />
                                    <circle
                                        cx="50%" cy="50%" r="45%"
                                        stroke="currentColor" strokeWidth="6"
                                        fill="transparent"
                                        strokeDasharray={`${2 * Math.PI * 45}`}
                                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
                                        className="text-white transition-all duration-1000 ease-out"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-4xl md:text-5xl font-bold">{score}</span>
                                    <div className="h-0.5 w-12 md:w-16 bg-white/40 my-1"></div>
                                    <span className="text-xl md:text-2xl opacity-90">{maxMarks}</span>
                                </div>
                            </div>
                            <div className="mt-3 text-white/90 font-medium bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm text-sm">
                                Class average: {classAverage}
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            {/* Percentile */}
                            <div className="bg-black/10 rounded-xl md:rounded-2xl p-3 md:p-4 backdrop-blur-sm">
                                <div className="text-xs text-orange-100 uppercase font-semibold mb-1">Percentile</div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl md:text-2xl font-bold">{myPercentile ?? '-'}%</span>
                                </div>
                                <div className="text-xs mt-1 opacity-80 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    {totalStudents} students appeared
                                </div>
                            </div>

                            {/* Performance Level */}
                            <div className="bg-black/10 rounded-xl md:rounded-2xl p-3 md:p-4 backdrop-blur-sm">
                                <div className="text-xs text-orange-100 uppercase font-semibold mb-1">Performance</div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-lg md:text-xl font-bold">{percentage}%</span>
                                </div>
                                <div className={`text-xs mt-1 text-white ${performance.bg}/80 px-2 py-0.5 rounded inline-block`}>
                                    {performance.label}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question Paper Button */}
                {test.test_paper && test.test_paper.length > 0 ? (
                    <button
                        onClick={() => setTestPaperModal({
                            isOpen: true,
                            images: test.test_paper || []
                        })}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
                    >
                        <ImageIcon className="w-5 h-5" />
                        View Question Paper
                    </button>
                ) : (
                    <div className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 cursor-not-allowed">
                        <ImageIcon className="w-5 h-5" />
                        No Question Paper Available
                    </div>
                )}

                {/* Subject Breakdown */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <div>
                            <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-white">Subject Analysis</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">Performance breakdown by subject</p>
                        </div>
                        <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-slate-300 dark:text-slate-600" />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:gap-4">
                        {subjectBreakdown.map((item, i) => {
                            const subjectPct = Math.round((item.score / item.max) * 100);
                            const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
                            return (
                                <div key={i} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 md:p-4 border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.name}</span>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{item.score}/{item.max}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${subjectPct}%`,
                                                backgroundColor: colors[i % colors.length]
                                            }}
                                        />
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subjectPct}%</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Catalyzers Recommendations */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-2xl md:rounded-3xl p-4 md:p-6 border border-indigo-200 dark:border-indigo-800">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <div>
                            <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Award className="w-5 h-5 text-indigo-600" />
                                Catalyzers Recommendations
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">Personalized topics to boost your scores</p>
                        </div>
                    </div>

                    {loadingRecommendations ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                            <span className="ml-2 text-slate-500 text-sm">Analyzing your performance...</span>
                        </div>
                    ) : recommendations.length > 0 ? (
                        <div className="space-y-3">
                            {recommendations.map((rec, i) => (
                                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-3 md:p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-start justify-between mb-2 gap-2">
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-semibold text-slate-800 dark:text-white text-sm md:text-base truncate">{rec.chapterTitle}</h4>
                                            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{rec.reason}</p>
                                        </div>
                                        <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg text-xs font-medium flex-shrink-0">
                                            Suggested
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {rec.resources.slice(0, 2).map((resource, j) => (
                                            <Link
                                                key={j}
                                                href={`/lectures`}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg text-xs md:text-sm text-slate-700 dark:text-slate-300 transition-colors"
                                            >
                                                {resource.type === 'video' && <PlayCircle className="w-3.5 h-3.5 text-blue-500" />}
                                                {resource.type === 'quiz' && <Target className="w-3.5 h-3.5 text-green-500" />}
                                                {resource.type === 'pyq' && <BookOpen className="w-3.5 h-3.5 text-amber-500" />}
                                                <span className="truncate max-w-[120px] md:max-w-none">{resource.title}</span>
                                                <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <Award className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Great job! No specific focus areas identified.</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Keep up the excellent work!</p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <Link
                        href="/lectures"
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <PlayCircle className="w-4 h-4" />
                        Browse Lectures
                    </Link>
                    <Link
                        href="/dashboard/tests"
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors"
                    >
                        <BarChart3 className="w-4 h-4" />
                        All Tests
                    </Link>
                </div>
            </div>
            {/* Test Paper Modal */}
            <TestPaperModal
                isOpen={testPaperModal.isOpen}
                onClose={() => setTestPaperModal({ isOpen: false, images: [] })}
                testName={test.test_name}
                images={testPaperModal.images}
            />
        </div>
    );
}
