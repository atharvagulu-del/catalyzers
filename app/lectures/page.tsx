"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { PlayCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import {
    PhysicsIcon,
    MathsIcon,
    ChemistryIcon,
    BiologyIcon
} from "@/components/ui/custom-icons";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { getLastVisited, LastVisitedItem } from "@/lib/learningHistory";
import { Clock, ChevronRight, HelpCircle, FileText } from "lucide-react";

// All possible subjects
const allSubjects = [
    { id: "maths", title: "Mathematics", icon: MathsIcon, svgPath: "/assets/icons/maths.svg", slug: "mathematics", category: "jee" },
    { id: "biology", title: "Biology", icon: BiologyIcon, slug: "biology", category: "neet" },
    { id: "physics", title: "Physics", icon: PhysicsIcon, svgPath: "/assets/icons/physics.svg", slug: "physics", category: "common" },
    { id: "chemistry", title: "Chemistry", icon: ChemistryIcon, svgPath: "/assets/icons/chemistry.svg", slug: "chemistry", category: "common" }
];

export default function LecturesPage() {
    const { session, user } = useAuth();
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<{ name?: string, class?: string, exam?: string } | null>(null);
    const [recentLecture, setRecentLecture] = useState<LastVisitedItem | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('userProfile');
        if (saved) {
            setUserProfile(JSON.parse(saved));
        }

        const fetchHistory = async () => {
            if (user?.id) {
                const history = await getLastVisited(user.id);
                setRecentLecture(history);
            }
        };
        fetchHistory();
    }, [session, user]);

    // Derived State
    const examType = (userProfile?.exam || "jee").toLowerCase().includes("neet") ? "neet" : "jee";
    const userClass = (userProfile?.class || "11");
    // Check for Dropper (Class 13 or explicit "Dropper")
    const isDropper = userClass.toLowerCase().includes("dropper") || userClass.includes("13");

    // Filter Subjects based on Exam
    const visibleSubjects = allSubjects.filter(sub => {
        if (sub.category === "common") return true;
        return sub.category === examType;
    });

    const renderSubjectGrid = (grade: string) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleSubjects.map((sub) => {
                const link = `/lectures/${examType}/${sub.slug}-${grade}`;
                return (
                    <Link href={link} key={`${sub.id}-${grade}`} className="block group">
                        <div
                            className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-300 dark:border-slate-700 cursor-pointer transition-all flex flex-col items-center justify-center gap-4 h-48 shadow-sm"
                        >
                            <div className="transform">
                                {sub.svgPath ? (
                                    <Image
                                        src={sub.svgPath}
                                        alt={sub.title}
                                        width={64}
                                        height={64}
                                        className="w-16 h-16 dark:invert"
                                    />
                                ) : (
                                    <sub.icon size={64} />
                                )}
                            </div>
                            <span className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                                {sub.title}
                            </span>
                        </div>
                    </Link>
                );
            })}
        </div>
    );

    return (
        <div className="space-y-10 max-w-5xl mx-auto">


            <div>

                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    Lectures
                </h1>
            </div>

            {/* Dropper View: Class 11 & 12 Sections */}
            {isDropper ? (
                <>
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">Class 11 Syllabus</span>
                            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                        </div>
                        {renderSubjectGrid("11")}
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider">Class 12 Syllabus</span>
                            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                        </div>
                        {renderSubjectGrid("12")}
                    </section>
                </>
            ) : (
                // Standard View: Single Class
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
                            Class {userClass.replace(/\D/g, '') || "11"} Syllabus
                        </span>
                    </div>
                    {/* Extract only the number from userClass (e.g., "Class 11" -> "11") */}
                    {renderSubjectGrid(userClass.replace(/\D/g, '') || "11")}
                </section>
            )}

            {/* Continue Learning Section */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mt-12">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
                    Continue Learning
                </h2>

                {recentLecture ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Link href={recentLecture.url} className="group block">
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:border-blue-500 hover:shadow-md transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-lg ${recentLecture.type === 'video' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                        recentLecture.type === 'quiz' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                                            'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                        }`}>
                                        {recentLecture.type === 'video' ? <PlayCircle className="w-6 h-6" /> :
                                            recentLecture.type === 'quiz' ? <HelpCircle className="w-6 h-6" /> :
                                                <FileText className="w-6 h-6" />}
                                    </div>
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/50 px-2 py-1 rounded">
                                        Last Visited
                                    </span>
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-1 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {recentLecture.title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">
                                    {recentLecture.subtitle}
                                </p>

                                <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 gap-4">
                                    {recentLecture.duration && (
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {recentLecture.duration}
                                        </div>
                                    )}
                                    {recentLecture.questionCount && (
                                        <div className="flex items-center gap-1">
                                            <HelpCircle className="w-3 h-3" />
                                            {recentLecture.questionCount} Questions
                                        </div>
                                    )}
                                    <div className="ml-auto flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                                        Resume <ChevronRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ) : (
                    // IF No History (Default State)
                    <div className="flex flex-col items-center justify-center text-center py-4">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                            <PlayCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                            Start your preparation journey!
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                            You have not watched any lectures yet. Select a subject above to begin your first class.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
