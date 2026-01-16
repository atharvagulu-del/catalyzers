"use client";

import { motion } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface CardViewerProps {
    isOpen: boolean;
    onClose: () => void;
    cards: Array<{ question: string; answer: string; hint: string | null }>;
    category: 'learning' | 'known';
    title: string;
}

// Helper to render LaTeX content
const renderContent = (text: string) => {
    const parts = text.split(/(\$.*?\$)/g);
    return (
        <span>
            {parts.map((part, i) => {
                if (part.startsWith('$') && part.endsWith('$')) {
                    try {
                        return <span key={i} className="inline-block mx-1"><InlineMath math={part.slice(1, -1)} /></span>;
                    } catch {
                        return <span key={i} className="text-red-500">{part}</span>;
                    }
                }
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
};

export default function CardViewer({ isOpen, onClose, cards, category, title }: CardViewerProps) {
    if (!isOpen) return null;

    const categoryColor = category === 'known' ? 'emerald' : 'amber';
    const categoryLabel = category === 'known' ? 'Knew answers for' : 'Still learning';

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 z-50 bg-white dark:bg-[#111] overflow-hidden flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-neutral-800">
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <div className="flex-1">
                    <h1 className="font-bold text-slate-800 dark:text-slate-100">{title}</h1>
                    <p className={`text-xs font-medium text-${categoryColor}-600`}>
                        {categoryLabel} • {cards.length} cards
                    </p>
                </div>
            </div>

            {/* Cards List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cards.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`bg-white dark:bg-neutral-900 rounded-xl border-l-4 ${category === 'known' ? 'border-l-emerald-500' : 'border-l-amber-500'
                            } shadow-sm overflow-hidden`}
                    >
                        {/* Question */}
                        <div className="p-4 border-b border-slate-50 dark:border-neutral-800">
                            <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Question {index + 1}</p>
                            <p className="text-slate-800 dark:text-slate-200 font-medium">
                                {renderContent(card.question)}
                            </p>
                        </div>

                        {/* Answer */}
                        <div className="p-4 bg-slate-50/50 dark:bg-neutral-800/50">
                            <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Answer</p>
                            <p className="text-slate-700 dark:text-slate-300 text-sm">
                                {renderContent(card.answer)}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
