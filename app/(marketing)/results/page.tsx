"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Trophy, Star, TrendingUp, Medal, Sparkles, MoveRight, ChevronDown } from "lucide-react";

// Massive dummy dataset to simulate a real coaching institute's results
const TOP_RANKERS = [
    { id: 1, name: "Vankatesh Amrutwar", rank: "AIR 45", exam: "JEE Advanced", image: "/assets/toppers/vankateshamrutwariitbombay.png", state: "Maharashtra", category: "General" },
    { id: 2, name: "Deepak Suthar", rank: "AIR 112", exam: "JEE Advanced", image: "/assets/toppers/deepaksuthariitdelhi.png", state: "Rajasthan", category: "OBC-NCL" },
    { id: 3, name: "Aarushi Verma", rank: "AIR 18", exam: "NEET UG", image: "/assets/toppers/yogeshwarichandrawatiitdelhi.png", state: "Delhi", category: "General" },
];

// Generate 40 dummy top 100 rankers
const TOP_100_RANKERS = Array.from({ length: 48 }).map((_, i) => ({
    id: i + 4,
    name: `Student Name ${i + 1}`,
    rank: `AIR ${Math.floor(Math.random() * 85) + 15}`,
    exam: Math.random() > 0.5 ? "JEE Advanced" : "NEET UG",
    // Use the 6 existing images randomly as placeholders
    image: [
        "/assets/toppers/vankateshamrutwariitbombay.png",
        "/assets/toppers/deepaksuthariitdelhi.png",
        "/assets/toppers/palakkhandelwaliitdhanbad.png",
        "/assets/toppers/rudraguptaiitguwahti.png",
        "/assets/toppers/siddharthsagariitroorke.png",
        "/assets/toppers/yogeshwarichandrawatiitdelhi.png"
    ][i % 6]
}));

// Generate 100 dummy generic selections for a marquee/ticker
const GENERAL_SELECTIONS = Array.from({ length: 100 }).map((_, i) => ({
    id: i + 100,
    name: `Selected Student ${i + 1}`,
    college: Math.random() > 0.5 ? `IIT ${['Bombay', 'Delhi', 'Madras', 'Kanpur', 'Kharagpur'][i % 5]}` : `AIIMS ${['Delhi', 'Bhopal', 'Jodhpur', 'Patna'][i % 4]}`
}));

export default function ResultsPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-indigo-500/30">
            <Header />

            {/* Premium Hero Section */}
            <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-slate-950">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    {/* Core glowing orb */}
                    <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-indigo-600/10 blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[100px]" />
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px]" />

                    {/* Premium grid texture */}
                    <div className="absolute inset-0 z-0 opacity-[0.15]"
                        style={{
                            backgroundImage: 'linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)',
                            backgroundSize: '64px 64px'
                        }}
                    />
                </div>

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="max-w-5xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/50 border border-indigo-500/20 backdrop-blur-md">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            <span className="text-sm font-semibold text-indigo-300 tracking-wider">CATALYZERS 2024 LEGACY</span>
                        </div>

                        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white leading-[1.05]">
                            The Benchmark of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                                Excellence
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium">
                            Over <strong>5,000+</strong> students selected in premium engineering and medical institutes in the last 3 years alone.
                        </p>

                        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition-colors flex items-center gap-2 group">
                                View Top Rankers <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 bg-indigo-950/50 text-white rounded-xl font-bold border border-indigo-500/30 hover:bg-indigo-900/50 transition-colors flex items-center gap-2">
                                Download Result PDF <MoveRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Highlights Bar */}
            <div className="w-full bg-slate-900 border-y border-slate-800 relative z-20">
                <div className="container px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-800/50">
                        {[
                            { label: "Total Selections", value: "25k+", icon: Trophy },
                            { label: "In Top 100 AIR", value: "120+", icon: Star },
                            { label: "99+ Percentile", value: "850+", icon: TrendingUp },
                            { label: "Success Rate", value: "1 in 3", icon: Medal },
                        ].map((stat, i) => (
                            <div key={i} className="py-8 px-4 flex flex-col items-center text-center">
                                <stat.icon className="w-6 h-6 text-indigo-500 mb-3 opacity-80" />
                                <span className="text-4xl md:text-5xl font-black text-white tracking-tight mb-1">{stat.value}</span>
                                <span className="text-sm font-semibold text-slate-500 tracking-wider uppercase">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Elite Club (Top 10) - Large Cards */}
            <section className="py-24 bg-[#020617] relative">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">The Elite Club</h2>
                        <p className="text-slate-400 text-lg">Top 50 All India Ranks in JEE & NEET 2024</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {TOP_RANKERS.map((student) => (
                            <div key={student.id} className="group relative bg-slate-900 rounded-[2rem] p-1 border border-slate-800 overflow-hidden hover:border-indigo-500/50 transition-colors duration-500">
                                {/* Golden/Indigo Glow behind the image */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-64 bg-indigo-500/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative bg-slate-950 rounded-[1.8rem] h-full overflow-hidden flex flex-col">
                                    <div className="pt-8 px-8 flex justify-between items-start relative z-10">
                                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-xl px-4 py-2 rounded-xl shadow-lg shadow-indigo-500/20">
                                            {student.rank}
                                        </div>
                                        <div className="px-3 py-1 bg-slate-800/80 rounded-lg text-xs font-bold text-slate-300 border border-slate-700">
                                            {student.exam}
                                        </div>
                                    </div>

                                    <div className="relative h-80 w-full mt-auto">
                                        {/* Faded masking at bottom of image */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
                                        <Image
                                            src={student.image}
                                            alt={student.name}
                                            fill
                                            className="object-cover object-top scale-[1.02] group-hover:scale-105 transition-transform duration-700 ease-out"
                                            unoptimized
                                        />
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                                        <h3 className="text-2xl font-bold text-white mb-1">{student.name}</h3>
                                        <p className="text-indigo-400 font-medium">{student.state} • {student.category}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Massive Century Grid (Top 100-500) */}
            <section className="py-24 bg-slate-950 relative border-t border-slate-900">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 pb-8 border-b border-slate-800">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Century Makers</h2>
                            <p className="text-slate-400 text-lg max-w-2xl">A dense grid showcasing the depth of our results. Over 100 students securing ranks under AIR 1000.</p>
                        </div>
                        <div className="flex gap-2 mt-6 md:mt-0">
                            <span className="px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 text-sm">JEE Advanced (64)</span>
                            <span className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold border border-slate-700 text-sm hover:bg-slate-700 cursor-pointer transition-colors">NEET UG (42)</span>
                        </div>
                    </div>

                    {/* Dense Grid Layout */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-1 md:gap-3">
                        {TOP_100_RANKERS.map((student) => (
                            <div key={student.id} className="group relative bg-slate-900 rounded-xl overflow-hidden aspect-[3/4] border border-slate-800 hover:border-indigo-500/50 transition-all">
                                <Image
                                    src={student.image}
                                    alt={student.name}
                                    fill
                                    className="object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />

                                <div className="absolute bottom-0 left-0 right-0 p-3 text-center translate-y-2 group-hover:translate-y-0 transition-transform z-20">
                                    <div className="text-sm font-black text-indigo-400 mb-0.5 drop-shadow-md">{student.rank}</div>
                                    <div className="text-[10px] sm:text-xs font-bold text-white truncate px-1 drop-shadow-md">{student.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <button className="px-6 py-3 bg-transparent text-slate-300 rounded-lg font-semibold border border-slate-700 hover:bg-slate-800 transition-colors">
                            Load 200 More Results
                        </button>
                    </div>
                </div>
            </section>

            {/* Marquee Ticker for overwhelming volume of general selections */}
            <section className="py-16 bg-[#020617] overflow-hidden border-t border-slate-900 relative">
                <div className="text-center mb-8 relative z-20">
                    <h3 className="text-slate-400 font-bold tracking-widest uppercase text-sm">2,500+ More Selected Students</h3>
                </div>

                <div className="relative flex overflow-hidden group">
                    {/* Dark gradient masks for smooth fade on edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#020617] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#020617] to-transparent z-10 pointer-events-none" />

                    <div className="flex gap-4 animate-[marquee_60s_linear_infinite] group-hover:[animation-play-state:paused] w-max">
                        {/* Duplicate for infinite effect */}
                        {[...GENERAL_SELECTIONS, ...GENERAL_SELECTIONS].map((student, i) => (
                            <div key={`${student.id}-${i}`} className="flex items-center gap-3 px-6 py-3 bg-slate-900 rounded-full border border-slate-800 whitespace-nowrap">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="font-bold text-slate-200 text-sm">{student.name}</span>
                                <span className="text-slate-600 text-sm font-medium">| {student.college}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Second row moving opposite direction */}
                <div className="relative flex overflow-hidden mt-4 group">
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#020617] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#020617] to-transparent z-10 pointer-events-none" />

                    <div className="flex gap-4 animate-[marquee_50s_linear_infinite_reverse] group-hover:[animation-play-state:paused] w-max">
                        {[...GENERAL_SELECTIONS].reverse().concat([...GENERAL_SELECTIONS].reverse()).map((student, i) => (
                            <div key={`rev-${student.id}-${i}`} className="flex items-center gap-3 px-6 py-3 bg-slate-900 rounded-full border border-slate-800 whitespace-nowrap">
                                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                <span className="font-bold text-slate-200 text-sm">{student.name}</span>
                                <span className="text-slate-600 text-sm font-medium">| {student.college}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>

            <Footer />
        </div>
    );
}
