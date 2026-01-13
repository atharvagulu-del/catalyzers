import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function KirtiMaamPage() {
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
                                    src="/assets/teachers/kirtimam.png"
                                    alt="Kirti Ma'am"
                                    width={256}
                                    height={256}
                                    className="w-full h-full object-contain"
                                    priority
                                />
                            </div>

                            {/* Name and Title */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                                    Kirti Ma&apos;am
                                </h1>
                                <p className="text-lg font-semibold text-primary mb-4">
                                    EXP: 15 YEARS
                                </p>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    Senior Chemistry Faculty
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Expert in Physical, Organic & Inorganic Chemistry
                                </p>
                            </div>
                        </div>

                        {/* Full Bio */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    Kirti Ma&apos;am is a Senior Chemistry Faculty with over 15 years of experience in teaching for JEE and NEET.
                                    Her teaching spans Physical, Organic, and Inorganic Chemistry, with a strong emphasis on concept clarity and exam-oriented preparation.
                                </p>

                                <p className="text-gray-700 leading-relaxed mb-6">
                                    Known for her crystal-clear explanations and structured teaching approach, she simplifies complex chemical concepts and connects theory with practical problem-solving. Her sessions are engaging, systematic, and tailored to meet the unique needs of competitive exam aspirants.
                                </p>

                                <p className="text-gray-700 leading-relaxed">
                                    Kirti Ma&apos;am&apos;s guidance has played a crucial role in helping students excel in both board examinations and national-level entrance tests. Her approachable nature and consistent mentoring make her a trusted name among students.
                                </p>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="mt-12 text-center">
                            <p className="text-lg text-gray-700 mb-6">
                                Ready to learn from Kirti Ma&apos;am?
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
