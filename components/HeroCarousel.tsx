"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const slides = [
    { src: "/assets/results/banner1.png", alt: "JEE Mains Top Results" },
    { src: "/assets/teachers/banner7.png", alt: "Catalyzers YouTube", link: "https://www.youtube.com/@catalyzersinstitute5574" },
    { src: "/assets/teachers/banner2.png", alt: "Adil Sir - Individual Physics" },
    { src: "/assets/teachers/banner6.png", alt: "Trust Catalyzers" },
    { src: "/assets/teachers/banner3.png", alt: "Kirti Ma'am - Individual Chemistry" },
    { src: "/assets/teachers/banner5.png?v=2", alt: "Batch Chota Result Bada" },
    { src: "/assets/teachers/banner4.png", alt: "Mayank Sir - Individual Mathematics" },
];

export default function HeroCarousel() {
    // Duplicate for infinite scroll horizontally
    const duplicatedSlides = [...slides, ...slides, ...slides];

    return (
        <section className="relative w-full overflow-hidden bg-slate-950/95 py-12 md:py-16 border-b border-indigo-500/10">
            {/* Very subtle ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[80%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

            <div className="relative z-20 container px-4 mb-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center justify-center gap-2 mb-4">
                        <span className="h-[1px] w-8 bg-indigo-500/50"></span>
                        <h2 className="text-indigo-300 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase">
                            Legendary Results & Faculty
                        </h2>
                        <span className="h-[1px] w-8 bg-indigo-500/50"></span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight drop-shadow-sm">
                        Excellence <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Proven Every Year</span>
                    </h3>
                </motion.div>
            </div>

            {/* Clean Horizontal Marquee Container */}
            <div className="relative flex flex-col overflow-hidden">
                {/* Dark masks on edges to fade out smoothly into the background */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-r from-[rgb(4,6,23)] to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-l from-[rgb(4,6,23)] to-transparent z-20 pointer-events-none" />

                {/* Single Row - Left Scrolling */}
                <motion.div
                    className="flex gap-6 md:gap-10 w-max px-4 md:px-0 py-4"
                    animate={{ x: ['0%', '-33.33%'] }}
                    transition={{ ease: "linear", duration: 60, repeat: Infinity }}
                    style={{ willChange: 'transform' }}
                >
                    {duplicatedSlides.map((slide, index) => {
                        const content = (
                            <>
                                <Image
                                    src={slide.src}
                                    alt={slide.alt}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    unoptimized
                                    priority={index < 3}
                                />
                                {/* Inner shadow overlay for premium screen effect */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/40 pointer-events-none" />
                                <div className="absolute inset-0 border border-white/10 rounded-xl sm:rounded-2xl pointer-events-none group-hover:border-indigo-500/30 transition-colors duration-500" />
                            </>
                        );

                        return (
                            <div
                                key={index}
                                className="relative flex-shrink-0 w-[600px] sm:w-[750px] md:w-[900px] lg:w-[1050px] aspect-[1442/275] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-indigo-900/20 border border-white/10 group"
                            >
                                {(slide as any).link ? (
                                    <a href={(slide as any).link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10 block">
                                        {content}
                                    </a>
                                ) : (
                                    content
                                )}
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
