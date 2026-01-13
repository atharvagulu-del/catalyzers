"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { setTheme } = useTheme();

    useEffect(() => {
        setTheme("light");
    }, [setTheme]);

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            {children}
        </div>
    );
}
