"use client";

import { CheckCircle2 } from "lucide-react";

export default function AppPromo() {
    return (
        <section className="relative py-20 md:py-32 bg-[#0A0F2C] overflow-hidden">
            {/* Background design elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
                <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-purple-600 rounded-full blur-[120px] opacity-20"></div>
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwbjQwdjQwaC00MHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMCAwaDQwdjQwaC00MHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSsyNTUsMjU1LDI1NSwwLjAyKSIvPjwvc3ZnPg==')] pointer-events-none"></div>
            </div>

            <div className="container px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    {/* Left: Content */}
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-blue-400"></span>
                            <span className="text-xs font-semibold text-white uppercase tracking-wider">Mobile Learning</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
                            Take your learning <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">everywhere you go.</span>
                        </h2>

                        <p className="text-slate-300 text-lg md:text-xl mb-10 leading-relaxed font-light">
                            Download the Catalyzers app to watch lectures offline, practice mock tests on the go, and get instant doubt resolutions anytime, anywhere.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            {/* Google Play Button */}
                            <button className="flex items-center gap-3 bg-white text-slate-900 px-6 py-3.5 rounded-xl hover:bg-slate-100 transition-all hover:-translate-y-1 shadow-xl shadow-white/5">
                                <svg viewBox="0 0 512 512" className="w-8 h-8" fill="currentColor">
                                    <path fill="#4CAF50" d="M43.2 465.1l301.9-173.8-90.1-88.8-211.8 262.6z" />
                                    <path fill="#2196F3" d="M43.2 46.9c-8.9 9.3-13.2 23.3-13.2 40.4v337.4l221.7-221.8L43.2 46.9z" />
                                    <path fill="#FFC107" d="M345.1 291.3l85 48.9c25.4 14.6 25.4 38.3 0 52.9l-85 48.9-54.8-54.3 54.8-96.4z" />
                                    <path fill="#F44336" d="M43.2 46.9l208.5 208.4 93.4-92.4-301.9-173.8c-25.5-14.7-51 0-51 29.4-4.2 8.4 2.8 19.3 11 28.4z" />
                                </svg>
                                <div className="text-left flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-500 leading-none">Get it on</span>
                                    <span className="text-base font-bold leading-tight">Google Play</span>
                                </div>
                            </button>

                            {/* App Store Button */}
                            <button className="flex items-center gap-3 bg-white/10 border border-white/20 text-white px-6 py-3.5 rounded-xl hover:bg-white/20 transition-all hover:-translate-y-1 backdrop-blur-sm">
                                <svg viewBox="0 0 384 512" className="w-8 h-8" fill="currentColor">
                                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                                </svg>
                                <div className="text-left flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-300 leading-none">Download on the</span>
                                    <span className="text-base font-bold leading-tight">App Store</span>
                                </div>
                            </button>
                        </div>

                        {/* Features List */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                "Offline Video Downloads",
                                "Daily Practice Problems (DPPs)",
                                "Live Polling During Classes",
                                "AI-Powered Doubt Engine"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    <span className="text-slate-200 text-sm font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Abstract Phone mockups */}
                    <div className="relative h-[600px] w-full mt-10 lg:mt-0 flex items-center justify-center lg:justify-end perspective-1000 hidden md:flex">

                        {/* Back Phone (Dark Mode UI) */}
                        <div className="absolute right-12 lg:right-24 top-10 w-[280px] h-[560px] rounded-[2.5rem] border-[10px] border-slate-800 bg-slate-950 shadow-2xl overflow-hidden transform rotate-6 hover:rotate-12 transition-all duration-500 hover:scale-105 z-10">
                            {/* Notch */}
                            <div className="absolute top-0 inset-x-0 h-7 bg-slate-800 z-20 rounded-b-3xl w-32 mx-auto"></div>

                            {/* Screen Content */}
                            <div className="w-full h-full p-5 pt-12 flex flex-col relative overflow-hidden">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <div className="w-10 h-10 rounded-full bg-slate-800"></div>
                                    <div className="w-8 h-8 rounded-full bg-slate-800"></div>
                                </div>
                                {/* Video Player Placeholder */}
                                <div className="w-full h-40 bg-slate-800 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm z-10 text-white pl-1">
                                        ▶
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-purple-600/30"></div>
                                </div>
                                {/* text lines */}
                                <div className="w-3/4 h-5 bg-slate-800 rounded-md mb-3"></div>
                                <div className="w-1/2 h-4 bg-slate-800/60 rounded-md mb-8"></div>
                                {/* List items */}
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-full h-16 bg-slate-800/80 rounded-xl flex items-center px-4 gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-700/50"></div>
                                            <div className="flex-1">
                                                <div className="w-full h-3 bg-slate-700 rounded-sm mb-2"></div>
                                                <div className="w-2/3 h-2 bg-slate-700/50 rounded-sm"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Bottom Nav bar */}
                                <div className="absolute bottom-4 left-4 right-4 h-16 bg-slate-800/90 backdrop-blur-xl rounded-2xl flex items-center justify-around px-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className={`w-10 h-10 rounded-full ${i === 1 ? 'bg-blue-500/20' : ''} flex items-center justify-center`}>
                                            <div className={`w-5 h-5 rounded-sm ${i === 1 ? 'bg-blue-400' : 'bg-slate-600'}`}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Front Phone (Light Mode UI) */}
                        <div className="absolute right-32 lg:right-56 top-24 w-[280px] h-[560px] rounded-[2.5rem] border-[10px] border-slate-900 bg-white shadow-2xl overflow-hidden transform -rotate-12 hover:-rotate-6 transition-all duration-500 hover:scale-110 z-20">
                            {/* Notch */}
                            <div className="absolute top-0 inset-x-0 h-7 bg-slate-900 z-20 rounded-b-3xl w-32 mx-auto"></div>

                            {/* Screen Content */}
                            <div className="w-full h-full p-5 pt-12 flex flex-col relative overflow-hidden bg-slate-50">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <div className="space-y-1.5">
                                        <div className="w-24 h-4 bg-slate-200 rounded-sm"></div>
                                        <div className="w-32 h-6 bg-slate-800 rounded-sm"></div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <div className="w-5 h-5 bg-blue-500 rounded-sm"></div>
                                    </div>
                                </div>

                                {/* Main Hero Card */}
                                <div className="w-full h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6 p-4 flex flex-col justify-end text-white shadow-lg shadow-blue-500/20">
                                    <div className="w-1/2 h-5 bg-white/20 rounded-md mb-2 backdrop-blur-sm"></div>
                                    <div className="w-3/4 h-3 bg-white/40 rounded-sm backdrop-blur-sm"></div>
                                </div>

                                {/* Subjects Grid */}
                                <div className="flex justify-between items-center mb-4">
                                    <div className="w-24 h-5 bg-slate-800 rounded-md"></div>
                                    <div className="w-16 h-4 bg-slate-200 rounded-md"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="h-24 bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex flex-col">
                                            <div className={`w-8 h-8 rounded-lg mb-auto ${['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100'][i - 1]}`}></div>
                                            <div className="w-full h-3 bg-slate-200 rounded-sm mb-1.5"></div>
                                            <div className="w-1/2 h-2 bg-slate-100 rounded-sm"></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Quick actions floating button */}
                                <div className="absolute bottom-8 right-6 w-14 h-14 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/30 flex items-center justify-center z-30">
                                    <div className="w-6 h-6 bg-white rounded-sm transform rotate-45"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
