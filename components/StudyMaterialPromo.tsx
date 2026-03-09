"use client";

import { BookOpen, Target, FileSignature } from "lucide-react";

export default function StudyMaterialPromo() {
    return (
        <section className="py-20 md:py-32 bg-[#050B14] relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
                {/* Custom dot grid background */}
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)]" style={{ backgroundSize: '30px 30px' }}></div>
            </div>

            <div className="container px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

                    {/* Left: Copy & Text */}
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                            <span className="flex h-2 w-2 rounded-full bg-fuchsia-400"></span>
                            <span className="text-xs font-semibold text-white uppercase tracking-wider">Premium Content</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-[52px] font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
                            Study material engineered for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">Top Ranks.</span>
                        </h2>

                        <p className="text-slate-400 text-lg mb-10 leading-relaxed font-light">
                            Our curriculum isn't just a collection of questions. It's a scientifically designed content ecosystem built by top IITians and Doctors to guarantee maximum retention and conceptual absolute clarity.
                        </p>

                        <div className="space-y-6">
                            {[
                                {
                                    icon: BookOpen,
                                    title: "Comprehensive Modules",
                                    desc: "Exhaustive theory with graded illustrations from basic to advanced levels."
                                },
                                {
                                    icon: Target,
                                    title: "Daily Practice Problems (DPP)",
                                    desc: "Targeted sub-topic wise practice sheets mapped perfectly to daily lectures."
                                },
                                {
                                    icon: FileSignature,
                                    title: "Topper's Mind Maps",
                                    desc: "Quick-revision sheets and formula charts for the final month acceleration."
                                }
                            ].map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/5">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                                            <Icon className="w-6 h-6 text-fuchsia-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-200 mb-1">{item.title}</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: 3D Isometric Grid of Books */}
                    <div className="relative h-[650px] w-full hidden md:flex items-center justify-center perspective-[2000px]">

                        {/* 3D Container applying the isometric rotation */}
                        <div className="relative w-full h-full transform-style-3d rotate-x-[60deg] rotate-z-[-45deg] scale-90 translate-y-12 transition-all duration-700 hover:rotate-x-[55deg] hover:rotate-z-[-40deg] hover:scale-100 group">

                            {/* Base floating grid aesthetic */}
                            <div className="absolute inset-0 translate-z-[-100px] grid grid-cols-4 grid-rows-4 border-l border-t border-indigo-500/20 shadow-[0_0_100px_rgba(79,70,229,0.2)]">
                                {[...Array(16)].map((_, i) => (
                                    <div key={i} className="border-r border-b border-indigo-500/20"></div>
                                ))}
                            </div>

                            {/* Book 1: Physics Module (Bottom layer) */}
                            <div className="absolute top-[20%] left-[10%] w-[260px] h-[360px] transform-style-3d translate-z-[40px] transition-transform duration-500 group-hover:translate-z-[80px]">
                                {/* Cover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 border-2 border-indigo-400/50 rounded-r-lg shadow-[20px_20px_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-6 text-center z-20">
                                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-md border border-white/20">
                                        <div className="font-serif text-2xl font-bold text-white">Ph</div>
                                    </div>
                                    <h3 className="text-white font-bold text-xl uppercase tracking-widest mb-2">Physics</h3>
                                    <p className="text-blue-200 text-xs font-medium uppercase tracking-widest">Vol 1 • Mechanics</p>
                                    <div className="absolute bottom-6 left-6 right-6 h-1 bg-gradient-to-r from-blue-400 to-transparent"></div>
                                </div>
                                {/* Pages Edge (Thickness) */}
                                <div className="absolute top-0 right-full w-[30px] h-full bg-indigo-950 origin-right rotate-y-90 border border-indigo-800"></div>
                                {/* Bottom Edge */}
                                <div className="absolute top-full left-0 w-full h-[30px] bg-slate-200 origin-top rotate-x-[-90deg] shadow-inner flex flex-col justify-evenly px-2">
                                    {/* Render fake pages lines */}
                                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-[1px] bg-slate-300"></div>)}
                                </div>
                            </div>

                            {/* Book 2: Chemistry DPP (Mid layer) */}
                            <div className="absolute top-[35%] left-[35%] w-[260px] h-[360px] transform-style-3d translate-z-[120px] transition-transform duration-500 delay-75 group-hover:translate-z-[180px]">
                                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600 to-purple-900 border-2 border-fuchsia-400/50 rounded-r-lg shadow-[30px_30px_50px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center p-6 text-center z-20">
                                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-md border border-white/20">
                                        <div className="font-serif text-2xl font-bold text-white">Ch</div>
                                    </div>
                                    <h3 className="text-white font-bold text-xl uppercase tracking-widest mb-2">Chemistry</h3>
                                    <p className="text-fuchsia-200 text-xs font-medium uppercase tracking-widest">Daily Practice</p>
                                    <div className="absolute bottom-6 left-6 right-6 h-1 bg-gradient-to-r from-fuchsia-400 to-transparent"></div>
                                </div>
                                {/* Spine */}
                                <div className="absolute top-0 right-full w-[20px] h-full bg-purple-950 origin-right rotate-y-90 border border-purple-800"></div>
                                {/* Bottom edge pages */}
                                <div className="absolute top-full left-0 w-full h-[20px] bg-slate-200 origin-top rotate-x-[-90deg] shadow-inner flex flex-col justify-evenly px-2">
                                    {[1, 2, 3].map(i => <div key={i} className="w-full h-[1px] bg-slate-300"></div>)}
                                </div>
                            </div>

                            {/* Book 3: Math Mind Maps (Top layer) */}
                            <div className="absolute top-[50%] left-[60%] w-[260px] h-[360px] transform-style-3d translate-z-[200px] transition-transform duration-500 delay-150 group-hover:translate-z-[280px]">
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-orange-600 border-2 border-orange-300/50 rounded-r-lg shadow-[40px_40px_60px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center p-6 text-center z-20">
                                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-md border border-white/20">
                                        <div className="font-serif text-2xl font-bold text-white">Ma</div>
                                    </div>
                                    <h3 className="text-white font-bold text-xl uppercase tracking-widest mb-2">Mathematics</h3>
                                    <p className="text-orange-200 text-xs font-medium uppercase tracking-widest">Mind Maps & Formulas</p>
                                    <div className="absolute bottom-6 left-6 right-6 h-1 bg-gradient-to-r from-orange-300 to-transparent"></div>
                                </div>
                                {/* Spine */}
                                <div className="absolute top-0 right-full w-[10px] h-full bg-orange-950 origin-right rotate-y-90 border border-orange-800"></div>
                                {/* Bottom edge pages */}
                                <div className="absolute top-full left-0 w-full h-[10px] bg-slate-200 origin-top rotate-x-[-90deg] shadow-inner"></div>
                            </div>

                            {/* Glowing connecting visual lines */}
                            <div className="absolute top-[35%] left-[20%] w-[40%] h-[2px] bg-gradient-to-r from-blue-400 to-fuchsia-400 translate-z-[80px] blur-[1px]"></div>
                            <div className="absolute top-[50%] left-[45%] w-[40%] h-[2px] bg-gradient-to-r from-fuchsia-400 to-orange-400 translate-z-[160px] blur-[1px]"></div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for proper 3D rendering context */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .perspective-\\[2000px\\] {
                    perspective: 2000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                .rotate-x-\\[60deg\\] { transform: rotateX(60deg); }
                .rotate-x-\\[55deg\\] { transform: rotateX(55deg); }
                .rotate-x-\\[-90deg\\] { transform: rotateX(-90deg); }
                .rotate-z-\\[-45deg\\] { transform: rotateZ(-45deg); }
                .rotate-z-\\[-40deg\\] { transform: rotateZ(-40deg); }
                .rotate-y-90 { transform: rotateY(90deg); }
                .translate-z-\\[-100px\\] { transform: translateZ(-100px); }
                .translate-z-\\[40px\\] { transform: translateZ(40px); }
                .translate-z-\\[80px\\] { transform: translateZ(80px); }
                .translate-z-\\[120px\\] { transform: translateZ(120px); }
                .translate-z-\\[160px\\] { transform: translateZ(160px); }
                .translate-z-\\[180px\\] { transform: translateZ(180px); }
                .translate-z-\\[200px\\] { transform: translateZ(200px); }
                .translate-z-\\[280px\\] { transform: translateZ(280px); }
            `}} />
        </section>
    );
}
