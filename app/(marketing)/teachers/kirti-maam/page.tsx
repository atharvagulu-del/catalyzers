import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Star, Award } from "lucide-react";
import Header from "@/components/Header";

export default function KirtiMaamPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            {/* Main Content Area */}
            <main className="pt-24 pb-16 md:pt-32 md:pb-24">
                <div className="container px-4 md:px-6">
                    {/* Back Button */}
                    <div className="mb-8">
                        <Link href="/teachers">
                            <Button variant="ghost" className="hover:bg-slate-100 text-slate-600 rounded-full px-6">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Faculty
                            </Button>
                        </Link>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        {/* Profile Header Card */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden mb-12 relative group">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-full h-48 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 opacity-60 pointer-events-none" />

                            <div className="relative p-8 md:p-12 flex flex-col md:flex-row gap-8 lg:gap-16 items-center">
                                {/* Teacher Image Area */}
                                <div className="w-64 h-64 md:w-80 md:h-80 flex-shrink-0 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-50 rounded-full blur-2xl opacity-50 transform group-hover:scale-110 transition-transform duration-700" />
                                    <div className="relative w-full h-full bg-slate-100 rounded-[2rem] overflow-hidden flex items-end justify-center shadow-inner pt-4">
                                        <Image
                                            src="/assets/teachers/kirtimam.png"
                                            alt="Kirti Ma'am"
                                            width={400}
                                            height={400}
                                            className="w-full h-full object-cover object-top drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500"
                                            priority
                                            unoptimized
                                        />
                                    </div>
                                </div>

                                {/* Teacher Info */}
                                <div className="flex-1 text-center md:text-left z-10">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
                                        <Award className="w-4 h-4 text-indigo-600" />
                                        <span className="text-sm font-bold text-indigo-700 tracking-wide uppercase">15 Years Experience</span>
                                    </div>

                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">
                                        Kirti Ma&apos;am
                                    </h1>

                                    <h2 className="text-xl md:text-2xl font-bold text-[#5A4BDA] mb-4">
                                        Senior Chemistry Faculty
                                    </h2>

                                    <div className="flex items-center justify-center md:justify-start gap-2 text-slate-600 mb-8 bg-slate-50 px-4 py-3 rounded-2xl w-fit mx-auto md:mx-0 border border-slate-100">
                                        <BookOpen className="w-5 h-5 text-indigo-400" />
                                        <span className="font-medium">Expert in Physical, Organic & Inorganic</span>
                                    </div>

                                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                        <a href="/courses">
                                            <Button size="lg" className="rounded-full px-8 bg-slate-900 text-white hover:bg-[#5A4BDA] shadow-md hover:shadow-xl transition-all duration-300">
                                                Enroll in Classes
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Full Bio Section */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12 lg:p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <span className="w-8 h-1 bg-[#5A4BDA] rounded-full inline-block"></span>
                                About Kirti Ma&apos;am
                            </h3>

                            <div className="prose prose-lg max-w-none text-slate-600">
                                <p className="leading-relaxed mb-6 text-lg">
                                    <strong className="text-slate-800">Kirti Ma&apos;am</strong> is a Senior Chemistry Faculty with over 15 years of experience in teaching for JEE and NEET.
                                    Her teaching spans Physical, Organic, and Inorganic Chemistry, with a strong emphasis on concept clarity and exam-oriented preparation.
                                </p>

                                <p className="leading-relaxed mb-6 text-lg">
                                    Known for her crystal-clear explanations and structured teaching approach, she simplifies complex chemical concepts and connects theory with practical problem-solving. Her sessions are engaging, systematic, and tailored to meet the unique needs of competitive exam aspirants.
                                </p>

                                <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 my-8 italic text-indigo-900 font-medium">
                                    "Kirti Ma&apos;am&apos;s guidance has played a crucial role in helping students excel in both board examinations and national-level entrance tests. Her approachable nature and consistent mentoring make her a trusted name among students."
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
