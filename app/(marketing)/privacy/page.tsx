"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, CheckCircle2, Server } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
            <Header />

            {/* Premium Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-slate-900 z-0" />
                
                {/* Abstract light beam background */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none z-0" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none z-0" />

                <div className="container relative z-10 px-4 md:px-6 max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center p-3 mb-6 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md shadow-xl">
                        <Shield className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
                        Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Policy</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
                        At Catalyzers Institute, we take your privacy seriously. Learn how we collect, use, and protect your personal information.
                    </p>
                    <p className="mt-6 text-sm text-slate-400 font-semibold tracking-wide uppercase">
                        Last Updated: March 2026
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="relative z-20 -mt-10 md:-mt-16 container px-4 md:px-6 max-w-4xl mx-auto mb-24">
                <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-12 lg:p-16">
                    
                    <div className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-indigo-600 hover:prose-a:text-indigo-500 marker:text-indigo-500">
                        <p className="lead text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                            Catalyzers Institute ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Catalyzers when you use our website, mobile application, and educational services.
                        </p>

                        <div className="space-y-12">
                            {/* Section 1 */}
                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 border border-indigo-100/50">
                                        <Eye className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl m-0 font-extrabold pb-0 border-none">1. Information We Collect</h2>
                                </div>
                                <p className="text-slate-600 mb-4">We collect information that you manually provide to us and information automatically collected when you use our platform:</p>
                                <ul className="space-y-3 text-slate-600 list-disc ml-6">
                                    <li><strong className="text-slate-800">Personal Data:</strong> Name, email address, phone number, date of birth, and residential address provided during registration.</li>
                                    <li><strong className="text-slate-800">Academic Information:</strong> Standard, school name, past academic records, and target exam (JEE/NEET).</li>
                                    <li><strong className="text-slate-800">Usage Data:</strong> IP address, browser type, pages visited, time spent on the platform, and device information.</li>
                                </ul>
                            </section>

                            <hr className="border-slate-100" />

                            {/* Section 2 */}
                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100/50">
                                        <Server className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl m-0 font-extrabold pb-0 border-none">2. How We Use Your Information</h2>
                                </div>
                                <p className="text-slate-600 mb-4">The information we collect is strictly used to enhance your educational experience:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    {[
                                        "To provide and maintain our Service.",
                                        "To notify you about changes to our Service.",
                                        "To provide student support and mentorship.",
                                        "To gather analysis or valuable information so we can improve our Service.",
                                        "To process payments securely.",
                                        "To monitor the usage of our Service."
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                                            <span className="text-slate-700 text-sm font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <hr className="border-slate-100" />

                            {/* Section 3 */}
                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 border border-purple-100/50">
                                        <Lock className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl m-0 font-extrabold pb-0 border-none">3. Data Security</h2>
                                </div>
                                <p className="text-slate-600">
                                    We implement a variety of premium security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential. We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information.
                                </p>
                            </section>

                            {/* Section 4 */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 border-none pb-0 mb-4">4. Third-Party Links</h2>
                                <p className="text-slate-600">
                                    Occasionally, at our discretion, we may include or offer third-party products or services on our website. These third-party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites.
                                </p>
                            </section>

                            {/* Section 5 */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 border-none pb-0 mb-4">5. Contact Us</h2>
                                <p className="text-slate-600">
                                    If there are any questions regarding this privacy policy, you may contact us using the information below:
                                </p>
                                <div className="mt-6 p-6 bg-slate-900 rounded-2xl text-white shadow-xl">
                                    <p className="font-bold text-lg mb-2">Catalyzers Institute</p>
                                    <p className="text-slate-400 mb-1">House No MPB39, Main Rd, Mahaveer Nagar-I</p>
                                    <p className="text-slate-400 mb-1">Kota, Rajasthan 324008</p>
                                    <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-col md:flex-row gap-4 md:gap-8">
                                        <p><span className="text-slate-400">Email:</span> <a href="mailto:info.catalyzers@gmail.com" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors mx-0">info.catalyzers@gmail.com</a></p>
                                        <p><span className="text-slate-400">Phone:</span> <a href="tel:07737976414" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors mx-0">077379 76414</a></p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
