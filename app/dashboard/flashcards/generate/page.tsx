"use client";

import { useState } from 'react';
import { useAuth } from "@/components/auth/AuthProvider";
import { motion } from 'framer-motion';
import { Loader2, Sparkles, ArrowLeft, Atom, FlaskConical, Calculator, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SUBJECTS = [
    { name: 'Physics', icon: Atom, color: 'from-blue-500 to-cyan-500' },
    { name: 'Chemistry', icon: FlaskConical, color: 'from-green-500 to-emerald-500' },
    { name: 'Maths', icon: Calculator, color: 'from-purple-500 to-pink-500' },
];

const TOPICS: Record<string, string[]> = {
    'Physics': [
        'Mechanics', 'Thermodynamics', 'Waves & Oscillations', 'Optics',
        'Electrostatics', 'Current Electricity', 'Magnetism', 'Modern Physics'
    ],
    'Chemistry': [
        'Atomic Structure', 'Chemical Bonding', 'Periodic Table', 'Thermodynamics',
        'Chemical Equilibrium', 'Electrochemistry', 'Organic Chemistry Basics', 'Coordination Compounds'
    ],
    'Maths': [
        'Algebra', 'Calculus', 'Coordinate Geometry', 'Trigonometry',
        'Vectors', 'Matrices & Determinants', 'Probability', 'Complex Numbers'
    ]
};

interface GeneratedCard {
    question: string;
    hint: string | null;
    answer: string;
}

export default function GenerateFlashcardsPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [cardCount, setCardCount] = useState(10);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

    const handleGenerate = async () => {
        if (!selectedSubject || !selectedTopic) return;

        setIsGenerating(true);
        setError(null);
        setGeneratedCards([]);

        try {
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
                throw new Error(data.error || 'Failed to generate flashcards');
            }

            const { cards } = await response.json();
            setGeneratedCards(cards);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleStartPractice = () => {
        // Store generated cards in sessionStorage for the practice session
        sessionStorage.setItem('generatedFlashcards', JSON.stringify({
            subject: selectedSubject,
            topic: selectedTopic,
            cards: generatedCards
        }));
        router.push('/dashboard/flashcards/practice');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/flashcards"
                    className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-purple-500" />
                        AI Flashcard Generator
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Generate custom flashcards on any topic
                    </p>
                </div>
            </div>

            {/* Subject Selection */}
            <section>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                    1. Select Subject
                </h2>
                <div className="grid grid-cols-3 gap-4">
                    {SUBJECTS.map(({ name, icon: Icon, color }) => {
                        const isSelected = selectedSubject === name;
                        return (
                            <motion.button
                                key={name}
                                onClick={() => {
                                    setSelectedSubject(name);
                                    setSelectedTopic(null);
                                    setGeneratedCards([]);
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-4 rounded-xl border-2 transition-all ${isSelected
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                        : 'border-slate-200 dark:border-neutral-700 bg-white dark:bg-[#1A1A1A]'
                                    }`}
                            >
                                <div className={`w-12 h-12 mx-auto mb-2 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className={`text-sm font-semibold ${isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {name}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </section>

            {/* Topic Selection */}
            {selectedSubject && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                        2. Select Topic
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {TOPICS[selectedSubject].map((topic) => {
                            const isSelected = selectedTopic === topic;
                            return (
                                <button
                                    key={topic}
                                    onClick={() => {
                                        setSelectedTopic(topic);
                                        setGeneratedCards([]);
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-neutral-700'
                                        }`}
                                >
                                    {topic}
                                </button>
                            );
                        })}
                    </div>
                </motion.section>
            )}

            {/* Card Count */}
            {selectedTopic && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                        3. Number of Cards
                    </h2>
                    <div className="flex items-center gap-4">
                        {[5, 10, 15, 20].map((num) => (
                            <button
                                key={num}
                                onClick={() => setCardCount(num)}
                                className={`w-12 h-12 rounded-xl font-bold transition-all ${cardCount === num
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-neutral-700'
                                    }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </motion.section>
            )}

            {/* Generate Button */}
            {selectedTopic && !generatedCards.length && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all disabled:opacity-70"
                    >
                        {isGenerating ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Generating {cardCount} cards...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Generate Flashcards
                            </span>
                        )}
                    </button>
                </motion.div>
            )}

            {/* Error */}
            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400"
                >
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                </motion.div>
            )}

            {/* Preview Generated Cards */}
            {generatedCards.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            Generated Cards ({generatedCards.length})
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <Check className="w-4 h-4" />
                            Ready to practice!
                        </div>
                    </div>

                    {/* Card Preview List */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {generatedCards.map((card, index) => (
                            <div
                                key={index}
                                className="p-4 bg-white dark:bg-[#1A1A1A] rounded-xl border border-slate-200 dark:border-neutral-800"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-xs font-bold">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">
                                            {card.question}
                                        </p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                            {card.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Start Practice Button */}
                    <button
                        onClick={handleStartPractice}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-lg transition-colors"
                    >
                        Start Practicing
                    </button>
                </motion.section>
            )}
        </div>
    );
}
