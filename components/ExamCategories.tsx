"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";

const categories = [
    {
        name: "NEET",
        description: "Medical entrance preparation for 11th, 12th & Droppers",
        blobColor: "bg-pink-100",
        href: "/courses#neet",
        icon: "/assets/icons/caduceus.svg",
        classes: [
            { label: "class 11", href: "/courses?exam=neet&type=11th" },
            { label: "class 12", href: "/courses?exam=neet&type=12th" },
            { label: "Dropper", href: "/courses?exam=neet&type=dropper" },
        ],
    },
    {
        name: "IIT JEE",
        description: "Engineering entrance preparation for 11th, 12th & Droppers",
        blobColor: "bg-yellow-100",
        href: "/courses#jee",
        icon: "/assets/icons/atom.svg",
        classes: [
            { label: "class 11", href: "/courses?exam=jee&type=11th" },
            { label: "class 12", href: "/courses?exam=jee&type=12th" },
            { label: "Dropper", href: "/courses?exam=jee&type=dropper" },
        ],
    },
];

export default function ExamCategories() {
    return (
        <section className="py-20 md:py-32 bg-white">
            <div className="container px-4 md:px-8">
                <h2 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-center mb-16 leading-tight">
                    Choose Your Path to{" "}
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Success
                    </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {categories.map((category) => (
                        <div
                            key={category.name}
                            className={`relative flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 p-8 md:p-12 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group ${category.name === 'IIT JEE' ? 'order-first' : 'order-last'}`}
                        >
                            {/* Decorative Background Blob */}
                            <div
                                className={`absolute -right-24 -top-24 w-80 h-80 rounded-full ${category.blobColor} opacity-60 blur-3xl transition-transform duration-500 group-hover:scale-110`}
                            />

                            {/* SVG Icon - Top Left */}
                            <div className="relative z-10 mb-8">
                                <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center p-4">
                                    <Image
                                        src={category.icon}
                                        alt={`${category.name} icon`}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Title */}
                                <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                                    {category.name}
                                </h3>

                                {/* Description */}
                                <p className="text-base md:text-lg text-gray-600 mb-8 max-w-sm">
                                    {category.description}
                                </p>

                                {/* Class Selection Pills */}
                                <div className="flex flex-wrap gap-3 mb-10">
                                    {category.classes.map((classItem) => (
                                        <a
                                            key={classItem.label}
                                            href={classItem.href}
                                            className="px-5 py-2.5 rounded-full border border-gray-300 text-sm md:text-base font-medium text-gray-700 hover:border-primary hover:text-primary hover:bg-purple-50 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                                        >
                                            {classItem.label}
                                        </a>
                                    ))}
                                </div>

                                {/* Explore Category Link */}
                                <a
                                    href={category.href}
                                    className="inline-flex items-center gap-3 text-gray-900 font-bold text-lg hover:text-primary transition-colors group/link"
                                >
                                    <span>Explore Category</span>
                                    <div className="w-10 h-10 rounded-full bg-gray-200 group-hover/link:bg-primary flex items-center justify-center transition-all duration-300 shadow-sm group-hover/link:shadow-md">
                                        <ArrowRight className="w-5 h-5 text-gray-700 group-hover/link:text-white transition-colors" />
                                    </div>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
