"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronRight, RefreshCw, Trophy, HelpCircle, SkipForward } from 'lucide-react';
import { Question } from '@/lib/lectureData';
import confetti from 'canvas-confetti';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

interface QuizInterfaceProps {
    questions: Question[];
    title: string;
    onComplete?: () => void;
}

const OnScreenKeyboard = ({ onInput, onDelete, onClear, onSubmit }: { onInput: (val: string) => void, onDelete: () => void, onClear: () => void, onSubmit: () => void }) => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '-'];

    return (
        <div className="mt-6 max-w-xs mx-auto">
            <div className="grid grid-cols-3 gap-2 mb-2">
                {keys.map((key) => (
                    <button
                        key={key}
                        onClick={() => onInput(key)}
                        className="h-12 text-xl font-semibold bg-blue-600 text-white rounded-lg shadow-[0_2px_0_0_#1e40af] hover:bg-blue-700 active:shadow-none active:translate-y-0.5 transition-all"
                    >
                        {key}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={onDelete}
                    className="h-12 font-semibold bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg shadow-[0_2px_0_0_#9ca3af] dark:shadow-[0_2px_0_0_#475569] hover:bg-gray-300 dark:hover:bg-slate-600 active:shadow-none active:translate-y-0.5 transition-all flex items-center justify-center"
                >
                    ⌫ Backspace
                </button>
                <button
                    onClick={onSubmit}
                    className="h-12 font-semibold bg-green-600 text-white rounded-lg shadow-[0_2px_0_0_#166534] hover:bg-green-700 active:shadow-none active:translate-y-0.5 transition-all"
                >
                    Check
                </button>
            </div>
        </div>
    );
};

export default function QuizInterface({ questions = [], title, onComplete }: QuizInterfaceProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | string | null>(null);
    const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect' | 'stuck'>('idle');
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [shake, setShake] = useState(0); // Key to trigger shake animation
    const [hintRevealed, setHintRevealed] = useState(false);

    const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

    useEffect(() => {
        if (!questions || questions.length === 0) {
            setShuffledQuestions([]);
            return;
        }

        const mcqs = questions.filter(q => !q.type || q.type === 'mcq');
        const numericals = questions.filter(q => q.type === 'numerical');

        const shuffleArray = (array: Question[]) => {
            const arr = [...array];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        };

        setShuffledQuestions([...shuffleArray(mcqs), ...shuffleArray(numericals)]);

    }, [questions]);

    const showExplanation = status === 'correct';

    // Reset state when question changes
    useEffect(() => {
        setSelectedOption(null);
        setStatus('idle');
        setHintRevealed(false);
    }, [currentIndex]);

    // Initial loading or empty state
    if (!questions || questions.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                    <p className="text-lg font-medium">No questions available yet.</p>
                    <p className="text-sm">Check back later!</p>
                </div>
            </div>
        );
    }

    if (shuffledQuestions.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">Loading...</div>;
    }

    const currentQuestion = shuffledQuestions[currentIndex];

    // Additional safety check if index is out of bounds
    if (!currentQuestion) {
        return <div className="p-8 text-center text-red-500">Error loading question.</div>;
    }

    // Handle Option Select
    const handleOptionSelect = (value: number | string) => {
        if (status === 'correct') return; // Lock if already correct
        setSelectedOption(value);
        if (status === 'stuck') {
            setStatus('idle');
        } else {
            setStatus('idle');
        }
    };

    // Keyboard handlers
    const handleKeyInput = (key: string) => {
        if (status === 'correct') return;
        const currentVal = selectedOption === null || selectedOption === -1 ? '' : String(selectedOption);
        handleOptionSelect(currentVal + key);
    };

    const handleKeyDelete = () => {
        if (status === 'correct') return;
        const currentVal = String(selectedOption || '');
        if (currentVal.length > 0) {
            handleOptionSelect(currentVal.slice(0, -1));
        }
    };

    const handleKeyClear = () => {
        if (status === 'correct') return;
        handleOptionSelect('');
    };

    // Handle Check Button
    const handleCheck = () => {
        if (selectedOption === null || String(selectedOption).trim() === '') return;

        let isCorrect = false;
        if (currentQuestion.type === 'numerical') {
            // Basic numerical validation (string comparison of trimmed values or integer parse)
            // Clean input and answer
            const inputs = String(selectedOption).trim();
            const answers = String(currentQuestion.correctAnswer).trim();
            isCorrect = inputs === answers;
        } else {
            isCorrect = selectedOption === currentQuestion.correctAnswer;
        }

        if (isCorrect) {
            setStatus('correct');
            setScore(prev => prev + 1);
            // Trigger simple confetti
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.7 },
                colors: ['#1865f2', '#00a60e', '#ffffff', '#fbbf24'] // Blue, Green, White, Amber
            });
        } else {
            setStatus('incorrect');
            setShake(prev => prev + 1); // Trigger shake
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setStatus('idle');
            setSelectedOption(null);
            setHintRevealed(false);
        } else {
            setShowResult(true);
            if (onComplete) onComplete();
        }
    };

    const handleSkip = () => {
        setStatus('stuck');
    };

    const handleShowHint = () => {
        setHintRevealed(true);
    };

    const handleSkipQuestion = () => {
        // Mark as skipped (no score increase) and move next
        handleNext();
    };

    const handleRetry = () => {
        setCurrentIndex(0);
        setSelectedOption(null);
        setStatus('idle');
        setScore(0);
        setShowResult(false);
        setHintRevealed(false);
    };

    const handleRetryAttempt = () => {
        setStatus('idle');
        setSelectedOption(null);
        setHintRevealed(false);
    };

    // --- Result Screen ---
    if (showResult) {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 h-full flex flex-col items-center justify-center p-8 text-center min-h-[500px]">
                <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-6">
                    <Trophy className="h-12 w-12 text-yellow-600 dark:text-yellow-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">Practice Complete!</h2>
                <p className="text-gray-600 dark:text-slate-300 mb-8 max-w-md">
                    You&apos;ve leveled up your skills on <strong>{title}</strong>.
                    <br />
                    Score: {score}/{questions.length} ({percentage}%)
                </p>

                <div className="w-full max-w-sm bg-gray-100 dark:bg-slate-800 rounded-full h-4 mb-8">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className={`h-full rounded-full ${percentage >= 80 ? 'bg-[#00a60e]' : 'bg-[#1865f2]'}`}
                    />
                </div>

                <button
                    onClick={handleRetry}
                    className="px-8 py-3 bg-[#1865f2] text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Practice Again
                </button>
            </div>
        );
    }

    // --- Main Quiz UI ---
    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 relative transition-colors">
            {/* 1. Header & Progress */}
            <div className="flex-none p-4 md:p-6 border-b border-gray-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-gray-400 dark:text-slate-500 text-sm tracking-wider uppercase">
                        Question {currentIndex + 1} / {questions.length}
                    </h2>
                </div>
                {/* Segmented Progress Bar */}
                <div className="flex gap-1 h-1.5 w-full">
                    {questions.map((_, idx) => (
                        <div
                            key={idx}
                            className={`flex-1 rounded-full ${idx < currentIndex ? 'bg-[#1865f2]' : idx === currentIndex ? 'bg-gray-300 dark:bg-slate-600' : 'bg-gray-100 dark:bg-slate-800'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* 2. Scrollable Content (Question + Options) */}
            <div className="flex-grow overflow-y-auto p-4 md:p-8 custom-scrollbar">
                <div className="max-w-2xl mx-auto w-full">
                    {/* Question Text */}
                    <div className="mb-8">
                        {/* Exam Source Badge */}
                        {currentQuestion.examSource && (
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                    {currentQuestion.examSource}
                                </span>
                            </div>
                        )}

                        <p className="text-xl md:text-2xl font-serif text-gray-900 dark:text-slate-100 leading-relaxed antialiased">
                            <Latex>{currentQuestion.text}</Latex>
                        </p>

                        {currentQuestion.image && (
                            <div className="mt-6 flex justify-center">
                                <Image
                                    src={currentQuestion.image}
                                    alt="Question Diagram"
                                    width={800}
                                    height={600}
                                    className="max-h-64 md:max-h-80 w-auto h-auto rounded-lg border border-gray-100 dark:border-slate-800 shadow-sm"
                                />
                            </div>
                        )}
                    </div>

                    {/* Hint Display */}
                    <AnimatePresence>
                        {hintRevealed && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg text-blue-900 dark:text-blue-200 overflow-hidden"
                            >
                                <div className="flex gap-2 mb-2">
                                    <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                                    <p className="font-bold text-sm uppercase tracking-wide text-blue-700 dark:text-blue-300">Hint</p>
                                </div>
                                <p className="text-blue-900/80 dark:text-blue-200/80 leading-relaxed pl-6">{currentQuestion.hint || "No hint available for this question."}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Options / Input Area */}
                    <div className="space-y-4">
                        {currentQuestion.type === 'numerical' ? (
                            <div className="mt-4 flex flex-col items-center">
                                <input
                                    type="text"
                                    readOnly={true} // Read-only to enforce keyboard usage
                                    className="w-full max-w-xs p-4 text-center border-2 border-gray-200 dark:border-slate-700 rounded-xl text-2xl font-bold tracking-widest focus:border-blue-600 hover:border-gray-300 dark:hover:border-slate-600 transition-all outline-none bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                                    placeholder="_ _ _"
                                    value={selectedOption !== null && selectedOption !== -1 ? selectedOption : ''}
                                />

                                {showExplanation ? (
                                    <div className={`mt-6 p-4 rounded-lg border w-full max-w-xs text-center ${selectedOption == currentQuestion.correctAnswer
                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30 text-green-800 dark:text-green-300'
                                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-300'
                                        }`}>
                                        <p className="font-bold text-lg mb-1">
                                            {selectedOption == currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                                        </p>
                                        <p>Correct Answer: <span className="font-bold">{currentQuestion.correctAnswer}</span></p>
                                    </div>
                                ) : (
                                    <OnScreenKeyboard
                                        onInput={handleKeyInput}
                                        onDelete={handleKeyDelete}
                                        onClear={handleKeyClear}
                                        onSubmit={handleCheck}
                                    />
                                )}
                            </div>
                        ) : (
                            currentQuestion.options?.map((option, index) => {
                                const isSelected = selectedOption === index;
                                const isWrong = status === 'incorrect' && isSelected;
                                const isCorrect = (status === 'correct' || showExplanation) && index === currentQuestion.correctAnswer;

                                // Determine styles based on state
                                let containerClass = "border-2 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800";
                                let iconClass = "border-2 border-gray-300 dark:border-slate-500 text-transparent";

                                if (isSelected) {
                                    containerClass = "border-2 border-[#1865f2] bg-blue-50/10 dark:bg-blue-900/20 shadow-[0_0_0_1px_#1865f2]";
                                    iconClass = "bg-[#1865f2] border-[#1865f2] text-white"; // Filled blue circle
                                }

                                if (isWrong) {
                                    containerClass = "border-2 border-[#b01e1e] bg-red-50/10 dark:bg-red-900/20"; // Khan red
                                    iconClass = "bg-[#b01e1e] border-[#b01e1e] text-white";
                                }

                                if (isCorrect) {
                                    containerClass = "border-2 border-[#00a60e] bg-green-50/10 dark:bg-green-900/20"; // Khan green
                                    iconClass = "bg-[#00a60e] border-[#00a60e] text-white";
                                }

                                return (
                                    <motion.button
                                        key={index}
                                        onClick={() => handleOptionSelect(index)}
                                        // Shake animation only for the wrong option
                                        animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}}
                                        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                                        disabled={status === 'correct' || showExplanation}
                                        className={`relative w-full text-left p-5 rounded-lg transition-all duration-200 flex items-start gap-4 group outline-none ${containerClass}`}
                                    >
                                        {/* Custom Radio Icon */}
                                        <div className={`flex-none w-6 h-6 rounded-full flex items-center justify-center mt-0.5 transition-colors ${iconClass}`}>
                                            {/* Inner white dot for selected state */}
                                            {isSelected && status === 'idle' && (
                                                <div className="w-2.5 h-2.5 bg-white rounded-full" />
                                            )}
                                            {/* Icons for terminal states */}
                                            {isWrong && <X className="w-4 h-4 stroke-[3]" />}
                                            {isCorrect && <Check className="w-4 h-4 stroke-[4]" />}
                                        </div>

                                        <span className="text-lg text-gray-800 dark:text-slate-200 leading-snug pt-0.5 font-medium">
                                            <Latex>{option}</Latex>
                                        </span>
                                    </motion.button>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* 3. Sticky Bottom Action Bar (Desktop & Mobile) */}
            <div className={`flex-none p-4 md:px-8 md:py-6 border-t border-gray-200 dark:border-slate-800 transition-colors duration-300 ${status === 'correct' ? 'bg-[#dfffe0] dark:bg-[#003305] border-t-transparent' :
                status === 'incorrect' ? 'bg-[#ffebe6] dark:bg-[#4a0d0d] border-t-transparent' :
                    status === 'stuck' ? 'bg-gray-50 dark:bg-slate-800' : 'bg-white dark:bg-slate-900'
                }`}>
                <div className="max-w-2xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Feedback Message */}
                    <div className="flex-grow w-full md:w-auto min-h-[2rem]">
                        <AnimatePresence mode="wait">
                            {status === 'correct' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-[#00a60e] shadow-sm">
                                        <Check className="w-5 h-5 stroke-[3]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#004d05] dark:text-[#4ade80] text-lg">Nice work!</h3>
                                        <p className="text-[#004d05]/80 dark:text-[#4ade80]/80 text-sm">You got it right.</p>
                                    </div>
                                </motion.div>
                            )}
                            {status === 'incorrect' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-[#b01e1e] shadow-sm">
                                        <X className="w-5 h-5 stroke-[3]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#700c0c] dark:text-[#f87171] text-lg">Not quite yet...</h3>
                                        <p className="text-[#700c0c]/80 dark:text-[#f87171]/80 text-sm font-medium cursor-pointer hover:underline">
                                            {currentQuestion.explanation || 'Try again or get help.'}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                            {status === 'stuck' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <h3 className="font-bold text-gray-800 dark:text-slate-200 text-lg">Stuck?</h3>
                                    <p className="text-gray-600 dark:text-slate-400 text-sm">Review related articles/videos or use a hint.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Action Button */}
                    <div className="w-full md:w-auto flex items-center gap-3">
                        {status === 'stuck' ? (
                            <>
                                <button
                                    onClick={!hintRevealed ? handleShowHint : undefined}
                                    disabled={hintRevealed}
                                    className={`flex-1 md:flex-none px-6 py-3 font-bold text-[#1865f2] hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors ${hintRevealed ? 'opacity-50 cursor-default' : ''}`}
                                >
                                    {hintRevealed ? 'Hint shown' : 'Get a hint'}
                                </button>
                                <button
                                    onClick={handleSkipQuestion}
                                    className="flex-1 md:flex-none px-6 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 font-bold rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                                >
                                    Skip for now
                                </button>
                            </>
                        ) : status === 'correct' ? (
                            <button
                                onClick={handleNext}
                                className="w-full md:w-auto px-8 py-3 bg-[#1865f2] text-white font-bold rounded-md hover:bg-[#0b4eba] transition-shadow shadow-[0_4px_0_0_#0b4eba] active:shadow-none active:translate-y-1"
                            >
                                {currentIndex < questions.length - 1 ? 'Next question' : 'Show Summary'}
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleSkip}
                                    className="px-4 py-3 text-gray-500 dark:text-slate-400 font-bold hover:text-gray-900 dark:hover:text-slate-200 transition-colors"
                                >
                                    Skip
                                </button>
                                {/* Hide Check button for numerical type since it's in the keyboard */}
                                {currentQuestion.type !== 'numerical' && (
                                    <button
                                        onClick={status === 'incorrect' ? handleRetryAttempt : handleCheck}
                                        disabled={selectedOption === null && status !== 'incorrect'}
                                        className={`w-full md:w-auto flex-1 px-8 py-3 font-bold rounded-md transition-all ${selectedOption !== null || status === 'incorrect'
                                            ? 'bg-[#1865f2] text-white shadow-[0_4px_0_0_#0b4eba] hover:bg-[#0b4eba] active:shadow-none active:translate-y-1'
                                            : 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed'
                                            }`}
                                    >
                                        {status === 'incorrect' ? 'Try Again' : 'Check'}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
