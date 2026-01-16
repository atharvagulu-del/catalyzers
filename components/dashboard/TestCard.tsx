"use client";

import { useState } from "react";
import { TestWithResults } from "@/lib/offlineTests";
import { Clock, Calendar, Trophy, PlayCircle, BarChart2, CheckCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import SyllabusModal from "./SyllabusModal";

interface TestCardProps {
    test: TestWithResults;
}

export default function TestCard({ test }: TestCardProps) {
    const [showSyllabus, setShowSyllabus] = useState(false);

    const now = new Date();
    const start = new Date(test.start_time);
    const end = new Date(test.end_time);

    let status: 'upcoming' | 'live' | 'ended' | 'result' = 'upcoming';

    if (now >= start && now <= end) {
        status = 'live';
    } else if (now > end) {
        status = test.is_marks_entered ? 'result' : 'ended';
    }

    const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    const hasChapters = test.chapters && test.chapters.length > 0;

    // Variant Styles
    const variants = {
        upcoming: {
            borderColor: "border-blue-200 dark:border-blue-800",
            bg: "bg-white dark:bg-slate-800",
            accent: "bg-blue-600",
            statusConfig: {
                label: "Upcoming",
                color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
                icon: <Calendar className="w-4 h-4" />
            }
        },
        live: {
            borderColor: "border-red-200 dark:border-red-800",
            bg: "bg-red-50/10 dark:bg-red-900/5",
            accent: "bg-red-600",
            statusConfig: {
                label: "Live Now",
                color: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 animate-pulse",
                icon: <PlayCircle className="w-4 h-4" />
            }
        },
        ended: {
            borderColor: "border-slate-200 dark:border-slate-700",
            bg: "bg-slate-50 dark:bg-slate-800/50",
            accent: "bg-slate-500",
            statusConfig: {
                label: "Ended",
                color: "text-slate-600 bg-slate-200 dark:bg-slate-700 dark:text-slate-400",
                icon: <CheckCircle className="w-4 h-4" />
            }
        },
        result: {
            borderColor: "border-emerald-200 dark:border-emerald-800",
            bg: "bg-emerald-50/20 dark:bg-emerald-900/5",
            accent: "bg-emerald-600",
            statusConfig: {
                label: "Result Out",
                color: "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
                icon: <Trophy className="w-4 h-4" />
            }
        }
    };

    const variant = variants[status];

    const renderCTA = () => {
        switch (status) {
            case 'upcoming':
                return (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowSyllabus(true)}
                            className="flex-1 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <BookOpen className="w-4 h-4" />
                            View Syllabus
                        </button>
                        <div className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center justify-center gap-2">
                            <Clock className="w-4 h-4" />
                            Starts in {Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60))}h
                        </div>
                    </div>
                );
            case 'live':
                return (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowSyllabus(true)}
                            className="flex-1 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <BookOpen className="w-4 h-4" />
                            Syllabus
                        </button>
                        <div className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-200 dark:shadow-red-900/20">
                            <PlayCircle className="w-4 h-4" />
                            In Progress
                        </div>
                    </div>
                );
            case 'ended':
                return (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowSyllabus(true)}
                            className="flex-1 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <BookOpen className="w-4 h-4" />
                            View Syllabus
                        </button>
                        <div className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center justify-center gap-2">
                            <Clock className="w-4 h-4" />
                            Awaiting Results
                        </div>
                    </div>
                );
            case 'result':
                return (
                    <div className="flex flex-col md:flex-row gap-2">
                        <button
                            onClick={() => setShowSyllabus(true)}
                            className="flex-1 py-2 md:py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs md:text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            View Syllabus
                        </button>
                        <Link
                            href={`/dashboard/performance/test/${test.id}`}
                            className="flex-1 py-2 md:py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-xs md:text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                            <BarChart2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            Result
                        </Link>
                    </div>
                );
        }
    };

    return (
        <>
            <div className={`rounded-2xl border ${variant.borderColor} ${variant.bg} p-4 md:p-5 flex flex-col gap-3 md:gap-4 relative overflow-hidden group transition-all duration-300 hover:shadow-md dark:hover:bg-slate-800`}>
                {/* Accent Line */}
                <div className={`absolute top-0 left-0 w-1 h-full ${variant.accent} opacity-100`}></div>

                {/* Header */}
                <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1.5 ${variant.statusConfig.color}`}>
                        {variant.statusConfig.icon}
                        {variant.statusConfig.label}
                    </span>
                    <div className="flex items-center gap-2">
                        {hasChapters && (
                            <span className="text-[10px] md:text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 md:py-1 rounded-md">
                                {test.chapters!.length} Topics
                            </span>
                        )}
                        <span className="text-[10px] md:text-xs font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 px-2 py-0.5 md:py-1 rounded-md border border-slate-100 dark:border-slate-600">
                            Offline
                        </span>
                    </div>
                </div>

                {/* Title & Info */}
                <div>
                    <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {test.test_name}
                    </h3>
                    <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400">
                        {test.subject} • {test.max_marks} Marks
                    </p>
                </div>

                {/* Meta Grid */}
                <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10px] md:text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/50 pt-2 md:pt-3">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-400" />
                        <span>{start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-400" />
                        <span>{start.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-400" />
                        <span>{durationMinutes} mins</span>
                    </div>
                    {status === 'result' && test.my_result && (
                        <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                            <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            <span>{test.my_result.marks_obtained}/{test.max_marks}</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-auto pt-1 md:pt-2">
                    {renderCTA()}
                </div>
            </div>

            {/* Syllabus Modal */}
            <SyllabusModal
                isOpen={showSyllabus}
                onClose={() => setShowSyllabus(false)}
                testName={test.test_name}
                subject={test.subject}
                chapters={test.chapters || []}
                customTopics={test.custom_topics || []}
                examType={test.exam_type || 'JEE'}
                grade={test.class}
            />
        </>
    );
}
