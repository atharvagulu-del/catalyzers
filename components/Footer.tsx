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
                            <a href="https://wa.me/917737976414" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-slate-400 hover:text-[#25D366] transition-colors group w-fit">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.778-.713-1.306-1.543-1.464-1.815-.148-.273-.016-.421.134-.569.135-.133.297-.346.446-.52.148-.173.197-.297.296-.495.099-.197.05-.371-.024-.52-.075-.148-.67-1.614-.92-2.213-.242-.58-.485-.5-.67-.508-.174-.009-.371-.009-.569-.009-.197 0-.52.074-.792.371-.272.296-1.039 1.014-1.039 2.473s1.065 2.868 1.213 3.066c.148.197 2.08 3.179 5.043 4.462.705.305 1.255.487 1.684.624.708.225 1.352.193 1.862.117.575-.086 1.758-.718 2.005-1.413.247-.695.247-1.29.173-1.413-.075-.124-.273-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
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
                                href="https://wa.me/917737976414"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:bg-[#25D366]/10 hover:border-[#25D366]/30 text-slate-400 hover:text-[#25D366] flex items-center justify-center transition-all shadow-sm"
                                aria-label="WhatsApp"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.778-.713-1.306-1.543-1.464-1.815-.148-.273-.016-.421.134-.569.135-.133.297-.346.446-.52.148-.173.197-.297.296-.495.099-.197.05-.371-.024-.52-.075-.148-.67-1.614-.92-2.213-.242-.58-.485-.5-.67-.508-.174-.009-.371-.009-.569-.009-.197 0-.52.074-.792.371-.272.296-1.039 1.014-1.039 2.473s1.065 2.868 1.213 3.066c.148.197 2.08 3.179 5.043 4.462.705.305 1.255.487 1.684.624.708.225 1.352.193 1.862.117.575-.086 1.758-.718 2.005-1.413.247-.695.247-1.29.173-1.413-.075-.124-.273-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                            </a>
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
