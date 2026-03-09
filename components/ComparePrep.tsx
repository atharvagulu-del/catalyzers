"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";

export default function ComparePrep() {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;

        let percent = (x / rect.width) * 100;
        percent = Math.max(5, Math.min(95, percent));

        setSliderPos(percent);
    };

    const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
        if (!isDragging) return;
        handleMove((e as React.MouseEvent).clientX ?? (e as MouseEvent).clientX);
    };

    const handleTouchMove = (e: React.TouchEvent | TouchEvent) => {
        if (!isDragging) return;
        handleMove((e as React.TouchEvent).touches[0].clientX ?? (e as TouchEvent).touches[0].clientX);
    };

    useEffect(() => {
        const stopDrag = () => setIsDragging(false);
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", stopDrag);
            window.addEventListener("touchmove", handleTouchMove, { passive: false });
            window.addEventListener("touchend", stopDrag);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", stopDrag);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", stopDrag);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", stopDrag);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", stopDrag);
        };
    }, [isDragging]);

    return (
        <section className="py-16 md:py-24 bg-white relative overflow-hidden border-t border-slate-100">
            {/* Background ambiance */}
            <div className="absolute inset-0 bg-slate-50 opacity-50"></div>

            <div className="container px-4 md:px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">The Paradigm Shift</span>
                    </div>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
                        The Clear Difference
                    </h2>
                    <p className="text-base text-slate-600 font-medium">
                        Drag the slider to see why thousands are switching to the personalized Catalyzers ecosystem.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto relative select-none">
                    <div
                        ref={containerRef}
                        className={`relative w-[90%] md:w-full mx-auto h-[550px] md:h-[420px] rounded-3xl overflow-hidden shadow-2xl bg-white cursor-ew-resize border border-slate-200 transition-shadow duration-500 ${isHovered || isDragging ? 'shadow-blue-900/10' : 'shadow-slate-200/50'}`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onMouseDown={(e) => {
                            setIsDragging(true);
                            handleMove(e.clientX);
                        }}
                        onTouchStart={(e) => {
                            setIsDragging(true);
                            handleMove(e.touches[0].clientX);
                        }}
                    >
                        {/* RIGHT SIDE: Catalyzers (Clean, Trustworthy Light/Blue theme) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-[#eff6ff] to-[#dbeafe] flex flex-col items-end justify-center p-6 md:p-12 text-right">

                            {/* Detailed Grid Overlay */}
                            <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '2rem 2rem' }}></div>

                            {/* Radial mask to make the grid soft at edges */}
                            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(248,250,252,0.8)_80%)]"></div>

                            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_60%)]"></div>

                            <div className="w-full md:w-[48%] h-full flex flex-col justify-center relative z-10">
                                <div className="inline-block px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-[10px] uppercase tracking-widest self-end mb-6 shadow-md shadow-blue-600/20">
                                    The Catalyzers Way
                                </div>

                                <div className="space-y-6">
                                    <div className="group">
                                        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1.5 flex items-center justify-end gap-2.5">
                                            Individual Focus <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs shadow-sm">✓</div>
                                        </h3>
                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">Personalized mentorship and small batches ensure teachers know your exact weaknesses.</p>
                                    </div>
                                    <div className="group">
                                        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1.5 flex items-center justify-end gap-2.5">
                                            Instant Doubt Solving <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs shadow-sm">✓</div>
                                        </h3>
                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">Don't wait till tomorrow. Get 24/7 AI and dedicated TA support exactly when you are stuck.</p>
                                    </div>
                                    <div className="group">
                                        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1.5 flex items-center justify-end gap-2.5">
                                            Affordable Excellence <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs shadow-sm">✓</div>
                                        </h3>
                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">Premium, high-quality education that offers fair and transparent pricing for everyone.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LEFT SIDE: Traditional Coaching (Dark theme) - Clipped Layer */}
                        {/* Notice we removed transition-all duration-75 from className so it clips INSTANTLY with the slider handle */}
                        <div
                            className="absolute inset-0 bg-slate-900 flex flex-col items-start justify-center p-6 md:p-12 z-10 pointer-events-none"
                            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                        >
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

                            {/* We wrap the content in a div for layout */}
                            <div className="w-full md:w-[48%] h-full flex flex-col justify-center relative z-20">
                                <div className="inline-block px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-bold text-[10px] uppercase tracking-widest border border-slate-700 self-start mb-6">
                                    Traditional Coaching
                                </div>

                                <div className="space-y-6">
                                    <div className="group">
                                        <h3 className="text-lg md:text-xl font-bold text-white mb-1.5 flex items-center gap-2.5">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs shadow-sm">✗</div> Factory Model
                                        </h3>
                                        <p className="text-sm text-slate-400 leading-relaxed font-medium">Sitting in crowded rooms of 300+ students. You're just another roll number in the herd.</p>
                                    </div>
                                    <div className="group">
                                        <h3 className="text-lg md:text-xl font-bold text-white mb-1.5 flex items-center gap-2.5">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs shadow-sm">✗</div> Left Behind
                                        </h3>
                                        <p className="text-sm text-slate-400 leading-relaxed font-medium">Hesitant to ask doubts. Backlogs pile up steadily until you surrender.</p>
                                    </div>
                                    <div className="group">
                                        <h3 className="text-lg md:text-xl font-bold text-white mb-1.5 flex items-center gap-2.5">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs shadow-sm">✗</div> Exorbitant Fees
                                        </h3>
                                        <p className="text-sm text-slate-400 leading-relaxed font-medium">Paying absolute premiums just for the brand name, without personal attention.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* The Draggable Slider Handle & Line */}
                        <div
                            className="absolute top-0 bottom-0 w-[2px] bg-slate-300 z-20 pointer-events-none"
                            style={{
                                left: `${sliderPos}%`,
                                transform: 'translateX(-50%)'
                            }}
                        >
                            <div
                                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-lg transition-transform duration-150 pointer-events-auto cursor-ew-resize
                                ${isDragging ? 'scale-110 shadow-xl border-blue-400' : 'scale-100'}`}
                            >
                                <div className="flex gap-0.5 text-slate-400">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDragging ? "#2563EB" : "currentColor"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 18l-6-6 6-6" />
                                    </svg>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDragging ? "#2563EB" : "currentColor"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform rotate-180">
                                        <path d="M15 18l-6-6 6-6" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
