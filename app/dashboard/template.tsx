"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Initialize based on path to avoid "Content -> Skeleton" flash
    const [isLoading, setIsLoading] = useState(pathname === '/dashboard');

    useEffect(() => {
        if (pathname === '/dashboard') {
            setIsLoading(true);
            const timer = setTimeout(() => setIsLoading(false), 350);
            return () => clearTimeout(timer);
        }
    }, [pathname]);

    const DashboardSkeleton = () => (
        <div className="space-y-8 p-0 max-w-7xl mx-auto">
            {/* Welcome */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
            </div>

            {/* Quick Actions Grid (Icon Style) */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="flex gap-6 md:gap-10 overflow-hidden pb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="space-y-3 flex flex-col items-center">
                            <Skeleton className="w-[105px] h-[105px] rounded-[28px]" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Tests Section (2/3) */}
                <Skeleton className="md:col-span-2 h-64 rounded-2xl" />
                {/* Daily Goals (1/3) */}
                <Skeleton className="h-64 rounded-2xl" />
            </div>
        </div>
    );

    return (
        <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div
                    key="skeleton"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full"
                >
                    <DashboardSkeleton />
                </motion.div>
            ) : (
                <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ ease: "easeOut", duration: 0.4 }}
                    className="w-full h-full"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
