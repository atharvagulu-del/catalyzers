"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Download, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";
import { revisionData, Subject } from "@/lib/revisionData";
import dynamic from "next/dynamic";

// Dynamic import for react-pdf component to avoid SSR issues
const ChapterPDFViewer = dynamic(() => import("@/components/ChapterPDFViewer"), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center text-slate-400">Loading Viewer...</div>
});

export default function RevisionNotesPage() {
    const { user } = useAuth();
    const [activeSubject, setActiveSubject] = useState<Subject>('Maths');
    const [selectedChapter, setSelectedChapter] = useState<{ title: string; pageStart: number; pageEnd: number } | null>(null);

    // Hardcoded path - User must place file here
    const PDF_PATH = "/assets/documents/formula-booklet.pdf";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                        Revision Notes
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Access comprehensive formulas and key concepts.
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
                {/* Sidebar: Subject & Chapters */}
                <div className={`w-full lg:w-96 flex flex-col gap-4 flex-shrink-0 h-full overflow-hidden ${selectedChapter ? 'hidden lg:flex' : 'flex'}`}>

                    {/* Subject Tabs */}
                    <div className="flex p-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                        {revisionData.map((subject) => (
                            <button
                                key={subject.id}
                                onClick={() => setActiveSubject(subject.id)}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeSubject === subject.id
                                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                    }`}
                            >
                                {subject.id}
                            </button>
                        ))}
                    </div>

                    {/* Chapter List */}
                    <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                        {revisionData.find(s => s.id === activeSubject)?.chapters.map((chapter) => (
                            <motion.button
                                key={chapter.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={() => setSelectedChapter({ title: chapter.title, pageStart: chapter.pageStart, pageEnd: chapter.pageEnd })}
                                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${selectedChapter?.title === chapter.title
                                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-blue-900"
                                    }`}
                            >
                                <div>
                                    <h3 className={`font-semibold text-sm transition-colors ${selectedChapter?.title === chapter.title
                                        ? "text-blue-700 dark:text-blue-300"
                                        : "text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                        }`}>
                                        {chapter.title}
                                    </h3>
                                </div>
                                {selectedChapter?.title === chapter.title && (
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* PDF Viewer Area */}
                <div className={`flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col relative ${!selectedChapter ? 'hidden lg:flex' : 'flex'}`}>
                    {selectedChapter ? (
                        <>
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10 w-full">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setSelectedChapter(null)}
                                        className="lg:hidden p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                                    >
                                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                                    </button>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px] md:max-w-none">{selectedChapter.title}</h3>
                                </div>
                                <a
                                    href={PDF_PATH}
                                    download="Formula_Booklet.pdf"
                                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
                                >
                                    <Download className="w-4 h-4" /> <span className="hidden sm:inline">Download</span>
                                </a>
                            </div>
                            <div className="flex-1 w-full relative bg-slate-100 dark:bg-slate-950 overflow-hidden">
                                <ChapterPDFViewer
                                    file={PDF_PATH}
                                    startPage={selectedChapter.pageStart}
                                    endPage={selectedChapter.pageEnd}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                            </div>
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Select a Chapter</h3>
                            <p className="max-w-xs text-sm">
                                Choose a chapter from the list to view the specific formula pages.
                            </p>


                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
