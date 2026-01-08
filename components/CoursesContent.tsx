"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, IndianRupee, Calendar, Clock } from "lucide-react";

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
            <section className="bg-gradient-to-br from-primary via-primary-dark to-purple-900 text-white py-12 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                            Our Courses
                        </h1>
                        <p className="text-base md:text-lg text-purple-100 mb-2">
                            📍 Offline Coaching in Kota - India&apos;s Coaching Capital
                        </p>
                        <p className="text-sm md:text-base text-purple-200">
                            Expert Faculty • Proven Results • Affordable Fees
                        </p>
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
                        {filteredCourses.map((course) => (
                            <div
                                key={course.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
                            >
                                {/* Course Image/Banner */}
                                <div className="relative h-40 bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                                    {course.badge && (
                                        <div className="absolute top-3 left-3 bg-white text-primary px-3 py-1 rounded-md text-xs font-bold shadow-sm">
                                            {course.badge}
                                        </div>
                                    )}
                                    {course.popular && (
                                        <div className="absolute top-3 right-3 bg-secondary text-white px-3 py-1 rounded-md text-xs font-bold shadow-sm">
                                            POPULAR
                                        </div>
                                    )}
                                    <div className="text-white text-center px-4">
                                        <h3 className="text-xl font-bold">{course.name}</h3>
                                    </div>
                                </div>

                                {/* Course Details */}
                                <div className="p-5">
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
                                    <div className="border-t pt-4">
                                        <div className="flex items-baseline gap-2 mb-2">
                                            <div className="flex items-baseline">
                                                <IndianRupee className="w-5 h-5 text-primary" />
                                                <span className="text-3xl font-bold text-primary">
                                                    {course.price.toLocaleString("en-IN")}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500 line-through">
                                                ₹{course.mrp.toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                        <div className="mb-4">
                                            <span className="inline-block px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                                                {course.discount}% discount applied
                                            </span>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex gap-2">
                                            <Button variant="outline" className="flex-1" size="sm">
                                                Explore
                                            </Button>
                                            <Button className="flex-1" size="sm">
                                                Buy Now
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
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
                                <a href="https://cal.com/atharva-gulve-9osunz/free-counselling" target="_blank" rel="noopener noreferrer" className="w-full">
                                    <Button className="w-full" size="sm">
                                        Enroll Now
                                    </Button>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Kota Section */}
            <section className="py-12 md:py-16 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="container px-4 md:px-6">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
                            Why Choose Catalyzer Kota?
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
                        Join thousands of successful students at Catalyzer Kota
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
