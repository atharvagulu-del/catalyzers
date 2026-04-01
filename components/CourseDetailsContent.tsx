"use client";

import { Button } from "@/components/ui/button";
import { Check, Calendar, Clock, BookOpen, GraduationCap, Medal, Star, ShieldCheck, ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Reuse the course data structure (in a real app this would be fetched or in a shared lib)
type CourseType = "11th" | "12th" | "dropper";
type ExamType = "neet" | "jee";

interface Course {
    id: string;
    name: string;
    type: CourseType;
    exam: ExamType;
    duration: string;
    startDate: string;
    endDate: string;
    price: number;
    mrp: number;
    discount: number;
    subjects: string[];
    features: string[];
    language: string;
    popular?: boolean;
    badge?: string;
    description: string;
    targetAudience: string;
    syllabusTimeline: { month: string; focus: string; topics: string }[];
}

const coursesData: Record<string, Course> = {
    // NEET
    "neet-11th": {
        id: "neet-11th",
        name: "Disha - Complete NEET 11th Program",
        type: "11th",
        exam: "neet",
        duration: "8 Months",
        startDate: "15 Jan 2026",
        endDate: "31 Dec 2026",
        price: 99999,
        mrp: 117646,
        discount: 15,
        subjects: ["Physics", "Chemistry", "Biology"],
        language: "Hinglish",
        badge: "OFFLINE",
        description: "The perfect foundation for medical aspirants. We start cleanly from the basics of 11th grade and steadily build the rigorous problem-solving skills needed for NEET.",
        targetAudience: "Students moving from Class 10th to 11th who want early advantage in NEET.",
        features: [
            "3 Hours of daily live offline classes at Kota",
            "Extensive NCERT line-by-line coverage for Biology",
            "Bi-weekly minor tests & monthly major tests",
            "1-on-1 dedicated academic mentor",
            "Printed comprehensive study modules (Theory + Exercise)",
            "Special Board exam prep integration"
        ],
        syllabusTimeline: [
            { month: "Month 1-2", focus: "Foundation", topics: "Basic Math, Kinematics, Mole Concept, Cell Biology" },
            { month: "Month 3-4", focus: "Core Mechanics & Structure", topics: "NLM, Work Power, Plant Physiology, Atomic Structure" },
            { month: "Month 5-6", focus: "Advanced Concepts", topics: "Thermodynamics, Human Physiology, Chemical Bonding" },
            { month: "Month 7-8", focus: "Revision & Testing", topics: "Complete 11th Syllabus Revision & Full Mock Tests" },
        ]
    },
    // JEE
    "jee-11th": {
        id: "jee-11th",
        name: "Disha - Complete JEE 11th Program",
        type: "11th",
        exam: "jee",
        duration: "8 Months",
        startDate: "15 Jan 2026",
        endDate: "31 Dec 2026",
        price: 99999,
        mrp: 117646,
        discount: 15,
        subjects: ["Physics", "Chemistry", "Mathematics"],
        language: "Hinglish",
        badge: "OFFLINE",
        description: "Your first step towards IIT. We focus heavily on building strong analytical thinking. The syllabus moves at a deliberate pace ensuring deep understanding over rote learning.",
        targetAudience: "Students moving from Class 10th to 11th aiming for top IITs/NITs.",
        features: [
            "3 Hours of daily live offline classes at Kota",
            "Gradual level-up: Boards -> Mains -> Advanced",
            "Bi-weekly minor tests aligned with JEE Pattern",
            "1-on-1 dedicated academic mentor",
            "Kota's top tier mathematically rigorous material",
            "Special Board exam prep integration"
        ],
        syllabusTimeline: [
            { month: "Month 1-2", focus: "Foundation", topics: "Basic Math, Kinematics, Mole Concept, Sets & Relations" },
            { month: "Month 3-4", focus: "Core Mechanics & Structure", topics: "NLM, Work Power, Atomic Structure, Quadratic Equations" },
            { month: "Month 5-6", focus: "Algebra & Thermodynamics", topics: "Thermodynamics, Chemical Bonding, Sequence & Series" },
            { month: "Month 7-8", focus: "Revision & Testing", topics: "Complete 11th Syllabus Revision & JEE Pattern Mocks" },
        ]
    },
    // Drop year Manzil (JEE)
    "jee-dropper": {
        id: "jee-dropper",
        name: "Manzil - Complete JEE 11+12th Program",
        type: "dropper",
        exam: "jee",
        duration: "8 Months",
        startDate: "10 Jan 2026",
        endDate: "1 May 2026",
        price: 149999,
        mrp: 172498,
        discount: 15,
        subjects: ["Physics", "Chemistry", "Mathematics"],
        language: "Hinglish",
        badge: "OFFLINE",
        popular: true,
        description: "The ultimate second chance. This intensive 8-month dropper batch is designed to drastically improve your rank. We skip the generic basics and focus purely on high-yield problem solving and massive testing.",
        targetAudience: "12th passed students looking for an intense, highly-focused drop year program for JEE Advanced.",
        features: [
            "6 Hours of intensive daily classes & practice sessions",
            "Fast-paced completion of 11th + 12th syllabus",
            "Daily practice sheets with strict tracking",
            "Premium All India Test Series (AITS) access",
            "24/7 dedicated library & mentor access",
            "Focused solely on JEE Main & Advanced (No Board Prep)"
        ],
        syllabusTimeline: [
            { month: "Month 1-2", focus: "11th High-Yield", topics: "Mechanics, Thermodynamics, Algebra, Physical Chemistry" },
            { month: "Month 3-4", focus: "12th Core Part 1", topics: "Electrodynamics, Calculus, Organic Chemistry" },
            { month: "Month 5-6", focus: "12th Core Part 2", topics: "Optics, Modern Physics, Coordinate Geometry, Inorganic" },
            { month: "Month 7-8", focus: "Advanced Testing", topics: "Daily Full Syllabus Mocks, Advanced Problem Solving Camps" },
        ]
    },
    // NEET 12th (Marg)
    "neet-12th": {
        id: "neet-12th",
        name: "Marg - Complete NEET 12th Program",
        type: "12th",
        exam: "neet",
        description: "The crucial board cum competitive year. Our Marg program provides an optimal balance between securing 95%+ in 12th boards and maintaining a high-intensity approach to cracking NEET.",
        targetAudience: "Students moving from Class 11th to 12th who need to balance Boards and NEET prep.",
        duration: "8 Months",
        startDate: "1 Feb 2026",
        endDate: "15 May 2026",
        price: 99999,
        mrp: 117646,
        discount: 15,
        subjects: ["Physics", "Chemistry", "Biology"],
        language: "Hinglish",
        badge: "OFFLINE",
        features: [
            "3 Hours of focused daily offline classes",
            "Perfect synergy: Term 1/Term 2 Board pre-boards + NEET Mocks",
            "Weekly subjective tests for Boards and objective tests for NEET",
            "Exclusive access to '11th Express Revision' modules",
            "Printed comprehensive study modules (12th + 11th Revision)",
            "Strictly NCERT based biology with intensive diagram practice"
        ],
        syllabusTimeline: [
            { month: "Month 1-2", focus: "12th Foundation & Optics", topics: "Electrostatics, Current Electricity, Reproduction, Solution" },
            { month: "Month 3-4", focus: "Core 12th & Board Focus", topics: "Magnetism, Genetics, Electrochemistry, Kinetics" },
            { month: "Month 5-6", focus: "Modern Physics & Organic", topics: "Modern Physics, Biotechnology, Complete 12th Organic" },
            { month: "Month 7-8", focus: "Complete Revision & Testing", topics: "11th Quick Revision, Board Pre-Boards, Final NEET Mock Series" },
        ]
    },

    // NEET Dropper (Manzil)
    "neet-dropper": {
        id: "neet-dropper",
        name: "Manzil - Complete NEET Dropper",
        type: "dropper",
        exam: "neet",
        description: "The ultimate second chance. This intensive 8-month dropper batch is designed to drastically improve your NEET rank. We focus purely on high-yield biology problem solving and massive testing.",
        targetAudience: "12th passed students looking for an intense, highly-focused drop year program for NEET.",
        duration: "8 Months",
        startDate: "10 Jan 2026",
        endDate: "1 May 2026",
        price: 149999,
        mrp: 172498,
        discount: 15,
        subjects: ["Physics", "Chemistry", "Biology"],
        language: "Hinglish",
        badge: "OFFLINE",
        popular: true,
        features: [
            "6 Hours of intensive daily classes & rigorous practice",
            "Fast-paced completion of 11th + 12th syllabus with zero filler",
            "Daily practice sheets tracked by dedicated mentors",
            "Premium All India Test Series (AITS) access",
            "24/7 library access & personalized doubt solving clinics",
            "Focused solely on NEET UG (No Board Prep)"
        ],
        syllabusTimeline: [
            { month: "Month 1-2", focus: "High-Yield 11th", topics: "Mechanics, Plant Physio, Human Physio, Physical Chem" },
            { month: "Month 3-4", focus: "12th Core Part 1", topics: "Electrodynamics, Genetics, Organic Chemistry Part 1" },
            { month: "Month 5-6", focus: "12th Core Part 2", topics: "Optics, Modern Physics, Biotechnology, Inorganic Chem" },
            { month: "Month 7-8", focus: "Advanced Testing", topics: "Daily Full Syllabus Mocks (3 hours 20 mins strict timing)" },
        ]
    },

    // JEE 12th (Marg)
    "jee-12th": {
        id: "jee-12th",
        name: "Marg - Complete JEE 12th Program",
        type: "12th",
        exam: "jee",
        description: "The crucial board cum competitive year. Our Marg program provides an optimal balance between securing 95%+ in 12th boards and maintaining a high-intensity approach to cracking JEE Advanced.",
        targetAudience: "Students moving from Class 11th to 12th aiming for top IITs/NITs along with Board excellence.",
        duration: "8 Months",
        startDate: "1 Feb 2026",
        endDate: "15 May 2026",
        price: 99999,
        mrp: 117646,
        discount: 15,
        subjects: ["Physics", "Chemistry", "Math"],
        language: "Hinglish",
        badge: "OFFLINE",
        features: [
            "3 Hours of focused daily offline classes",
            "Perfect synergy: Term 1/Term 2 Board pre-boards + JEE Mocks",
            "Weekly subjective tests for Boards and objective tests for Mains/Adv",
            "Exclusive access to '11th Express Revision' modules",
            "Printed comprehensive study modules (12th + 11th Revision)",
            "Specialized coaching for advanced mathematical proofs"
        ],
        syllabusTimeline: [
            { month: "Month 1-2", focus: "12th Foundation & Calculus", topics: "Electrostatics, Matrices, Functions, Solid State" },
            { month: "Month 3-4", focus: "Core 12th & Board Focus", topics: "Magnetism, Differential Calculus, Electrochemistry" },
            { month: "Month 5-6", focus: "Modern Physics & Integral Calculus", topics: "Modern Physics, Integration, Complete 12th Organic" },
            { month: "Month 7-8", focus: "Complete Revision & Testing", topics: "11th Quick Revision, Board Pre-Boards, Final JEE Mocks" },
        ]
    },
};

export default function CourseDetailsContent({ courseId }: { courseId: string }) {
    const course = coursesData[courseId];

    if (!course) {
        notFound();
    }

    const isNEET = course.exam === "neet";
    const accentColor = isNEET ? "red" : "blue";

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
                <div className="container px-4 md:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <Link href="/courses" className="hover:text-slate-900 transition-colors">Courses</Link>
                        <span>/</span>
                        <span className="text-slate-900">{course.id.toUpperCase()}</span>
                    </div>
                </div>
            </div>

            {/* Premium Hero Section */}
            <section className="relative bg-[#020617] text-white pt-16 pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                {/* Dynamic colored glow based on exam */}
                <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-20 ${isNEET ? 'bg-red-600' : 'bg-blue-600'}`}></div>

                <div className="container px-4 md:px-6 relative z-10 max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        {/* Left Content */}
                        <div className="lg:w-3/5">
                            <div className="flex items-center gap-3 mb-6">
                                <span className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md border border-white/20`}>
                                    {course.badge} BATCH
                                </span>
                                {course.popular && (
                                    <span className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest bg-gradient-to-r ${isNEET ? 'from-red-500 to-rose-600' : 'from-blue-500 to-indigo-600'} shadow-lg`}>
                                        MOST POPULAR
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                                {course.name.split('-')[0]} <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isNEET ? 'from-red-400 to-rose-400' : 'from-blue-400 to-indigo-400'}`}>
                                    {course.exam.toUpperCase()}
                                </span>
                            </h1>

                            <p className="text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed font-light">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap gap-6 mb-10">
                                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-sm">
                                    <Calendar className={`w-6 h-6 ${isNEET ? 'text-red-400' : 'text-blue-400'}`} />
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Duration</p>
                                        <p className="font-bold">{course.duration}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-sm">
                                    <Clock className={`w-6 h-6 ${isNEET ? 'text-red-400' : 'text-blue-400'}`} />
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Starts On</p>
                                        <p className="font-bold">{course.startDate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content: Pricing Card */}
                        <div className="lg:w-2/5 w-full max-w-md">
                            <div className="bg-white rounded-3xl p-8 text-slate-900 mb-6 shadow-2xl relative">
                                <ShieldCheck className="absolute top-4 right-4 w-6 h-6 text-green-500 opacity-20" />

                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    Batch Pricing <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase tracking-wider">All Inclusive</span>
                                </h3>

                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-5xl font-extrabold tracking-tight">₹{course.price.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-slate-400 line-through font-medium">₹{course.mrp.toLocaleString("en-IN")}</span>
                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Save {course.discount}%</span>
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-3 text-sm font-medium"><Check className="w-4 h-4 text-green-500" /> Complete Year Offline Classes</li>
                                    <li className="flex items-center gap-3 text-sm font-medium"><Check className="w-4 h-4 text-green-500" /> Printed Study Material</li>
                                    <li className="flex items-center gap-3 text-sm font-medium"><Check className="w-4 h-4 text-green-500" /> All India Test Series</li>
                                </ul>

                                <a href="https://cal.com/catalyzers/15min" target="_blank" rel="noopener noreferrer">
                                    <Button className={`w-full py-6 text-lg font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-1 ${isNEET ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'}`}>
                                        Enroll Now
                                    </Button>
                                </a>
                                <p className="text-center text-xs text-slate-500 font-medium mt-4 flex items-center justify-center gap-1">
                                    <ShieldCheck className="w-4 h-4" /> 100% Secure Payment
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <div className="container px-4 md:px-6 max-w-6xl mx-auto pt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Left Column: Details & Syllabus */}
                <div className="lg:col-span-2 space-y-16">

                    {/* What You Get */}
                    <section>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                            <Star className={`w-8 h-8 ${isNEET ? 'text-red-500' : 'text-blue-500'}`} />
                            What's Included in this Batch?
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {course.features.map((feature, idx) => (
                                <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl flex items-start gap-4 hover:shadow-md transition-shadow">
                                    <div className={`mt-1 bg-${isNEET ? 'red' : 'blue'}-50 p-1.5 rounded-full shrink-0`}>
                                        <Check className={`w-4 h-4 ${isNEET ? 'text-red-600' : 'text-blue-600'}`} />
                                    </div>
                                    <p className="font-medium text-slate-700 text-sm leading-relaxed">{feature}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Target Audience */}
                    <section className="bg-white border border-slate-200 p-8 rounded-3xl">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Who is this for?</h3>
                        <p className="text-slate-600 leading-relaxed">{course.targetAudience}</p>
                    </section>

                    {/* Interactive Syllabus Timeline */}
                    <section>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                            <BookOpen className={`w-8 h-8 ${isNEET ? 'text-red-500' : 'text-blue-500'}`} />
                            Rigorous Execution Timeline
                        </h2>
                        <p className="text-slate-600 mb-8 text-lg">We don't just teach. We execute a surgically precise plan over 8 months to ensure you peak at the right time.</p>

                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                            {course.syllabusTimeline?.map((timeline, idx) => (
                                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                        {idx + 1}
                                    </div>

                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-blue-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-xs font-bold uppercase tracking-widest ${isNEET ? 'text-red-500' : 'text-blue-500'}`}>{timeline.month}</span>
                                        </div>
                                        <h4 className="font-bold text-lg text-slate-900 mb-2">{timeline.focus}</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">Covering: {timeline.topics}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Sticky Sidebar Info */}
                <div className="space-y-8">
                    {/* Faculty Section Promo */}
                    <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden text-center border border-slate-800">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl"></div>
                        <GraduationCap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-3">Learn from Kota's Visionaries</h3>
                        <p className="text-slate-400 text-sm mb-6">This batch is taught exclusively by our Head of Departments (10+ Years Exp).</p>
                        <Button variant="outline" className="w-full border-slate-700 bg-slate-800 text-white hover:bg-slate-700 rounded-xl">View Faculty Mentors</Button>
                    </div>

                    {/* Results Promo */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
                        <Medal className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Proven Success</h3>
                        <p className="text-slate-600 text-sm mb-6">Students from this exact methodology have secured top AIRs consecutively.</p>
                        <Link href="/" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1">
                            See Hall of Fame <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
