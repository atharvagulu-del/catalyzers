import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

import { ArrowRight, Star } from "lucide-react";

const teachers = [
    {
        id: "adil-sir",
        name: "Adil Sir",
        experience: "14 YEARS",
        role: "Founder & Senior Physics Faculty for JEE & NEET",
        shortBio: "With over 14 years of experience in teaching Physics for JEE and NEET, Adil Sir is a highly respected educator known for his crystal-clear concept delivery, structured approach, and result-oriented mentorship. His classes are designed to empower students with a deep understanding of Physics while sharpening their problem-solving skills essential for cracking top competitive exams.",
        image: "/assets/teachers/adilsir.png",
        imagePosition: "left",
        scale: "scale-[1.35]",
    },
    {
        id: "kirti-maam",
        name: "Kirti Ma'am",
        experience: "15 YEARS",
        role: "Senior Chemistry Faculty",
        shortBio: "With an impressive 15-year track record in coaching students for JEE and NEET, Kirti Ma'am stands out as a seasoned and inspiring Chemistry faculty. Her passion for teaching and deep command over the subject have helped thousands of students grasp even the most challenging concepts with ease.",
        image: "/assets/teachers/kirti_updated.png",
        imagePosition: "right",
        scale: "scale-100",
    },
    {
        id: "mayank-sir",
        name: "Mayank Sir",
        experience: "8 YEARS",
        role: "Senior Mathematics Faculty",
        shortBio: "Dedicated, dynamic, and highly skilled in teaching Mathematics to JEE aspirants, Mayank Sir brings 8 years of experience and a genuine passion for making math engaging and accessible. His focus is on helping students move toward achieving their dream ranks.",
        image: "/assets/teachers/mayanksir.png",
        imagePosition: "left",
        scale: "scale-[1.35]",
    },
];

export default function TeachersPage() {
    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Header */}
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-white">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#5A4BDA]/10 blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[100px]" />
                    <div
                        className="absolute inset-0 z-0 opacity-[0.5]"
                        style={{
                            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                            backgroundSize: '32px 32px'
                        }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50/50 to-transparent z-1" />
                </div>

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">World-Class Faculty</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                            Learn from the <span className="text-[#5A4BDA]">Masters</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                            Meet the expert educators dedicated to transforming your preparation into top results with personalized guidance.
                        </p>
                    </div>
                </div>
            </section>

            {/* Teachers List */}
            <section className="py-16 md:py-24">
                <div className="container px-4 md:px-6">
                    <div className="max-w-6xl mx-auto space-y-12 md:space-y-20">
                        {teachers.map((teacher, index) => {
                            const isReversed = teacher.imagePosition === "right";
                            return (
                                <div
                                    key={teacher.id}
                                    className="group relative bg-white rounded-[2.5rem] p-6 md:p-8 lg:p-12 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-slate-200 transition-all duration-500"
                                >
                                    <div
                                        className={`flex flex-col ${isReversed
                                            ? "md:flex-row-reverse"
                                            : "md:flex-row"
                                            } gap-8 lg:gap-16 items-center`}
                                    >
                                        {/* Teacher Image Area */}
                                        <div className="w-full md:w-5/12 lg:w-1/2 flex-shrink-0 relative">
                                            {/* Decorative Background Blob behind teacher */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-[2rem] transform group-hover:scale-105 transition-transform duration-500" />

                                            <div className="relative w-full aspect-square md:aspect-[4/5] overflow-hidden flex items-end justify-center rounded-[2rem] pt-8">
                                                <Image
                                                    src={teacher.image}
                                                    alt={teacher.name}
                                                    width={500}
                                                    height={600}
                                                    className={`w-full h-full object-cover object-top drop-shadow-2xl transition-transform duration-700 group-hover:translate-y-[-10px] ${teacher.scale} origin-top`}
                                                    priority={index === 0}
                                                    unoptimized
                                                />
                                            </div>
                                        </div>

                                        {/* Teacher Info */}
                                        <div className="flex-1 text-center md:text-left z-10">
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-6 tracking-wide">
                                                <span>{teacher.experience} EXPERIENCE</span>
                                            </div>

                                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4">
                                                {teacher.name}
                                            </h2>

                                            <p className="text-xl md:text-2xl font-semibold text-[#5A4BDA] mb-6">
                                                {teacher.role}
                                            </p>

                                            <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-8">
                                                {teacher.shortBio}
                                            </p>

                                            <Link href={`/teachers/${teacher.id}`}>
                                                <Button
                                                    size="lg"
                                                    className="rounded-full px-8 py-6 text-base font-semibold bg-slate-900 text-white hover:bg-[#5A4BDA] hover:shadow-lg transition-all duration-300 group/btn"
                                                >
                                                    View Profile
                                                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
