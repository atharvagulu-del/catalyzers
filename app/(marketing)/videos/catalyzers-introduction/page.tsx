"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PlayCircle, Share2, Award, Users } from "lucide-react";

export default function VideoWatchPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
            <Header />

            <main className="flex-1 pt-24 pb-20">
                <div className="container px-4 md:px-6 max-w-6xl mx-auto">
                    
                    {/* Breadcrumbs / Page Context */}
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-6 mt-4">
                        <a href="/" className="hover:text-indigo-600 transition-colors">Home</a>
                        <span>/</span>
                        <a href="/videos" className="hover:text-indigo-600 transition-colors">Videos</a>
                        <span>/</span>
                        <span className="text-slate-800">Catalyzers Introduction</span>
                    </div>

                    {/* Main Video Hero Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        
                        {/* Primary Video Player Column (Takes 2/3 width on large screens) */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            
                            {/* Cinematic Video Wrapper */}
                            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-200/50 group">
                                <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] pointer-events-none" />
                                <iframe 
                                    src="https://www.youtube.com/embed/TBFImdGw6fk?autoplay=0&rel=0&modestbranding=1" 
                                    title="Welcome to Catalyzers Institute"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full z-10"
                                ></iframe>
                            </div>

                            {/* Video Info Section */}
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                                    Welcome to Catalyzers Institute | Your Journey Starts Here
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium mb-6 pb-6 border-b border-slate-100">
                                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">Introduction</span>
                                    <span className="flex items-center gap-1.5"><PlayCircle className="w-4 h-4" /> Official Video</span>
                                </div>
                                
                                <h3 className="text-lg font-bold text-slate-800 mb-2">About This Video</h3>
                                <p className="text-slate-600 leading-relaxed max-w-3xl">
                                    Discover how Catalyzers Institute is redefining JEE and NEET coaching in Kota. Learn about our expert faculty, personalized doubt-solving ecosystem, and why thousands of students trust us to help them achieve their engineering and medical dreams. We believe in providing absolutely premium education that remains highly accessible to every dedicated student.
                                </p>
                            </div>

                        </div>

                        {/* Sidebar Information (Takes 1/3 width on large screens) */}
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            
                            {/* CTA Card */}
                            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
                                <h3 className="text-xl font-bold mb-3 z-10 relative">Ready to Join?</h3>
                                <p className="text-indigo-200 text-sm leading-relaxed mb-6 z-10 relative">
                                    Enroll in our upcoming batches for JEE or NEET and take the first step towards your dream college.
                                </p>
                                <a 
                                    href="/contact" 
                                    className="block w-full text-center py-3.5 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all z-10 relative"
                                >
                                    Book a Free Demo
                                </a>
                            </div>

                            {/* Features Highlights */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    Why Choose Us?
                                </h3>
                                <ul className="space-y-5">
                                    <li className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                            <Award className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-900">Proven Results</h4>
                                            <p className="text-xs text-slate-500 mt-1">Consistent top ranks in JEE and NEET.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-900">Expert Mentorship</h4>
                                            <p className="text-xs text-slate-500 mt-1">Guidance from Kota's most trusted educators.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
