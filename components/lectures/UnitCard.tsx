import Link from "next/link";
import { PlayCircle, FileText, CheckCircle, ChevronDown, ChevronRight, HelpCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UnitCardProps {
    unit: {
        id: string;
        title: string;
        chapters: {
            id: string;
            title: string;
            masteryLevel?: number;
            resources: any[];
        }[];
    };
    exam: string;
    slug: string;
}

export default function UnitCard({ unit, exam, slug }: UnitCardProps) {
    const totalChapters = unit.chapters.length;
    // Calculate simple mastery (mock)
    const mastery = unit.chapters.reduce((acc, ch) => acc + (ch.masteryLevel || 0), 0) / (totalChapters || 1);

    // State for expanded chapters (inner accordion)
    const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
    // State for the unit itself (outer accordion)
    const [isUnitExpanded, setIsUnitExpanded] = useState(false);

    const toggleChapter = (chapterId: string) => {
        setExpandedChapters(prev =>
            prev.includes(chapterId)
                ? prev.filter(id => id !== chapterId)
                : [...prev, chapterId]
        );
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-1">{unit.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{unit.chapters.length} TOPICS</p>
                </div>
                {mastery === 100 ? (
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-full uppercase">
                        Completed
                    </span>
                ) : mastery > 0 ? (
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded-full uppercase">
                        In Progress
                    </span>
                ) : (
                    <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-xs font-bold px-2 py-1 rounded-full uppercase">
                        Not Started
                    </span>
                )}
            </div>

            <div className="mb-4">
                <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">
                    <span>MASTERY</span>
                    <span>{Math.round(mastery)}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${mastery}%` }}
                    />
                </div>
            </div>

            {/* The original clickable header for the unit is now integrated into the main card body,
                but the expansion logic needs to be re-applied to a new element if the unit itself
                is still meant to be an accordion. For now, I'll wrap the chapter list in a div
                that can be toggled. */}
            <div
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors rounded-lg -mx-6 px-6 py-2"
                onClick={() => setIsUnitExpanded(!isUnitExpanded)}
            >
                <div className="flex justify-between items-center">
                    <h4 className="text-base font-semibold text-gray-800 dark:text-slate-200">
                        {isUnitExpanded ? "Hide Chapters" : "Show Chapters"}
                    </h4>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transform transition-transform duration-300 ${isUnitExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>

            <AnimatePresence>
                {isUnitExpanded && (
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
                        <div className="px-6 pb-6 space-y-1">
                            {unit.chapters.map((chapter) => {
                                const isExpanded = expandedChapters.includes(chapter.id);
                                return (
                                    <div key={chapter.id} className="border-b border-gray-100 dark:border-slate-800 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors rounded-lg overflow-hidden">
                                        {/* Chapter Header Row (Click to Expand) */}
                                        <button
                                            onClick={() => toggleChapter(chapter.id)}
                                            className="w-full flex items-center justify-between p-4 text-left group focus:outline-none"
                                        >
                                            <span className="text-lg font-medium text-gray-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                                                {chapter.title}
                                            </span>
                                            <div className="p-1 rounded-full text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-slate-700 group-hover:text-gray-600 dark:group-hover:text-slate-300 transition-all">
                                                <ChevronDown className={`h-5 w-5 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                            </div>
                                        </button>

                                        {/* Resources Accordion Body */}
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
                                                    <div className="px-4 pb-4 space-y-2 pl-6">
                                                        {chapter.resources.map((resource, idx) => (
                                                            <Link
                                                                key={resource.id}
                                                                href={`/lectures/${exam}/${slug}/${unit.id}/${chapter.id}`}
                                                                className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-50 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all group/resource"
                                                            >
                                                                <div className="text-gray-400 group-hover/resource:text-blue-500 transition-colors">
                                                                    {getResourceIcon(resource.type)}
                                                                </div>
                                                                <span className="text-sm font-medium">{resource.title}</span>
                                                                {resource.completed && <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-gray-50 dark:bg-slate-800/50 px-6 py-4 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    {unit.chapters.length === 1 ? "Full Chapter" : `${unit.chapters.length} Topics`}
                </span>
                <Link
                    href={`/lectures/${exam}/${slug}/${unit.id}/${unit.chapters[0]?.id}`}
                    className="text-sm font-bold text-primary hover:text-primary-dark uppercase tracking-wide hover:underline"
                >
                    Start Unit
                </Link>
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
