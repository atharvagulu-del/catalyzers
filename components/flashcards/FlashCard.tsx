"use client";

import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface FlashCardProps {
    question: string;
    hint: string | null;
    answer: string;
    isFlipped: boolean;
    onFlip: () => void;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    swipeDirection?: 'left' | 'right' | null;
    cardNumber?: number;
    totalCards?: number;
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

export default function FlashCard({
    question,
    hint,
    answer,
    isFlipped,
    onFlip,
    onSwipeLeft,
    onSwipeRight,
    swipeDirection,
    cardNumber,
    totalCards
}: FlashCardProps) {
    const [showHint, setShowHint] = useState(false);
    const [dragX, setDragX] = useState(0);

    // Full card background color based on swipe direction
    const getCardBackground = () => {
        if (swipeDirection === 'right') return 'bg-emerald-400';
        if (swipeDirection === 'left') return 'bg-amber-400';
        // During drag, show color based on drag direction
        if (dragX > 50) return 'bg-emerald-100';
        if (dragX < -50) return 'bg-amber-100';
        return 'bg-white';
    };

    const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setDragX(info.offset.x);
    };

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const swipeThreshold = 100;
        if (info.offset.x > swipeThreshold && onSwipeRight) {
            onSwipeRight();
        } else if (info.offset.x < -swipeThreshold && onSwipeLeft) {
            onSwipeLeft();
        }
        setDragX(0);
    };

    return (
        <motion.div
            className="perspective-1000 w-full max-w-md mx-auto"
            drag={isFlipped ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            animate={{
                x: swipeDirection === 'right' ? 300 : swipeDirection === 'left' ? -300 : 0,
                rotate: swipeDirection === 'right' ? 15 : swipeDirection === 'left' ? -15 : dragX * 0.05,
                opacity: swipeDirection ? 0 : 1,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
        >
            <motion.div
                className="relative w-full aspect-[3/4] cursor-pointer preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                onClick={!swipeDirection ? onFlip : undefined}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front Face - Question */}
                <motion.div
                    className={`absolute inset-0 backface-hidden rounded-2xl shadow-lg flex flex-col overflow-hidden transition-colors duration-150
                        ${getCardBackground()} dark:bg-[#1E1E1E]`}
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {/* Stacked cards effect */}
                    <div className="absolute -bottom-2 left-2 right-2 h-4 bg-slate-100 rounded-b-2xl -z-10 opacity-60" />
                    <div className="absolute -bottom-4 left-4 right-4 h-4 bg-slate-200 rounded-b-2xl -z-20 opacity-40" />

                    {/* Content */}
                    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8">
                        <div className="text-base md:text-xl font-medium text-slate-800 dark:text-slate-100 text-center leading-relaxed">
                            {renderContent(question)}
                        </div>
                    </div>

                    {/* Hint Section */}
                    <div className="p-4 border-t border-slate-100/50">
                        <AnimatePresence mode="wait">
                            {showHint && hint ? (
                                <motion.div
                                    key="hint"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-amber-50 rounded-xl p-3 border border-amber-100"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <Lightbulb className="w-4 h-4 text-amber-600" />
                                        <span className="text-xs font-semibold text-amber-700 uppercase">Hint</span>
                                    </div>
                                    <p className="text-sm text-amber-800">{renderContent(hint)}</p>
                                </motion.div>
                            ) : hint ? (
                                <motion.button
                                    key="hint-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowHint(true);
                                    }}
                                    className="w-full py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 tracking-wide uppercase"
                                >
                                    Show a Hint
                                </motion.button>
                            ) : null}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Back Face - Answer */}
                <motion.div
                    className={`absolute inset-0 backface-hidden rounded-2xl shadow-lg flex flex-col overflow-hidden transition-colors duration-150
                        ${getCardBackground()} dark:bg-[#1E1E1E]`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    {/* Stacked cards effect */}
                    <div className="absolute -bottom-2 left-2 right-2 h-4 bg-slate-100 rounded-b-2xl -z-10 opacity-60" />
                    <div className="absolute -bottom-4 left-4 right-4 h-4 bg-slate-200 rounded-b-2xl -z-20 opacity-40" />

                    {/* Answer Header */}
                    <div className="py-3 text-center border-b border-slate-100/50">
                        <span className="text-xs font-bold text-slate-400 tracking-widest">— ANSWER —</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8">
                        <div className="text-base md:text-lg text-slate-700 dark:text-slate-200 text-center leading-relaxed">
                            {renderContent(answer)}
                        </div>
                    </div>

                    {/* Swipe hint */}
                    <div className="p-4 text-center">
                        <p className="text-xs text-slate-400">← Swipe or use buttons below →</p>
                    </div>
                </motion.div>
            </motion.div>

            {/* CSS for 3D transforms */}
            <style jsx global>{`
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
            `}</style>
        </motion.div>
    );
}
