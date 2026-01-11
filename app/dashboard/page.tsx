"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { Clock, Calendar } from "lucide-react";
import { motion, useMotionValue } from "framer-motion";
import {
    RevisionNotesIcon,
    CustomPracticeIcon,
    ImprovementBookIcon,
    FlashcardsIcon,
    PyqIcon
} from "@/components/ui/custom-icons";
import { useState, useEffect } from "react";
import { getOrCreateDailyPlan, toggleGoalStatus, DailyGoal } from "@/lib/dailyGoals";
import { CheckCircle, Circle, ArrowRight, TrendingUp, Zap, BookOpen, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

const quickActions = [
    {
        title: "Revision Notes",
        icon: RevisionNotesIcon,
        badge: "NEW",
        href: "/dashboard/revision-notes"
    },
    {
        title: "Custom Practice",
        icon: CustomPracticeIcon,
        href: "/dashboard/custom-practice"
    },
    {
        title: "Improvement Book",
        icon: ImprovementBookIcon,
        href: "/dashboard/improvement-book"
    },
    {
        title: "Flashcards",
        icon: FlashcardsIcon,
        href: "/dashboard/flashcards"
    },
    {
        title: "PYQ Papers",
        icon: PyqIcon,
        href: "/dashboard/pyq-papers"
    }
];

export default function DashboardPage() {
    const { session, user, fullName } = useAuth();
    const [userName, setUserName] = useState("");
    const [userExam, setUserExam] = useState("");

    const [goals, setGoals] = useState<DailyGoal[]>([]);
    const [isLoadingGoals, setIsLoadingGoals] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('userProfile');
        if (saved) {
            const parsed = JSON.parse(saved);
            setUserName(parsed.name);
            setUserExam(parsed.exam);
        }

        const fetchGoals = async () => {
            if (user?.id) {
                const fetched = await getOrCreateDailyPlan(user.id);
                setGoals(fetched);
            }
            setIsLoadingGoals(false);
        };
        fetchGoals();
    }, [user]);

    const toggleGoal = async (goal: DailyGoal) => {
        if (!user?.id) return;

        // Optimistic update
        const newStatus = !goal.completed;
        setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, completed: newStatus } : g));

        await toggleGoalStatus(user.id, goal.id, newStatus);
    };

    const completedCount = goals.filter(g => g.completed).length;
    const progress = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;
    const progressColor = progress === 100 ? "#22c55e" : "#3B82F6"; // Green on finish, Blue otherwise

    useEffect(() => {
        if (progress === 100 && !isLoadingGoals) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, [progress, isLoadingGoals]);

    const displayName = userName || fullName || user?.email?.split("@")[0] || "Student";
    const displayExam = userExam || user?.user_metadata?.exam || "JEE";

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    Welcome back, {displayName}! 👋
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Your target: <span className="font-semibold text-blue-600 dark:text-blue-400">{displayExam}</span>
                </p>
            </div>

            {/* Quick Actions (Allen-style colorful cards) */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Quick Actions</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {quickActions.map((action) => (
                        <Link key={action.title} href={action.href || "#"} passHref>
                            <motion.div
                                whileHover={{ y: -4, scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:border-blue-100 transition-all flex flex-col items-center justify-center gap-4 group relative overflow-hidden h-40 md:h-48 cursor-pointer"
                            >
                                {/* Icon */}
                                <div className="transform group-hover:scale-110 transition-transform duration-300">
                                    <action.icon size={64} />
                                </div>

                                {/* Title */}
                                <span className="font-bold text-slate-700 dark:text-slate-200 text-sm md:text-base text-center leading-tight">
                                    {action.title}
                                </span>

                                {/* Badge */}
                                {action.badge && (
                                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                        {action.badge}
                                    </span>
                                )}
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Secondary Actions / More Config */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Tests Section */}
                <section className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            My Schedule
                        </h2>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">View Calendar</button>
                    </div>

                    <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/50">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4">
                            <Calendar className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">No Tests Scheduled</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                            Enjoy your free time! Stay tuned for upcoming mock tests.
                        </p>
                    </div>
                </section>

                {/* Daily Engagement */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            Daily Goals
                            {progress === 100 && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Completed! 🎉</span>}
                        </h2>
                        <span className="text-sm font-medium text-slate-500">{completedCount}/{goals.length} Done</span>
                    </div>

                    <div className="flex flex-col gap-6 items-center">
                        {/* Progress Circle - Adjusted size / layout */}
                        {/* Premium Progress Ring */}
                        <div className="relative w-40 h-40 flex-shrink-0 flex items-center justify-center">
                            {/* Glow Effect Background */}
                            <div className={`absolute inset-0 rounded-full blur-xl opacity-20 transition-colors duration-500 ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} />

                            <svg className="w-full h-full transform -rotate-90 drop-shadow-lg" viewBox="0 0 120 120">
                                {/* Gradient Definition */}
                                <defs>
                                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor={progress === 100 ? "#22c55e" : "#3B82F6"} />
                                        <stop offset="100%" stopColor={progress === 100 ? "#4ade80" : "#8B5CF6"} />
                                    </linearGradient>
                                </defs>

                                {/* Background Track */}
                                <circle
                                    cx="60" cy="60" r="52"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="none"
                                    className="text-slate-100 dark:text-slate-800"
                                />

                                {/* Progress Path */}
                                <motion.circle
                                    cx="60" cy="60" r="52"
                                    stroke="url(#progressGradient)"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: progress / 100 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    style={{ pathLength: useMotionValue(0) }} // Placeholder for typing
                                />
                            </svg>

                            {/* Center Text */}
                            <div className="absolute flex flex-col items-center justify-center">
                                <motion.span
                                    key={progress}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={`text-3xl font-black tracking-tight ${progress === 100 ? 'text-green-500' : 'text-slate-800 dark:text-slate-100'}`}
                                >
                                    {progress}%
                                </motion.span>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-0.5">
                                    Done
                                </span>
                            </div>
                        </div>

                        {/* Goals List - Vertical Stack */}
                        <div className="flex-1 w-full space-y-3">
                            {isLoadingGoals ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-14 bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            ) : goals.length === 0 ? (
                                <div className="text-center py-4 text-slate-500">All caught up! Check back tomorrow.</div>
                            ) : (
                                goals.map((goal, index) => {
                                    return (
                                        <motion.div
                                            key={goal.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${goal.completed
                                                ? "bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 opacity-70"
                                                : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800"
                                                }`}
                                        >
                                            {/* Tick Mechanism */}
                                            {goal.isAutomated ? (
                                                // Automated Goal: No manual tick
                                                <div className="flex-shrink-0 text-slate-300 dark:text-slate-600 cursor-not-allowed" title="Auto-completed by system">
                                                    {goal.completed ? (
                                                        <CheckCircle className="w-5 h-5 text-green-500 fill-green-50" />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                                            <Sparkles className="w-2.5 h-2.5 text-slate-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                // Manual Goal: Clickable
                                                <button
                                                    onClick={() => toggleGoal(goal)}
                                                    className={`flex-shrink-0 transition-colors ${goal.completed ? "text-green-500" : "text-slate-300 hover:text-blue-500"}`}
                                                >
                                                    {goal.completed ? <CheckCircle className="w-5 h-5 fill-green-50" /> : <Circle className="w-5 h-5" />}
                                                </button>
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className={`text-sm font-semibold truncate transition-colors ${goal.completed ? "text-slate-500 line-through" : "text-slate-900 dark:text-slate-100"}`}>
                                                        {goal.title}
                                                    </h4>
                                                    {goal.isAutomated && !goal.completed && (
                                                        <span className="text-[10px] uppercase font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">Auto</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 truncate">{goal.subtitle}</p>
                                            </div>

                                            {!goal.completed && (
                                                <Link href={goal.link} className="p-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                                                    <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            )}
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
