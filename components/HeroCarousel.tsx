"use client";

import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

export default function HeroCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 5000, stopOnInteraction: false }),
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollTo = useCallback(
        (index: number) => emblaApi && emblaApi.scrollTo(index),
        [emblaApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, onSelect]);

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <div className="embla" ref={emblaRef}>
                <div className="embla__container flex">
                    {/* Slide 1 - Main Hero */}
                    <div className="embla__slide flex-[0_0_100%] min-w-0">
                        <div className="container px-4 md:px-6 py-16 md:py-24">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6 animate-fade-in">
                                    {/* Speech Bubble */}
                                    <div className="inline-block bg-white rounded-2xl p-6 shadow-lg max-w-md">
                                        <p className="text-sm font-semibold text-primary mb-2">
                                            Meet Adil Sir
                                        </p>
                                        <p className="text-gray-700">
                                            With 14 years of teaching experience, helping thousands of students achieve their NEET & JEE dreams
                                        </p>
                                    </div>

                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                        India&apos;s Trusted &{" "}
                                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                            Affordable
                                        </span>{" "}
                                        Educational Platform
                                    </h1>

                                    <p className="text-lg text-gray-600 max-w-xl">
                                        Empowering India&apos;s future leaders with
                                        quality education at affordable prices
                                    </p>

                                    <a href="/courses">
                                        <Button size="lg" className="text-lg px-8">
                                            Enroll Now
                                        </Button>
                                    </a>
                                </div>

                                {/* Teacher Photo - Adil Sir */}
                                <div className="flex justify-center lg:justify-end">
                                    <div className="relative">
                                        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-2xl overflow-hidden">
                                            <Image
                                                src="/assets/teachers/adil.png"
                                                alt="Adil Sir - 14 years teaching experience"
                                                width={320}
                                                height={320}
                                                className="w-full h-full object-contain scale-110"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Slide 2 - Mission 100 (Formerly Slide 3) */}
                    <div className="embla__slide flex-[0_0_100%] min-w-0">
                        <div className="container px-4 md:px-6 py-16 md:py-24">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6 animate-fade-in">
                                    {/* Speech Bubble */}
                                    <div className="inline-block bg-white rounded-2xl p-6 shadow-lg max-w-md">
                                        <p className="text-sm font-semibold text-primary mb-2">
                                            Meet Kirti Ma&apos;am
                                        </p>
                                        <p className="text-gray-700">
                                            Expert Chemistry faculty with years of experience helping students achieve their NEET & JEE goals
                                        </p>
                                    </div>

                                    {/* Mission 100 Pill */}
                                    <div className="inline-block bg-primary text-white px-6 py-2 rounded-full font-semibold text-sm">
                                        Mission 100
                                    </div>

                                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold">
                                        NEET & JEE{" "}
                                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                            2026
                                        </span>{" "}
                                        Preparation
                                    </h2>
                                    <p className="text-xl text-gray-600 max-w-2xl">
                                        Join our intensive program for guaranteed success
                                    </p>
                                    <a href="/courses">
                                        <Button size="lg" className="text-lg px-8">
                                            Enroll Now
                                        </Button>
                                    </a>
                                </div>

                                {/* Teacher Photo - Kirti Ma'am */}
                                <div className="flex justify-center lg:justify-end">
                                    <div className="relative">
                                        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-2xl overflow-hidden">
                                            <Image
                                                src="/assets/teachers/kirti_updated.png"
                                                alt="Kirti Ma'am"
                                                width={320}
                                                height={320}
                                                className="w-full h-full object-contain scale-110"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Slide 3 - Year End Sale (Formerly Slide 2) */}
                    <div className="embla__slide flex-[0_0_100%] min-w-0">
                        <div className="container px-4 md:px-6 py-16 md:py-24">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6 animate-fade-in pb-12">
                                    {/* Speech Bubble */}
                                    <div className="inline-block bg-white rounded-2xl p-6 shadow-lg max-w-md">
                                        <p className="text-sm font-semibold text-primary mb-2">
                                            Meet Mayank Sir
                                        </p>
                                        <p className="text-gray-700">
                                            Expert Chemistry faculty helping students excel in NEET & JEE with simplified concepts
                                        </p>
                                    </div>

                                    {/* Year End Sale Pill */}
                                    <div className="inline-block bg-secondary text-white px-6 py-2 rounded-full font-semibold text-sm">
                                        Year End Sale
                                    </div>

                                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold">
                                        Get Up to<br />
                                        <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                                            15% OFF
                                        </span>
                                    </h2>
                                    <p className="text-xl text-gray-600 max-w-2xl">
                                        On all courses for JEE & NEET
                                    </p>
                                    <a href="/courses">
                                        <Button size="lg" variant="secondary" className="text-lg px-8">
                                            Enroll Now
                                        </Button>
                                    </a>
                                </div>

                                {/* Teacher Photo - Mayank Sir */}
                                <div className="flex justify-center lg:justify-end">
                                    <div className="relative">
                                        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-2xl overflow-hidden">
                                            <Image
                                                src="/assets/teachers/mayank.png"
                                                alt="Mayank Sir"
                                                width={320}
                                                height={320}
                                                className="w-full h-full object-contain scale-110"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Carousel Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {[0, 1, 2].map((index) => (
                    <button
                        key={index}
                        className={`h-2 rounded-full transition-all duration-300 ${index === selectedIndex
                            ? "w-8 bg-primary"
                            : "w-2 bg-gray-300 hover:bg-gray-400"
                            }`}
                        onClick={() => scrollTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
