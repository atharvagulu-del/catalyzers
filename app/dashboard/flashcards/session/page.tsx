"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import confetti from 'canvas-confetti';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface GeneratedCard {
    question: string;
    hint: string | null;
    answer: string;
}

interface SessionData {
    subject: string;
    topic: string;
    cards: GeneratedCard[];
    cardCount: number;
}

// Helper to render LaTeX content
const renderContent = (text: string) => {
    const parts = (text || "").split(/(\$.*?\$)/g);
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

// Allen exact colors
const ALLEN_GREEN_RGB = [4, 202, 143];
const ALLEN_ORANGE_RGB = [255, 171, 46];
const WHITE_RGB = [255, 255, 255];
const DARK_CARD_RGB = [30, 41, 59]; // slate-800

const interpolateColor = (start: number[], end: number[], factor: number) => {
    const r = Math.round(start[0] + (end[0] - start[0]) * factor);
    const g = Math.round(start[1] + (end[1] - start[1]) * factor);
    const b = Math.round(start[2] + (end[2] - start[2]) * factor);
    return `rgb(${r}, ${g}, ${b})`;
};

export default function FlashcardSessionPage() {
    const router = useRouter();

    const [sessionData, setSessionData] = useState<SessionData | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showCompletion, setShowCompletion] = useState(false);
    const [showHint, setShowHint] = useState(false);

    // View mode for reviewing cards
    const [viewMode, setViewMode] = useState<'session' | 'review'>('session');
    const [viewCategory, setViewCategory] = useState<'learning' | 'known' | null>(null);
    const [viewIndex, setViewIndex] = useState(0);
    const [viewFlipped, setViewFlipped] = useState(false);

    // Stats
    const [knownCards, setKnownCards] = useState<GeneratedCard[]>([]);
    const [learningCards, setLearningCards] = useState<GeneratedCard[]>([]);

    // Simple drag state
    const [dragX, setDragX] = useState(0);

    // We use a key to force re-mounting of the card component when index changes
    const cardKey = `card-${currentIndex}`;

    const [exitState, setExitState] = useState<{
        exiting: boolean;
        direction: 'left' | 'right' | null;
    }>({ exiting: false, direction: null });

    // Computed values
    const dragFactor = Math.min(Math.abs(dragX) / 150, 1);
    const cardRotation = (dragX / 200) * 15; // Gentle rotation

    // Use dark card color for dark mode interpolation? No, cards are always white in Allen design
    // But user might want dark cards in dark mode? 
    // Image 2 shows white cards on dark background.
    // So we keep cards white, but interpolated color is same.

    const currentCardColor = dragX > 0
        ? interpolateColor(WHITE_RGB, ALLEN_GREEN_RGB, dragFactor)
        : interpolateColor(WHITE_RGB, ALLEN_ORANGE_RGB, dragFactor);

    // Determines if we should show white text (high intensity color)
    const useWhiteText = dragFactor > 0.6;

    const buttonHighlight = dragX > 50 ? 'right' : dragX < -50 ? 'left' : null;

    // Load session data
    useEffect(() => {
        const stored = sessionStorage.getItem('generatedFlashcards');
        if (stored) {
            try {
                const data = JSON.parse(stored) as SessionData;
                setSessionData(data);
            } catch {
                router.push('/dashboard/flashcards');
            }
        } else {
            router.push('/dashboard/flashcards');
        }
        setIsLoading(false);
    }, [router]);

    const cards = sessionData?.cards || [];
    const currentCard = cards[currentIndex];

    // Reset state
    useEffect(() => {
        setDragX(0);
        setExitState({ exiting: false, direction: null });
        setIsFlipped(false);
        setShowHint(false);
    }, [currentIndex]);

    const handleFlip = useCallback(() => {
        if (!exitState.exiting) {
            setIsFlipped(prev => !prev);
        }
    }, [exitState.exiting]);

    const moveToNextCard = useCallback((direction: 'left' | 'right') => {
        if (exitState.exiting) return;

        setExitState({ exiting: true, direction });

        setTimeout(() => {
            if (currentIndex < cards.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setShowCompletion(true);
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }, 300);
    }, [currentIndex, cards.length, exitState.exiting]);

    const handleResponse = useCallback((status: 'known' | 'learning') => {
        if (!currentCard || exitState.exiting) return;

        if (status === 'known') {
            setKnownCards(prev => [...prev, currentCard]);
            moveToNextCard('right');
        } else {
            setLearningCards(prev => [...prev, currentCard]);
            moveToNextCard('left');
        }
    }, [currentCard, exitState.exiting, moveToNextCard]);

    const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (exitState.exiting) return;

        const swipeThreshold = 100;
        if (info.offset.x > swipeThreshold) {
            handleResponse('known');
        } else if (info.offset.x < -swipeThreshold) {
            handleResponse('learning');
        } else {
            setDragX(0);
        }
    }, [exitState.exiting, handleResponse]);

    const handleClose = useCallback(() => {
        setShowCompletion(true);
    }, []);

    const handleKeepPracticing = useCallback(async () => {
        if (!sessionData) return;
        setIsGenerating(true);
        try {
            let newCards;
            const count = Math.max(sessionData.cardCount || 5, 5);
            const { getShuffledCards, hasQuestionBank } = await import('@/lib/questionBank');

            if (hasQuestionBank(sessionData.subject, sessionData.topic)) {
                newCards = getShuffledCards(sessionData.subject, sessionData.topic, count);
            } else {
                const response = await fetch('/api/flashcards/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        subject: sessionData.subject,
                        topic: sessionData.topic,
                        count
                    })
                });
                if (!response.ok) throw new Error('Failed to generate cards');
                const result = await response.json();
                newCards = result.cards;
            }

            const newSessionData = { ...sessionData, cards: newCards };
            sessionStorage.setItem('generatedFlashcards', JSON.stringify(newSessionData));
            setSessionData(newSessionData);

            setKnownCards([]);
            setLearningCards([]);
            setCurrentIndex(0);
            setIsFlipped(false);
            setShowCompletion(false);
            setViewMode('session');
            setDragX(0);
            setExitState({ exiting: false, direction: null });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsGenerating(false);
        }
    }, [sessionData]);

    const handleExit = useCallback(() => {
        sessionStorage.removeItem('generatedFlashcards');
        router.push('/dashboard/flashcards');
    }, [router]);

    const handleViewCards = (category: 'learning' | 'known') => {
        setViewCategory(category);
        setViewMode('review');
        setViewIndex(0);
        setViewFlipped(false);
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F0F6FA] dark:bg-[#0B0F15]">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!sessionData || !currentCard) {
        if (showCompletion) {
            // Let completion screen render
        } else if (cards.length > 0 && currentIndex >= cards.length) {
            setTimeout(() => setShowCompletion(true), 0);
            return null;
        } else {
            return (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F0F6FA] dark:bg-[#0B0F15] p-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Loading Deck...</h2>
                    <p className="text-sm text-slate-500 mb-4">Please wait or try regenerating.</p>
                    <button onClick={() => router.push('/dashboard/flashcards')} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl">Go Back</button>
                </div>
            );
        }
    }

    // REVIEW MODE
    if (viewMode === 'review' && viewCategory) {
        const reviewCards = viewCategory === 'known' ? knownCards : learningCards;
        const reviewCard = reviewCards[viewIndex];
        const categoryColor = viewCategory === 'known' ? '#04CA8F' : '#FFAB2E';

        return (
            <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#F0F6FA] dark:bg-[#0B0F15]">
                <div className="relative z-10 py-4 px-6 flex flex-col items-center">
                    <h1 className="text-base font-bold uppercase tracking-wide" style={{ color: categoryColor }}>
                        {viewCategory === 'known' ? 'Knew Answers For' : 'Still Learning'}
                    </h1>
                    <button onClick={() => { setViewMode('session'); setShowCompletion(true); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                        <ChevronLeft />
                    </button>
                </div>
                <div className="flex-1 flex items-center justify-center p-4">
                    {reviewCard && (
                        <div className="w-[320px] h-[420px] relative">
                            <motion.div
                                className="w-full h-full relative"
                                animate={{ rotateY: viewFlipped ? 180 : 0 }}
                                transition={{ duration: 0.4 }}
                                onClick={() => setViewFlipped(!viewFlipped)}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div className="absolute inset-0 bg-white rounded-3xl shadow-lg p-6 flex items-center justify-center" style={{ backfaceVisibility: 'hidden', borderLeft: `6px solid ${categoryColor}` }}>
                                    <div className="text-center">{renderContent(reviewCard.question)}</div>
                                </div>
                                <div className="absolute inset-0 bg-white rounded-3xl shadow-lg p-6 flex items-center justify-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderLeft: `6px solid ${categoryColor}` }}>
                                    <div className="text-center text-slate-700">{renderContent(reviewCard.answer)}</div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
                <div className="pb-8 flex justify-center gap-6">
                    <button onClick={() => { setViewIndex(Math.max(0, viewIndex - 1)); setViewFlipped(false); }} disabled={viewIndex === 0} className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm"><ChevronLeft className="dark:text-white" /></button>
                    <button onClick={() => { setViewIndex(Math.min(reviewCards.length - 1, viewIndex + 1)); setViewFlipped(false); }} disabled={viewIndex === reviewCards.length - 1} className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm"><ChevronRight className="dark:text-white" /></button>
                </div>
            </div>
        )
    }

    // COMPLETION SCREEN
    if (showCompletion) {
        const totalCards = knownCards.length + learningCards.length;
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F0F6FA] dark:bg-[#0B0F15] p-4">
                <div className="bg-white dark:bg-[#1A1F26] rounded-3xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-100 dark:border-slate-800">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-xl font-bold text-center mb-1 dark:text-white">Session Complete!</h2>
                        <p className="text-center text-slate-500 text-sm">{totalCards} cards studied</p>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-800">
                        <div className="p-4 text-center">
                            <p className="text-xs uppercase font-bold text-amber-500 mb-1">Still Learning</p>
                            <p className="text-2xl font-bold dark:text-white">{learningCards.length}</p>
                            <button onClick={() => handleViewCards('learning')} className="text-xs text-blue-500 mt-2 hover:underline">View Cards</button>
                        </div>
                        <div className="p-4 text-center">
                            <p className="text-xs uppercase font-bold text-emerald-500 mb-1">Knew This</p>
                            <p className="text-2xl font-bold dark:text-white">{knownCards.length}</p>
                            <button onClick={() => handleViewCards('known')} className="text-xs text-blue-500 mt-2 hover:underline">View Cards</button>
                        </div>
                    </div>
                    <div className="p-4 flex gap-3 bg-slate-50 dark:bg-[#151920]">
                        <button onClick={handleExit} className="flex-1 py-3 text-slate-600 font-semibold border bg-white dark:bg-[#1A1F26] dark:text-slate-300 dark:border-slate-800 rounded-xl">Close</button>
                        <button onClick={handleKeepPracticing} disabled={isGenerating} className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-blue-600/20">
                            {isGenerating ? <Loader2 className="animate-spin w-4 h-4" /> : 'Practice More'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const exitX = exitState.direction === 'right' ? 400 : -400;
    const exitRotate = exitState.direction === 'right' ? 25 : -25;

    // ACTIVE SESSION
    return (
        <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#F0F6FA] dark:bg-[#0B0F15]">
            {/* Background Grid Pattern - Light & Dark support */}
            <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.2]"
                style={{
                    backgroundImage: 'linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />
            {/* Dark mode specific subtle glow overlay for premium feel */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-200/20 dark:to-[#0B0F15] pointer-events-none" />


            {/* Header */}
            <div className="relative z-10 pt-8 pb-4 text-center">
                <h1 className="text-lg font-bold text-slate-800 dark:text-white">{sessionData.topic}</h1>
                <p className="text-sm text-slate-500">Card {currentIndex + 1} of {cards.length}</p>

                {/* Close Button - Circular floating with dark mode styling */}
                <button
                    onClick={handleClose}
                    className="absolute right-6 top-8 w-10 h-10 bg-white dark:bg-[#1A1F26] shadow-sm border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:scale-105 transition-all"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Card Dock */}
            <div className="flex-1 flex items-center justify-center relative z-10 perspective-1000">
                {/* Visual Stack (Back Cards) - Styled like white cards, consistently white in dark mode too */}
                <div
                    className="absolute bg-white rounded-[24px] shadow-sm border border-slate-100 dark:border-none w-[75vw] h-[55vh] md:w-[300px] md:h-[400px]"
                    style={{ transform: 'translateY(16px) scale(0.9)', zIndex: 10 }}
                />
                <div
                    className="absolute bg-white rounded-[24px] shadow-sm border border-slate-100 dark:border-none w-[75vw] h-[55vh] md:w-[300px] md:h-[400px]"
                    style={{ transform: 'translateY(8px) scale(0.95)', zIndex: 20 }}
                />

                <AnimatePresence mode="popLayout">
                    {currentCard && (
                        <motion.div
                            key={cardKey}
                            className="cursor-grab active:cursor-grabbing touch-none relative w-[85vw] h-[60vh] md:w-[320px] md:h-[420px]"
                            style={{
                                zIndex: 50
                            }}
                            drag={!exitState.exiting ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.9}
                            onDrag={(e, info) => setDragX(info.offset.x)}
                            onDragEnd={handleDragEnd}
                            animate={exitState.exiting ? {
                                x: exitX,
                                rotate: exitRotate,
                                opacity: 0
                            } : {
                                x: dragX,
                                rotate: cardRotation,
                                opacity: 1,
                                scale: 1
                            }}
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            exit={{ opacity: 0 }}
                            transition={exitState.exiting ? { duration: 0.3 } : { type: "spring", stiffness: 400, damping: 30 }}
                        >
                            <motion.div
                                className="w-full h-full relative"
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ duration: 0.4 }}
                                onClick={handleFlip}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* Front */}
                                <div
                                    className="absolute inset-0 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white/50 flex flex-col overflow-hidden transition-colors duration-100"
                                    style={{
                                        backgroundColor: exitState.exiting ? (exitState.direction === 'right' ? '#04CA8F' : '#FFAB2E') : currentCardColor,
                                        backfaceVisibility: 'hidden'
                                    }}
                                >
                                    <div className="p-4 text-center border-b border-black/5">
                                        <span className={`text-[10px] font-bold tracking-[0.2em] font-sans ${useWhiteText ? 'text-white/90' : 'text-slate-400'}`}>QUESTION</span>
                                    </div>

                                    <div className="flex-1 flex items-center justify-center p-8 text-center">
                                        <div className={`text-lg font-medium leading-relaxed font-sans ${useWhiteText ? 'text-white' : 'text-slate-800'}`}>
                                            {renderContent(currentCard.question)}
                                        </div>
                                    </div>

                                    {currentCard.hint && (
                                        <div className="p-5">
                                            {showHint ? (
                                                <div className="bg-yellow-50/80 backdrop-blur-sm text-yellow-800 text-sm p-3 rounded-xl border border-yellow-100/50">
                                                    {renderContent(currentCard.hint)}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setShowHint(true) }}
                                                    className={`text-xs font-bold uppercase tracking-wider w-full text-center py-2 ${useWhiteText ? 'text-white/80 hover:text-white' : 'text-blue-500 hover:text-blue-600'}`}
                                                >
                                                    Show Hint
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Back */}
                                <div
                                    className="absolute inset-0 bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 flex flex-col overflow-hidden"
                                    style={{
                                        backfaceVisibility: 'hidden',
                                        transform: 'rotateY(180deg)'
                                    }}
                                >
                                    <div className="p-4 border-b border-slate-50 text-center bg-slate-50/50">
                                        <span className="text-[10px] font-bold text-slate-400 font-sans tracking-[0.2em]">ANSWER</span>
                                    </div>
                                    <div className="flex-1 flex items-center justify-center p-8 text-center">
                                        <div className="text-lg text-slate-700 leading-relaxed font-sans">{renderContent(currentCard.answer)}</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="p-6 pb-10 flex justify-center gap-4 relative z-10 w-full max-w-md mx-auto">
                <button
                    onClick={() => handleResponse('learning')}
                    disabled={exitState.exiting}
                    className="flex-1 py-3.5 rounded-full font-bold transition-all transform active:scale-95 disabled:opacity-50 border-[2px] shadow-sm hover:shadow-md bg-white dark:bg-[#1A1F26] dark:border-[#FFAB2E]"
                    style={{
                        borderColor: '#FFAB2E',
                        color: buttonHighlight === 'left' ? 'white' : '#FFAB2E',
                        backgroundColor: buttonHighlight === 'left' ? '#FFAB2E' : (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? '#1A1F26' : 'white'),
                    }}
                >
                    Still Learning
                </button>
                <button
                    onClick={() => handleResponse('known')}
                    disabled={exitState.exiting}
                    className="flex-1 py-3.5 rounded-full font-bold transition-all transform active:scale-95 disabled:opacity-50 border-[2px] shadow-sm hover:shadow-md bg-white dark:bg-[#1A1F26] dark:border-[#04CA8F]"
                    style={{
                        borderColor: '#04CA8F',
                        color: buttonHighlight === 'right' ? 'white' : '#04CA8F',
                        backgroundColor: buttonHighlight === 'right' ? '#04CA8F' : (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? '#1A1F26' : 'white'),
                    }}
                >
                    I Know This
                </button>
            </div>
        </div>
    );
}
