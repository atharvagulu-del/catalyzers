"use client";

import { Trophy, Star, MapPin } from "lucide-react";

const toppers = [
    { name: "Vankatesh Amrutwar", achievement: "IIT Bombay", course: "JEE Advanced", image: "/assets/toppers/vankateshamrutwariitbombay.png" },
    { name: "Deepak Suthar", achievement: "IIT Delhi", course: "JEE Advanced", image: "/assets/toppers/deepaksuthariitdelhi.png" },
    { name: "Palak Khandelwal", achievement: "IIT Dhanbad", course: "JEE Advanced", image: "/assets/toppers/palakkhandelwaliitdhanbad.png" },
    { name: "Rudra Gupta", achievement: "IIT Guwahati", course: "JEE Advanced", image: "/assets/toppers/rudraguptaiitguwahti.png" },
    { name: "Siddharth Sagar", achievement: "IIT Roorkee", course: "JEE Advanced", image: "/assets/toppers/siddharthsagariitroorke.png" },
    { name: "Yogeshwari Chandrawat", achievement: "IIT Delhi", course: "JEE Advanced", image: "/assets/toppers/yogeshwarichandrawatiitdelhi.png" },
];

// Split into two distinct rows for the marquee
const studentsRow1 = [toppers[0], toppers[1], toppers[2]];
const studentsRow2 = [toppers[3], toppers[4], toppers[5]];

// Duplicate arrays to create a seamless infinite loop
const row1 = [...studentsRow1, ...studentsRow1, ...studentsRow1, ...studentsRow1];
const row2 = [...studentsRow2, ...studentsRow2, ...studentsRow2, ...studentsRow2];

export default function HallOfFame() {
    return (
        <section className="py-20 md:py-32 bg-[#020617] relative overflow-hidden">
            {/* Dark premium background accents */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container px-4 md:px-6 relative z-10 mb-12">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6 backdrop-blur-sm">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Legacy of Excellence</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                        The Catalyzers <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Hall of Fame</span>
                    </h2>
                    <p className="text-lg text-slate-400 font-light">
                        Results speak louder than words. Join the ecosystem that consistently produces top All India Ranks year after year.
                    </p>
                </div>
            </div>

            {/* Scrolling Marquee Rows */}
            <div className="relative w-full flex flex-col gap-6 overflow-hidden py-4 mask-edges">

                {/* CSS for custom animation */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .mask-edges {
                        -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                        mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                    }
                    @keyframes scrollLeft {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(calc(-280px * 3 - 1.5rem * 3)); } 
                    }
                    @keyframes scrollRight {
                        0% { transform: translateX(calc(-280px * 3 - 1.5rem * 3)); }
                        100% { transform: translateX(0); }
                    }
                    .animate-scroll-left {
                        animation: scrollLeft 40s linear infinite;
                    }
                    .animate-scroll-right {
                        animation: scrollRight 40s linear infinite;
                    }
                    .animate-scroll-left:hover, .animate-scroll-right:hover {
                        animation-play-state: paused;
                    }
                `}} />

                {/* Row 1 (Scrolls Left) */}
                <div className="flex w-[max-content] animate-scroll-left gap-6 px-3">
                    {row1.map((student, idx) => (
                        <div key={`r1-${idx}`} className="w-[280px] shrink-0 bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-3xl p-5 flex flex-col items-center text-center group hover:bg-slate-800/80 hover:border-slate-700 transition-all duration-300">
                            {/* Premium circular avatar for the topper */}
                            <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-slate-800 mb-5 relative group-hover:border-yellow-500/50 transition-colors shadow-lg group-hover:shadow-yellow-500/20">
                                <img src={student.image} alt={student.name} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>

                            <h4 className="text-white font-bold text-xl mb-1">{student.name}</h4>
                            <p className="text-slate-400 text-sm mb-5 font-medium tracking-wide">{student.course}</p>

                            <div className="mt-auto bg-slate-950/60 w-full py-2.5 px-4 rounded-xl border border-slate-800 flex items-center justify-center gap-2 group-hover:border-yellow-500/30 group-hover:bg-yellow-500/10 transition-colors relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                                <MapPin className="w-4 h-4 text-yellow-500" />
                                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                                    {student.achievement}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Row 2 (Scrolls Right) */}
                <div className="flex w-[max-content] animate-scroll-right gap-6 px-3">
                    {row2.map((student, idx) => (
                        <div key={`r2-${idx}`} className="w-[280px] shrink-0 bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-3xl p-5 flex flex-col items-center text-center group hover:bg-slate-800/80 hover:border-slate-700 transition-all duration-300">
                            {/* Premium circular avatar for the topper */}
                            <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-slate-800 mb-5 relative group-hover:border-blue-500/50 transition-colors shadow-lg group-hover:shadow-blue-500/20">
                                <img src={student.image} alt={student.name} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>

                            <h4 className="text-white font-bold text-xl mb-1">{student.name}</h4>
                            <p className="text-slate-400 text-sm mb-5 font-medium tracking-wide">{student.course}</p>

                            <div className="mt-auto bg-slate-950/60 w-full py-2.5 px-4 rounded-xl border border-slate-800 flex items-center justify-center gap-2 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-colors relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                                <MapPin className="w-4 h-4 text-blue-400" />
                                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                    {student.achievement}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
