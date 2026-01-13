import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function MayankSirPage() {
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
                                    src="/assets/teachers/mayanksir.png"
                                    alt="Mayank Sir"
                                    width={256}
                                    height={256}
                                    className="w-full h-full object-contain"
                                    priority
                                />
                            </div>

                            {/* Name and Title */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                                    Mayank Sir
                                </h1>
                                <p className="text-lg font-semibold text-primary mb-4">
                                    EXP: 8 YEARS
                                </p>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    Senior Mathematics Faculty
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Concept-based teaching with a strong focus on problem-solving and clarity
                                </p>
                            </div>
                        </div>

                        {/* Full Bio */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    Mayank Sir is a Senior Mathematics Faculty with 8 years of JEE teaching experience.
                                    Dedicated, dynamic, and highly skilled, he is known for his concept-based teaching style and passion for making mathematics engaging and easy to understand. His approach focuses on logical thinking and effective problem-solving, helping students build strong fundamentals required for competitive exams.
                                </p>

                                <p className="text-gray-700 leading-relaxed mb-6">
                                    Known for breaking down complex topics into simple, structured steps, Mayank Sir ensures that students not only learn mathematics but also develop confidence in applying concepts to challenging problems. Whether it is Algebra, Calculus, or Coordinate Geometry, his sessions are aimed at building deep conceptual clarity and consistency.
                                </p>

                                <p className="text-gray-700 leading-relaxed">
                                    His approachable nature and student-centric teaching have helped numerous aspirants excel in board exams as well as competitive examinations year after year.
                                </p>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="mt-12 text-center">
                            <p className="text-lg text-gray-700 mb-6">
                                Ready to learn from Mayank Sir?
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
