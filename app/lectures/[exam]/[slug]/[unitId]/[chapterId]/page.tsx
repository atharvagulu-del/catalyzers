"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { lectureData } from "@/lib/lectureData";
import LessonSidebar from "@/components/lectures/LessonSidebar";
import QuizInterface from "@/components/lectures/QuizInterface";
import { Play, FileText, HelpCircle, ChevronRight, Trophy } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { saveLastVisited } from "@/lib/learningHistory";
import { checkGoalCompletion } from "@/lib/dailyGoals";
import { useAuth } from "@/components/auth/AuthProvider";

interface PageProps {
    params: {
        exam: string;
        slug: string;
        unitId: string;
        chapterId: string;
    };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default function LessonPage({ params, searchParams }: PageProps) {
    const { user } = useAuth();
    const key = `${params.exam}-${params.slug}`.toLowerCase();
    // Fallback key lookup: Try constructed key, then raw slug, then 'maths' alias
    const subjectData = lectureData[key] ||
        lectureData[params.slug] ||
        lectureData[`${params.exam}-${params.slug.replace('mathematics', 'maths')}`];

    const unit = subjectData?.units.find(u => u.id === params.unitId);
    const chapter = unit?.chapters.find(c => c.id === params.chapterId);

    // Determine active resource
    const activeResourceId = typeof searchParams.resource === 'string' ? searchParams.resource : null;
    const activeResourceIndex = chapter
        ? (activeResourceId ? chapter.resources.findIndex(r => r.id === activeResourceId) : 0)
        : -1;

    const activeResource = (chapter && activeResourceIndex !== -1) ? chapter.resources[activeResourceIndex] : chapter?.resources[0];

    useEffect(() => {
        if (activeResource && subjectData && unit && chapter && user) {
            saveLastVisited(user.id, {
                id: activeResource.id,
                type: activeResource.type as any,
                title: activeResource.title,
                subtitle: `${subjectData.subject} • ${unit.title}`,
                url: `/lectures/${params.exam}/${params.slug}/${unit.id}/${chapter.id}?resource=${activeResource.id}`,
                duration: activeResource.duration,
                questionCount: activeResource.questionCount
            });

            // Auto-tick Daily Goal if applicable (System Event: Resource Opened)
            checkGoalCompletion(user.id, activeResource.id, 'open');
        }
    }, [activeResource, params, subjectData, unit, chapter, user]);

    const handleResourceCompletion = async () => {
        if (user && activeResource) {
            await checkGoalCompletion(user.id, activeResource.id, 'complete');
        }
    };

    // Validation / Not Found Handling
    if (!subjectData) return <div className="p-8 text-center">Course not found</div>;
    if (!unit) return <div className="p-8 text-center">Unit not found</div>;
    if (!chapter) return <div className="p-8 text-center">Chapter not found</div>;
    if (!activeResource) return <div className="p-8 text-center">No content available</div>;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col transition-colors">
            <DashboardHeader />

            <div className="flex flex-grow">
                {/* Sidebar - Hidden on mobile, sticky on desktop */}
                <LessonSidebar
                    unit={unit}
                    currentChapterId={chapter.id}
                    exam={params.exam}
                    slug={params.slug}
                />

                {/* Main Content */}
                <main className="flex-grow w-full max-w-5xl mx-auto p-4 md:p-8">
                    {/* Breadcrumbs */}
                    <div className="flex items-center text-sm text-gray-500 dark:text-slate-400 mb-6 font-medium">
                        <Link href={`/lectures/${params.exam}/${params.slug}`} className="hover:text-primary transition-colors">Unit: {unit.title}</Link>
                        <ChevronRight className="h-4 w-4 mx-2" />
                        <span className="text-gray-900 dark:text-slate-100">{chapter.title}</span>
                    </div>

                    {/* Content Header */}
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                        {activeResource?.title || chapter.title}
                    </h1>

                    {/* Content Player / Interaction Area */}
                    <div className={`rounded-xl overflow-hidden shadow-2xl relative mb-8 group bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 ${activeResource?.type === 'video' ? 'aspect-video bg-black' : 'min-h-[600px] flex flex-col'
                        }`}>
                        {activeResource?.type === 'video' ? (
                            activeResource.url && activeResource.url !== 'placeholder' ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${activeResource.url}`}
                                    title={activeResource.title}
                                    className="w-full h-full object-cover"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                                    {/* YouTube Embed Placeholder */}
                                    <div className="text-center text-white">
                                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm group-hover:scale-110 transition-transform cursor-pointer">
                                            <Play className="h-8 w-8 text-white fill-white" />
                                        </div>
                                        <p className="font-semibold text-lg">Video Placeholder</p>
                                        <p className="text-sm text-gray-400">Duration: {activeResource.duration || '10:00'}</p>
                                    </div>
                                </div>
                            )
                        ) : (activeResource?.type === 'quiz' || activeResource?.type === 'pyq') ? (
                            <div className="h-full overflow-y-auto bg-gray-50 dark:bg-slate-950">
                                <QuizInterface
                                    key={activeResource.id}
                                    questions={activeResource.questions || []}
                                    title={activeResource.title}
                                    onComplete={handleResourceCompletion}
                                />
                            </div>
                        ) : (
                            // Fallback for other types
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">{activeResource?.title}</h3>
                                    <p className="text-gray-500 dark:text-slate-400">Resource content placeholder.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Interactions / Description */}
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div className="prose dark:prose-invert max-w-none">
                                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-slate-100">About this lesson</h3>
                                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                                    {chapter.description || "Master the concepts with our detailed video lectures and practice problems. This lesson covers key topics essential for JEE/NEET preparation."}
                                </p>
                            </div>

                            {/* Engagement Tabs */}
                            <div className="border-b border-gray-200 dark:border-slate-800">
                                <div className="flex gap-6">
                                    <button className="py-2 border-b-2 border-primary text-primary font-bold">Overview</button>
                                    <button className="py-2 border-b-2 border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 font-medium transition-colors">Q&A</button>
                                    <button className="py-2 border-b-2 border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 font-medium transition-colors">Notes</button>
                                </div>
                            </div>

                            {/* Resource Description (Stub) */}
                            <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg border border-gray-100 dark:border-slate-800">
                                <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-1">{activeResource?.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    {activeResource?.type === 'video' ? 'Watch this video to understand the core concepts.' : 'Test your understanding with these practice questions.'}
                                </p>
                            </div>
                        </div>

                        {/* "Up Next" / Recommended Options */}
                        <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-6 h-fit border border-gray-100 dark:border-slate-800">
                            <h3 className="font-bold text-gray-900 dark:text-slate-100 mb-4">Up Next</h3>
                            <div className="space-y-4">
                                {/* Option 1: Practice Test (if available and currently watching video) */}
                                {activeResource.type === 'video' && (() => {
                                    const nextRes = chapter.resources.find(r => r.type === 'pyq' || r.type === 'quiz');
                                    if (!nextRes) return null;

                                    const isFullTest = nextRes.type === 'quiz';

                                    return (
                                        <Link
                                            href={`/lectures/${params.exam}/${params.slug}/${unit.id}/${chapter.id}?resource=${nextRes.id}`}
                                            className="block group"
                                        >
                                            <div className={`bg-white dark:bg-slate-800 rounded-lg border hover:border-${isFullTest ? 'orange' : 'blue'}-500 transition-all p-4 shadow-sm hover:shadow-md border-gray-200 dark:border-slate-700`}>
                                                <span className={`text-xs font-bold text-${isFullTest ? 'orange' : 'blue'}-600 dark:text-${isFullTest ? 'orange' : 'blue'}-400 uppercase tracking-wider mb-2 block flex items-center gap-1`}>
                                                    {isFullTest ? <Trophy className="h-3 w-3" /> : <HelpCircle className="h-3 w-3" />}
                                                    {isFullTest ? 'Full Test' : 'Practice'}
                                                </span>
                                                <h4 className={`font-bold text-gray-800 dark:text-slate-200 mb-1 group-hover:text-${isFullTest ? 'orange' : 'blue'}-700 dark:group-hover:text-${isFullTest ? 'orange' : 'blue'}-300 leading-tight`}>
                                                    {nextRes.title || (isFullTest ? 'Take Full Chapter Test' : 'Take Practice Test')}
                                                </h4>
                                                <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                                                    <FileText className="h-3 w-3 mr-1" />
                                                    {nextRes.questionCount} Questions
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })()}

                                {/* Option 2: Next Topic / Chapter */}
                                {(() => {
                                    const currentChapterIndex = unit.chapters.findIndex(c => c.id === params.chapterId);
                                    let nextTopicResource = null;
                                    let nextTopicLink = '#';
                                    let nextTopicTitle = '';
                                    let isNextUnit = false;

                                    if (currentChapterIndex !== -1 && currentChapterIndex < unit.chapters.length - 1) {
                                        // Go to next chapter in current unit
                                        const nextChapter = unit.chapters[currentChapterIndex + 1];
                                        if (nextChapter.resources.length > 0) {
                                            nextTopicResource = nextChapter.resources[0];
                                            nextTopicLink = `/lectures/${params.exam}/${params.slug}/${unit.id}/${nextChapter.id}?resource=${nextTopicResource.id}`;
                                            nextTopicTitle = nextChapter.title;
                                        }
                                    } else {
                                        isNextUnit = true;
                                    }

                                    if (nextTopicResource) {
                                        // Check if the next resource is a Full Chapter Test (quiz)
                                        if (nextTopicResource.type === 'quiz') {
                                            return (
                                                <Link href={nextTopicLink} className="block group">
                                                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-orange-500 transition-all p-4 shadow-sm hover:shadow-md">
                                                        <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2 block flex items-center gap-1">
                                                            <Trophy className="h-3 w-3" />
                                                            Full Test
                                                        </span>
                                                        <h4 className="font-bold text-gray-800 dark:text-slate-200 mb-1 group-hover:text-orange-700 dark:group-hover:text-orange-300 leading-tight">
                                                            {nextTopicTitle}
                                                        </h4>
                                                        <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                                                            <FileText className="h-3 w-3 mr-1" />
                                                            {nextTopicResource.questionCount || 25} Questions
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        }

                                        return (
                                            <Link href={nextTopicLink} className="block group">
                                                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-purple-500 transition-all p-4 shadow-sm hover:shadow-md">
                                                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2 block flex items-center gap-1">
                                                        <Play className="h-3 w-3" />
                                                        Next Topic
                                                    </span>
                                                    <h4 className="font-bold text-gray-800 dark:text-slate-200 mb-1 group-hover:text-purple-700 dark:group-hover:text-purple-300 leading-tight">
                                                        {nextTopicTitle}
                                                    </h4>
                                                    <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                                                        <Play className="h-3 w-3 mr-1" />
                                                        {nextTopicResource.duration || '10:00'} mins
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    } else if (activeResource.type === 'pyq' || activeResource.type === 'quiz' || !chapter.resources.find(r => r.type === 'pyq' || r.type === 'quiz')) {
                                        return (
                                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center border border-green-100 dark:border-green-900/30">
                                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-2">
                                                    <Play className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                </div>
                                                <p className="text-sm font-bold text-green-800 dark:text-green-300">Unit Complete!</p>
                                                <Link href={`/lectures/${params.exam}/${params.slug}`} className="text-xs text-green-700 dark:text-green-400 underline mt-1 block">
                                                    Back to Syllabus
                                                </Link>
                                            </div>
                                        )
                                    }
                                    return null;
                                })()}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
