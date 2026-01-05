"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

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
                        alt="Catalyzer Collage"
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

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight" style={{ color: '#FFFFFF' }}>
                                You can study anywhere.<br />
                                But <span style={{ color: '#B2A9FF' }}>understanding</span> starts here
                            </h1>
                            <p className="text-base md:text-lg font-normal max-w-3xl mx-auto leading-relaxed text-gray-200">
                                Catalyzers was created for students who are already studying in big coaching institutes but feel confused, left behind, or hesitant to ask doubts.
                                <br /><br />
                                In large classrooms, it’s easy for some students to struggle silently — not because they are weak, but because they need personal attention and clearer explanations.
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

            {/* Vision Section - PW Style */}
            <section className="relative py-16 md:py-24 overflow-hidden bg-[#FEF9F5]">
                {/* Side Star Decoration (Absolute Left) */}
                <div className="absolute top-10 left-[-20px] md:left-10 w-24 h-24 md:w-32 md:h-32 pointer-events-none opacity-80">
                    <Image
                        src="/assets/background/vision-star.png"
                        alt="Decoration"
                        fill
                        className="object-contain"
                    />
                </div>

                {/* Background Cross Pattern (Subtle) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                </div>

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                        {/* Text Content */}
                        <div className="space-y-8 pl-4 md:pl-0">
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 border-l-4 border-[#F3C74C] pl-6">
                                Our Vision
                            </h2>

                            <div className="space-y-6">
                                {/* Point 1 */}
                                <div className="flex items-start gap-4">
                                    <div className="mt-1.5 flex-shrink-0 text-[#F3C74C]">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-lg text-gray-700 leading-relaxed font-medium">
                                        To democratize education at scale in India.
                                    </p>
                                </div>

                                {/* Point 2 */}
                                <div className="flex items-start gap-4">
                                    <div className="mt-1.5 flex-shrink-0 text-[#F3C74C]">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-lg text-gray-700 leading-relaxed font-medium">
                                        To ensure every child has access to quality education at the most affordable costs.
                                    </p>
                                </div>

                                {/* Point 3 */}
                                <div className="flex items-start gap-4">
                                    <div className="mt-1.5 flex-shrink-0 text-[#F3C74C]">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-lg text-gray-700 leading-relaxed font-medium">
                                        To allow every child to realize his/her dream, live up to their true potential and be their lifelong learning partner.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Images (Hexagon Cluster) */}
                        <div className="relative h-[480px] w-full flex justify-center items-center mt-8 lg:mt-0">
                            <style jsx>{`
                                .clip-hexagon {
                                    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
                                }
                            `}</style>

                            {/* Container: 520px width = 250px + 20px gap + 250px. Height adjusted for gap. */}
                            <div className="relative w-[520px] h-[400px] scale-[0.6] sm:scale-[0.8] md:scale-100 origin-center">
                                {/* Top Left Hexagon - (kids1.png) */}
                                <div className="absolute top-0 left-0 w-[250px] h-[216px] clip-hexagon transition-transform hover:z-20 hover:scale-105 duration-300 shadow-xl overflow-hidden bg-gray-200">
                                    <Image
                                        src="/assets/hexagon/kids1.png"
                                        alt="Vision Student"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Top Right Hexagon - (kids2.png) */}
                                <div className="absolute top-0 right-0 w-[250px] h-[216px] clip-hexagon transition-transform hover:z-20 hover:scale-105 duration-300 shadow-xl overflow-hidden bg-gray-200">
                                    <Image
                                        src="/assets/hexagon/kids2.png"
                                        alt="Vision Group"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Bottom Middle Hexagon - (all3.png) - Top offset 182px (162px nesting + 20px gap) */}
                                <div className="absolute top-[182px] left-1/2 -translate-x-1/2 w-[250px] h-[216px] clip-hexagon z-10 hover:scale-105 transition-transform duration-300 shadow-xl overflow-hidden bg-[#5A4BDA]">
                                    <Image
                                        src="/assets/hexagon/all3.png"
                                        alt="Vision Center"
                                        fill
                                        className="object-cover scale-75 origin-bottom"
                                    />
                                </div>
                            </div>

                            {/* Decorative Star Bottom Right */}
                            <div className="absolute bottom-[-20px] right-[10%] w-20 h-20 opacity-80 pointer-events-none">
                                <Image src="/assets/background/vision-star.png" alt="Star" fill className="object-contain" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Founders Section */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <div className="container px-4 md:px-6">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16">
                        Meet Our Founders
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Founder 1 - Adil Sir */}
                        <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700 hover:border-primary transition-all duration-300">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-primary">
                                    <Image
                                        src="/assets/teachers/adilsir.png"
                                        alt="Adil Sir"
                                        width={128}
                                        height={128}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Adil Sir</h3>
                                <p className="text-primary font-semibold mb-4">Founder & Physics Faculty</p>
                                <p className="text-gray-300 leading-relaxed mb-6 italic">
                                    &quot;My aim is to democratize education and make quality learning accessible to every student in India. Education should empower, not exclude.&quot;
                                </p>
                                <a href="/teachers/adil-sir">
                                    <button className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105">
                                        Read More
                                    </button>
                                </a>
                            </div>
                        </div>

                        {/* Founder 2 - Placeholder */}
                        <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700 hover:border-primary transition-all duration-300">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-primary bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                    <span className="text-5xl font-bold text-white">K</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Kirti Ma&apos;am</h3>
                                <p className="text-primary font-semibold mb-4">Co-Founder & Chemistry Faculty</p>
                                <p className="text-gray-300 leading-relaxed mb-6 italic">
                                    &quot;Quality education combined with personalized mentorship is the key to unlocking every student&apos;s potential. We&apos;re here to guide them every step of the way.&quot;
                                </p>
                                <a href="/teachers/kirti-maam">
                                    <button className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105">
                                        Read More
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary-dark text-white">
                <div className="container px-4 md:px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">5M+</div>
                            <div className="text-sm md:text-base text-purple-200">Happy Students</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">10K+</div>
                            <div className="text-sm md:text-base text-purple-200">Mock Tests</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">8.5M+</div>
                            <div className="text-sm md:text-base text-purple-200">YouTube Subscribers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">500+</div>
                            <div className="text-sm md:text-base text-purple-200">Expert Faculty</div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
