"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#020617] text-slate-300 border-t border-slate-800/60 relative overflow-hidden font-sans">
            {/* Background Aesthetic Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Main Footer Content */}
            <div className="container px-4 md:px-6 py-16 md:py-24 relative z-10 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    
                    {/* Brand & About Information */}
                    <div className="lg:col-span-5 space-y-6 md:pr-8">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="relative h-10 w-10">
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
                                        <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            <span className="text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                                Catalyzers
                            </span>
                        </Link>
                        
                        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-md font-medium">
                            India's Trusted & Affordable Educational Platform, empowering millions of students to achieve their dreams with exceptional educators and premium study material.
                        </p>
                        
                        <div className="pt-4 space-y-4">
                            <a href="tel:07737976414" className="flex items-center gap-4 text-slate-400 hover:text-indigo-400 transition-colors group w-fit">
                                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-semibold tracking-wide">077379 76414</span>
                            </a>
                            <a href="mailto:info.catalyzers@gmail.com" className="flex items-center gap-4 text-slate-400 hover:text-blue-400 transition-colors group w-fit">
                                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-all">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-semibold tracking-wide">info.catalyzers@gmail.com</span>
                            </a>
                            <div className="flex items-start gap-4 text-slate-400">
                                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium leading-relaxed mt-1">
                                    House No MPB39, Main Rd,<br />
                                    Mahaveer Nagar-I, Kota,<br />
                                    Rajasthan 324008
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links Menu */}
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-white font-bold text-lg tracking-wide">Quick Links</h4>
                        <ul className="space-y-3">
                            {[
                                { name: "Home", href: "/" },
                                { name: "Courses", href: "/courses" },
                                { name: "Teachers", href: "/teachers" },
                                { name: "Results", href: "/results" },
                                { name: "Study Material", href: "/study-material" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-slate-400 hover:text-indigo-400 text-sm font-medium transition-colors flex items-center gap-2 group">
                                        <div className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-indigo-400 transition-colors" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* About & Legal Menu */}
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-white font-bold text-lg tracking-wide">Company</h4>
                        <ul className="space-y-3">
                            {[
                                { name: "About Us", href: "/about" },
                                { name: "Contact Us", href: "/contact" },
                                { name: "Privacy Policy", href: "/privacy" },
                                { name: "Terms of Use", href: "/terms" },
                                { name: "Refund Policy", href: "/refund" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-slate-400 hover:text-blue-400 text-sm font-medium transition-colors flex items-center gap-2 group">
                                        <div className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-blue-400 transition-colors" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Connect & CTA */}
                    <div className="lg:col-span-3 space-y-6">
                        <h4 className="text-white font-bold text-lg tracking-wide">Connect With Us</h4>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            Stay up to date with the latest courses, results, and study strategies.
                        </p>
                        
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30 text-slate-400 hover:text-[#1877F2] flex items-center justify-center transition-all shadow-sm"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-4 h-4 fill-current" />
                            </a>
                            <a
                                href="https://www.instagram.com/catalyzersinstitute/?hl=en"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:bg-[#E4405F]/10 hover:border-[#E4405F]/30 text-slate-400 hover:text-[#E4405F] flex items-center justify-center transition-all shadow-sm"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a
                                href="https://www.youtube.com/@catalyzersinstitute5574"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:bg-[#FF0000]/10 hover:border-[#FF0000]/30 text-slate-400 hover:text-[#FF0000] flex items-center justify-center transition-all shadow-sm"
                                aria-label="YouTube"
                            >
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                        
                        <div className="pt-4">
                            <Link href="/contact" className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
                                <MessageCircle className="w-4 h-4" />
                                Reach Out Now
                            </Link>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar Segment */}
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500 font-medium">
                        &copy; {new Date().getFullYear()} Catalyzers Institute. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-slate-500 font-medium tracking-wide">
                        <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
                        <Link href="/refund" className="hover:text-slate-300 transition-colors">Refund</Link>
                    </div>
                </div>
            </div>

            {/* Fully Working Floating CTA (Navigates to Contact) */}
            <Link
                href="/contact"
                className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center z-50 group hover:-translate-y-1"
                aria-label="Get Help"
            >
                <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </Link>
        </footer>
    );
}
