"use client";

import { Users, Code, LineChart, HandHeart } from "lucide-react";

export default function LiveClassPromo() {
    return (
        <section className="py-20 md:py-32 bg-white relative overflow-hidden">
            <div className="container px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

                    {/* Left: Content Description */}
                    <div className="max-w-xl order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 mb-6">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                            </span>
                            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Live & Interactive</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-[52px] font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                            Classrooms that feel <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">truly alive.</span>
                        </h2>

                        <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                            Boring monologue lectures are a thing of the past. Our robust live class engine makes learning a two-way street with real-time participation.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                                    <LineChart className="w-6 h-6 text-orange-500" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-slate-900 mb-1">Live Polling & Quizzes</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">Compete with thousands of peers in real-time leaderboards.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <HandHeart className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-slate-900 mb-1">Hand Raise Feature</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">Talk to your favorite educators directly on audio.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                                    <Code className="w-6 h-6 text-purple-500" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-slate-900 mb-1">Instant Doubt Chat</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">Dedicated teaching assistants answering chat queries live.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                    <Users className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-slate-900 mb-1">Distraction-Free Mode</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">Focus solely on the teacher and the board when needed.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Abstract UI Mockup */}
                    <div className="relative order-1 lg:order-2 perspective-1000 hidden md:block">
                        {/* Shadow back drop */}
                        <div className="absolute inset-4 bg-gradient-to-tr from-rose-500/20 to-orange-500/20 rounded-3xl blur-2xl transform rotate-3"></div>

                        {/* Main App Window */}
                        <div className="relative w-full aspect-[4/3] bg-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden transform -rotate-2 hover:rotate-0 transition-all duration-500 hover:scale-[1.02] z-10 flex flex-col">
                            {/* Window Header */}
                            <div className="h-10 bg-slate-800/80 backdrop-blur border-b border-slate-700/50 flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                <div className="mx-auto w-32 h-3 bg-slate-700 rounded-sm"></div>
                            </div>

                            {/* Main Workspace */}
                            <div className="flex-1 flex p-4 gap-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">

                                {/* Left: Video Player Area */}
                                <div className="flex-[3] flex flex-col gap-4">
                                    {/* Main Video */}
                                    <div className="flex-1 rounded-xl bg-slate-800 border border-slate-700 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90"></div>
                                        {/* Fake Teacher Video outline */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                            <div className="w-32 h-40 bg-slate-500 rounded-t-full mt-20"></div>
                                        </div>
                                        {/* HUD Elements */}
                                        <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-xs font-bold">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                            LIVE
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-slate-400">
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-700/80 flex items-center justify-center">▶</div>
                                                <div className="w-8 h-8 rounded-full bg-slate-700/80 flex items-center justify-center">🔊</div>
                                            </div>
                                            <div className="h-1 flex-1 mx-4 bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full w-1/3 bg-rose-500"></div>
                                            </div>
                                            <div className="text-xs font-mono">24:15 / 1:30:00</div>
                                        </div>
                                    </div>

                                    {/* Bottom: Floating Poll pop-up simulation */}
                                    <div className="h-32 rounded-xl bg-slate-800 border border-slate-700 p-4 flex gap-4">
                                        <div className="flex-1 border-r border-slate-700 pr-4">
                                            <div className="h-4 w-3/4 bg-slate-600 rounded mb-3"></div>
                                            <div className="h-3 w-1/2 bg-slate-700 rounded mb-4"></div>
                                            <div className="h-8 w-full bg-gradient-to-r from-rose-500 to-orange-500 rounded"></div>
                                        </div>
                                        <div className="w-24 flex flex-col justify-center items-center">
                                            <div className="text-2xl font-bold text-white mb-1">45s</div>
                                            <div className="text-[10px] text-slate-400 uppercase tracking-widest">Time Left</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Chat / QA Sidebar */}
                                <div className="flex-1 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col overflow-hidden relative">
                                    <div className="h-12 border-b border-slate-700 flex">
                                        <div className="flex-1 font-bold text-xs text-white flex items-center justify-center border-b-2 border-rose-500 bg-slate-800">Q&A</div>
                                        <div className="flex-1 font-bold text-xs text-slate-400 flex items-center justify-center hover:bg-slate-700/50 cursor-pointer">Live Chat</div>
                                    </div>

                                    <div className="flex-1 p-3 space-y-4 relative">
                                        {/* Mock Chat bubbles */}
                                        <div className="flex gap-2">
                                            <div className="w-6 h-6 rounded bg-indigo-500 flex-shrink-0"></div>
                                            <div className="bg-slate-700 p-2 rounded-lg rounded-tl-none w-full shadow-sm">
                                                <div className="h-2 w-1/2 bg-slate-500/50 rounded mb-2"></div>
                                                <div className="h-2 w-3/4 bg-slate-600 rounded shrink-0"></div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <div className="w-6 h-6 rounded bg-emerald-500 flex-shrink-0"></div>
                                            <div className="bg-slate-700 p-2 rounded-lg rounded-tl-none w-full shadow-sm">
                                                <div className="h-2 w-1/3 bg-slate-500/50 rounded mb-2"></div>
                                                <div className="h-2 w-full bg-slate-600 rounded"></div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 opacity-50">
                                            <div className="w-6 h-6 rounded bg-amber-500 flex-shrink-0"></div>
                                            <div className="bg-slate-700 p-2 rounded-lg rounded-tl-none w-full shadow-sm">
                                                <div className="h-2 w-full bg-slate-600 rounded"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Input bar */}
                                    <div className="h-14 bg-slate-900 border-t border-slate-700 p-2 flex items-center gap-2">
                                        <div className="flex-1 h-full bg-slate-800 rounded-md border border-slate-700 flex items-center px-3">
                                            <div className="h-2 w-1/2 bg-slate-600 rounded"></div>
                                        </div>
                                        <div className="w-10 h-10 rounded-md bg-rose-500 flex items-center justify-center">
                                            <div className="w-4 h-4 bg-white rounded-sm transform rotate-45 -translate-x-0.5"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating elements to break the box */}
                        <div className="absolute -right-6 top-1/4 w-32 h-16 bg-white rounded-xl shadow-2xl border border-slate-100 p-3 z-20 flex items-center gap-3 transform rotate-6 animate-bounce" style={{ animationDuration: '4s' }}>
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold border-2 border-white shadow-sm">+5</div>
                            <div className="flex-1">
                                <div className="h-2 w-full bg-slate-200 rounded mb-1"></div>
                                <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
