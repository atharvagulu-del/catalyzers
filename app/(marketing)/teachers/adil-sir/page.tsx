import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AdilSirPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
            {/* Back Button */}
            <div className="container px-4 md:px-6 py-6">
                <Link href="/teachers">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Teachers
                    </Button>
                </Link>
            </div>

            {/* Teacher Profile */}
            <section className="py-12 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="max-w-5xl mx-auto">
                        {/* Header with Image */}
                        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start mb-12">
                            {/* Teacher Image */}
                            <div className="w-64 h-64 flex-shrink-0">
                                <Image
                                    src="/assets/teachers/adilsir.png"
                                    alt="Adil Sir"
                                    width={256}
                                    height={256}
                                    className="w-full h-full object-contain"
                                    priority
                                />
                            </div>

                            {/* Name and Title */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                                    Adil Sir
                                </h1>
                                <p className="text-lg font-semibold text-primary mb-4">
                                    EXP: 14 YEARS
                                </p>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    Founder & Senior Physics Faculty
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Concept-driven Physics for JEE & NEET
                                </p>
                            </div>
                        </div>

                        {/* Full Bio */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    Adil Sir is the Founder and Senior Physics Faculty with over 14 years of experience teaching Physics for JEE and NEET.
                                    Highly respected for his in-depth knowledge and student-focused teaching approach, he specializes in Mechanics, Heat & Thermodynamics, Optics, Waves, Oscillations, and Modern Physics.
                                </p>

                                <p className="text-gray-700 leading-relaxed mb-6">
                                    His teaching emphasizes conceptual understanding, logical reasoning, and strong problem-solving skills. Adil Sir ensures that students don&apos;t just memorize formulas but truly understand Physics and learn how to apply concepts effectively in exams.
                                </p>

                                <p className="text-gray-700 leading-relaxed">
                                    With a proven track record of producing top performers year after year, his mentorship has been instrumental in shaping confident and capable aspirants for competitive examinations.
                                </p>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="mt-12 text-center">
                            <p className="text-lg text-gray-700 mb-6">
                                Ready to learn from Adil Sir?
                            </p>
                            <a href="/courses">
                                <Button size="lg" className="text-lg px-8">
                                    Enroll Now
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
