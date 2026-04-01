"use client";

import { useEffect } from "react";
import { MapPin, Phone, Mail, Award, BookOpen, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cal, { getCalApi } from "@calcom/embed-react";

export default function ContactPage() {
    useEffect(() => {
        (async function () {
            const cal = await getCalApi();
            cal("ui", {
                theme: "light",
                styles: { branding: { brandColor: "#4f46e5" } },
                hideEventTypeDetails: false,
                layout: "month_view"
            });
        })();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500/30">
            <Header />

            {/* Professional Hero Section */}
            <section className="relative pt-24 pb-16 md:pt-36 md:pb-24 bg-indigo-950 border-b border-slate-200 overflow-hidden text-center text-white">
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                        backgroundSize: '32px 32px'
                    }}
                />
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <span className="inline-block py-1.5 px-5 rounded-full bg-white/10 mt-6 backdrop-blur-sm border border-white/20 text-indigo-100 font-bold text-xs tracking-widest uppercase shadow-sm">
                            Reach Out
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                            Start Your Journey Today
                        </h1>
                        <p className="text-lg md:text-xl text-indigo-200 max-w-2xl mx-auto leading-relaxed font-medium">
                            Whether you need academic counseling, admissions support, or just have questions about our coaching batches, we are always here to help.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="py-16 md:py-24">
                <div className="container px-4 md:px-6 max-w-7xl mx-auto space-y-24">
                    
                    {/* Top Row: Info Cards + Map & Details */}
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                        
                        {/* Left: Contact Info Grid */}
                        <div className="grid sm:grid-cols-2 gap-6 w-full">
                            {/* Phone Card */}
                            <div className="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10">
                                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <h4 className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">Call Us Directly</h4>
                                <p className="text-2xl font-bold text-slate-800">077379 76414</p>
                                <p className="text-sm font-medium text-slate-500 mt-2">Mon-Sat, 9AM-8PM</p>
                            </div>

                            {/* Email Card */}
                            <div className="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 flex flex-col justify-center">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <h4 className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">Email Support</h4>
                                <a href="mailto:info.catalyzers@gmail.com" className="text-lg font-bold text-slate-800 hover:text-blue-600 transition-colors break-all inline-block">info.catalyzers@gmail.com</a>
                                <p className="text-sm font-medium text-slate-500 mt-2">Replies within 24 hours</p>
                            </div>

                            {/* Location / Map Mini Card */}
                            <div className="sm:col-span-2 group relative bg-white border border-slate-200 rounded-3xl p-2 pb-6 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden">
                                <div className="bg-slate-100 rounded-[1.5rem] h-56 w-full relative overflow-hidden mb-6 z-0">
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        frameBorder="0" 
                                        scrolling="no" 
                                        marginHeight={0} 
                                        marginWidth={0} 
                                        src="https://maps.google.com/maps?q=Catalyzers,+House+No+MPB39,+Main+Rd,+Mahaveer+Nagar-I,+Kota,+Rajasthan+324008&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                        className="absolute inset-0 grayscale-[20%] opacity-90 hover:opacity-100 hover:grayscale-0 transition-all duration-700 pointer-events-auto"
                                    ></iframe>
                                </div>
                                <div className="px-6 flex items-start gap-5">
                                    <div className="p-3 bg-slate-100 rounded-xl text-slate-600 shrink-0">
                                        <MapPin className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-1">Campus Location</h4>
                                        <p className="text-lg font-bold text-slate-800 leading-snug">
                                            House No MPB39, Main Rd<br />
                                            Mahaveer Nagar-I, Kota
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Coaching Details */}
                        <div className="flex flex-col h-full lg:py-6">
                            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                Why Choose Catalyzers?
                            </h2>
                            <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                                We are Kota's premier institute for JEE and NEET preparation. We don't just teach; we mentor students to achieve their absolute highest potential through personalized attention and proven methodologies.
                            </p>

                            <ul className="space-y-10">
                                <li className="flex items-start gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/50 shadow-sm">
                                        <Award className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-2xl text-slate-900 mb-2">Proven Expert Faculty</h4>
                                        <p className="text-slate-500 text-lg leading-relaxed">Learn from Kota's most trusted educators like Adil Sir and Kirti Ma'am, who have produced thousands of top-ranked scholars over the years.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/50 shadow-sm">
                                        <BookOpen className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-2xl text-slate-900 mb-2">Comprehensive Strategy</h4>
                                        <p className="text-slate-500 text-lg leading-relaxed">Gain absolute mastery with meticulously crafted study materials, high-yield daily practice problems (DPPs), and rigorous mock test series.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100/50 shadow-sm">
                                        <Users className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-2xl text-slate-900 mb-2">Personalized Mentorship</h4>
                                        <p className="text-slate-500 text-lg leading-relaxed">No student is left behind. We offer dedicated 1-on-1 doubt counters and constant academic tracking to ensure continuous growth.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                    </div>

                    {/* Bottom Row: Cal.com Full Width Embed */}
                    <div className="pt-16 border-t border-slate-200">
                        <div className="text-center mb-12">
                            <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-50 text-indigo-700 font-bold text-sm tracking-wide border border-indigo-100 mb-4">
                                Free 1-on-1 Consultation
                            </span>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                Schedule a Free Counseling Session
                            </h2>
                            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                                Select a convenient time below to speak directly with an expert counselor about your comprehensive JEE/NEET preparation strategy.
                            </p>
                        </div>
                        
                        <div className="w-full max-w-[1000px] mx-auto bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-200">
                            {/* The Cal.com widget handles its own height dynamically */}
                            <div className="w-full relative min-h-[700px] bg-slate-50/30">
                                <Cal 
                                    calLink="catalyzers/15min"
                                    style={{ width:"100%", height:"100%", minHeight: "750px", overflow:"auto" }}
                                    config={{ layout: "month_view" }}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </div>
    );
}
