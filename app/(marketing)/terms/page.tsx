"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, AlertTriangle, Scale, Globe, BookOpen } from "lucide-react";

export default function TermsOfUsePage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] selection:bg-blue-100 selection:text-blue-900">
            <Header />

            {/* Premium Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white border-b border-slate-200 shadow-sm">
                {/* Abstract grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                
                <div className="container relative z-10 px-4 md:px-6 max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center p-3 mb-6 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shadow-sm">
                        <FileText className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
                        Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Use</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
                        Please read these terms and conditions carefully before using our platform and services.
                    </p>
                    <div className="mt-8 inline-block px-4 py-1.5 bg-slate-100 rounded-full text-slate-500 text-sm font-semibold tracking-wider uppercase border border-slate-200">
                        Effective Date: Jan 1, 2026
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container px-4 md:px-6 max-w-4xl mx-auto py-16 md:py-24">
                <div className="space-y-12">
                    
                    {/* Introduction */}
                    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-200">
                        <p className="text-xl text-slate-700 leading-relaxed font-medium mb-0">
                            Welcome to Catalyzers Institute. These terms of use constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Catalyzers Institute ("we," "us," or "our").
                        </p>
                    </div>

                    {/* Term Blocks */}
                    <div className="grid gap-8">
                        
                        {/* Term 1 */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 group hover:border-blue-300 transition-colors">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 m-0">1. Acceptance of Terms</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed pl-14">
                                By accessing our website, platform, entering into our premises, or utilizing our educational materials, you agree that you have read, understood, and agreed to be bound by all of these Terms of Use. If you do not agree with all of these terms, then you are expressly prohibited from using the site and must discontinue use immediately.
                            </p>
                        </div>

                        {/* Term 2 */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 group hover:border-blue-300 transition-colors">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 m-0">2. Intellectual Property Rights</h2>
                            </div>
                            <div className="pl-14 space-y-4 text-slate-600 leading-relaxed">
                                <p>
                                    Unless otherwise indicated, the Site, App, and offline materials are our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, graphics, and study materials ("Content") are owned or controlled by us.
                                </p>
                                <p>
                                    You are prohibited from modifying, sharing, selling, distributing, or exploiting our Content for any commercial purpose. Our study materials (DPPs, Modules, Test Papers) are provided solely for your personal educational use.
                                </p>
                            </div>
                        </div>

                        {/* Term 3 */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 group hover:border-blue-300 transition-colors">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 m-0">3. User Representation & Conduct</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed pl-14 mb-4">
                                By using the Site or Institute facilities, you represent and warrant that:
                            </p>
                            <ul className="list-disc pl-20 space-y-2 text-slate-600 marker:text-blue-500">
                                <li>All registration information you submit will be true, accurate, current, and complete.</li>
                                <li>You will maintain the accuracy of such information.</li>
                                <li>You will not use the Site for any illegal or unauthorized purpose.</li>
                                <li>You will not share your student login credentials with third parties. Sharing course access will result in immediate termination without refund.</li>
                                <li>You will maintain discipline and decorum within physical and online classrooms.</li>
                            </ul>
                        </div>

                        {/* Term 4 */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 group hover:border-blue-300 transition-colors">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Scale className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 m-0">4. Disclaimers & Limitations of Liability</h2>
                            </div>
                            <div className="pl-14 space-y-4 text-slate-600 leading-relaxed">
                                <p>
                                    The site and curriculum are provided on an as-is and as-available basis. While we strive for excellence in education, Catalyzers Institute does not guarantee any specific rank, admission, or score in competitive exams like JEE or NEET. Success ultimately depends on a student's individual hard work and aptitude.
                                </p>
                                <p>
                                    In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, or punitive damages arising from your use of the site or our services.
                                </p>
                            </div>
                        </div>

                        {/* Term 5 */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 group hover:border-blue-300 transition-colors">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                    <Scale className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 m-0">5. Governing Law</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed pl-14">
                                These Terms of Use and your use of the Site are governed by and construed in accordance with the laws of India. Any legal action of whatever nature brought by either you or us shall be commenced or prosecuted in the state and federal courts located in <strong>Kota, Rajasthan</strong>, and the parties hereby consent to, and waive all defenses of lack of personal jurisdiction and forum non conveniens with respect to venue and jurisdiction in such state and federal courts.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
