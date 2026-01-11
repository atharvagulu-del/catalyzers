"use client";

import Link from "next/link";
import { PlayCircle, FileText, HelpCircle, ChevronLeft, ChevronDown } from "lucide-react";
import { Unit } from "@/lib/lectureData";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LessonSidebarProps {
    unit: Unit;
    currentChapterId: string;
    exam: string;
    slug: string;
}

import { useSearchParams } from "next/navigation";

// ... (props interface remains same)

export default function LessonSidebar({ unit, currentChapterId, exam, slug }: LessonSidebarProps) {
    const [expandedChapters, setExpandedChapters] = useState<string[]>([currentChapterId]);
    const searchParams = useSearchParams();
    const activeResourceId = searchParams.get('resource');

    const toggleChapter = (chapterId: string) => {
        setExpandedChapters(prev =>
            prev.includes(chapterId)
                ? prev.filter(id => id !== chapterId)
                : [...prev, chapterId]
        );
    };

    return (
        <div className="w-full md:w-80 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto hidden md:block custom-scrollbar transition-colors">
            <div className="p-4 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
                <Link
                    href={`/lectures/${exam}/${slug}`}
                    className="text-sm text-primary font-bold flex items-center hover:underline mb-3"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Unit: {unit.title}
                </Link>
                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
            </div>

            <div className="pb-4">
                {unit.chapters.map((chapter) => {
                    const isExpanded = expandedChapters.includes(chapter.id);
                    const isActiveChapter = chapter.id === currentChapterId;

                    return (
                        <div key={chapter.id} className="border-b border-gray-100 dark:border-slate-800 last:border-0">
                            {/* Chapter Header (Accordion Toggle) */}
                            <button
                                onClick={() => toggleChapter(chapter.id)}
                                className={`w-full px-4 py-4 flex items-start gap-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50 focus:outline-none ${isActiveChapter ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                    }`}
                            >
                                <div className="mt-0.5">
                                    {isActiveChapter ? (
                                        <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center bg-white dark:bg-slate-900">
                                            <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                                        </div>
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-slate-600"></div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <h3 className={`text-sm font-bold leading-tight ${isActiveChapter ? 'text-gray-900 dark:text-slate-100' : 'text-gray-700 dark:text-slate-300'
                                        }`}>
                                        {chapter.title}
                                    </h3>
                                </div>
                                <ChevronDown
                                    className={`h-5 w-5 text-gray-400 dark:text-slate-500 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {/* Resources List (Collapsible) */}
                            <AnimatePresence initial={false}>
                                {isExpanded && (
                                    <motion.div
                                        initial="collapsed"
                                        animate="open"
                                        exit="collapsed"
                                        variants={{
                                            open: { opacity: 1, height: "auto" },
                                            collapsed: { opacity: 0, height: 0 }
                                        }}
                                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                                    >
                                        <div className="pl-12 pr-4 pb-4 space-y-1">
                                            {chapter.resources.map((resource) => {
                                                // Determine if this is the active resource
                                                // If no param is present, default to first resource of the active chapter
                                                const isActive = activeResourceId === resource.id ||
                                                    (!activeResourceId && isActiveChapter && chapter.resources[0].id === resource.id);

                                                return (
                                                    <Link
                                                        key={resource.id}
                                                        href={`/lectures/${exam}/${slug}/${unit.id}/${chapter.id}?resource=${resource.id}`}
                                                        className={`w-full text-left py-2 px-3 rounded-lg text-sm flex items-start gap-3 transition-colors group ${isActive
                                                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                                                            : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200'
                                                            }`}
                                                    >
                                                        <div className={`mt-0.5 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500 group-hover:text-primary'}`}>
                                                            {getResourceIcon(resource.type)}
                                                        </div>
                                                        <span className="leading-snug">{resource.title}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function getResourceIcon(type: string) {
    switch (type) {
        case 'video': return <PlayCircle className="h-4 w-4" />;
        case 'pyq': return <FileText className="h-4 w-4" />;
        case 'quiz': return <HelpCircle className="h-4 w-4" />;
        default: return <FileText className="h-4 w-4" />;
    }
}
