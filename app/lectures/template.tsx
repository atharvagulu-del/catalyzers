"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function LecturesTemplate({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const prevPathnameRef = useRef(pathname);

    // Determine page type
    const isSubjectPage = pathname.split('/').filter(Boolean).length > 2;
    const isLecturesIndex = pathname === '/lectures';

    // Show skeleton on navigation
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Only trigger loading if pathname actually changed
        if (prevPathnameRef.current !== pathname) {
            setIsLoading(true);
            prevPathnameRef.current = pathname;
        }

        const timer = setTimeout(() => setIsLoading(false), 400);
        return () => clearTimeout(timer);
    }, [pathname]);

    // Skeleton for Lectures Index
    const LecturesSkeleton = () => (
        <div className="space-y-10 p-0 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mt-8 space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-48" />
            </div>

            {/* Subject Grid */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <div className="h-px bg-slate-100 flex-1" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-48 rounded-xl" />
                    ))}
                </div>
            </div>

            {/* Continue Learning */}
            <Skeleton className="h-64 rounded-2xl mt-12" />
        </div>
    );

    // Skeleton for Subject Detail Pages
    const SubjectSkeleton = () => (
        <div className="flex flex-col">
            {/* Navigation Strip */}
            <div className="container px-4 md:px-6 pt-6 pb-2">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <Skeleton className="h-10 w-64 rounded-full" />
                </div>
            </div>

            <main className="flex-grow container px-4 md:px-6 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Skeleton */}
                    <div className="md:w-64 flex-shrink-0 space-y-6">
                        <div className="space-y-3">
                            <Skeleton className="h-10 w-48" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        <Skeleton className="h-40 rounded-xl" />
                    </div>

                    {/* Main Content Skeleton */}
                    <div className="flex-grow space-y-6">
                        <Skeleton className="h-12 w-full rounded-xl" />
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-48 rounded-xl" />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );

    // Show appropriate skeleton during loading
    if (isLoading) {
        return (
            <div className="w-full h-full">
                {isSubjectPage ? <SubjectSkeleton /> : <LecturesSkeleton />}
            </div>
        );
    }

    // Normal render
    return <div className="w-full h-full">{children}</div>;
}

