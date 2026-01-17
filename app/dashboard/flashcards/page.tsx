"use client";

import { useState } from 'react';
import { ArrowLeft, Atom, FlaskConical, Calculator, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JEE_CHAPTERS } from '@/lib/flashcards';
import { getShuffledCards, hasQuestionBank } from '@/lib/questionBank';

const SUBJECT_CONFIG = {
    'Physics': { icon: Atom, color: 'text-blue-500', bg: 'bg-blue-500', lightBg: 'bg-blue-50', border: 'border-blue-300' },
    'Chemistry': { icon: FlaskConical, color: 'text-emerald-500', bg: 'bg-emerald-500', lightBg: 'bg-emerald-50', border: 'border-emerald-300' },
    'Maths': { icon: Calculator, color: 'text-purple-500', bg: 'bg-purple-500', lightBg: 'bg-purple-50', border: 'border-purple-300' },
};

const CARD_COUNT_OPTIONS = [5, 10];

export default function FlashcardsPage() {
    const router = useRouter();
    const [selectedSubject, setSelectedSubject] = useState<string>('Physics');
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [cardCount, setCardCount] = useState<number>(5);
    const [isStarting, setIsStarting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleStart = async () => {
        if (!selectedTopic) return;

        setIsStarting(true);
        setError(null);

        try {
            let cards;

            // Try question bank first (instant, free)
            if (hasQuestionBank(selectedSubject, selectedTopic)) {
                cards = getShuffledCards(selectedSubject, selectedTopic, cardCount);
            } else {
                // Fall back to Gemini API for topics not in bank
                const response = await fetch('/api/flashcards/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        subject: selectedSubject,
                        topic: selectedTopic,
                        count: cardCount
                    })
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.details || data.error || 'Failed to generate flashcards');
                }

                const result = await response.json();
                cards = result.cards;
            }

            // Store cards in sessionStorage and navigate
            const sessionData = {
                subject: selectedSubject,
                topic: selectedTopic,
                cards,
                cardCount
            };
            sessionStorage.setItem('generatedFlashcards', JSON.stringify(sessionData));
            router.push('/dashboard/flashcards/session');
        } catch (err) {
            console.error('Error generating cards:', err);
            setError(err instanceof Error ? err.message : 'Something went wrong');
            setIsStarting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-32 md:pb-0 min-h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 flex-shrink-0">
                <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-slate-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Flash Cards</h1>
                    <p className="text-sm text-slate-500">Select a chapter to start revision</p>
                </div>
            </div>

            {/* Subject Selection (Horizontal Cards - Allen Style) */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 flex-shrink-0">
                {Object.keys(SUBJECT_CONFIG).map((subject) => {
                    const config = SUBJECT_CONFIG[subject as keyof typeof SUBJECT_CONFIG];
                    const isSelected = selectedSubject === subject;
                    const Icon = config.icon;

                    return (
                        <button
                            key={subject}
                            onClick={() => {
                                setSelectedSubject(subject);
                                setSelectedTopic(null);
                            }}
                            className={`relative p-4 md:p-5 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                                ${isSelected
                                    ? `${config.border} ${config.lightBg}`
                                    : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                                }`}
                        >
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${isSelected ? config.bg : 'bg-slate-100'} flex items-center justify-center transition-colors`}>
                                <Icon className={`w-5 h-5 md:w-6 md:h-6 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                            </div>
                            <span className={`text-sm font-semibold ${isSelected ? 'text-slate-800' : 'text-slate-600'}`}>{subject}</span>
                        </button>
                    );
                })}
            </div>

            {/* Card Count Selection */}
            <div className="flex items-center gap-4 flex-shrink-0 bg-white dark:bg-[#111] rounded-xl p-4 border border-slate-100 dark:border-neutral-800">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Cards per session:</span>
                <div className="flex gap-2">
                    {CARD_COUNT_OPTIONS.map((count) => (
                        <button
                            key={count}
                            onClick={() => setCardCount(count)}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all
                                ${cardCount === count
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-neutral-800 dark:text-slate-400'
                                }`}
                        >
                            {count}
                        </button>
                    ))}
                </div>
            </div>

            {/* Topic List */}
            <div className="flex-1 bg-white dark:bg-[#111] rounded-2xl border border-slate-100 dark:border-neutral-800 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50">
                    <h2 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        {selectedSubject} Chapters
                        <span className="text-xs font-normal text-slate-400 bg-white dark:bg-neutral-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-neutral-700">
                            {JEE_CHAPTERS[selectedSubject as keyof typeof JEE_CHAPTERS]?.length || 0}
                        </span>
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-2 max-h-[400px]">
                    <div className="space-y-1">
                        {JEE_CHAPTERS[selectedSubject as keyof typeof JEE_CHAPTERS]?.map((topic, index) => {
                            const isSelected = selectedTopic === topic;

                            return (
                                <button
                                    key={topic}
                                    onClick={() => setSelectedTopic(isSelected ? null : topic)}
                                    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-colors text-left
                                        ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-slate-50 dark:hover:bg-neutral-900'}`}
                                >
                                    <div className="flex-shrink-0 text-slate-400 font-mono text-xs w-6">
                                        {(index + 1).toString().padStart(2, '0')}
                                    </div>
                                    <div className="flex-1 font-medium text-slate-700 dark:text-slate-300 truncate text-sm">
                                        {topic}
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                        ${isSelected
                                            ? 'bg-blue-600 border-blue-600'
                                            : 'border-slate-300 dark:border-neutral-600'
                                        }`}
                                    >
                                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm">
                    {error}
                </div>
            )}

            {/* Start Button - Fixed on Mobile */}
            <div className="fixed md:relative bottom-0 left-0 right-0 p-4 md:p-0 bg-white/90 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none border-t md:border-0 border-slate-100">
                <button
                    onClick={handleStart}
                    disabled={!selectedTopic || isStarting}
                    className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all
                        ${selectedTopic && !isStarting
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    {isStarting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating {cardCount} cards...
                        </>
                    ) : (
                        'Start'
                    )}
                </button>
            </div>
        </div>
    );
}
