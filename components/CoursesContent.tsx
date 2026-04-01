"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, IndianRupee, Calendar, Clock, Sparkles, ArrowRight, Minus } from "lucide-react";

// Course types
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
}

interface SubjectCourse {
    id: string;
    name: string;
    type: CourseType;
    exam: ExamType;
    price: number;
    mrp: number;
    discount: number;
    duration: string;
    language: string;
}

const courses: Course[] = [
    // NEET Courses - Class 11th (Disha)
    {
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
        features: [
            "Daily live classes at Kota campus",
            "Comprehensive study material",
            "Weekly tests & assessments",
            "Doubt clearing sessions",
            "Personal mentorship",
            "NCERT complete coverage",
        ],
    },
    // NEET Courses - Class 12th (Marg)
    {
        id: "neet-12th",
        name: "Marg - Complete NEET 12th Program",
        type: "12th",
        exam: "neet",
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
            "Intensive daily classes",
            "Complete syllabus coverage",
            "Regular mock tests",
            "Previous year papers practice",
            "Personalized guidance",
            "Exam strategy sessions",
        ],
        popular: true,
    },
    // NEET Courses - Dropper (Manzil 11+12th)
    {
        id: "neet-dropper",
        name: "Manzil - Complete NEET 11+12th Program",
        type: "dropper",
        exam: "neet",
        duration: "8 Months",
        startDate: "10 Jan 2026",
        endDate: "1 May 2026",
        price: 149999,
        mrp: 172498,
        discount: 15,
        subjects: ["Physics", "Chemistry", "Biology"],
        language: "Hinglish",
        badge: "OFFLINE",
        features: [
            "Intensive daily classes (8+ hours)",
            "Complete revision program",
            "Daily practice tests",
            "All India test series",
            "One-on-one mentoring",
            "Success guarantee program",
        ],
        popular: true,
    },
    // JEE Courses - Class 11th (Disha)
    {
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
        features: [
            "Daily live classes at Kota campus",
            "Comprehensive study material",
            "Weekly tests & assessments",
            "Doubt clearing sessions",
            "Personal mentorship",
            "Board + JEE preparation",
        ],
    },
    // JEE Courses - Class 12th (Marg)
    {
        id: "jee-12th",
        name: "Marg - Complete JEE 12th Program",
        type: "12th",
        exam: "jee",
        duration: "8 Months",
        startDate: "1 Feb 2026",
        endDate: "15 May 2026",
        price: 99999,
        mrp: 117646,
        discount: 15,
        subjects: ["Physics", "Chemistry", "Mathematics"],
        language: "Hinglish",
        badge: "OFFLINE",
        features: [
            "Intensive daily classes",
            "Complete syllabus coverage",
            "Regular mock tests",
            "Previous year papers practice",
            "Personalized guidance",
            "JEE Main & Advanced prep",
        ],
        popular: true,
    },
    // JEE Courses - Dropper (Manzil 11+12th)
    {
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
        features: [
            "Intensive daily classes (8+ hours)",
            "Complete revision program",
            "Daily practice tests",
            "All India test series",
            "One-on-one mentoring",
            "Success guarantee program",
        ],
        popular: true,
    },
];

const subjectCourses: SubjectCourse[] = [
    // NEET Subjects - Adhar (11th)
    {
        id: "neet-physics-11",
        name: "Adhar Physics (NEET 11th)",
        type: "11th",
        exam: "neet",
        price: 40000,
        mrp: 47058,
        discount: 15,
        duration: "8 Months",
        language: "Hinglish",
    },
    {
        id: "neet-chemistry-11",
        name: "Adhar Chemistry (NEET 11th)",
        type: "11th",
        exam: "neet",
        price: 40000,
        mrp: 47058,
        discount: 15,
        duration: "8 Months",
        language: "Hinglish",
    },
    {
        id: "neet-biology-11",
        name: "Adhar Biology (NEET 11th)",
        type: "11th",
        exam: "neet",
        price: 40000,
        mrp: 47058,
        discount: 15,
        duration: "8 Months",
        language: "Hinglish",
    },
    // NEET Subjects - Stambh (12th)
    {
        id: "neet-physics-12",
        name: "Stambh Physics (NEET 12th)",
        type: "12th",
        exam: "neet",
        price: 40000,
        mrp: 47058,
        discount: 15,
        duration: "8 Months",
        language: "Hinglish",
    },
    {
        id: "neet-chemistry-12",
        name: "Stambh Chemistry (NEET 12th)",
        type: "12th",
        exam: "neet",
        price: 40000,
        mrp: 47058,
        discount: 15,
        duration: "8 Months",
        language: "Hinglish",
    },
    {
        id: "neet-biology-12",
        name: "Stambh Biology (NEET 12th)",
        type: "12th",
        exam: "neet",
        price: 40000,
        mrp: 47058,
        discount: 15,
        duration: "8 Months",
        language: "Hinglish",
    },
    // NEET Subjects - Shikhar (11+12th)
    {
        id: "neet-physics-dropper",
        name: "Shikhar Physics (NEET 11+12th)",
        type: "dropper",
        exam: "neet",
        price: 60000,
        mrp: 70588,
        discount: 15,
        duration: "8 Months",
        language: "Hinglish",
    },
    {
        id: "neet-chemistry-dropper",
        name: "Shikhar Chemistry (NEET 11+12th)",
        type: "dropper",
        exam: "neet",
        price: 60000,
        mrp: 70588,
        discount: 15,
        duration: "8 Months",
        language: "Hinglish",
    },
    {
        id: "neet-biology-dropper",
        name: "Shikhar Biology (NEET 11+12th)",
        type: "dropper",
        exam: "neet",
        price: 60000,
        mrp: 70588,
        discount: 15,
        duration: "8 Months",
        language: "Hinglish",
    },
    // JEE Subjects - Adhar (11th)
    {
        id: "jee-physics-11",
        name: "Adhar Physics (JEE 11th)",
        type: "11th",
        exam: "jee",
        price: 40000,
        mrp: 47058,
        discount: 15,
        duration: "8 Months",
        language: "Hinglish",
    },
    {
        id: "jee-chemistry-11",
        name: "Adhar Chemistry (JEE 11th)",
        type: "11th",
        exam: "jee",
        price: 40000,
        mrp: 47058,
        discount: 15,
        duration: "8 Months",
        language: "Hinglish",
    },
    {
        id: "jee-maths-11",
        name: "Adhar Mathematics (JEE 11th)",
        type: "11th",
        exam: "jee",
        price: 40000,
        mrp: 47058,
        discount: 15,
        duration: "8 Months",
        language: "Hinglish",
    },
    // JEE Subjects - Stambh (12th)
    {
        id: "jee-physics-12",
        name: "Stambh Physics (JEE 12th)",
        type: "12th",
        exam: "jee",
        price: 40000,
        mrp: 47058,
        discount: 15,
        duration: "8 Months",
        language: "Hinglish",
    },
    {
        id: "jee-chemistry-12",
        name: "Stambh Chemistry (JEE 12th)",
        type: "12th",
        exam: "jee",
        price: 40000,
        mrp: 47058,
        discount: 15,
        duration: "8 Months",
        language: "Hinglish",
    },
    {
        id: "jee-maths-12",
        name: "Stambh Mathematics (JEE 12th)",
        type: "12th",
        exam: "jee",
        price: 40000,
        mrp: 47058,
        discount: 15,
        duration: "8 Months",
        language: "Hinglish",
    },
    // JEE Subjects - Shikhar (11+12th)
    {
        id: "jee-physics-dropper",
        name: "Shikhar Physics (JEE 11+12th)",
        type: "dropper",
        exam: "jee",
        price: 60000,
        mrp: 70588,
        discount: 15,
        duration: "8 Months",
        language: "Hinglish",
    },
    {
        id: "jee-chemistry-dropper",
        name: "Shikhar Chemistry (JEE 11+12th)",
        type: "dropper",
        exam: "jee",
        price: 60000,
        mrp: 70588,
        discount: 15,
        duration: "8 Months",
        language: "Hinglish",
    },
    {
        id: "jee-maths-dropper",
        name: "Shikhar Mathematics (JEE 11+12th)",
        type: "dropper",
        exam: "jee",
        price: 60000,
        mrp: 70588,
        discount: 15,
        duration: "8 Months",
        language: "Hinglish",
    },
];

export default function CoursesContent() {
    const [selectedExam, setSelectedExam] = useState<ExamType>("neet");
    const [selectedType, setSelectedType] = useState<CourseType | "all">("all");

    // Quiz State
    const [quizExam, setQuizExam] = useState<ExamType | null>(null);
    const [quizClass, setQuizClass] = useState<CourseType | null>(null);

    const filteredCourses = courses.filter(
        (course) =>
            course.exam === selectedExam &&
            (selectedType === "all" || course.type === selectedType)
    );

    const filteredSubjects = subjectCourses.filter(
        (subject) => subject.exam === selectedExam &&
            (selectedType === "all" || subject.type === selectedType)
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-[#020617] text-white py-20 md:py-32 overflow-hidden">
                {/* Premium Background Effects */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 backdrop-blur-sm">
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Academic Ecosystem</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
                            Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Potential</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto font-light">
                            India's most rigorously designed batches in Kota. Choose your path and let our visionaries guide you to a top rank.
                        </p>

                        <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-slate-400">
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Expert Faculty</span>
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Tracked Results</span>
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Transparent Fees</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Quiz: Find Your Perfect Batch */}
            <section className="py-16 md:py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-4 shadow-sm">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                                Find Your Perfect Batch in 10 Seconds
                            </h2>
                            <p className="text-lg text-slate-600">
                                Not sure which program is right for you? Let's narrow it down.
                            </p>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-10 shadow-lg">
                            {/* Step 1 */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm">1</span>
                                    What is your target exam?
                                </h3>
                                <div className="grid grid-cols-2 gap-4 pl-11">
                                    <button
                                        onClick={() => setQuizExam("jee")}
                                        className={`py-4 rounded-xl border-2 font-bold transition-all flex flex-col items-center justify-center gap-2 ${quizExam === "jee" ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}
                                    >
                                        <span>JEE Main & Adv.</span>
                                    </button>
                                    <button
                                        onClick={() => setQuizExam("neet")}
                                        className={`py-4 rounded-xl border-2 font-bold transition-all flex flex-col items-center justify-center gap-2 ${quizExam === "neet" ? "border-red-500 bg-red-50 text-red-700 shadow-md" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}
                                    >
                                        <span>NEET UG</span>
                                    </button>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className={`transition-all duration-500 ${quizExam ? "opacity-100 translate-y-0" : "opacity-50 translate-y-4 pointer-events-none"}`}>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm">2</span>
                                    Which class are you in right now?
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-11">
                                    <button
                                        onClick={() => setQuizClass("11th")}
                                        className={`py-3 rounded-xl border-2 font-bold transition-all ${quizClass === "11th" ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}
                                    >
                                        11th Moving
                                    </button>
                                    <button
                                        onClick={() => setQuizClass("12th")}
                                        className={`py-3 rounded-xl border-2 font-bold transition-all ${quizClass === "12th" ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}
                                    >
                                        12th Moving
                                    </button>
                                    <button
                                        onClick={() => setQuizClass("dropper")}
                                        className={`py-3 rounded-xl border-2 font-bold transition-all ${quizClass === "dropper" ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}
                                    >
                                        12th Passed (Dropper)
                                    </button>
                                </div>
                            </div>

                            {/* Result */}
                            {/* Result */}
                            {quizExam && quizClass && (
                                <div className="mt-10 pl-11 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                                    {/* Primary Recommendation */}
                                    <div className="p-6 bg-gradient-to-br from-[#020617] to-indigo-950 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-900 relative overflow-hidden">
                                        {/* Background effect */}
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                                        <div className="relative z-10 text-center md:text-left">
                                            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center justify-center md:justify-start gap-1">
                                                <Sparkles className="w-3 h-3" /> Recommended For You
                                            </p>
                                            <h4 className="text-3xl font-extrabold mb-1">
                                                {quizClass === "11th" ? "Disha" : quizClass === "12th" ? "Marg" : "Manzil"} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{quizExam.toUpperCase()}</span> Batch
                                            </h4>
                                            <p className="text-slate-400 text-sm mt-2 max-w-sm">
                                                The perfect 1-year offline program tailored exactly for {quizExam.toUpperCase()} aspirants in {quizClass === 'dropper' ? 'their drop year' : `class ${quizClass}`}.
                                            </p>
                                        </div>
                                        <a href={`/courses/${quizExam}-${quizClass === "11th" ? "11th" : quizClass === "12th" ? "12th" : "dropper"}`} className="relative z-10 w-full md:w-auto">
                                            <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 hover:-translate-y-1">
                                                View Batch Details <ArrowRight className="w-5 h-5 ml-2" />
                                            </Button>
                                        </a>
                                    </div>

                                    {/* Secondary Recommendation (Combo/Backlog) */}
                                    {(quizClass === "11th" || quizClass === "12th") && (
                                        <div className="p-6 bg-gradient-to-br from-[#020617] to-indigo-950 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-900 relative overflow-hidden">
                                            {/* Background effect */}
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                            
                                            <div className="relative z-10 text-center md:text-left">
                                                <p className="text-blue-400 text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center justify-center md:justify-start gap-1">
                                                    <Sparkles className="w-3 h-3" /> Best Value Combo
                                                </p>
                                                <h4 className="text-xl font-extrabold mb-1">
                                                    Manzil <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{quizExam.toUpperCase()}</span> (11th + 12th)
                                                </h4>
                                                <p className="text-slate-400 text-sm mt-1 max-w-sm">
                                                    {quizClass === "11th" 
                                                        ? "Get the complete 2-year package with a massive discount. Secure your 11th and 12th preparation together."
                                                        : "Fix your 11th backlog while mastering 12th concepts. The ultimate program for serious aspirants."}
                                                </p>
                                            </div>
                                            <a href={`/courses/${quizExam}-dropper`} className="relative z-10 w-full md:w-auto">
                                                <Button variant="outline" className="w-full md:w-auto border-blue-800 bg-blue-950/50 text-white hover:bg-blue-900 hover:text-white font-bold px-6 py-5 rounded-xl shadow-sm transition-all hover:scale-105 hover:-translate-y-1">
                                                    View Combo Details <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Exam Selection Tabs */}
            <section className="sticky top-16 z-40 bg-white border-b shadow-sm">
                <div className="container px-4 md:px-6 py-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Exam Tabs */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedExam("neet")}
                                className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${selectedExam === "neet"
                                    ? "bg-red-500 text-white shadow-md"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                NEET
                            </button>
                            <button
                                onClick={() => setSelectedExam("jee")}
                                className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${selectedExam === "jee"
                                    ? "bg-primary text-white shadow-md"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                JEE
                            </button>
                        </div>

                        {/* Type Filters */}
                        <div className="flex gap-2 flex-wrap justify-center">
                            <button
                                onClick={() => setSelectedType("all")}
                                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${selectedType === "all"
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                All Batches
                            </button>
                            <button
                                onClick={() => setSelectedType("11th")}
                                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${selectedType === "11th"
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                Class 11
                            </button>
                            <button
                                onClick={() => setSelectedType("12th")}
                                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${selectedType === "12th"
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                Class 12
                            </button>
                            <button
                                onClick={() => setSelectedType("dropper")}
                                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${selectedType === "dropper"
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                Dropper
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Complete Courses */}
            <section className="py-12 md:py-16" id={selectedExam}>
                <div className="container px-4 md:px-6">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">
                        {selectedExam.toUpperCase()} Complete Programs
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => {
                            const isNEET = course.exam === 'neet';
                            return (
                            <div
                                key={course.id}
                                className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200 flex flex-col ${isNEET ? 'hover:shadow-red-900/10 hover:border-red-200' : 'hover:shadow-blue-900/10 hover:border-blue-200'}`}
                            >
                                {/* Course Image/Banner */}
                                <div className={`relative h-48 bg-gradient-to-br flex items-center justify-center overflow-hidden ${isNEET ? 'from-[#020617] via-rose-950 to-[#020617]' : 'from-slate-900 via-indigo-950 to-slate-900'}`}>
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                                    <div className={`absolute inset-0 bg-gradient-to-t to-transparent ${isNEET ? 'from-rose-950/80' : 'from-slate-900/80'}`}></div>

                                    {course.badge && (
                                        <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase shadow-sm">
                                            {course.badge}
                                        </div>
                                    )}
                                    {course.popular && (
                                        <div className={`absolute top-4 right-4 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase shadow-lg bg-gradient-to-r ${isNEET ? 'from-red-500 to-rose-600 shadow-red-500/30' : 'from-blue-500 to-indigo-600 shadow-blue-500/30'}`}>
                                            POPULAR
                                        </div>
                                    )}
                                    <div className="text-white text-center px-6 relative z-10 transform group-hover:scale-105 transition-transform duration-500">
                                        <h3 className="text-2xl font-bold drop-shadow-md">{course.name}</h3>
                                    </div>
                                </div>

                                {/* Course Details */}
                                <div className="p-6 flex-grow flex flex-col">
                                    {/* Meta Info */}
                                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {course.duration}
                                        </span>
                                        <span>• {course.language}</span>
                                    </div>

                                    {/* Dates */}
                                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-4">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>
                                            {course.startDate} - {course.endDate}
                                        </span>
                                    </div>

                                    {/* Subjects */}
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-2">
                                            {course.subjects.map((subject) => (
                                                <span
                                                    key={subject}
                                                    className="px-2.5 py-1 bg-purple-50 text-primary rounded-md text-xs font-medium"
                                                >
                                                    {subject}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-2 mb-5">
                                        {course.features.slice(0, 3).map((feature, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-xs text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pricing */}
                                    <div className="border-t border-slate-100 mt-auto pt-5">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <div className="flex items-baseline">
                                                <IndianRupee className="w-5 h-5 text-slate-900" />
                                                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                                    {course.price.toLocaleString("en-IN")}
                                                </span>
                                            </div>
                                            <span className="text-sm text-slate-400 line-through font-medium">
                                                ₹{course.mrp.toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                        <div className="mb-6">
                                            <span className="inline-block px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                                Save {course.discount}% Today
                                            </span>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex gap-3">
                                            <a href={`/courses/${course.id}`} className="flex-1 w-full relative z-20">
                                                <Button variant="outline" className="w-full rounded-xl border-slate-300 text-slate-700 font-bold hover:bg-slate-50 relative z-20" size="lg">
                                                    Explore
                                                </Button>
                                            </a>
                                            <a href="https://cal.com/catalyzers/15min" target="_blank" rel="noopener noreferrer" className="flex-1 w-full relative z-20">
                                                <Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 relative z-20" size="lg">
                                                    Enroll Now
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Individual Subjects */}
            <section className="py-12 md:py-16 bg-white">
                <div className="container px-4 md:px-6">
                    <div className="max-w-4xl mx-auto mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">
                            Individual Subject Courses
                        </h2>
                        <p className="text-gray-600">
                            Strengthen your weak areas with our subject-specific programs
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {filteredSubjects.map((subject) => (
                            <div
                                key={subject.id}
                                className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300"
                            >
                                <h3 className="text-lg font-bold mb-2">{subject.name}</h3>
                                <p className="text-xs text-gray-600 mb-4">
                                    {subject.duration} • {subject.language}
                                </p>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <IndianRupee className="w-4 h-4 text-primary" />
                                    <span className="text-2xl font-bold text-primary">
                                        {subject.price.toLocaleString("en-IN")}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                        ₹{subject.mrp.toLocaleString("en-IN")}
                                    </span>
                                </div>
                                <div className="mb-4">
                                    <span className="inline-block px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">
                                        {subject.discount}% off
                                    </span>
                                </div>
                                <a href="https://cal.com/catalyzers/15min" target="_blank" rel="noopener noreferrer" className="w-full">
                                    <Button className="w-full" size="sm">
                                        Enroll Now
                                    </Button>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Apple-Style Comparison Table */}
            <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200">
                <div className="container px-4 md:px-6 max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                            Compare the Programs.
                        </h2>
                        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                            Whether you need to build the foundation or require intensive revision, see exactly what each offline batch includes.
                        </p>
                    </div>

                    <div className="overflow-x-auto pb-8">
                        <table className="w-full min-w-[800px] border-collapse bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            <thead>
                                <tr className="border-b-2 border-slate-200 bg-slate-50/50">
                                    <th className="p-8 text-left w-1/4">
                                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Compare Features</span>
                                    </th>
                                    <th className="p-8 text-center w-1/4 border-l border-slate-100">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Disha</h3>
                                        <p className="text-slate-500 font-medium text-sm">Class 11th Focus</p>
                                    </th>
                                    <th className="p-8 text-center w-1/4 border-l border-slate-100">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Marg</h3>
                                        <p className="text-slate-500 font-medium text-sm">Class 12th + Boards</p>
                                    </th>
                                    <th className="p-8 text-center w-1/4 border-l border-slate-100 bg-blue-50/30 relative">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                                        <div className="relative inline-block mb-2">
                                            <span className="absolute -top-1 -right-3 flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                            </span>
                                            <h3 className="text-2xl font-extrabold text-blue-700">Manzil</h3>
                                        </div>
                                        <p className="text-blue-600 font-medium text-sm">Intensive Dropper</p>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 text-center">
                                {/* Core Features Row */}
                                <tr className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-6 font-bold text-left text-slate-900 text-sm">Daily Class Duration</td>
                                    <td className="p-6 font-medium border-l border-slate-100">3 Hours</td>
                                    <td className="p-6 font-medium border-l border-slate-100">3 Hours</td>
                                    <td className="p-6 font-bold text-blue-800 bg-blue-50/30 border-l border-blue-100">6 Hours <br /><span className="text-xs font-normal text-blue-600">(Intensive)</span></td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 font-bold text-left text-slate-900 text-sm">Syllabus Coverage</td>
                                    <td className="p-6 border-l border-slate-100">11th Class Only</td>
                                    <td className="p-6 border-l border-slate-100">12th Class + 11th Revision</td>
                                    <td className="p-6 font-bold text-blue-800 bg-blue-50/30 border-l border-blue-100">Complete 11th & 12th</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 font-bold text-left text-slate-900 text-sm">Testing Frequency</td>
                                    <td className="p-6 border-l border-slate-100">Bi-Weekly</td>
                                    <td className="p-6 border-l border-slate-100">Weekly</td>
                                    <td className="p-6 font-bold text-blue-800 bg-blue-50/30 border-l border-blue-100">Daily Practice + Weekly Mains</td>
                                </tr>

                                {/* Specialized Features row */}
                                <tr>
                                    <td colSpan={4} className="py-8 px-6 bg-slate-50 text-left border-y border-slate-200">
                                        <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-slate-400" /> Specialized Deliverables
                                        </h4>
                                    </td>
                                </tr>

                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 font-bold text-left text-slate-900 text-sm">Board Exam Prep Integration</td>
                                    <td className="p-6 border-l border-slate-100">
                                        <Check className="w-5 h-5 text-slate-300 mx-auto" />
                                    </td>
                                    <td className="p-6 border-l border-slate-100">
                                        <Check className="w-6 h-6 text-green-500 mx-auto" />
                                        <span className="text-xs text-green-700 font-bold block mt-1">Dedicated Focus</span>
                                    </td>
                                    <td className="p-6 bg-blue-50/30 border-l border-blue-100">
                                        <Minus className="w-5 h-5 text-slate-400 mx-auto" />
                                        <span className="text-[10px] text-slate-500 block mt-1 uppercase font-bold tracking-wider">Not Applicable</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 font-bold text-left text-slate-900 text-sm">1-on-1 Dedicated Mentor</td>
                                    <td className="p-6 border-l border-slate-100">
                                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                                    </td>
                                    <td className="p-6 border-l border-slate-100">
                                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                                    </td>
                                    <td className="p-6 bg-blue-50/30 border-l border-blue-100">
                                        <div className="flex flex-col items-center">
                                            <Check className="w-6 h-6 text-blue-600" />
                                            <span className="text-xs text-blue-800 font-bold mt-1">24/7 Priority Access</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 font-bold text-left text-slate-900 text-sm">All India Test Series (AITS)</td>
                                    <td className="p-6 border-l border-slate-100">
                                        <Check className="w-5 h-5 text-slate-300 mx-auto" />
                                    </td>
                                    <td className="p-6 border-l border-slate-100">
                                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                                    </td>
                                    <td className="p-6 bg-blue-50/30 border-l border-blue-100">
                                        <div className="flex flex-col items-center">
                                            <Check className="w-6 h-6 text-blue-600" />
                                            <span className="text-xs text-blue-800 font-bold mt-1">Advanced AITS Included</span>
                                        </div>
                                    </td>
                                </tr>

                                {/* Enroll Row */}
                                <tr>
                                    <td className="p-6 border-t-2 border-slate-200"></td>
                                    <td className="p-6 border-l border-slate-100 border-t-2 border-slate-200">
                                        <a href="/courses/neet-11th">
                                            <Button variant="outline" className="w-full rounded-xl border-slate-300 font-bold text-slate-700 hover:bg-slate-50">Explore Disha</Button>
                                        </a>
                                    </td>
                                    <td className="p-6 border-l border-slate-100 border-t-2 border-slate-200">
                                        <a href="/courses/neet-12th">
                                            <Button variant="outline" className="w-full rounded-xl border-slate-300 font-bold text-slate-700 hover:bg-slate-50">Explore Marg</Button>
                                        </a>
                                    </td>
                                    <td className="p-6 bg-blue-50/50 border-l border-blue-100 border-t-2 border-slate-200">
                                        <a href="https://cal.com/catalyzers/15min" target="_blank" rel="noopener noreferrer">
                                            <Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20">Enroll in Manzil</Button>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Why Kota Section */}
            <section className="py-12 md:py-16 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="container px-4 md:px-6">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
                            Why Choose Catalyzers Kota?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="text-3xl mb-3">🏆</div>
                                <h3 className="text-lg font-bold mb-2">Proven Track Record</h3>
                                <p className="text-sm text-gray-600">
                                    Thousands of successful selections in NEET & JEE every year
                                    from our Kota campus
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="text-3xl mb-3">👨‍🏫</div>
                                <h3 className="text-lg font-bold mb-2">Expert Faculty</h3>
                                <p className="text-sm text-gray-600">
                                    Learn from Kota&apos;s most experienced and dedicated teachers with
                                    10+ years experience
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="text-3xl mb-3">📚</div>
                                <h3 className="text-lg font-bold mb-2">
                                    Comprehensive Material
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Best-in-class study material covering complete syllabus with
                                    practice questions
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="text-3xl mb-3">🎯</div>
                                <h3 className="text-lg font-bold mb-2">Regular Testing</h3>
                                <p className="text-sm text-gray-600">
                                    Weekly tests and All India mock exams for better preparation
                                    and performance tracking
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
                <div className="container px-4 md:px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-base text-purple-100 mb-6 max-w-2xl mx-auto">
                        Join thousands of successful students at Catalyzers Kota
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/courses">
                            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                                Enroll Now
                            </Button>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
