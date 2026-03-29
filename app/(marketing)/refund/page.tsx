"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RefreshCw, CreditCard, Clock, CheckCircle, HelpCircle } from "lucide-react";

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50 selection:bg-purple-100 selection:text-purple-900">
            <Header />

            {/* Premium Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-slate-900 z-0" />
                
                {/* Wavy premium background */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-50 to-transparent z-10" />
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />

                <div className="container relative z-20 px-4 md:px-6 max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center p-4 mb-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
                        <RefreshCw className="w-10 h-10 text-purple-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
                        Cancellation & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Refund Policy</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
                        We believe in complete transparency. Our refund policy ensures fairness for both students and the institution.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="container relative z-30 px-4 md:px-6 max-w-4xl mx-auto py-16 -mt-10">
                
                <div className="grid gap-8">
                    
                    {/* Policy Card 1 */}
                    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden group hover:border-purple-200 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 m-0">Registration & Admission Fee</h2>
                        </div>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            The Initial Registration Fee and Admission/Kit Fee (including the cost of the Catalyzers T-Shirt, Bag, and ID Card) are strictly <strong className="text-slate-900 border-b-2 border-purple-200">Non-Refundable</strong> under any circumstances. Once paid, this confirms the student's intent to engage with our educational environment.
                        </p>
                    </div>

                    {/* Policy Card 2 */}
                    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden group hover:border-fuchsia-200 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 m-0">Tuition Fee Refund Criteria</h2>
                        </div>
                        <p className="text-lg text-slate-600 leading-relaxed mb-6">
                            For offline classroom programs, refunds for the Tuition Fee component are processed strictly based on the timeline of the refund request relative to the batch start date:
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">Within 15 Days of Batch Commencement</h4>
                                    <p className="text-slate-600 text-sm">75% of the Tuition Fee will be refunded. (Deduction of 25% for classes attended and resource allocation).</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <CheckCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">Within 16 to 30 Days</h4>
                                    <p className="text-slate-600 text-sm">50% of the Tuition Fee will be refunded.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-red-50/50 border border-red-100">
                                <CheckCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">After 30 Days</h4>
                                    <p className="text-slate-600 text-sm">No refund requests will be entertained under any circumstances after 30 days from the batch start date.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Policy Card 3 */}
                    <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                        {/* Decorative glow inside */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />

                        <div className="relative z-10 flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                                <HelpCircle className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white m-0">Refund Processing</h2>
                        </div>
                        <ul className="space-y-4 text-slate-300 relative z-10">
                            <li className="flex gap-3">
                                <span className="text-purple-400 font-bold">•</span>
                                All refund requests must be submitted in writing using the official Refund Request Form available at the Kota center office.
                            </li>
                            <li className="flex gap-3">
                                <span className="text-purple-400 font-bold">•</span>
                                The calculation of the timeline begins from the official start date of the assigned batch, not from the date of admission or the student's first attended class.
                            </li>
                            <li className="flex gap-3">
                                <span className="text-purple-400 font-bold">•</span>
                                Approved refunds will be processed via bank transfer / NEFT within 14-21 working days of form submission. Cash refunds are strictly not permitted.
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
}
