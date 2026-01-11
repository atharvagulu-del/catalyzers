"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { lectureData } from "@/lib/lectureData";
import { notFound } from "next/navigation";
import UnitCard from "@/components/lectures/UnitCard";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";

interface PageProps {
    params: {
        exam: string;
        slug: string;
    };
}

export default function SubjectPage({ params }: PageProps) {
    // Key construction matching lectureData keys
    const key = `${params.exam}-${params.slug}`.toLowerCase();

    // Simple lookup (handle potential key mismatches roughly)
    const subjectData = lectureData[key] ||
        lectureData[`${params.exam}-${params.slug.replace('mathematics', 'maths')}`];

    if (!subjectData) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <DashboardHeader />
                <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Coming Soon</h1>
                    <p className="text-gray-600 mb-6 max-w-md">
                        We are currently adding specialized courses for this subject. Please check back later!
                    </p>
                    <Link href="/lectures" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Back to Lectures
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col transition-colors duration-300">
            <DashboardHeader />

            {/* Navigation Strip (Non-sticky) */}
            <div className="container px-4 md:px-6 pt-6 pb-2">
                <div className="flex items-center gap-3">
                    <Link
                        href="/lectures"
                        className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm"
                        title="Back to Lectures"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>

                    <div className="flex items-center text-sm text-gray-600 dark:text-slate-400 overflow-x-auto whitespace-nowrap scrollbar-hide bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                        <Link href="/lectures" className="hover:text-blue-600 dark:hover:text-blue-400 hidden md:inline transition-colors">Courses</Link>
                        <ChevronRight className="h-4 w-4 mx-2 text-gray-400 hidden md:inline" />
                        <span className="font-semibold text-gray-900 dark:text-slate-100 capitalize">{params.exam.toUpperCase()}</span>
                        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                        <span className="font-semibold text-gray-900 dark:text-slate-100">{subjectData.title}</span>
                    </div>
                </div>
            </div>

            <main className="flex-grow container px-4 md:px-6 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / Info */}
                    <div className="md:w-64 flex-shrink-0 space-y-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2">{subjectData.subject}</h1>
                            <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-slate-800 rounded-full text-sm font-semibold text-gray-600 dark:text-slate-300">
                                Class {subjectData.grade}
                            </div>
                        </div>

                        <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2 text-lg">Course Challenge</h3>
                            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4 leading-relaxed">
                                Test your knowledge of the entire course with a comprehensive challenge.
                            </p>
                            <Link
                                href={`/lectures/${params.exam}/${params.slug}/challenge`}
                                className="block w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm text-center"
                            >
                                Start Course Challenge
                            </Link>
                        </div>
                    </div>

                    {/* Main Content - Units Grid */}
                    <div className="flex-grow grid grid-cols-1 gap-6">
                        {subjectData.units.map((unit) => (
                            <UnitCard
                                key={unit.id}
                                unit={unit}
                                exam={params.exam}
                                slug={params.slug}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
