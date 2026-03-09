"use client";

import { useState } from "react";
import { BookOpen, Calculator, FlaskConical, Atom } from "lucide-react";

export default function InteractiveSyllabus() {
    const [activeSubject, setActiveSubject] = useState("physics");

    const subjects = {
        physics: {
            title: "Physics",
            icon: Atom,
            color: "text-blue-500",
            bg: "bg-blue-50 border-blue-200",
            activeBg: "bg-blue-500 text-white",
            description: "Master the fundamental laws of nature with our visualization-first approach.",
            modules: [
                { name: "Mechanics", chapters: 12, weightage: "35%", difficulty: "High" },
                { name: "Electromagnetism", chapters: 8, weightage: "25%", difficulty: "Very High" },
                { name: "Optics & Modern Physics", chapters: 6, weightage: "20%", difficulty: "Medium" },
                { name: "Thermodynamics", chapters: 4, weightage: "10%", difficulty: "Medium" },
                { name: "Waves & Oscillations", chapters: 3, weightage: "10%", difficulty: "High" }
            ]
        },
        chemistry: {
            title: "Chemistry",
            icon: FlaskConical,
            color: "text-rose-500",
            bg: "bg-rose-50 border-rose-200",
            activeBg: "bg-rose-500 text-white",
            description: "Conquer equations, reactions, and periodic trends through logical block building.",
            modules: [
                { name: "Physical Chemistry", chapters: 10, weightage: "35%", difficulty: "High" },
                { name: "Organic Chemistry", chapters: 14, weightage: "35%", difficulty: "Very High" },
                { name: "Inorganic Chemistry", chapters: 8, weightage: "30%", difficulty: "Medium" }
            ]
        },
        mathematics: {
            title: "Mathematics",
            icon: Calculator,
            color: "text-amber-500",
            bg: "bg-amber-50 border-amber-200",
            activeBg: "bg-amber-500 text-white",
            description: "Develop sharp problem-solving skills with rigorous algorithmic practice.",
            modules: [
                { name: "Calculus", chapters: 8, weightage: "35%", difficulty: "Very High" },
                { name: "Algebra", chapters: 10, weightage: "30%", difficulty: "High" },
                { name: "Coordinate Geometry", chapters: 5, weightage: "20%", difficulty: "Medium" },
                { name: "Trigonometry & Vectors", chapters: 6, weightage: "15%", difficulty: "Medium" }
            ]
        },
        biology: {
            title: "Biology",
            icon: BookOpen,
            color: "text-emerald-500",
            bg: "bg-emerald-50 border-emerald-200",
            activeBg: "bg-emerald-500 text-white",
            description: "Deep dive into the science of life with extensive 3D diagrams and mind maps.",
            modules: [
                { name: "Human Physiology", chapters: 7, weightage: "20%", difficulty: "High" },
                { name: "Genetics & Evolution", chapters: 3, weightage: "18%", difficulty: "Very High" },
                { name: "Ecology & Environment", chapters: 4, weightage: "16%", difficulty: "Medium" },
                { name: "Cell Biology", chapters: 4, weightage: "15%", difficulty: "Medium" },
                { name: "Plant Physiology", chapters: 5, weightage: "15%", difficulty: "High" }
            ]
        }
    };

    const current = subjects[activeSubject as keyof typeof subjects];

    return (
        <section className="py-20 md:py-32 bg-white relative">
            <div className="container px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 font-bold text-slate-800 text-xs uppercase tracking-widest mb-4">
                        Comprehensive Curriculum
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                        Explore exactly what you'll master
                    </h2>
                    <p className="text-lg text-slate-600">
                        Our curriculum is meticulously structured to align with JEE & NEET requirements. Click below to see the depth of our coverage.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto rounded-3xl border border-slate-200 p-2 md:p-4 shadow-xl shadow-slate-200/50 bg-slate-50">
                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-4 mb-6 md:mb-8">
                        {Object.entries(subjects).map(([key, subject]) => {
                            const Icon = subject.icon;
                            const isActive = activeSubject === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveSubject(key)}
                                    className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl transition-all duration-300 font-bold border-2 ${isActive
                                            ? `${subject.activeBg} border-transparent shadow-lg scale-[1.02]`
                                            : `bg-white ${subject.color} border-transparent hover:border-slate-200`
                                        }`}
                                >
                                    <Icon className={`w-6 h-6 ${isActive ? 'text-white' : subject.color}`} />
                                    <span className="hidden sm:inline">{subject.title}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Content Area */}
                    <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden transition-all duration-500 min-h-[400px]">
                        {/* Decorative Background Icon */}
                        <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none transform -rotate-12">
                            <current.icon className="w-96 h-96" />
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row gap-12">
                            {/* Left Side: Subject Info */}
                            <div className="w-full md:w-1/3">
                                <h3 className={`text-4xl font-extrabold mb-4 ${current.color}`}>{current.title}</h3>
                                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                                    {current.description}
                                </p>
                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                                        <span className="font-semibold text-slate-500">Total Modules</span>
                                        <span className="font-extrabold text-slate-900 text-xl">{current.modules.length}</span>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                                        <span className="font-semibold text-slate-500">Live Lectures</span>
                                        <span className="font-extrabold text-slate-900 text-xl">150+ Hrs</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Modules Grid */}
                            <div className="w-full md:w-2/3">
                                <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    Syllabus Breakdown
                                    <span className="text-sm font-normal text-slate-500 ml-2">(Sorted by Weightage)</span>
                                </h4>

                                <div className="space-y-4">
                                    {current.modules.map((mod, i) => (
                                        <div key={i} className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-300 bg-white cursor-default">
                                            <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${current.bg} ${current.color}`}>
                                                    0{i + 1}
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-slate-900 text-lg group-hover:text-slate-700 transition-colors">{mod.name}</h5>
                                                    <p className="text-sm text-slate-500 font-medium">{mod.chapters} Chapters</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 pl-14 sm:pl-0">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Weightage</span>
                                                    <span className={`font-extrabold text-lg ${current.color}`}>{mod.weightage}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Difficulty</span>
                                                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${mod.difficulty === 'Very High' ? 'bg-red-50 text-red-600' :
                                                            mod.difficulty === 'High' ? 'bg-orange-50 text-orange-600' :
                                                                'bg-green-50 text-green-600'
                                                        }`}>
                                                        {mod.difficulty}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
