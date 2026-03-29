"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Zap, ChevronDown, CheckCircle2 } from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

// Animated Counter component
const AnimatedCounter = ({ from = 0, to, duration = 2 }: { from?: number, to: number, duration?: number }) => {
    const nodeRef = useRef<HTMLSpanElement>(null);
    const inView = useInView(nodeRef, { once: true, margin: "-50px" });

    useEffect(() => {
        if (!inView) return;

        const node = nodeRef.current;
        if (!node) return;

        let startValue = from;
        const endValue = to;
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round((duration * 1000) / frameDuration);
        let frame = 0;

        const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            // Easing function (easeOutQuart)
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.round(startValue + (endValue - startValue) * easeProgress);

            if (node) node.textContent = currentCount.toLocaleString();

            if (frame === totalFrames) {
                clearInterval(counter);
            }
        }, frameDuration);

        return () => clearInterval(counter);
    }, [from, to, duration, inView]);

    return <span ref={nodeRef}>{from}</span>;
};

export default function AboutPage() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Calculate transform values based on scroll
    const maxScroll = 400;
    const scrollProgress = Math.min(scrollY / maxScroll, 1);

    // Scale from 1 to 0.95
    const scale = 1 - scrollProgress * 0.05;
    const borderRadius = Math.min(scrollProgress * 400, 40); // PW uses 40px border-radius

    return (
        <div className="min-h-screen bg-white">
            {/* Global CSS Override for Header */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .about-page-wrapper header {
                    background-color: transparent !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    border-bottom: none !important;
                }
                
                /* White text when transparent (on collage) */
                .about-page-wrapper.transparent header a,
                .about-page-wrapper.transparent header span {
                    color: white !important;
                }
                
                /* Keep logo gradient visible on white */
                .about-page-wrapper.transparent header span {
                    background: white !important;
                    -webkit-background-clip: text !important;
                    background-clip: text !important;
                    -webkit-text-fill-color: transparent !important;
                }
                
                /* Button stays purple with white text */
                .about-page-wrapper header button {
                    background-color: rgb(107, 70, 193) !important;
                    color: white !important;
                }
            `}} />

            {/* Header Wrapper - Transparent initially, solid white on scroll */}
            <div
                className={`about-page-wrapper ${scrollProgress <= 0.1 ? 'transparent' : ''} fixed top-0 left-0 right-0 z-50 transition-all duration-1000`}
                style={{
                    backgroundColor: scrollProgress > 0.1 ? 'rgb(255, 255, 255)' : 'transparent',
                    boxShadow: scrollProgress > 0.1 ? '0 2px 10px rgba(0,0,0,0.1)' : 'none'
                }}
            >
                <Header />
            </div>

            {/* Hero Section with Collage */}
            <div className="relative h-screen overflow-hidden">
                <div
                    className="absolute inset-0 transition-all duration-700 ease-out"
                    style={{
                        transform: `scale(${scale})`,
                        borderRadius: `${borderRadius}px`,
                        margin: `${scrollProgress * 20}px`,
                        overflow: 'hidden'
                    }}
                >
                    <Image
                        src="/assets/background/collage.png"
                        alt="Catalyzers Collage"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* PW-style Dark Overlay - Gradient for dimmer effect */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.76), rgba(0, 0, 0, 0.84))' }} />

                    {/* Hero Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 pt-20">
                        <div className="max-w-5xl">
                            {/* ABOUT CATALYZER Tag */}
                            <div className="inline-block bg-white text-gray-800 px-4 py-1 rounded-full text-sm font-medium mb-6">
                                ABOUT CATALYZER
                            </div>

                            <h1 className="text-2xl md:text-6xl font-bold mb-6 md:mb-8 leading-tight" style={{ color: '#FFFFFF' }}>
                                You can study anywhere.<br />
                                But <span style={{ color: '#B2A9FF' }}>understanding</span> starts here
                            </h1>
                            <p className="text-sm md:text-lg font-normal max-w-3xl mx-auto leading-relaxed text-gray-200">
                                Catalyzers was created for students who are already studying in big coaching institutes but feel confused, left behind, or hesitant to ask doubts.
                                <br /><br />
                                In large classrooms, it&apos;s easy for some students to struggle silently — not because they are weak, but because they need personal attention and clearer explanations.
                                <br /><br />
                                At Catalyzers, we work alongside your main coaching institute to help you truly understand concepts, clear doubts without hesitation, and regain confidence in your preparation for JEE and NEET.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission Section - PW Style (Compact) */}
            <section className="relative py-12 md:py-16 overflow-hidden">
                {/* Background Image & Color */}
                <div className="absolute inset-0 z-0 bg-[#0D1366]">
                    <Image
                        src="/assets/background/mission-bg-v2.png"
                        alt="Background"
                        fill
                        className="object-cover opacity-90"
                    />
                </div>

                <div className="container relative z-10 px-4 md:px-6">
                    <h2 className="text-3xl font-bold text-center mb-10 text-white">
                        Our Mission
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {/* Card 1: Equity */}
                        <div className="relative group h-full">
                            {/* Accent Background (Green) */}
                            <div className="absolute -bottom-1.5 -right-1.5 w-full h-full bg-[#00A75D] rounded-xl transform transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"></div>
                            {/* Main Card */}
                            <div className="relative bg-white rounded-xl p-6 h-full flex flex-col justify-center border border-gray-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-[#FFE5E3] flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl">🤝</span>
                                    </div>
                                    <p className="text-base font-medium text-gray-800 pt-1 leading-snug">
                                        To aim for <span className="text-[#5A4BDA] font-bold">Equity and inclusivity</span> in Education
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Reach */}
                        <div className="relative group h-full">
                            {/* Accent Background (Yellow) */}
                            <div className="absolute -bottom-1.5 -right-1.5 w-full h-full bg-[#F3C74C] rounded-xl transform transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"></div>
                            {/* Main Card */}
                            <div className="relative bg-white rounded-xl p-6 h-full flex flex-col justify-center border border-gray-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-[#E3F2FF] flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl">🌐</span>
                                    </div>
                                    <p className="text-base font-medium text-gray-800 pt-1 leading-snug">
                                        To reach <span className="text-[#5A4BDA] font-bold">learners</span> in every corner of the country
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Sustainability */}
                        <div className="relative group h-full">
                            {/* Accent Background (Red/Pink) */}
                            <div className="absolute -bottom-1.5 -right-1.5 w-full h-full bg-[#E9435E] rounded-xl transform transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"></div>
                            {/* Main Card */}
                            <div className="relative bg-white rounded-xl p-6 h-full flex flex-col justify-center border border-gray-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-[#E5F7F1] flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl">🏢</span>
                                    </div>
                                    <p className="text-base font-medium text-gray-800 pt-1 leading-snug">
                                        To build a <span className="text-[#5A4BDA] font-bold">business sustainability</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="relative py-20 overflow-hidden bg-slate-50">
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
                        {/* Text Content */}
                        <div className="space-y-8 pl-4 md:pl-0">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1E293B] tracking-tight">
                                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5A4BDA] to-[#7B61FF]">Vision</span>
                            </h2>

                            <div className="space-y-6 pt-4">
                                {/* Point 1 */}
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0 w-7 h-7 rounded-full bg-[#EEEDFA] flex items-center justify-center shadow-sm">
                                        <Zap className="w-4 h-4 text-[#5A4BDA] fill-[#5A4BDA]" />
                                    </div>
                                    <p className="text-lg md:text-xl text-[#475569] leading-relaxed font-medium">
                                        To democratize education at scale in India.
                                    </p>
                                </div>

                                {/* Point 2 */}
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0 w-7 h-7 rounded-full bg-[#EEEDFA] flex items-center justify-center shadow-sm">
                                        <Zap className="w-4 h-4 text-[#5A4BDA] fill-[#5A4BDA]" />
                                    </div>
                                    <p className="text-lg md:text-xl text-[#475569] leading-relaxed font-medium">
                                        To ensure every child has access to quality education at the most affordable costs.
                                    </p>
                                </div>

                                {/* Point 3 */}
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0 w-7 h-7 rounded-full bg-[#EEEDFA] flex items-center justify-center shadow-sm">
                                        <Zap className="w-4 h-4 text-[#5A4BDA] fill-[#5A4BDA]" />
                                    </div>
                                    <p className="text-lg md:text-xl text-[#475569] leading-relaxed font-medium">
                                        To allow every child to realize their dream, live up to their true potential and be their lifelong learning partner.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Image Content */}
                        <div className="relative">
                            <div className="relative bg-[#F4F5FB] rounded-[2rem] md:rounded-[3rem] pt-8 px-4 overflow-hidden shadow-sm border border-slate-100 flex items-end justify-center min-h-[350px]">
                                <Image
                                    src="/assets/illustrations/catalyzers_hero.png"
                                    alt="Catalyzers Founders"
                                    width={600}
                                    height={400}
                                    className="w-[90%] md:w-full h-auto object-contain drop-shadow-xl translate-y-4"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Founders Section - Ultra Premium Alternating Layout (Compact) */}
            <section className="relative py-20 md:py-28 bg-white overflow-hidden">
                {/* Abstract light beam background */}
                <div className="absolute top-[10%] left-0 w-full h-[300px] bg-gradient-to-br from-indigo-50/40 via-blue-50/20 to-purple-50/40 transform -skew-y-6 pointer-events-none" />

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="text-center mb-16 md:mb-24">
                        <div className="inline-block bg-slate-50 border border-slate-100/60 shadow-sm text-slate-800 px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold mb-4 tracking-wide uppercase">
                            Visionary Leadership
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
                            Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5A4BDA] to-blue-500">Founders</span>
                        </h2>
                    </div>

                    <div className="max-w-5xl mx-auto space-y-16 md:space-y-24">
                        {/* Founder 1 - Adil Sir (Image Left, Text Right) */}
                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
                            {/* Image Container */}
                            <div className="w-full md:w-[45%] lg:w-[40%] relative">
                                {/* Animated colorful aura */}
                                <div className="absolute -inset-4 md:-inset-6 bg-gradient-to-tr from-[#5A4BDA] to-blue-400 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-700" />

                                <div className="relative aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden border border-white/60 shadow-[0_15px_40px_-10px_rgba(90,75,218,0.15)]">
                                    <Image
                                        src="/assets/teachers/adilsir.png"
                                        alt="Adil Sir"
                                        fill
                                        className="object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out"
                                    />
                                    {/* Glass reflection overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-white/5 to-white/20 pointer-events-none" />
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="w-full md:w-[55%] lg:w-[60%] space-y-6">
                                <div>
                                    <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Adil Sir</h3>
                                    <p className="text-base text-[#5A4BDA] font-bold tracking-widest uppercase flex items-center gap-3">
                                        <span className="w-6 h-[2px] bg-[#5A4BDA]"></span>
                                        Founder & Physics Faculty
                                    </p>
                                </div>

                                <div className="relative">
                                    <span className="absolute -top-8 -left-4 md:-left-6 text-6xl text-slate-200/50 font-serif leading-none select-none pointer-events-none">"</span>
                                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed italic relative z-10 font-medium pb-2">
                                        My aim is to democratize education and make quality learning accessible to every student in India. Education should empower, not exclude.
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <a href="/teachers/adil-sir" className="inline-flex items-center justify-center px-6 py-3 text-sm md:text-base rounded-full bg-slate-900 text-white font-semibold hover:bg-[#5A4BDA] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                        Discover Adil Sir's Profile
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Founder 2 - Kirti Ma'am (Text Left, Image Right) */}
                        <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16 group">
                            {/* Text Content */}
                            <div className="w-full md:w-[55%] lg:w-[60%] space-y-6 md:text-right flex flex-col items-start md:items-end">
                                <div className="w-full">
                                    <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Kirti Ma&apos;am</h3>
                                    <p className="text-base text-blue-500 font-bold tracking-widest uppercase flex items-center md:justify-end gap-3">
                                        Co-Founder & Chemistry Faculty
                                        <span className="w-6 h-[2px] bg-blue-500 hidden md:block"></span>
                                    </p>
                                </div>

                                <div className="relative text-left md:text-right">
                                    <span className="absolute -top-8 -left-4 md:left-auto md:-right-6 text-6xl text-slate-200/50 font-serif leading-none select-none pointer-events-none">"</span>
                                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed italic relative z-10 font-medium pb-2">
                                        Quality education combined with personalized mentorship is the key to unlocking every student&apos;s potential. We&apos;re here to guide them every step of the way.
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <a href="/teachers/kirti-maam" className="inline-flex items-center justify-center px-6 py-3 text-sm md:text-base rounded-full bg-slate-900 text-white font-semibold hover:bg-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                        Discover Kirti Ma&apos;am's Profile
                                    </a>
                                </div>
                            </div>

                            {/* Image Container */}
                            <div className="w-full md:w-[45%] lg:w-[40%] relative">
                                {/* Animated colorful aura */}
                                <div className="absolute -inset-4 md:-inset-6 bg-gradient-to-tl from-cyan-400 to-blue-500 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-700" />

                                <div className="relative aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden border border-white/60 shadow-[0_15px_40px_-10px_rgba(59,130,246,0.15)]">
                                    <Image
                                        src="/assets/teachers/kirti_updated.png"
                                        alt="Kirti Ma'am"
                                        fill
                                        className="object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out"
                                    />
                                    {/* Glass reflection overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-tl from-black/10 via-white/5 to-white/20 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Catalyzers Section */}
            <section className="relative py-16 md:py-24 overflow-hidden bg-white">
                {/* Star Background Pattern */}
                <div className="absolute inset-0 opacity-40 pointer-events-none">
                    <Image
                        src="/assets/background/star-pattern-white.png"
                        alt="Background Pattern"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="container px-4 md:px-6 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-gray-900">
                        Why <span className="text-primary">CATALYZERS</span> is the <span className="text-[#F3C74C]">Best Choice for You</span>:
                    </h2>

                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Point 1 */}
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold text-[#00A3FF] mb-2">Top-Rated Faculty Team:</h3>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Learn from experienced educators and subject experts, including renowned mentors like Adil Sir, Kirti Ma&apos;am and Mayank Sir who bring deep insight and effective strategies for cracking competitive exams.
                            </p>
                        </div>

                        {/* Point 2 */}
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold text-[#00A3FF] mb-2">Comprehensive Courses:</h3>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Tailor-made programs for JEE, NEET, and Boards that cover the complete syllabus with equal emphasis on theory, application, and revision.
                            </p>
                        </div>

                        {/* Point 3 */}
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold text-[#00A3FF] mb-2">Result-Oriented Approach:</h3>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Structured study plans, regular tests, performance analysis, and personalized mentoring to track and boost student performance.
                            </p>
                        </div>

                        {/* Point 4 */}
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold text-[#00A3FF] mb-2">Modern Learning Environment:</h3>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Smart classrooms, doubt-solving zones, and access to high-quality study material, practice sheets, and mock tests.
                            </p>
                        </div>

                        {/* Point 5 */}
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold text-[#00A3FF] mb-2">Proven Track Record:</h3>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Hundreds of selections every year in IITs, NITs, AIIMS, BITS and other top institutions. Consistent top rankers in boards and competitive exams.
                            </p>
                        </div>

                        {/* Closing Paragraph */}
                        <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-lg text-gray-800 font-medium italic text-center leading-relaxed">
                                &quot;At Catalyzers, we believe in igniting potential and fueling ambition. Whether your goal is to become an engineer, doctor, or a board topper, we provide the guidance, discipline, and support needed to reach the pinnacle of success.&quot;
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modern Stats Section (Floating Glassmorphism) */}
            <section className="relative py-24 bg-[#F8FAFC] overflow-hidden">
                {/* Decorative background blur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] rounded-[3rem] p-10 md:p-14 max-w-6xl mx-auto">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 divide-x divide-slate-100/50">
                            <div className="text-center px-4">
                                <div className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#5A4BDA] to-[#3B82F6] mb-3 font-mono tracking-tight">
                                    <AnimatedCounter to={20000} />+
                                </div>
                                <div className="text-sm md:text-base font-semibold text-slate-500 uppercase tracking-widest">Happy Students</div>
                            </div>
                            <div className="text-center px-4">
                                <div className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#5A4BDA] to-[#3B82F6] mb-3 font-mono tracking-tight">
                                    <AnimatedCounter to={1000} />+
                                </div>
                                <div className="text-sm md:text-base font-semibold text-slate-500 uppercase tracking-widest">Mock Tests</div>
                            </div>
                            <div className="text-center px-4">
                                <div className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#5A4BDA] to-[#3B82F6] mb-3 font-mono tracking-tight">
                                    <AnimatedCounter to={4000} />+
                                </div>
                                <div className="text-sm md:text-base font-semibold text-slate-500 uppercase tracking-widest">YouTube Subs</div>
                            </div>
                            <div className="text-center px-4">
                                <div className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#5A4BDA] to-[#3B82F6] mb-3 font-mono tracking-tight">
                                    <AnimatedCounter to={15} />+
                                </div>
                                <div className="text-sm md:text-base font-semibold text-slate-500 uppercase tracking-widest">Expert Faculty</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium FAQ Section */}
            <section className="py-20 md:py-32 bg-white relative">
                <div className="absolute left-0 top-0 w-1/3 h-full bg-slate-50/50 skew-x-12 -translate-x-10 pointer-events-none" />

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <div className="inline-block bg-[#EEEDFA] text-[#5A4BDA] px-4 py-1.5 rounded-full text-sm font-semibold mb-6 tracking-wide uppercase">
                            Got Questions?
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5A4BDA] to-blue-500">Questions</span>
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {[
                                {
                                    q: "What makes Catalyzers different from other coaching institutes?",
                                    a: "We act as a supplementary bridge to your primary coaching. We focus heavily on resolving doubts, strengthening fundamental concepts, and providing personalized attention that large classroom batches often miss."
                                },
                                {
                                    q: "Do you only teach JEE and NEET students?",
                                    a: "While our core focus is engineering and medical entrance exams, we also provide rigorous foundation courses and board exam preparation to ensure holistic academic excellence."
                                },
                                {
                                    q: "How does the doubt-solving system work?",
                                    a: "We hold dedicated doubt-clearing sessions where students can directly interact with senior faculty. You won't just get the answer; you'll understand the methodology behind it."
                                },
                                {
                                    q: "Are the mock tests aligned with the latest exam patterns?",
                                    a: "Absolutely. Our academic team constantly updates the test series to strictly reflect the latest syllabus, difficulty level, and patterns of JEE Main, Advanced, and NEET."
                                },
                                {
                                    q: "Can I join online, or is it offline only?",
                                    a: "We offer flexible learning modes. You can join our comprehensive online programs from anywhere in India, or visit our physical smart classrooms if you prefer an in-person environment."
                                }
                            ].map((faq, i) => (
                                <AccordionItem key={i} value={`item-${i}`} className="border border-slate-200 bg-white rounded-2xl px-6 py-2 hover:border-indigo-200 transition-colors shadow-sm">
                                    <AccordionTrigger className="text-left text-lg font-semibold text-slate-800 hover:text-[#5A4BDA] hover:no-underline [&[data-state=open]>div>svg]:rotate-180">
                                        <div className="flex w-full items-center justify-between gap-4">
                                            <span>{faq.q}</span>
                                            <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform duration-200">
                                                <ChevronDown className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-600 leading-relaxed text-base pt-2 pb-4 pr-12">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>


            <Footer />
        </div>
    );
}
