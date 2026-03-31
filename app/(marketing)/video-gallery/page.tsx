"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PlayCircle } from "lucide-react";

const VIDEOS = [
    {
        id: "TBFlmdGw6fk",
        title: "Welcome to Catalyzers Institute | Introduction",
        description: "Discover how Catalyzers Institute is redefining JEE and NEET coaching in Kota. Learn about our expert faculty, personalized doubt-solving ecosystem, and why thousands of students trust us.",
        badge: "Introduction"
    },
    {
        id: "ozjBcZTkYAk",
        title: "JEE Mains Topper (99.95%ile) | Success Story",
        description: "Hear directly from Rudra Gupta, our JEE Mains topper, about his preparation strategy, daily routine, and how Catalyzers helped him achieve this incredible milestone.",
        badge: "Success Story"
    },
    {
        id: "EHDDH_6mwF4",
        title: "Journey to BITS Pilani | Student Experience",
        description: "Bhaviya Agrawal shares her inspiring journey to cracking BITSAT. Learn about the exact study materials and mock tests that made the difference in her preparation.",
        badge: "Student Experience"
    }
];

export default function VideoGalleryPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
            <Header />

            <main className="flex-1 pt-32 pb-24">
                <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                    
                    {/* Header */}
                    <div className="text-center mb-16 md:mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-sm mb-6 shadow-sm">
                            <PlayCircle className="w-4 h-4" /> Official Media
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 tracking-tight mb-6">
                            Video <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Gallery</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                            Explore our introduction, success stories, and student experiences directly from Kota.
                        </p>
                    </div>

                    {/* Featured Video (First one) */}
                    <div className="mb-12 md:mb-20">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center bg-white rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 shadow-xl shadow-indigo-900/5 border border-slate-100 relative overflow-hidden">
                            {/* Abstract decorative blur */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                            
                            <div className="lg:col-span-2 relative aspect-video rounded-[1.5rem] overflow-hidden bg-slate-900 shadow-2xl z-10 border border-slate-200/50 group">
                                <div className="absolute inset-0 bg-indigo-500/10 blur-[50px] pointer-events-none z-0" />
                                <iframe 
                                    src={`https://www.youtube.com/embed/${VIDEOS[0].id}?autoplay=0&rel=0`}
                                    title={VIDEOS[0].title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full z-10"
                                ></iframe>
                            </div>
                            <div className="lg:col-span-1 flex flex-col justify-center gap-6 p-4 md:p-6 z-10">
                                <div className="inline-block bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-full text-xs self-start uppercase tracking-wider">
                                    {VIDEOS[0].badge}
                                </div>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                                    {VIDEOS[0].title}
                                </h2>
                                <p className="text-slate-600 leading-relaxed text-lg font-medium">
                                    {VIDEOS[0].description}
                                </p>
                                <a 
                                    href="/contact" 
                                    className="mt-2 inline-flex items-center justify-center w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                                >
                                    Book a Free Demo
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Videos Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                        {VIDEOS.slice(1).map((video) => (
                            <div key={video.id} className="bg-white rounded-[2rem] p-4 md:p-5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col hover:border-blue-200 hover:shadow-blue-500/10 transition-all duration-300 group hover:-translate-y-1">
                                <div className="relative w-full aspect-video rounded-[1.5rem] overflow-hidden bg-slate-900 mb-6 border border-slate-100 shadow-inner">
                                    <iframe 
                                        src={`https://www.youtube.com/embed/${video.id}?autoplay=0&rel=0`}
                                        title={video.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                        className="absolute inset-0 w-full h-full"
                                    ></iframe>
                                </div>
                                <div className="px-4 pb-4 flex flex-col flex-1">
                                    <div className="inline-block bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-full text-xs self-start uppercase tracking-wider mb-4">
                                        {video.badge}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-3 group-hover:text-blue-600 transition-colors">
                                        {video.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {video.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
