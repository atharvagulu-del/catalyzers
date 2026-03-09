"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles, GraduationCap, BookOpen } from "lucide-react";

const teachers = [
    {
        name: "Adil Sir",
        role: "Physics Expert",
        experience: "14+ Years Experience",
        description: "Simplifying Physics for NEET & JEE aspirants with real-world examples and concept-first teaching.",
        image: "/assets/teachers/adil.png",
        icon: Sparkles,
        accent: "from-indigo-500 to-blue-600",
        accentLight: "bg-indigo-50 text-indigo-700",
    },
    {
        name: "Kirti Ma'am",
        role: "Chemistry Expert",
        experience: "Expert Faculty",
        description: "Making Chemistry intuitive with crystal-clear explanations and result-driven strategies.",
        image: "/assets/teachers/kirti_updated.png",
        icon: BookOpen,
        accent: "from-rose-500 to-pink-600",
        accentLight: "bg-rose-50 text-rose-700",
    },
    {
        name: "Mayank Sir",
        role: "Chemistry Expert",
        experience: "Expert Faculty",
        description: "Building strong Chemistry foundations for competitive exam success with engaging methods.",
        image: "/assets/teachers/mayank.png",
        icon: GraduationCap,
        accent: "from-amber-500 to-orange-600",
        accentLight: "bg-amber-50 text-amber-700",
    },
];

export default function TeacherShowcase() {
    return (
        <section className="relative py-14 md:py-20 bg-white overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)", backgroundSize: "40px 40px" }} />

            <div className="container px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="inline-block text-sm font-semibold tracking-wider text-primary uppercase mb-3">
                        Our Faculty
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                        Learn from the{" "}
                        <span className="relative inline-block">
                            Best Minds
                            <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                                <path d="M2 6C50 2 150 2 198 6" stroke="url(#underline-grad)" strokeWidth="3" strokeLinecap="round" />
                                <defs><linearGradient id="underline-grad" x1="0" y1="0" x2="200" y2="0"><stop stopColor="#6366f1" /><stop offset="1" stopColor="#ec4899" /></linearGradient></defs>
                            </svg>
                        </span>
                    </h2>
                    <p className="mt-4 text-gray-500 text-base md:text-lg max-w-xl mx-auto">
                        Expert faculty dedicated to transforming your preparation into top results.
                    </p>
                </div>

                {/* Teacher Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
                    {teachers.map((teacher) => {
                        const Icon = teacher.icon;
                        return (
                            <div
                                key={teacher.name}
                                className="group relative bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Top accent line */}
                                <div className={`absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r ${teacher.accent} rounded-b-full`} />

                                {/* Icon + Role */}
                                <div className="flex items-center gap-2 mb-5">
                                    <div className={`w-8 h-8 rounded-lg ${teacher.accentLight} flex items-center justify-center`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-semibold tracking-wide uppercase text-gray-400">{teacher.role}</span>
                                </div>

                                {/* Teacher Photo */}
                                <div className="relative mx-auto mb-5 w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                                    <Image
                                        src={teacher.image}
                                        alt={teacher.name}
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                {/* Name & Info */}
                                <h3 className="text-lg font-bold text-gray-900 text-center">{teacher.name}</h3>
                                <p className="text-xs text-gray-400 font-medium text-center mt-1 mb-3">{teacher.experience}</p>
                                <p className="text-sm text-gray-500 text-center leading-relaxed">{teacher.description}</p>
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="text-center mt-10">
                    <a href="/courses">
                        <Button size="lg" className="text-sm px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary to-primary-dark">
                            Explore All Courses
                        </Button>
                    </a>
                </div>
            </div>
        </section>
    );
}
