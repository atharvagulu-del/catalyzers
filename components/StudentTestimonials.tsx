"use client";

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Image from 'next/image';

const TESTIMONIALS = [
    {
        id: 1,
        name: "Aarav Sharma",
        tagline: "AIR 45 (JEE Adv)",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?si=placeholder"
    },
    {
        id: 2,
        name: "Ishita Patel",
        tagline: "NEET Top Ranker",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ishita",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?si=placeholder"
    },
    {
        id: 3,
        name: "Rohan Gupta",
        tagline: "Bits Pilani Secured",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?si=placeholder"
    },
    {
        id: 4,
        name: "Meera Singh",
        tagline: "Selection in AIIMS",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?si=placeholder"
    },
    {
        id: 5,
        name: "Vikram Malhotra",
        tagline: "IIT Bombay CSE",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?si=placeholder"
    }
];

export default function StudentTestimonials() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        skipSnaps: false,
    }, [Autoplay({ delay: 5000, stopOnInteraction: true })]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <section
            className="relative pt-32 pb-40 overflow-hidden"
            style={{
                backgroundImage: `linear-gradient(to bottom, rgba(5, 11, 20, 0.8), rgba(5, 11, 20, 0.9)), url('/assets/backgrounds/testimonial-bg.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 space-y-3">
                    <h2 className="text-3xl md:text-5xl font-bold text-white font-sans tracking-tight">
                        Hear What Students Say About Catalyzers
                    </h2>
                    <p className="text-blue-200 text-sm md:text-base font-light tracking-wide">
                        What Our Rising Stars Say About Their Journey ?
                    </p>
                    <div className="flex justify-center mt-6">
                        <svg width="200" height="20" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                            <path d="M2 10C50 18 150 18 198 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>

                {/* Carousel Container */}
                <div className="relative group">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex -ml-4 md:-ml-6 py-4">
                            {TESTIMONIALS.map((student) => (
                                <div key={student.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4 md:pl-6">
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                                        {/* Video Section */}
                                        <div className="relative pb-[56.25%] bg-slate-100">
                                            <iframe
                                                className="absolute top-0 left-0 w-full h-full object-cover"
                                                src={student.videoUrl}
                                                title={`Testimonial by ${student.name}`}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                loading="lazy"
                                            ></iframe>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6 flex items-center relative flex-1">
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 p-0.5 shrink-0 bg-white">
                                                    <Image
                                                        src={student.image}
                                                        alt={student.name}
                                                        width={64}
                                                        height={64}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                </div>
                                            </div>

                                            <div className="ml-4 flex-1">
                                                <h4 className="text-blue-900 font-bold text-lg leading-tight">
                                                    {student.name}
                                                </h4>
                                                <p className="text-slate-600 font-medium text-sm mt-1">
                                                    {student.tagline}
                                                </p>
                                            </div>

                                            {/* Quote Icon */}
                                            <div className="absolute bottom-4 right-4 opacity-10">
                                                <Quote size={48} className="text-slate-900" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={scrollPrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-all shadow-lg hidden md:block group-hover:opacity-100 disabled:opacity-50"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-all shadow-lg hidden md:block group-hover:opacity-100 disabled:opacity-50"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight size={32} />
                    </button>
                </div>

                {/* General Testimonial Text */}
                <div className="mt-12 max-w-6xl mx-auto text-center relative z-10 px-4">
                    <p className="text-blue-100/90 text-xs md:text-sm leading-relaxed font-normal">
                        "Catalyzers is one of the best IIT JEE and NEET coaching institutes in Kota. The comprehensive study material and well-structured teaching approach helped me build a strong conceptual foundation in all subjects. The regular tests and mock exams prepared me thoroughly for the competitive exams and also helped me develop discipline and consistency in my studies. The faculty at Catalyzers is highly dedicated and supportive, always available to clear doubts and provide guidance whenever needed. Choosing Catalyzers in Kota for my IIT JEE/NEET preparation was one of the best decisions I made. The experienced teachers and their personalized teaching methods helped me improve my performance significantly. My confidence increased with continuous practice and evaluations, and my exam results reflect the effectiveness of the study material and test series. I would highly recommend Catalyzers to students aiming to crack IIT JEE or NEET."
                    </p>
                </div>
            </div>
        </section>
    );
}
