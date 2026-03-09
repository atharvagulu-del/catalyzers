"use client";

import NextImage from "next/image";
import { Award, ShieldCheck, GraduationCap, Building2 } from "lucide-react";

export default function TrustMentors() {
    const mentors = [
        {
            name: "Dr. Arvind Sharma",
            role: "Chief Academic Officer",
            credentials: "Ph.D. Physics, IIT Delhi",
            exp: "18+ Years Exp.",
            desc: "Former HOD at leading national institutes. Architect of the Catalyzers Physics curriculum.",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop"
        },
        {
            name: "Prof. Meera Reddy",
            role: "Head of Chemistry",
            credentials: "M.Sc. Chemistry, IISc Bangalore",
            exp: "15+ Years Exp.",
            desc: "Renowned author of 4 JEE Advanced textbooks. Specializes in organic reaction mechanisms.",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"
        },
        {
            name: "Vishal Gupta",
            role: "Mathematics Director",
            credentials: "B.Tech, IIT Bombay",
            exp: "12+ Years Exp.",
            desc: "Mentored over 500+ students to top 1000 JEE ranks. Known for his visual calculus approach.",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop"
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
            <div className="absolute -top-[500px] -right-[500px] w-[1000px] h-[1000px] rounded-full bg-slate-50 border border-slate-100/50"></div>

            <div className="container px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    {/* Left content */}
                    <div className="w-full lg:w-1/3 space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 mb-6">
                                <ShieldCheck className="w-4 h-4 text-amber-600" />
                                <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Verified Excellence</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                                Guided by the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Visionaries</span>
                            </h2>
                            <p className="text-lg text-slate-600">
                                You aren't just learning from teachers; you are being mentored by the brilliant minds who literally wrote the books on competitive prep.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                    <Award className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Proven Track Record</h4>
                                    <p className="text-sm text-slate-500 mt-1">Our board has collectively produced over 50+ Top 100 All India Ranks.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                    <Building2 className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Premium Kota Center</h4>
                                    <p className="text-sm text-slate-500 mt-1">Direct access to these visionaries exclusively at our flagship offline campus.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right content - Mentor Cards */}
                    <div className="w-full lg:w-2/3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mentors.map((mentor, i) => (
                                <div
                                    key={i}
                                    className={`group relative bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 ${i === 1 ? 'md:-translate-y-8' : ''
                                        }`}
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-10"></div>
                                        {/* Using standard img for external URLs quickly */}
                                        <img
                                            src={mentor.image}
                                            alt={mentor.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute bottom-4 left-4 z-20">
                                            <div className="inline-block px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-bold text-white tracking-widest uppercase mb-1">
                                                {mentor.exp}
                                            </div>
                                            <h3 className="text-xl font-bold text-white">{mentor.name}</h3>
                                        </div>
                                    </div>

                                    <div className="p-6 relative">
                                        <h4 className="text-sm font-bold text-indigo-600 mb-3">{mentor.role}</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed mb-6">"{mentor.desc}"</p>

                                        <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs font-semibold text-slate-600">{mentor.credentials}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
