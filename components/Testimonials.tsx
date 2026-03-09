"use client";

import { Quote } from "lucide-react";
import Image from "next/image";

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
        name: "Vankatesh Amrutwar",
        achievement: "IIT Bombay",
        course: "JEE",
        text: "Catalyzers' offline coaching in Kota transformed my preparation. The daily classes, personal mentorship, and regular tests helped me achieve my dream rank. Adil Sir's teaching methodology made complex topics easy to understand.",
        image: "/assets/toppers/vankateshamrutwariitbombay.png",
    },
    {
        id: 2,
        name: "Deepak Suthar",
        achievement: "IIT Delhi",
        course: "JEE",
        text: "The faculty at Catalyzers Kota is exceptional. Their dedication and the comprehensive study material provided gave me the confidence to crack JEE Advanced. The doubt clearing sessions were incredibly helpful.",
        image: "/assets/toppers/deepaksuthariitdelhi.png",
    },
    {
        id: 3,
        name: "Palak Khandelwal",
        achievement: "IIT Dhanbad",
        course: "JEE",
        text: "Coming to Kota and joining Catalyzers was the best decision of my life. The intensive dropper batch program with 8+ hours of daily classes ensured I covered the entire syllabus thoroughly. Highly recommended!",
        image: "/assets/toppers/palakkhandelwaliitdhanbad.png",
    },
    {
        id: 4,
        name: "Rudra Gupta",
        achievement: "IIT Guwahati",
        course: "JEE",
        text: "Catalyzers' affordable fees without compromising on quality education is remarkable. The mock tests and all India test series helped me understand my weak areas and improve consistently.",
        image: "/assets/toppers/rudraguptaiitguwahti.png",
    },
    {
        id: 5,
        name: "Siddharth Sagar",
        achievement: "IIT Roorkee",
        course: "JEE",
        text: "The personalized attention and one-on-one mentoring at Catalyzers made all the difference. The teachers genuinely care about each student's success. Thank you for helping me achieve my dream!",
        image: "/assets/toppers/siddharthsagariitroorke.png",
    },
    {
        id: 6,
        name: "Yogeshwari Chandrawat",
        achievement: "IIT Delhi",
        course: "JEE",
        text: "The study environment at Catalyzers Kota campus is excellent. Daily practice tests and previous year papers practice gave me the edge I needed to crack JEE Advanced. Forever grateful!",
        image: "/assets/toppers/yogeshwarichandrawatiitdelhi.png",
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
                            Catalyzers
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 font-medium">
                        Hear from students at Catalyzers
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
                            {testimonials[0].image ? (
                                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                    <Image
                                        src={testimonials[0].image}
                                        alt={testimonials[0].name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-xl">
                                    {testimonials[0].name.charAt(0)}
                                </div>
                            )}
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
                                {testimonial.image ? (
                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            width={40}
                                            height={40}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-sm text-gray-900">
                                        {testimonial.name}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-xs">
                                        <span className="text-primary font-semibold">
                                            {testimonial.achievement}
                                        </span>
                                        <span className="text-gray-400">|</span>
                                        <span className="text-gray-600">{testimonial.course}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Google Reviews Link */}
                <div className="mt-12 text-center">
                    <a
                        href="https://www.google.com/search?sca_esv=9cf56067a199ff72&rlz=1C1VDKB_enIN1113IN1113&sxsrf=AE3TifP4LvUtOBlCueThM-4FgFCMixm3Ug:1767730957772&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-EzZAW8VjIxtLHBia7QFTVLVTwclP_JDeKfDhmJMR_QuFpAMR69-iejKV5yHviftPfee_YGKy52oDkWhJhNRfNHi5B6CzTWUZv-77V09UokSl7ya3qotBniTYnx1v3xxeCiyP9KSnOwHELv1QMjwIS3QR7V96ztU06VkDc7OctGxQPfvcgw%3D%3D&q=Catalyzers+Institute+%7C+Best+institute+for+IIT-JEE+,Neet+and+Boards+Reviews&sa=X&ved=2ahUKEwinra_-3veRAxX7SWwGHfoUFW4Q0bkNegQINRAD&biw=2040&bih=949&dpr=0.67"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-base md:text-lg font-semibold text-gray-700 hover:text-primary transition-all duration-300 group"
                    >
                        <span className="group-hover:scale-110 transition-transform duration-300">⭐</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                            View all Google Reviews
                        </span>
                        <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
