"use client";

import { useEffect } from "react";
import { MapPin, Phone, Mail, Clock, CalendarDays, ArrowRight, Building2 } from "lucide-react";
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
            <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 bg-white border-b border-slate-200 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-[0.4]"
                    style={{
                        backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
                        backgroundSize: '32px 32px'
                    }}
                />
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center space-y-5">
                        <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-sm tracking-wide border border-indigo-100">
                            Get in Touch
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                            Contact Our Team
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            We're here to help you navigate your educational journey. Reach out to us for admissions, support, or general inquiries.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="py-16 md:py-20">
                <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-5 gap-8 items-start">
                        
                        {/* Information Grid */}
                        <div className="lg:col-span-3 grid sm:grid-cols-2 gap-6 w-full">
                            
                            {/* Phone Card */}
                            <div className="group relative bg-white border border-indigo-100 rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-indigo-500/10">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] group-hover:bg-indigo-500/20 transition-colors pointer-events-none" />
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-white pointer-events-none z-0" />
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform shadow-sm">
                                        <Phone className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <h4 className="text-indigo-600/80 font-bold uppercase tracking-wider text-xs mb-2">Call Us Directly</h4>
                                    <p className="text-2xl font-bold text-slate-800">077379 76414</p>
                                    <p className="text-sm font-medium text-slate-500 mt-2">Available Mon-Sat, 9AM-8PM</p>
                                </div>
                            </div>

                            {/* Email Card */}
                            <div className="group relative bg-white border border-blue-100 rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-blue-500/10">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] group-hover:bg-blue-500/20 transition-colors pointer-events-none" />
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-white pointer-events-none z-0" />
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform shadow-sm">
                                        <Mail className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h4 className="text-blue-600/80 font-bold uppercase tracking-wider text-xs mb-2">Email Support</h4>
                                    <p className="text-[17px] md:text-xl font-bold text-slate-800">info.catalyzers@gmail.com</p>
                                    <p className="text-sm font-medium text-slate-500 mt-2">We typically reply within 24 hours</p>
                                </div>
                            </div>

                            {/* Location Card */}
                            <div className="group relative bg-white border border-purple-100 rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-purple-500/10 sm:col-span-2 md:col-span-1">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] group-hover:bg-purple-500/20 transition-colors pointer-events-none" />
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white to-white pointer-events-none z-0" />
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform shadow-sm">
                                        <MapPin className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h4 className="text-purple-600/80 font-bold uppercase tracking-wider text-xs mb-2">Campus Location</h4>
                                    <p className="text-[16px] font-bold text-slate-800 leading-snug">
                                        House No MPB39, Main Rd<br />
                                        Mahaveer Nagar-I, Kota<br />
                                        Rajasthan 324008
                                    </p>
                                </div>
                            </div>

                            {/* Corporate Office / Alternate Card */}
                            <div className="group relative bg-white border border-emerald-100 rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-emerald-500/10 sm:col-span-2 md:col-span-1">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] group-hover:bg-emerald-500/20 transition-colors pointer-events-none" />
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-white pointer-events-none z-0" />
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform shadow-sm">
                                        <Clock className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <h4 className="text-emerald-600/80 font-bold uppercase tracking-wider text-xs mb-2">Working Hours</h4>
                                    <p className="text-[17px] font-bold text-slate-800 mb-1">Mon - Sat: 8 AM - 9 PM</p>
                                    <p className="text-sm font-medium text-slate-500">Sunday: 8 AM - 8 PM</p>
                                </div>
                            </div>
                            
                        </div>

                        {/* Booking CTA Column - Native Cal.com UI */}
                        <div className="lg:col-span-2 h-[750px] flex flex-col mt-6 lg:mt-0 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden border border-indigo-100">
                            <div className="bg-slate-900 px-6 py-5 flex items-center gap-4 shrink-0">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/20">
                                    <CalendarDays className="w-6 h-6 text-indigo-300" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        Book a Free Counseling Session
                                    </h3>
                                    <p className="text-slate-400 text-sm">
                                        Choose to speak directly with an expert
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1 w-full bg-slate-50 relative pb-4">
                                <Cal 
                                    calLink="catalyzers/15min"
                                    style={{ width:"100%", height:"100%", overflow:"scroll" }}
                                    config={{ layout: "month_view" }}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Map Placeholder or Extra Detail Section */}
            <section className="pb-20">
                <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                    <div className="bg-slate-200 rounded-3xl h-[450px] w-full flex items-center justify-center overflow-hidden border border-slate-300 relative shadow-inner">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            frameBorder="0" 
                            scrolling="no" 
                            marginHeight={0} 
                            marginWidth={0} 
                            src="https://maps.google.com/maps?q=Catalyzers,+House+No+MPB39,+Main+Rd,+Mahaveer+Nagar-I,+Kota,+Rajasthan+324008&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            className="absolute inset-0 grayscale-[20%] contrast-125 opacity-90 hover:opacity-100 hover:grayscale-0 transition-all duration-700"
                        ></iframe>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
