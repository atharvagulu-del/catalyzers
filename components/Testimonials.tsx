"use client";

import { Quote } from "lucide-react";

interface Testimonial {
    id: number;
    name: string;
    achievement: string;
    course: string;
    text: string;
    image?: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Rahul Sharma",
        achievement: "AIR 47 in NEET 2025",
        course: "NEET",
        text: "Catalyzer's offline coaching in Kota transformed my preparation. The daily classes, personal mentorship, and regular tests helped me achieve my dream rank. Adil Sir's teaching methodology made complex topics easy to understand.",
    },
    {
        id: 2,
        name: "Priya Patel",
        achievement: "AIR 156 in JEE Advanced 2025",
        course: "JEE",
        text: "The faculty at Catalyzer Kota is exceptional. Their dedication and the comprehensive study material provided gave me the confidence to crack JEE Advanced. The doubt clearing sessions were incredibly helpful.",
    },
    {
        id: 3,
        name: "Amit Kumar",
        achievement: "AIR 89 in NEET 2025",
        course: "NEET",
        text: "Coming to Kota and joining Catalyzer was the best decision of my life. The intensive dropper batch program with 8+ hours of daily classes ensured I covered the entire syllabus thoroughly. Highly recommended!",
    },
    {
        id: 4,
        name: "Sneha Reddy",
        achievement: "AIR 234 in JEE Main 2025",
        course: "JEE",
        text: "Catalyzer's affordable fees without compromising on quality education is remarkable. The mock tests and all India test series helped me understand my weak areas and improve consistently.",
    },
    {
        id: 5,
        name: "Arjun Singh",
        achievement: "AIR 112 in NEET 2025",
        course: "NEET",
        text: "The personalized attention and one-on-one mentoring at Catalyzer made all the difference. The teachers genuinely care about each student's success. Thank you for helping me achieve my dream!",
    },
    {
        id: 6,
        name: "Ananya Gupta",
        achievement: "AIR 298 in JEE Advanced 2025",
        course: "JEE",
        text: "The study environment at Catalyzer Kota campus is excellent. Daily practice tests and previous year papers practice gave me the edge I needed to crack JEE Advanced. Forever grateful!",
    },
];

export default function Testimonials() {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container px-4 md:px-6">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                        Students ❤️{" "}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Catalyzer
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 font-medium">
                        Hear from students at Catalyzer
                    </p>
                </div>

                {/* Featured Testimonial */}
                <div className="max-w-6xl mx-auto mb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
                        <Quote className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                            {testimonials[0].text}
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-xl">
                                {testimonials[0].name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{testimonials[0].name}</p>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-primary font-semibold">
                                        {testimonials[0].achievement}
                                    </span>
                                    <span className="text-gray-400">|</span>
                                    <span className="text-gray-600">{testimonials[0].course}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid of Testimonials */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {testimonials.slice(1).map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
                        >
                            <Quote className="w-8 h-8 text-gray-300 mb-3" />
                            <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-4">
                                {testimonial.text}
                            </p>
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900">
                                        {testimonial.name}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-xs">
                                        <span className="text-primary font-semibold">
                                            {testimonial.achievement}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
