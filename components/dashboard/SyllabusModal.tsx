"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, BookOpen, ChevronRight, GraduationCap, PlayCircle, ExternalLink } from "lucide-react";
import { getChaptersByIds, Chapter } from "@/lib/lectureData";

interface SyllabusModalProps {
    isOpen: boolean;
    onClose: () => void;
    testName: string;
    subject: string;
    chapters: string[];
    customTopics?: string[];
    examType?: 'JEE' | 'NEET';
    grade?: string;
}

export default function SyllabusModal({
    isOpen,
    onClose,
    testName,
    subject,
    chapters,
    customTopics = [],
    examType = 'JEE',
    grade = '11'
}: SyllabusModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    // Get chapter details from IDs
    const chapterDetails = getChaptersByIds(examType, subject, grade, chapters);
    const totalTopics = chapterDetails.length + customTopics.length;

    const handleTopicClick = (chapter: Chapter) => {
        // Navigate to lectures page with correct URL structure
        // Format: /lectures/[exam]/[subject]-[grade] (e.g. /lectures/jee/physics-11)
        const subjectSlug = subject.toLowerCase().replace(/\s+/g, '-');
        const normalizedGrade = grade === 'Dropper' ? '12' : grade;
        const examSlug = examType.toLowerCase();

        router.push(`/lectures/${examSlug}/${subjectSlug}-${normalizedGrade}`);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="font-bold text-base line-clamp-1">{testName}</h2>
                                <p className="text-blue-100 text-sm">{subject} • {examType}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[60vh]">
                    <div className="flex items-center gap-2 mb-4">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-slate-800 dark:text-white">
                            Syllabus ({totalTopics} {totalTopics === 1 ? 'Topic' : 'Topics'})
                        </h3>
                    </div>

                    {totalTopics === 0 ? (
                        <div className="text-center py-8">
                            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 dark:text-slate-400">
                                No specific syllabus defined for this test.
                            </p>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                                This test covers general {subject} topics.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {/* Linked Chapters - Clickable */}
                            {chapterDetails.map((chapter, index) => (
                                <button
                                    key={chapter.id}
                                    onClick={() => handleTopicClick(chapter)}
                                    className="w-full group bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm line-clamp-1">
                                                {chapter.title}
                                            </h4>
                                            {chapter.description && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                                    {chapter.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <PlayCircle className="w-4 h-4" />
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </button>
                            ))}

                            {/* Custom Topics - Not Clickable */}
                            {customTopics.map((topic, index) => (
                                <div
                                    key={`custom-${index}`}
                                    className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-100 dark:border-amber-800"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold text-amber-600 dark:text-amber-400">
                                            {chapterDetails.length + index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-slate-800 dark:text-white text-sm line-clamp-1">
                                                {topic}
                                            </h4>
                                            <p className="text-xs text-amber-600 dark:text-amber-400">
                                                Custom Topic
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {chapterDetails.length > 0 && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-4">
                            Tap a topic to view related lectures
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-medium transition-colors text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
