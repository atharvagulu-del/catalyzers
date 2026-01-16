"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface SessionSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
    onRestart?: () => void;
    deckTitle: string;
    knownCount: number;
    learningCount: number;
    totalCards: number;
    isComplete?: boolean;
}

export default function SessionSummaryModal({
    isOpen,
    onClose,
    onContinue,
    onRestart,
    deckTitle,
    knownCount,
    learningCount,
    totalCards,
    isComplete = false
}: SessionSummaryModalProps) {
    const progressPercent = totalCards > 0 ? Math.round(((knownCount + learningCount) / totalCards) * 100) : 0;

    const getStatusLabel = () => {
        if (progressPercent === 0) return "Just Started";
        if (progressPercent < 30) return "Getting Started";
        if (progressPercent < 60) return "Making Progress";
        if (progressPercent < 90) return "Almost There";
        if (progressPercent === 100) return "Completed!";
        return "Great Work!";
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
                    >
                        {/* Header with Illustration */}
                        <div className="pt-6 pb-4 px-6 text-center">
                            {/* Celebration/Confetti Illustration */}
                            <div className="w-20 h-20 mx-auto mb-4 relative">
                                {isComplete ? (
                                    // Coffee cup for completion
                                    <div className="text-6xl">☕</div>
                                ) : (
                                    // Window/door illustration for exit
                                    <div className="text-5xl">🚪</div>
                                )}
                            </div>

                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                {isComplete ? "Great Job!" : "Going so soon?"}
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                {isComplete
                                    ? "You've completed all the cards!"
                                    : "You can continue revising this set anytime from the homescreen"
                                }
                            </p>
                        </div>

                        {/* Stats Card */}
                        <div className="mx-6 mb-4 p-4 bg-slate-50 dark:bg-neutral-800 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-slate-700 dark:text-slate-200">Flashcards</h3>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-2">
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                    <span>{progressPercent}% Done</span>
                                </div>
                                <div className="h-2 bg-slate-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercent}%` }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="h-full bg-blue-500 rounded-full"
                                    />
                                </div>
                            </div>

                            <p className="text-xs text-slate-400">{getStatusLabel()}</p>

                            {/* Stats Row */}
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div className="text-center p-2 bg-white dark:bg-neutral-900 rounded-lg border border-slate-100 dark:border-neutral-700">
                                    <p className="text-lg font-bold text-amber-600">{learningCount}</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-medium">Still learning</p>
                                </div>
                                <div className="text-center p-2 bg-white dark:bg-neutral-900 rounded-lg border border-slate-100 dark:border-neutral-700">
                                    <p className="text-lg font-bold text-emerald-600">{knownCount}</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-medium">Knew answers for</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-6 pt-2 flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 border-2 border-blue-500 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={isComplete && onRestart ? onRestart : onContinue}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors"
                            >
                                {isComplete ? "Review Again" : "Keep Practicing"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
