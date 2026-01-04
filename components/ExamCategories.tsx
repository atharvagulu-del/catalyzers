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
        <section className="py-16 md:py-24 bg-white">
            <div className="container px-4 md:px-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12">
                    Choose Your Path to{" "}
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Success
                    </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {categories.map((category) => (
                        <div
                            key={category.name}
                            className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8 transition-all duration-300 hover:shadow-xl group"
                        >
                            {/* Decorative Background Blob */}
                            <div
                                className={`absolute -right-20 -top-20 w-64 h-64 rounded-full ${category.blobColor} opacity-60`}
                            />

                            {/* SVG Icon - Top Left */}
                            <div className="relative z-10 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center p-3">
                                    <Image
                                        src={category.icon}
                                        alt={`${category.name} icon`}
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Title */}
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                    {category.name}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-gray-600 mb-6">
                                    {category.description}
                                </p>

                                {/* Class Selection Pills */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {category.classes.map((classItem) => (
                                        <a
                                            key={classItem.label}
                                            href={classItem.href}
                                            className="px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-700 hover:border-primary hover:text-primary hover:bg-purple-50 transition-all duration-200"
                                        >
                                            {classItem.label}
                                        </a>
                                    ))}
                                </div>

                                {/* Explore Category Link */}
                                <a
                                    href={category.href}
                                    className="inline-flex items-center gap-2 text-gray-900 font-medium hover:text-primary transition-colors group/link"
                                >
                                    <span>Explore Category</span>
                                    <div className="w-8 h-8 rounded-full bg-gray-200 group-hover/link:bg-primary flex items-center justify-center transition-all duration-300">
                                        <ArrowRight className="w-4 h-4 text-gray-700 group-hover/link:text-white transition-colors" />
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
