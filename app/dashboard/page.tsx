"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { Clock, Calendar } from "lucide-react";
import { motion, useMotionValue } from "framer-motion";
import {
    // RevisionNotesIcon,
    // CustomPracticeIcon,
    // ImprovementBookIcon,
    // FlashcardsIcon,
    // ExplainItIcon
} from "@/components/ui/custom-icons";
import { useState, useEffect } from "react";
import { getOrCreateDailyPlan, toggleGoalStatus, DailyGoal } from "@/lib/dailyGoals";
import { CheckCircle, Circle, ArrowRight, TrendingUp, Zap, BookOpen, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

const quickActions = [
    {
        title: "Revision Formulas",
        icon: null,
        iconSrc: "/assets/icons/revise.svg",
        href: "/dashboard/revision-notes"
    },
    {
        title: "Custom Practice",
        icon: null,
        iconSrc: "/assets/icons/custom.svg",
        href: "/dashboard/custom-practice"
    },
    {
        title: "Improve",
        icon: null,
        iconSrc: "/assets/icons/grow.svg",
        href: "/dashboard/improvement-book"
    },

    {
        title: "Explain it",
        icon: null,
        iconSrc: "/assets/icons/idea.svg",
        href: "/dashboard/explain-it"
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

    // Force Redirect for Teacher
    const router = useRouter();
    useEffect(() => {
        if (user?.email?.toLowerCase() === "ritagulve1984@gmail.com") {
            router.push("/teacher");
        }
    }, [user, router]);

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
        <div className="space-y-6 md:space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">
                    Welcome back, {displayName}! 👋
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Your target: <span className="font-semibold text-blue-600 dark:text-blue-400">{displayExam}</span>
                </p>
            </div>

            {/* Quick Actions (Exact Allen Style) */}
            <section>
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Quick Actions</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 px-2 md:flex md:gap-10 md:overflow-visible md:pb-6 md:px-0">
                    {quickActions.map((action) => (
                        <Link key={action.title} href={action.href || "#"} className="group flex-shrink-0">
                            <div className="flex flex-col items-center gap-3">
                                {/* Button Container - Bottom Shadow Only */}
                                <button
                                    className="relative w-full aspect-square max-w-[120px] md:w-[115px] md:h-[115px] bg-slate-50 dark:bg-[#222222] rounded-[24px] md:rounded-[28px] 
                                               shadow-[0px_14px_24px_-10px_rgba(0,0,0,0.08),0px_6px_0px_-2px_rgba(0,0,0,0.03)]
                                               hover:shadow-[0px_18px_32px_-10px_rgba(0,0,0,0.12),0px_8px_0px_-2px_rgba(0,0,0,0.04)]
                                               active:translate-y-1 active:shadow-none active:scale-[0.99]
                                               transition-all duration-200 ease-out
                                               flex items-center justify-center
                                               border border-slate-200/60 dark:border-white/5 mx-auto"
                                >
                                    {/* Icon */}
                                    <div className="transform transition-transform duration-300 group-hover:scale-105">
                                        <img src={action.iconSrc} alt={action.title} className="w-10 h-10 md:w-[54px] md:h-[54px]" />
                                    </div>
                                </button>

                                {/* Label */}
                                <span className="text-sm md:text-xs font-semibold text-slate-700 dark:text-slate-300 text-center leading-tight max-w-[90px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {action.title}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Secondary Actions / More Config */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Tests Section */}
                <section className="md:col-span-2 bg-white dark:bg-[#111111] rounded-[24px] md:rounded-[28px] shadow-sm border border-slate-100 dark:border-neutral-800 p-5 md:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            My Schedule
                        </h2>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">View Calendar</button>
                    </div>

                    <div className="flex flex-col items-center justify-center py-6 md:py-10 text-center border-2 border-dashed border-slate-200 dark:border-neutral-800 rounded-2xl bg-slate-50/50 dark:bg-neutral-900/30">
                        <div className="w-16 h-16 bg-white dark:bg-[#1A1A1A] rounded-full flex items-center justify-center shadow-sm mb-4">
                            <Calendar className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">No Tests Scheduled</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                            Enjoy your free time! Stay tuned for upcoming mock tests.
                        </p>
                    </div>
                </section>

                {/* Daily Engagement */}
                <section className="bg-white dark:bg-[#111111] rounded-[24px] md:rounded-[28px] shadow-sm border border-slate-100 dark:border-neutral-800 p-5 md:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            Daily Goals
                            {progress === 100 && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Completed! 🎉</span>}
                        </h2>
                        <span className="text-sm font-medium text-slate-500">{completedCount}/{goals.length} Done</span>
                    </div>

                    <div className="flex flex-col gap-6 items-center">
                        {/* Clean Progress Ring - No gimmicks */}
                        <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                                {/* Background Track */}
                                <circle
                                    cx="60" cy="60" r="54"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    fill="none"
                                    className="text-slate-100 dark:text-neutral-800"
                                />

                                {/* Progress Path - Single solid color */}
                                <motion.circle
                                    cx="60" cy="60" r="54"
                                    stroke={progress === 100 ? "#22c55e" : "#3B82F6"}
                                    strokeWidth="6"
                                    fill="none"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: progress / 100 }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                    style={{ pathLength: useMotionValue(0) }}
                                />

                                {/* Small dot indicator at end */}
                                {progress > 0 && progress < 100 && (
                                    <circle
                                        cx="60"
                                        cy="6"
                                        r="3"
                                        fill="#3B82F6"
                                        style={{
                                            transform: `rotate(${progress * 3.6}deg)`,
                                            transformOrigin: '60px 60px'
                                        }}
                                    />
                                )}
                            </svg>

                            {/* Center Text - Clean typography */}
                            <div className="absolute flex flex-col items-center justify-center">
                                <span className={`text-xl md:text-2xl font-bold ${progress === 100 ? 'text-green-500' : 'text-slate-800 dark:text-slate-100'}`}>
                                    {progress}%
                                </span>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    DONE
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
