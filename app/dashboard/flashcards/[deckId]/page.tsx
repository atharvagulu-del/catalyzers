"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@/components/auth/AuthProvider";
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import FlashCard from '@/components/flashcards/FlashCard';
import SwipeActions from '@/components/flashcards/SwipeActions';
import ProgressHeader from '@/components/flashcards/ProgressHeader';
import SessionSummaryModal from '@/components/flashcards/SessionSummaryModal';
import { getDeckWithCards, updateCardProgress, Flashcard, FlashcardDeck } from '@/lib/flashcards';

export default function FlashcardSessionPage() {
    const { user } = useAuth();
    const params = useParams();
    const router = useRouter();
    const deckId = params.deckId as string;

    const [deck, setDeck] = useState<FlashcardDeck | null>(null);
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showSummary, setShowSummary] = useState(false);

    // Stats
    const [knownCount, setKnownCount] = useState(0);
    const [learningCount, setLearningCount] = useState(0);

    // Card highlight color for swipe feedback
    const [cardHighlight, setCardHighlight] = useState<'green' | 'orange' | null>(null);
    const [activeButton, setActiveButton] = useState<'learning' | 'know' | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    // Load deck and cards
    useEffect(() => {
        const loadDeck = async () => {
            setIsLoading(true);
            const result = await getDeckWithCards(deckId);
            if (result) {
                setDeck(result.deck);
                setCards(result.cards);
            }
            setIsLoading(false);
        };
        loadDeck();
    }, [deckId]);

    const currentCard = cards[currentIndex];

    const handleFlip = useCallback(() => {
        setIsFlipped(prev => !prev);
    }, []);

    const handleResponse = useCallback(async (status: 'known' | 'learning') => {
        if (!currentCard) return;

        // Visual Feedback - Card color + button fill
        if (status === 'known') {
            setCardHighlight('green');
            setActiveButton('know');
            setKnownCount(prev => prev + 1);
        } else {
            setCardHighlight('orange');
            setActiveButton('learning');
            setLearningCount(prev => prev + 1);
        }

        // Update progress in database (non-blocking)
        if (user?.id) {
            updateCardProgress(user.id, deckId, currentCard.id, status);
        }

        // Move to next card after animation
        setTimeout(() => {
            setIsFlipped(false);
            setCardHighlight(null);
            setActiveButton(null);

            if (currentIndex < cards.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                // Session complete - show confetti!
                setIsComplete(true);
                setShowSummary(true);
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }, 400);
    }, [user?.id, deckId, currentCard, currentIndex, cards.length]);

    const handleClose = useCallback(() => {
        setShowSummary(true);
    }, []);

    const handleContinue = useCallback(() => {
        setShowSummary(false);
    }, []);

    const handleRestart = useCallback(() => {
        // Reset session
        setCurrentIndex(0);
        setKnownCount(0);
        setLearningCount(0);
        setIsFlipped(false);
        setIsComplete(false);
        setShowSummary(false);
    }, []);

    const handleExit = useCallback(() => {
        router.push('/dashboard/flashcards');
    }, [router]);

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-[#E8F4FD]">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!deck || cards.length === 0) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#E8F4FD] p-4">
                <h2 className="text-xl font-bold text-slate-800 mb-2">No Cards Available</h2>
                <button
                    onClick={() => router.push('/dashboard/flashcards')}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                    Choose Different Topic
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: 'linear-gradient(180deg, #D6EAF8 0%, #E8F4FD 100%)' }}>
            {/* Grid Pattern Overlay (Allen style) */}
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

            {/* Header */}
            <div className="relative z-10 bg-white/50 backdrop-blur-sm">
                <ProgressHeader
                    title={deck.title}
                    currentIndex={currentIndex}
                    totalCards={cards.length}
                    onClose={handleClose}
                />
            </div>

            {/* Card Area */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-6 relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentCard.id}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            x: cardHighlight === 'orange' ? -30 : cardHighlight === 'green' ? 30 : 0,
                            rotate: cardHighlight === 'orange' ? -5 : cardHighlight === 'green' ? 5 : 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.9,
                            x: cardHighlight === 'orange' ? -200 : cardHighlight === 'green' ? 200 : 0,
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="w-full max-w-lg"
                    >
                        <FlashCard
                            question={currentCard.question}
                            hint={currentCard.hint}
                            answer={currentCard.answer}
                            isFlipped={isFlipped}
                            onFlip={handleFlip}
                            highlightColor={cardHighlight}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="pb-6 md:pb-8 relative z-10 bg-gradient-to-t from-white/30 to-transparent pt-4">
                <SwipeActions
                    onLearning={() => handleResponse('learning')}
                    onKnow={() => handleResponse('known')}
                    disabled={!isFlipped}
                    activeButton={activeButton}
                />
                {!isFlipped && (
                    <p className="text-center text-xs text-slate-500 mt-2 font-medium">
                        Tap the card to reveal answer
                    </p>
                )}
            </div>

            {/* Summary Modal */}
            <SessionSummaryModal
                isOpen={showSummary}
                onClose={handleExit}
                onContinue={handleContinue}
                onRestart={handleRestart}
                deckTitle={deck.title}
                knownCount={knownCount}
                learningCount={learningCount}
                totalCards={cards.length}
                isComplete={isComplete}
            />
        </div>
    );
}
