"use client";

import { CheckCircle2, PlayCircle, FileText, Trophy } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function RoadmapSection() {
    const steps = [
        {
            icon: PlayCircle,
            title: "Concept Building",
            description: "Master fundamentals with high-quality interactive video lectures.",
            color: "text-blue-500",
            bg: "bg-blue-100 dark:bg-blue-900/30",
            border: "border-blue-200 dark:border-blue-800"
        },
        {
            icon: FileText,
            title: "Rigorous Practice",
            description: "Solve daily practice problems (DPPs) and comprehensive modules.",
            color: "text-purple-500",
            bg: "bg-purple-100 dark:bg-purple-900/30",
            border: "border-purple-200 dark:border-purple-800"
        },
        {
            icon: CheckCircle2,
            title: "Doubt Resolution",
            description: "Get stuck? Use our instant 24/7 AI and expert doubt solving.",
            color: "text-rose-500",
            bg: "bg-rose-100 dark:bg-rose-900/30",
            border: "border-rose-200 dark:border-rose-800"
        },
        {
            icon: Trophy,
            title: "Test & Conquer",
            description: "Benchmark yourself with All India Test Series and secure your rank.",
            color: "text-amber-500",
            bg: "bg-amber-100 dark:bg-amber-900/30",
            border: "border-amber-200 dark:border-amber-800"
        }
    ];

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <section className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
            {/* Subtle background curved line */}
            <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden pointer-events-none opacity-30">
                <svg viewBox="0 0 1440 320" className="absolute w-full top-0">
                    <path fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="10 10" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,176C672,181,768,139,864,128C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160"></path>
                </svg>
            </div>

            <div className="container px-4 md:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-20 md:mb-28"
                >
                    <span className="inline-block text-sm font-bold tracking-widest text-indigo-600 uppercase mb-3">
                        The Catalyzers Pathway
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                        Your Journey from <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Aspirant to Achiever</span>
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        We don't just teach; we engineer your success through a scientifically proven 4-step learning ecosystem.
                    </p>
                </motion.div>

                {/* Animated Vertical Timeline */}
                <div className="relative max-w-5xl mx-auto" ref={containerRef}>
                    {/* Central Line Background */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2 rounded-full z-0"></div>

                    {/* Animated Solid Line */}
                    <motion.div
                        className="absolute left-8 md:left-1/2 top-0 w-1 bg-gradient-to-b from-blue-500 via-indigo-500 to-amber-500 -translate-x-1/2 rounded-full z-10 origin-top"
                        style={{ height: lineHeight }}
                    />

                    <div className="space-y-12 md:space-y-24 relative z-20">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isEven = index % 2 === 0;
                            return (
                                <div key={index} className={`flex flex-col md:flex-row items-center justify-between w-full `}>

                                    {/* Left Side Component (Empty on mobile, swaps on desktop depending on index) */}
                                    <div className={`hidden md:block w-5/12 ${!isEven ? 'md:order-3' : 'md:order-1'}`}>
                                        {isEven && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -50 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true, margin: "-20%" }}
                                                transition={{ duration: 0.5, delay: 0.1 }}
                                                className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group"
                                            >
                                                <div className="flex items-start gap-6">
                                                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${step.bg} ${step.border} border-2 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300`}>
                                                        <Icon className={`w-8 h-8 ${step.color}`} strokeWidth={1.5} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-400 mb-1">Step 0{index + 1}</div>
                                                        <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                                        <p className="text-slate-600 leading-relaxed text-sm">
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                        {!isEven && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 50 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true, margin: "-20%" }}
                                                transition={{ duration: 0.5, delay: 0.1 }}
                                                className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group"
                                            >
                                                <div className="flex items-start gap-6 flex-row-reverse text-right">
                                                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${step.bg} ${step.border} border-2 flex items-center justify-center transform group-hover:-rotate-6 transition-transform duration-300`}>
                                                        <Icon className={`w-8 h-8 ${step.color}`} strokeWidth={1.5} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-400 mb-1">Step 0{index + 1}</div>
                                                        <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                                        <p className="text-slate-600 leading-relaxed text-sm">
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Central Dot */}
                                    <div className="absolute left-8 md:static md:w-2/12 flex justify-center items-center z-20 -translate-x-1/2 md:translate-x-0 md:order-2">
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            viewport={{ once: true, margin: "-20%" }}
                                            transition={{ duration: 0.4, delay: 0.2, type: "spring" }}
                                            className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-white border-4 border-slate-100 shadow-md flex items-center justify-center relative`}
                                        >
                                            <div className={`absolute inset-0 rounded-full blur-md opacity-50 ${step.bg}`} />
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-900 z-10 text-white flex items-center justify-center text-xs font-bold">
                                                {index + 1}
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Right Side / Mobile Layout Component */}
                                    <div className={`w-full pl-20 pr-4 md:hidden md:w-5/12 ${!isEven ? 'md:order-1' : 'md:order-3'}`}>
                                        <motion.div
                                            initial={{ opacity: 0, x: 30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: "-20%" }}
                                            transition={{ duration: 0.5, delay: 0.1 }}
                                            className={`bg-white rounded-3xl p-6 border border-slate-100 shadow-lg shadow-slate-200/50 group`}
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={`w-12 h-12 rounded-xl ${step.bg} ${step.border} border-2 flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                                                    <Icon className={`w-6 h-6 ${step.color}`} strokeWidth={1.5} />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-slate-400">Step 0{index + 1}</div>
                                                    <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                                                </div>
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed">
                                                {step.description}
                                            </p>
                                        </motion.div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
