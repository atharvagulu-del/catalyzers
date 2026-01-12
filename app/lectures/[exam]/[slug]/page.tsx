"use client";

import { useState, useMemo } from "react";
import { lectureData } from "@/lib/lectureData";
import UnitCard from "@/components/lectures/UnitCard";
import Link from "next/link";
import { ChevronRight, ArrowLeft, Search, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

    // Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Filter units based on search query (search UNIT TITLE only - what user calls "chapters")
    // Topics inside matched units stay intact
    const filteredUnits = useMemo(() => {
        if (!subjectData) return [];
        if (!searchQuery.trim()) return subjectData.units;

        const query = searchQuery.toLowerCase().trim();

        // Only filter by UNIT title (the main chapter card name)
        // All topics inside a matched unit remain visible
        return subjectData.units.filter(unit =>
            unit.title.toLowerCase().includes(query)
        );
    }, [subjectData, searchQuery]);

    // Calculate total topics across filtered units
    const totalTopics = useMemo(() => {
        return filteredUnits.reduce((acc, unit) => acc + unit.chapters.length, 0);
    }, [filteredUnits]);

    if (!subjectData) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">Content Coming Soon</h1>
                <p className="text-gray-600 dark:text-slate-400 mb-6 max-w-md">
                    We are currently adding specialized courses for this subject. Please check back later!
                </p>
                <Link href="/lectures" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Back to Lectures
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
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
                    <div className="flex-grow space-y-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search chapters..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>

                        {/* Results Count */}
                        {searchQuery && (
                            <p className="text-sm text-gray-500 dark:text-slate-400">
                                Found {filteredUnits.length} chapter{filteredUnits.length !== 1 ? 's' : ''}, {totalTopics} topic{totalTopics !== 1 ? 's' : ''}
                            </p>
                        )}

                        {/* Units */}
                        <div className="grid grid-cols-1 gap-6">
                            {filteredUnits.length > 0 ? (
                                filteredUnits.map((unit) => (
                                    <UnitCard
                                        key={unit.id}
                                        unit={unit}
                                        exam={params.exam}
                                        slug={params.slug}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <Search className="h-12 w-12 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-2">No chapters found</h3>
                                    <p className="text-gray-500 dark:text-slate-400">
                                        Try searching with a different term.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
