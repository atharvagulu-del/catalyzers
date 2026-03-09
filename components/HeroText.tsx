"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Target, MessageCircleQuestion, Users, BookOpen } from "lucide-react";

const highlights = [
    {
        icon: Target,
        title: "Individual Focus",
        subtitle: "Personalized attention for every student",
        color: "text-blue-500",
        bg: "bg-blue-50",
        ring: "ring-blue-100",
    },
    {
        icon: MessageCircleQuestion,
        title: "Doubt Solving 24×7",
        subtitle: "Round-the-clock doubt resolution support",
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        ring: "ring-emerald-100",
    },
    {
        icon: Users,
        title: "Student Community",
        subtitle: "Learn and grow together with peers",
        color: "text-orange-500",
        bg: "bg-orange-50",
        ring: "ring-orange-100",
    },
    {
        icon: BookOpen,
        title: "Premium Materials",
        subtitle: "Curated study resources and notes",
        color: "text-purple-500",
        bg: "bg-purple-50",
        ring: "ring-purple-100",
    },
];

export default function HeroText() {
    return (
        <section className="relative overflow-hidden bg-slate-50">
            {/* Absolute CSS mesh gradient background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#5A4BDA]/10 blur-[100px]" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-blue-400/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[50%] rounded-full bg-indigo-300/10 blur-[100px]" />

                {/* Clean CSS Dot Pattern - Darkened */}
                <div
                    className="absolute inset-0 z-0 opacity-[0.55]"
                    style={{
                        backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                {/* Fade out the dots at the bottom so it blends into the next section cleanly */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-50 to-transparent z-1" />
            </div>

            {/* Hero content area */}
            <div className="relative pt-12 md:pt-16 pb-16 md:pb-24 z-10">

                {/* Main Content - Two Column Layout */}
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

                        {/* Left: Text Content */}
                        <div className="lg:col-span-7 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-blue-100 shadow-sm mb-6 max-w-fit mx-auto lg:mx-0">
                                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                                <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">India&apos;s leading platform</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
                                Accelerate Your <br className="hidden md:block" /><span className="text-[#5A4BDA]">Learning Journey</span> <br className="hidden md:block" />
                                Today
                            </h1>

                            <p className="text-slate-600 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                                Maximize your efforts with Catalyzers. We provide the expert guidance, dedicated focus, and premium resources you need to effectively crack JEE, NEET, and board exams.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <Link href="/courses">
                                    <Button
                                        size="lg"
                                        className="bg-[#5A4BDA] hover:bg-[#4a3ca0] text-white text-base md:text-lg font-semibold px-10 py-6 md:py-7 rounded-xl shadow-xl shadow-blue-900/10 transition-all hover:-translate-y-1 w-full sm:w-auto"
                                    >
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Right: Graphic Elements */}
                        <div className="lg:col-span-5 relative hidden md:block">
                            <div className="relative w-full aspect-square max-w-[500px] mx-auto animate-[floating_6s_ease-in-out_infinite]">
                                {/* Subtle glow behind the illustration */}
                                <div className="absolute inset-1/4 rounded-full bg-blue-500/10 blur-[80px]" />

                                {/* 3D Premium Illustration */}
                                <div className="relative w-full h-full">
                                    <Image
                                        src="/assets/illustrations/catalyzers_hero.png"
                                        alt="Catalyzers EdTech Illustration"
                                        fill
                                        className="object-contain drop-shadow-md rounded-3xl"
                                        priority
                                        unoptimized
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle floating animation */}
            <style jsx>{`
                @keyframes floating {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>

            {/* Premium Stats Bar - Glassmorphism & Modern Icons */}
            <div className="relative bg-slate-100/80 -mt-6 md:-mt-10 pt-0 pb-6 md:pb-8">
                <div className="container px-4 md:px-8 relative z-20">
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white p-6 md:p-10">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-0">
                            {highlights.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.title}
                                        className={`flex flex-col items-center text-center px-4 md:px-6 group ${idx !== highlights.length - 1 ? 'lg:border-r lg:border-slate-200' : ''
                                            }`}
                                    >
                                        <div className={`relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 mb-4 rounded-2xl ${item.bg} ${item.color} ring-4 ${item.ring} ring-offset-2 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-lg`}>
                                            <Icon className="w-7 h-7 md:w-8 md:h-8 group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                        <h3 className="text-sm md:text-lg font-bold text-slate-800 leading-tight mb-2 group-hover:text-black transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs md:text-sm text-slate-500 mt-1 leading-snug hidden md:block">
                                            {item.subtitle}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
