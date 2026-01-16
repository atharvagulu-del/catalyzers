"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FlashCard from '@/components/flashcards/FlashCard';
import SwipeActions from '@/components/flashcards/SwipeActions';
import ProgressHeader from '@/components/flashcards/ProgressHeader';
import SessionSummaryModal from '@/components/flashcards/SessionSummaryModal';

interface GeneratedCard {
    question: string;
    hint: string | null;
    answer: string;
}

interface SessionData {
    subject: string;
    topic: string;
    cards: GeneratedCard[];
}

export default function PracticeGeneratedCardsPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [sessionData, setSessionData] = useState<SessionData | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showSummary, setShowSummary] = useState(false);

    // Track session stats
    const [knownCount, setKnownCount] = useState(0);
    const [learningCount, setLearningCount] = useState(0);

    // Animation state for card transitions
    const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

    // Load session data from sessionStorage
    useEffect(() => {
        const stored = sessionStorage.getItem('generatedFlashcards');
        if (stored) {
            try {
                const data = JSON.parse(stored) as SessionData;
                setSessionData(data);
            } catch {
                router.push('/dashboard/flashcards/generate');
            }
        } else {
            router.push('/dashboard/flashcards/generate');
        }
        setIsLoading(false);
    }, [router]);

    const cards = sessionData?.cards || [];
    const currentCard = cards[currentIndex];

    const handleFlip = useCallback(() => {
        setIsFlipped(prev => !prev);
    }, []);

    const handleResponse = useCallback((status: 'known' | 'learning') => {
        if (!currentCard) return;

        // Update local stats
        if (status === 'known') {
            setKnownCount(prev => prev + 1);
            setExitDirection('right');
        } else {
            setLearningCount(prev => prev + 1);
            setExitDirection('left');
        }

        // Move to next card after animation
        setTimeout(() => {
            setIsFlipped(false);
            setExitDirection(null);

            if (currentIndex < cards.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                // Session complete
                setShowSummary(true);
            }
        }, 300);
    }, [currentCard, currentIndex, cards.length]);

    const handleClose = useCallback(() => {
        setShowSummary(true);
    }, []);

    const handleContinue = useCallback(() => {
        setShowSummary(false);
    }, []);

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 dark:from-[#0A0A0A] dark:to-[#111]">
                <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
            </div>
        );
    }

    if (!sessionData || cards.length === 0) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 dark:from-[#0A0A0A] dark:to-[#111] p-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No Cards Available</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Generate some flashcards first.</p>
                <button
                    onClick={() => router.push('/dashboard/flashcards/generate')}
                    className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
                >
                    Generate Cards
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-purple-50 to-pink-100 dark:from-[#0A0A0A] dark:to-[#111]">
            {/* Header */}
            <ProgressHeader
                title={`${sessionData.subject} - ${sessionData.topic}`}
                currentIndex={currentIndex}
                totalCards={cards.length}
                onClose={handleClose}
            />

            {/* Card Area */}
            <div className="flex-1 flex items-center justify-center p-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: exitDirection === 'left' ? -300 : exitDirection === 'right' ? 300 : 0,
                        }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-md"
                    >
                        <FlashCard
                            question={currentCard.question}
                            hint={currentCard.hint}
                            answer={currentCard.answer}
                            isFlipped={isFlipped}
                            onFlip={handleFlip}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="pb-8">
                <SwipeActions
                    onLearning={() => handleResponse('learning')}
                    onKnow={() => handleResponse('known')}
                    disabled={!isFlipped}
                />
                {!isFlipped && (
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Tap the card to reveal the answer
                    </p>
                )}
            </div>

            {/* Summary Modal */}
            <SessionSummaryModal
                isOpen={showSummary}
                onClose={() => setShowSummary(false)}
                onContinue={handleContinue}
                deckTitle={`${sessionData.subject} - ${sessionData.topic}`}
                knownCount={knownCount}
                learningCount={learningCount}
                totalCards={cards.length}
            />
        </div>
    );
}
