"use client";

import { X } from 'lucide-react';

interface ProgressHeaderProps {
    title: string;
    currentIndex: number;
    totalCards: number;
    onClose: () => void;
}

export default function ProgressHeader({ title, currentIndex, totalCards, onClose }: ProgressHeaderProps) {
    return (
        <div className="relative flex flex-col items-center justify-center py-4 px-6">
            {/* Chapter Title */}
            <h1 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                {title}
            </h1>

            {/* Progress Counter - Allen Style */}
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Deck 1 • <span className="font-medium">{currentIndex + 1} of {totalCards}</span> cards
            </p>

            {/* Close Button - Top Right */}
            <button
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 bg-white dark:bg-neutral-800 rounded-full border border-slate-200 dark:border-neutral-700 shadow-sm hover:shadow transition-all"
                aria-label="Close session"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
