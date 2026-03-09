"use client";

import Image from "next/image";
import { BrainCircuit, GraduationCap, MessageCircleQuestion, Target } from "lucide-react";
import { motion } from "framer-motion";

const edgeFeatures = [
    {
        icon: BrainCircuit,
        title: "Pedagogical Excellence",
        description: "Our unique teaching methodology ensures deep concept clarity and long-term retention.",
        bgClass: "bg-blue-50 border border-blue-100",
        iconColor: "text-blue-600"
    },
    {
        icon: GraduationCap,
        title: "State Board Support",
        description: "Comprehensive coverage of all major state boards alongside intensive CBSE prep.",
        bgClass: "bg-indigo-50 border border-indigo-100",
        iconColor: "text-indigo-600"
    },
    {
        icon: MessageCircleQuestion,
        title: "Live Doubt Solving",
        description: "Instant, on-demand doubt resolution with dedicated expert faculty support.",
        bgClass: "bg-purple-50 border border-purple-100",
        iconColor: "text-purple-600"
    },
    {
        icon: Target,
        title: "Regular Assessments",
        description: "Continuous AI-driven evaluation to track progress and surgically identify weak areas.",
        bgClass: "bg-pink-50 border border-pink-100",
        iconColor: "text-pink-600"
    },
];

const features = [
    {
        icon: "/assets/icons/course.svg",
        title: "Comprehensive Courses",
        description:
            "Intensive programs covering every topic in depth with regular assessments",
        color: "from-blue-500 to-cyan-500",
    },
    {
        icon: "/assets/icons/teacher.svg",
        title: "Expert Faculty",
        description:
            "Learn from India's best educators with years of teaching experience",
        color: "from-purple-500 to-pink-500",
    },
    {
        icon: "/assets/icons/savemoney.svg",
        title: "Affordable Pricing",
        description: "Quality education at prices that don't burden families",
        color: "from-green-500 to-emerald-500",
    },
    {
        icon: "/assets/icons/target.svg",
        title: "Result-Oriented",
        description: "Proven track record of success in competitive exams",
        color: "from-orange-500 to-red-500",
    },
];

export default function ContentSections() {
    return (
        <>
            {/* Premium Offline Centers Section */}
            <section className="py-16 md:py-24 bg-white relative overflow-hidden">
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="bg-[#1e2336] rounded-[2.5rem] p-8 md:p-12 lg:p-16 overflow-hidden relative shadow-2xl shadow-blue-900/10">
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#5A4BDA] rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/3" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500 rounded-full blur-[100px] opacity-20 translate-y-1/3 -translate-x-1/3" />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 w-fit">
                                    <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
                                    <span className="text-xs font-semibold text-white uppercase tracking-wider">Flagship Center</span>
                                </div>

                                <h2 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-white leading-tight mb-6">
                                    Experience the power of <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Catalyzers Kota</span>
                                </h2>

                                <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-xl">
                                    Step into our state-of-the-art flagship learning center in Kota. Experience the perfect blend of top-tier faculty, distraction-free environment, and modern academic infrastructure.
                                </p>

                                <div className="space-y-4 mb-10">
                                    {[
                                        "Highly Competitive Peer Group",
                                        "One-on-One Mentorship & Doubts",
                                        "Air-Conditioned Library & Study Zones",
                                        "Rigorous Offline Test Series"
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-slate-200 font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <a href="/courses">
                                    <button className="bg-white text-slate-900 font-bold px-8 py-4 rounded-xl hover:bg-slate-100 transition-all shadow-lg hover:shadow-white/20 hover:-translate-y-1">
                                        Join Our Kota Batch
                                    </button>
                                </a>
                            </div>

                            <div className="relative h-full min-h-[400px] hidden lg:block">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl border border-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                                    {/* Background card element */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-[280px] bg-white/5 border border-white/10 rounded-2xl transform -rotate-6 shadow-2xl backdrop-blur-md p-6">
                                        <div className="w-full h-32 bg-slate-800/40 rounded-lg mb-6"></div>
                                        <div className="w-3/4 h-4 bg-slate-800/60 rounded mb-3"></div>
                                        <div className="w-1/2 h-4 bg-slate-800/60 rounded"></div>
                                    </div>
                                    {/* Foreground primary card element */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-[300px] bg-[#5A4BDA] border border-white/20 rounded-2xl transform rotate-3 shadow-2xl p-6 flex flex-col justify-between hover:rotate-0 hover:scale-105 transition-all duration-500">
                                        <div>
                                            <div className="w-14 h-14 bg-white/20 rounded-xl mb-6 flex items-center justify-center">
                                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <div className="w-3/4 h-5 bg-white/90 rounded mb-3"></div>
                                            <div className="w-full h-2 bg-white/40 rounded mb-2"></div>
                                            <div className="w-4/5 h-2 bg-white/40 rounded"></div>
                                        </div>
                                        <div className="w-full h-12 bg-white/10 hover:bg-white/20 transition-colors border border-white/20 rounded-xl mt-6 flex items-center justify-center">
                                            <div className="w-24 h-2 bg-white/50 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container px-4 md:px-6">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8">
                        Know About{" "}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Catalyzers
                        </span>
                    </h2>
                    <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
                        <p>
                            Catalyzers is revolutionizing education in India by making quality
                            learning accessible and affordable to every student. With our
                            comprehensive courses, expert faculty, and innovative teaching
                            methods, we&apos;ve helped millions of students achieve their academic
                            goals.
                        </p>
                        <p>
                            From competitive exam preparation to school curriculum support, we
                            offer a complete learning ecosystem that nurtures talent and
                            builds confidence.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why We Stand Out */}
            <section className="py-16 md:py-24 bg-gray-50">
                <div className="container px-4 md:px-6">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12">
                        We Stand Out{" "}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Because
                        </span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            return (
                                <div
                                    key={feature.title}
                                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div
                                        className={`inline-flex items-center justify-center w-20 h-20 rounded-xl bg-white mb-4 p-4 shadow-sm`}
                                    >
                                        <Image
                                            src={feature.icon}
                                            alt={feature.title}
                                            width={48}
                                            height={48}
                                            className="w-12 h-12"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Key Focus Areas */}
            <section className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
                <div className="container px-4 md:px-6 relative z-10 max-w-7xl mx-auto">
                    <div className="text-center mb-16 md:mb-24">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-semibold text-slate-600 uppercase tracking-widest mb-6 border-b-2 border-b-blue-100">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Academic Pathways
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
                            Define Your <br className="md:hidden" />
                            <span className="relative inline-block mt-2 md:mt-0">
                                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Focus Area</span>
                                <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-100 -z-10 transform -rotate-2"></span>
                            </span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-5xl mx-auto">
                        {[
                            {
                                id: "01",
                                title: "Disha",
                                subtitle: "Class 11th Program",
                                description: "Develop an unshakable core. Master fundamental concepts early to stay consistently ahead of the competition.",
                                color: "bg-blue-500",
                                shadow: "hover:shadow-blue-500/20",
                                border: "group-hover:border-blue-200",
                                icon: (
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                )
                            },
                            {
                                id: "02",
                                title: "Marg",
                                subtitle: "Class 12th Program",
                                description: "Methodical preparation strategies for Board exams and rigorous competitive training to guarantee academic excellence.",
                                color: "bg-purple-500",
                                shadow: "hover:shadow-purple-500/20",
                                border: "group-hover:border-purple-200",
                                icon: (
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )
                            },
                            {
                                id: "03",
                                title: "Manzil",
                                subtitle: "Dropper (11th + 12th)",
                                description: "Intensive 1-year program featuring Kota's legendary pedagogy and deeply insightful mentorship to crack JEE/NEET.",
                                color: "bg-orange-500",
                                shadow: "hover:shadow-orange-500/20",
                                border: "group-hover:border-orange-200",
                                icon: (
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                )
                            },
                        ].map((program) => (
                            <div
                                key={program.id}
                                className="group relative"
                            >
                                {/* Background Layer (Decorative Shadow) */}
                                <div className={`absolute inset-0 bg-white rounded-[2rem] border border-slate-200 pointer-events-none transition-transform duration-500 ease-out group-hover:translate-x-3 group-hover:-translate-y-3 z-0 ${program.border}`}></div>

                                {/* Main Card Content */}
                                <div className={`relative bg-white border border-slate-200 rounded-[2rem] p-8 pb-10 h-full flex flex-col z-10 shadow-sm transition-all duration-500 ease-out xl:group-hover:-translate-y-2 xl:group-hover:-translate-x-2 xl:hover:scale-[1.02] ${program.shadow}`}>

                                    <div className="flex justify-between items-start mb-10">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform -translate-y-4 group-hover:-translate-y-6 transition-transform duration-500 ${program.color}`}>
                                            {program.icon}
                                        </div>
                                        <span className="text-4xl font-black text-slate-100 font-serif tracking-tighter">
                                            {program.id}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                                            {program.subtitle}
                                        </div>
                                        <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 transition-colors">
                                            {program.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed font-medium mb-8">
                                            {program.description}
                                        </p>
                                    </div>

                                    <div className="mt-auto flex justify-between items-center group-hover:underline decoration-2 underline-offset-4 decoration-slate-900 cursor-pointer">
                                        <div className="text-sm font-bold text-slate-900 transition-all">
                                            Explore {program.title}
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300 transform group-hover:rotate-45">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                            </svg>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What Makes Us Different */}
            <section className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[120px] opacity-70 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-50 rounded-full blur-[100px] opacity-70 translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                <div className="container px-4 md:px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm tracking-wide mb-4">
                            The Catalyzers Edge
                        </span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                            What Makes Us{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                Different
                            </span>
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            We've decoded the science of learning to build an ecosystem that virtually guarantees improvement, step by step.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
                        {edgeFeatures.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group relative bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col h-full"
                                >
                                    {/* Subtle hover gradient background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-purple-50/0 group-hover:from-indigo-50/50 group-hover:to-purple-50/50 transition-colors duration-500 z-0" />

                                    <div className="relative z-10 flex-grow">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-md ${item.bgClass}`}>
                                            <Icon className={`w-7 h-7 ${item.iconColor}`} strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-indigo-700 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed text-sm">
                                            {item.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
