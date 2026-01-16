"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CompletionPageProps {
    isOpen: boolean;
    onClose: () => void;
    onKeepPracticing: () => void;
    onViewCards: (category: 'learning' | 'known') => void;
    deckTitle: string;
    knownCount: number;
    learningCount: number;
    totalCards: number;
}

export default function CompletionPage({
    isOpen,
    onClose,
    onKeepPracticing,
    onViewCards,
    deckTitle,
    knownCount,
    learningCount,
    totalCards
}: CompletionPageProps) {
    const progressPercent = totalCards > 0 ? Math.round((knownCount / totalCards) * 100) : 0;
    const decksFinished = 1; // For now, single deck

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ background: 'linear-gradient(180deg, #D6EAF8 0%, #E8F4FD 100%)' }}
            >
                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, #B8D4E8 1px, transparent 1px),
                            linear-gradient(to bottom, #B8D4E8 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Close X */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700 bg-white rounded-full shadow-sm"
                >
                    ✕
                </button>

                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    {/* Stats Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                        {/* Header */}
                        <div className="p-5 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800">Flashcards</h2>
                            <p className="text-sm text-slate-500">{progressPercent}% Done</p>

                            {/* Progress Bar */}
                            <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="flex h-full">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(knownCount / totalCards) * 100}%` }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="bg-emerald-500 h-full"
                                    />
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(learningCount / totalCards) * 100}%` }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                        className="bg-amber-500 h-full"
                                    />
                                </div>
                            </div>

                            <p className="text-xs text-slate-400 mt-2 text-center">{decksFinished} Deck finished</p>
                        </div>

                        {/* Cards Summary */}
                        <div className="grid grid-cols-2 divide-x divide-slate-100">
                            {/* Still Learning */}
                            <div className="p-4">
                                <p className="text-xs font-semibold text-amber-600 uppercase mb-1">Still learning</p>
                                <p className="text-2xl font-bold text-slate-800 mb-3">{learningCount} Cards</p>
                                <button
                                    onClick={() => onViewCards('learning')}
                                    disabled={learningCount === 0}
                                    className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    View <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Knew Answers */}
                            <div className="p-4">
                                <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">Knew answers for</p>
                                <p className="text-2xl font-bold text-slate-800 mb-3">{knownCount} Cards</p>
                                <button
                                    onClick={() => onViewCards('known')}
                                    disabled={knownCount === 0}
                                    className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    View <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3.5 bg-white border-2 border-blue-500 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={onKeepPracticing}
                            className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors"
                        >
                            Keep Practicing
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
