"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Award, Users, ShieldCheck } from "lucide-react";

export default function TrustDashboard() {
    const [monthlyActive, setMonthlyActive] = useState(0);
    const [successRate, setSuccessRate] = useState(0);

    // Simple number counter animation when component mounts
    useEffect(() => {
        const duration = 2000; // 2 seconds
        const steps = 50;
        const stepTime = duration / steps;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            setMonthlyActive(Math.floor((120000 / steps) * currentStep));
            setSuccessRate(Math.floor((94 / steps) * currentStep));

            if (currentStep >= steps) {
                clearInterval(timer);
                setMonthlyActive(124500);
                setSuccessRate(94);
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-[100px] mix-blend-multiply opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-[100px] mix-blend-multiply opacity-50"></div>
                {/* Graph paper pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
            </div>

            <div className="container px-4 md:px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 mb-6 backdrop-blur-sm">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Proven Results</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                        Don't just take our word. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">Look at the data.</span>
                    </h2>

                    <p className="text-slate-600 text-lg mb-4 leading-relaxed font-medium">
                        Our platform guarantees radical rank improvements through continuous tracking and precise intervention. Our students consistently outperform the national average.
                    </p>
                </div>

                {/* Dashboard UI Frame */}
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        {/* Mock Browser Header */}
                        <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center px-6 gap-2">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="mx-auto px-4 py-1.5 bg-white border border-slate-200 rounded-md text-[10px] font-mono text-slate-400 flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3" />
                                portal.catalyzers.com/analytics
                            </div>
                        </div>

                        <div className="p-8 md:p-10 bg-slate-50/50">
                            {/* Top Stats Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                            <Users className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-md flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> +12%
                                        </span>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900 mb-1">
                                        {monthlyActive.toLocaleString()}+
                                    </div>
                                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Students</div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                            <Award className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-md flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> Top 1%
                                        </span>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900 mb-1">
                                        {successRate}%
                                    </div>
                                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Selection Rate vs Avg</div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-purple-600" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900 mb-1">
                                        Top 100
                                    </div>
                                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">15+ Ranks Secured Yearly</div>
                                </div>
                            </div>

                            {/* Animated Chart Area */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                                    <h3 className="text-lg font-bold text-slate-900 mb-6">Average Student Rank Progression</h3>

                                    {/* Mock Graph using CSS */}
                                    <div className="relative h-64 w-full flex items-end gap-2 sm:gap-4 mt-8">
                                        {/* Y-axis Labels */}
                                        <div className="absolute left-0 bottom-0 h-full flex flex-col justify-between text-xs text-slate-400 font-mono pb-8 -translate-x-full pr-4 hidden sm:flex">
                                            <span>Rank 1k</span>
                                            <span>Rank 50k</span>
                                            <span>Rank 100k+</span>
                                        </div>

                                        {/* Bars */}
                                        {[
                                            { h: "15%", label: "Month 1", color: "bg-slate-200" },
                                            { h: "30%", label: "Month 3", color: "bg-blue-200" },
                                            { h: "45%", label: "Month 6", color: "bg-blue-300" },
                                            { h: "70%", label: "Month 9", color: "bg-indigo-400" },
                                            { h: "90%", label: "Final Test", color: "bg-emerald-500" }
                                        ].map((bar, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                                                {/* Tooltip on hover */}
                                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
                                                    Massive Improvement
                                                </div>

                                                {/* Animated Bar */}
                                                <div
                                                    className={`w-full rounded-t-xl ${bar.color} transition-all duration-1000 ease-out origin-bottom hover:brightness-110 shadow-sm`}
                                                    style={{ height: bar.h, animationDelay: `${i * 150}ms` }}
                                                ></div>
                                                <span className="mt-4 text-xs font-bold text-slate-500">{bar.label}</span>
                                            </div>
                                        ))}

                                        {/* Trend Line SVG overlay */}
                                        <svg className="absolute inset-0 w-full h-full pointer-events-none pt-4 pb-12" preserveAspectRatio="none" viewBox="0 0 100 100">
                                            <path
                                                d="M 10 85 Q 30 70, 50 55 T 90 10"
                                                fill="none"
                                                stroke="#10b981"
                                                strokeWidth="2"
                                                className="drop-shadow-md"
                                                strokeDasharray="200"
                                                strokeDashoffset="0"
                                            />
                                            {/* Glowing dot at the end */}
                                            <circle cx="90" cy="10" r="3" fill="#10b981" className="animate-pulse shadow-xl" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Right Side Panel */}
                                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-2xl shadow-xl text-white flex flex-col justify-between relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>

                                    <div>
                                        <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6">
                                            <ShieldCheck className="w-6 h-6 text-indigo-400" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-4">Why Trust Catalyzers?</h3>
                                        <ul className="space-y-4">
                                            {[
                                                "100% Refund if no rank improvement*",
                                                "Faculty verified by Top IITs & AIIMS",
                                                "Bank-grade secure testing environment",
                                                "Transparent parent dashbaords"
                                            ].map((text, i) => (
                                                <li key={i} className="flex gap-3 text-sm text-indigo-100">
                                                    <span className="w-5 h-5 rounded-full bg-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                                                    <span className="leading-relaxed">{text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/10 text-xs text-indigo-300">
                                        *Terms and conditions apply for the refund policy. Requires 90% attendance.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
