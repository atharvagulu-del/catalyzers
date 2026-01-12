"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Send, RefreshCw, Sparkles, CheckCircle, AlertTriangle, BookOpen, ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getSubjects, getChaptersForSubject, getRandomPrompt, ExplainItPrompt } from "@/lib/explainItPrompts";
import { useAuth } from "@/components/auth/AuthProvider";

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Import animation JSON
import aiThinkingAnimation from "@/public/assets/animations/AI logo Foriday.json";
import explainItAnimation from "@/public/assets/animations/explain it.json";
import ideaAnimation from "@/public/assets/animations/idea.json";

type Step = "selection" | "prompt" | "feedback";

interface FeedbackResponse {
    correct: string;
    missing: string;
    nextSteps: {
        text: string;
        lectureSlug?: string;
        lectureTitle?: string;
    };
}

export default function ExplainItPage() {
    const { fullName, user } = useAuth();
    const studentName = fullName?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || 'there';

    const [step, setStep] = useState<Step>("selection");
    const [selectedSubject, setSelectedSubject] = useState<string>("");
    const [selectedChapter, setSelectedChapter] = useState<string>("");
    const [currentPrompt, setCurrentPrompt] = useState<ExplainItPrompt | null>(null);
    const [explanation, setExplanation] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
    const [error, setError] = useState("");
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [onboardingChecked, setOnboardingChecked] = useState(false);

    const subjects = getSubjects();
    const chapters = selectedSubject ? getChaptersForSubject(selectedSubject) : [];

    // Check if user has seen onboarding before (per account)
    useEffect(() => {
        if (user?.id) {
            const key = `explainIt_onboarded_${user.id}`;
            const hasSeenOnboarding = localStorage.getItem(key);
            if (!hasSeenOnboarding) {
                setShowOnboarding(true);
            }
            setOnboardingChecked(true);
        }
    }, [user?.id]);

    // Handle continue from onboarding
    const handleContinueOnboarding = () => {
        if (user?.id) {
            const key = `explainIt_onboarded_${user.id}`;
            localStorage.setItem(key, 'true');
        }
        setShowOnboarding(false);
    };

    // Load prompt when chapter is selected
    useEffect(() => {
        if (selectedSubject && selectedChapter) {
            const prompt = getRandomPrompt(selectedSubject, selectedChapter);
            setCurrentPrompt(prompt);
        }
    }, [selectedSubject, selectedChapter]);

    const handleStartExplaining = () => {
        if (currentPrompt) {
            setStep("prompt");
        }
    };

    const handleSubmitExplanation = async () => {
        if (!explanation.trim() || explanation.trim().length < 20) {
            setError("Please write at least a few sentences to explain the concept.");
            return;
        }

        setError("");
        setIsAnalyzing(true);

        try {
            const response = await fetch("/api/explain-it/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject: selectedSubject,
                    chapter: selectedChapter,
                    prompt: currentPrompt?.text,
                    keyConcepts: currentPrompt?.keyConcepts,
                    explanation: explanation.trim(),
                    studentName: studentName
                })
            });

            if (!response.ok) throw new Error("Failed to analyze");

            const data = await response.json();
            setFeedback(data);
            setStep("feedback");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleTryAnother = () => {
        const newPrompt = getRandomPrompt(selectedSubject, selectedChapter);
        setCurrentPrompt(newPrompt);
        setExplanation("");
        setFeedback(null);
        setStep("prompt");
    };

    const handleStartOver = () => {
        setSelectedSubject("");
        setSelectedChapter("");
        setCurrentPrompt(null);
        setExplanation("");
        setFeedback(null);
        setError("");
        setStep("selection");
    };

    // Don't render until we've checked onboarding status
    if (!onboardingChecked) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
        );
    }

    // Show onboarding screen for first-time users
    if (showOnboarding) {
        return (
            <div className="space-y-6 max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg"
                >
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                            Welcome to Explain It!
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            A new way to test your true understanding
                        </p>
                    </div>

                    {/* Rules */}
                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-green-800 dark:text-green-200">No marks, no pressure</h3>
                                <p className="text-sm text-green-700 dark:text-green-300">This is not a test. Just explain concepts in your own words.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-blue-800 dark:text-blue-200">Get personalized feedback</h3>
                                <p className="text-sm text-blue-700 dark:text-blue-300">AI analyzes your explanation and tells you what you got right and what to improve.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-amber-800 dark:text-amber-200">Build real understanding</h3>
                                <p className="text-sm text-amber-700 dark:text-amber-300">Explaining concepts helps you remember them better than re-reading.</p>
                            </div>
                        </div>
                    </div>

                    {/* Idea Animation */}
                    <div className="flex justify-center mb-8">
                        <div className="w-60 h-60">
                            <Lottie animationData={ideaAnimation} loop={true} />
                        </div>
                    </div>

                    {/* Continue Button - styled like Check button */}
                    <button
                        onClick={handleContinueOnboarding}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/25"
                    >
                        Continue
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* Page Title */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 flex-shrink-0">
                    <img src="/assets/icons/idea.svg" alt="Explain It" className="w-full h-full" />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Explain It</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Test your true understanding</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* Step 1: Selection */}
                {step === "selection" && (
                    <motion.div
                        key="selection"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Intro Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-5 text-white mb-6">
                                <h2 className="text-xl font-bold mb-2">Think you understood?</h2>
                                <p className="opacity-90 text-sm">
                                    Explain a concept in your own words. No marks, no pressure – just clarity.
                                </p>
                            </div>

                            {/* Subject Selection */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Select Subject
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {subjects.map((subject) => (
                                        <button
                                            key={subject.id}
                                            onClick={() => {
                                                setSelectedSubject(subject.id);
                                                setSelectedChapter("");
                                            }}
                                            className={`p-4 rounded-xl border-2 transition-all text-center ${selectedSubject === subject.id
                                                ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800"
                                                }`}
                                        >
                                            <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                                                {subject.title}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Chapter Selection */}
                            {selectedSubject && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="space-y-4 mt-6"
                                >
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Select Chapter
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedChapter}
                                            onChange={(e) => setSelectedChapter(e.target.value)}
                                            className="w-full p-4 pr-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 appearance-none cursor-pointer focus:outline-none focus:border-amber-500 text-sm"
                                        >
                                            <option value="">Choose a chapter...</option>
                                            {chapters.map((chapter) => (
                                                <option key={chapter.slug} value={chapter.slug}>
                                                    {chapter.title}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                    </div>
                                </motion.div>
                            )}

                            {/* Start Button */}
                            {currentPrompt && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6"
                                >
                                    <button
                                        onClick={handleStartExplaining}
                                        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
                                    >
                                        Start Explaining
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Prompt */}
                {step === "prompt" && (
                    <motion.div
                        key="prompt"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Prompt Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 flex-shrink-0">
                                    <Lottie animationData={explainItAnimation} loop={true} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Explain this concept:</p>
                                    <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                                        {currentPrompt?.text}
                                    </h2>
                                </div>
                            </div>

                            {/* Text Input */}
                            <div className="space-y-3">
                                <textarea
                                    value={explanation}
                                    onChange={(e) => setExplanation(e.target.value)}
                                    placeholder="Write your explanation here... Just explain it like you're teaching a friend."
                                    rows={6}
                                    className="w-full p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500 resize-none text-sm"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {explanation.length} characters • No marks, no timer – just think and write
                                </p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleStartOver}
                                    className="flex-1 py-3 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmitExplanation}
                                    disabled={isAnalyzing || explanation.length < 20}
                                    className="flex-[2] py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Submit
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Feedback */}
                {step === "feedback" && feedback && (
                    <motion.div
                        key="feedback"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Header */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                            <div className="w-20 h-20 mx-auto mb-4">
                                <Lottie animationData={aiThinkingAnimation} loop={false} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                Your feedback
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                No marks — just insights to help you learn better
                            </p>
                        </div>

                        {/* Correct Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-bold text-green-800 dark:text-green-200">
                                    What you explained correctly
                                </h3>
                            </div>
                            <p className="text-green-700 dark:text-green-300 leading-relaxed text-sm">
                                {feedback.correct}
                            </p>
                        </motion.div>

                        {/* Missing Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-bold text-amber-800 dark:text-amber-200">
                                    What is missing or unclear
                                </h3>
                            </div>
                            <p className="text-amber-700 dark:text-amber-300 leading-relaxed text-sm">
                                {feedback.missing}
                            </p>
                        </motion.div>

                        {/* Next Steps Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-bold text-blue-800 dark:text-blue-200">
                                    What to do next
                                </h3>
                            </div>
                            <p className="text-blue-700 dark:text-blue-300 leading-relaxed text-sm">
                                {feedback.nextSteps.text}
                            </p>
                            {feedback.nextSteps.lectureSlug && feedback.nextSteps.lectureTitle && (
                                <Link
                                    href={feedback.nextSteps.lectureSlug}
                                    className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-blue-500/25"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    Watch: {feedback.nextSteps.lectureTitle}
                                </Link>
                            )}
                        </motion.div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleTryAnother}
                                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Another
                            </button>
                            <button
                                onClick={handleStartOver}
                                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all text-sm"
                            >
                                Change Topic
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
