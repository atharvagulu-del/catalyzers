import { Skeleton } from "@/components/ui/skeleton";

export default function SubjectLoading() {
    return (
        <div className="flex flex-col min-h-screen bg-[#F0F6FE] dark:bg-black">
            {/* Navigation Strip Skeleton */}
            <div className="container px-4 md:px-6 pt-6 pb-2">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <Skeleton className="h-9 w-48 rounded-full" />
                </div>
            </div>

            <main className="flex-grow container px-4 md:px-6 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Skeleton */}
                    <div className="md:w-64 flex-shrink-0 space-y-6">
                        <div>
                            <Skeleton className="h-10 w-48 mb-2" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>

                        {/* Course Challenge Card Skeleton */}
                        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                    </div>

                    {/* Main Content Skeleton */}
                    <div className="flex-grow space-y-6">
                        {/* Search Bar Skeleton */}
                        <Skeleton className="h-12 w-full rounded-xl" />

                        {/* Unit Cards Skeleton */}
                        <div className="grid grid-cols-1 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2 w-2/3">
                                            <Skeleton className="h-6 w-3/4" />
                                            <Skeleton className="h-4 w-1/4" />
                                        </div>
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                    </div>

                                    <div className="space-y-4">
                                        <Skeleton className="h-2 w-full rounded-full" />
                                        <div className="flex justify-between">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
