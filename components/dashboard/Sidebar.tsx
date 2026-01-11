"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    OverviewIcon,
    LecturesIcon,
    TestsIcon,
    DoubtsIcon,
    PerformanceIcon
} from "@/components/ui/custom-icons";

// Map old Lucide icons to new custom ones for the Sidebar
const sidebarItems = [
    {
        name: "Overview",
        href: "/dashboard",
        icon: OverviewIcon,
    },
    {
        name: "Lectures",
        href: "/lectures",
        icon: LecturesIcon,
    },
    {
        name: "Tests",
        href: "/dashboard/tests",
        icon: TestsIcon,
    },
    {
        name: "Doubts",
        href: "/dashboard/doubts",
        icon: DoubtsIcon,
    },
    {
        name: "Performance",
        href: "/dashboard/profile",
        icon: PerformanceIcon,
    },
];

export default function Sidebar({ isOpen = false, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Overlay - only visible when menu is open on mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col z-50 transition-transform duration-300 
                ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        // Allen style: active items have a light blue pill background
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose} // Close menu on navigation (mobile)
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                                    }`}
                            >
                                <item.icon
                                    className={`w-5 h-5 transition-colors ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                                        }`}
                                // strokeWidth={isActive ? 2.5 : 2} // Custom icons have fixed stroke, can pass prop if needed
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Branding or simple footer */}
                <div className="p-6 border-t border-slate-50 dark:border-slate-800 text-center">
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">© 2024 Catalyzer</p>
                </div>
            </aside>
        </>
    );
}
