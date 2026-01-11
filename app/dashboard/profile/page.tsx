"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { User, Mail, Award, Clock, BookOpen, ChevronRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const { user, fullName } = useAuth();

    // Mock progress data - in real app, fetch from 'user_progress' table
    const progressData = [
        { subject: "Physics", topic: "Kinematics", progress: 85, score: "45/50", lastActive: "2 days ago" },
        { subject: "Chemistry", topic: "Atomic Structure", progress: 60, score: "38/50", lastActive: "1 day ago" },
        { subject: "Maths", topic: "Quadratic Equations", progress: 40, score: "Pending", lastActive: "Just now" },
    ];

    const stats = [
        { label: "Tests Taken", value: "12", icon: Award, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/20" },
        { label: "Video Hours", value: "48h", icon: Clock, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/20" },
        { label: "Questions Solved", value: "850+", icon: BookOpen, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/20" },
        { label: "Avg. Accuracy", value: "88%", icon: TrendingUp, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/20" },
    ];

    return (
        <div className="space-y-8">
            {/* Header / Profile Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start transition-colors">
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-blue-50 dark:ring-blue-900/30">
                    {fullName ? fullName[0] : "S"}
                </div>
                <div className="flex-1 text-center md:text-left space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{fullName}</h1>
                    <div className="flex flex-col md:flex-row gap-3 items-center text-slate-500 dark:text-slate-400 text-sm">
                        <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user?.email}</span>
                        <span className="hidden md:block">•</span>
                        <span className="flex items-center gap-1.5">Class 11 - JEE (Main + Adv)</span>
                    </div>
                    <div className="pt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            Active Student
                        </span>
                    </div>
                </div>
                <div className="md:self-center">
                    <button className="px-6 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors">
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors"
                    >
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Progress Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Academic Progress</h2>
                    <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">View Full Report</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4">Topic</th>
                                <th className="px-6 py-4">Completion</th>
                                <th className="px-6 py-4">Test Score</th>
                                <th className="px-6 py-4">Last Activity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {progressData.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">{row.subject}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row.topic}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${row.progress > 75 ? 'bg-green-500' : row.progress > 40 ? 'bg-blue-500' : 'bg-orange-500'}`}
                                                    style={{ width: `${row.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{row.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.score === "Pending" ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" : "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                            }`}>
                                            {row.score}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{row.lastActive}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
