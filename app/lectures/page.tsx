"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";

import Image from "next/image";

export default function LecturesPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-grow container px-4 md:px-6 py-12">
                <div className="relative text-center mb-16 py-16 md:py-32 overflow-hidden rounded-3xl shadow-xl">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/assets/teachers/allteacher.jpg"
                            alt="Teachers Background"
                            fill
                            className="object-cover object-[center_25%]"
                            priority
                        />
                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-black/60"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 px-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                            Explore our <span className="text-primary-foreground text-yellow-400">Courses</span>
                        </h1>
                        <p className="text-lg text-gray-100 max-w-2xl mx-auto drop-shadow-md font-medium">
                            Select your exam and class to start learning with our comprehensive video lectures, quizzes, and PYQs.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* JEE Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-blue-50 p-6 border-b border-blue-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                    <GraduationCap className="h-8 w-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">JEE (Main + Advanced)</h2>
                                    <p className="text-gray-600 text-sm">For Aspiring Engineers</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Class 11 */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                                    Class 11
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <SubjectCard exam="jee" subject="mathematics" grade="11" label="Mathematics" color="bg-blue-50 hover:bg-blue-100 text-blue-700" />
                                    <SubjectCard exam="jee" subject="physics" grade="11" label="Physics" color="bg-purple-50 hover:bg-purple-100 text-purple-700" />
                                    <SubjectCard exam="jee" subject="chemistry" grade="11" label="Chemistry" color="bg-teal-50 hover:bg-teal-100 text-teal-700" />
                                </div>
                            </div>

                            {/* Class 12 */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                                    Class 12
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <SubjectCard exam="jee" subject="mathematics" grade="12" label="Mathematics" color="bg-blue-50 hover:bg-blue-100 text-blue-700" />
                                    <SubjectCard exam="jee" subject="physics" grade="12" label="Physics" color="bg-purple-50 hover:bg-purple-100 text-purple-700" />
                                    <SubjectCard exam="jee" subject="chemistry" grade="12" label="Chemistry" color="bg-teal-50 hover:bg-teal-100 text-teal-700" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* NEET Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-emerald-50 p-6 border-b border-emerald-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                                    <BookOpen className="h-8 w-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">NEET (Medical)</h2>
                                    <p className="text-gray-600 text-sm">For Aspiring Doctors</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Class 11 */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                                    Class 11
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <SubjectCard exam="neet" subject="biology" grade="11" label="Biology" color="bg-emerald-50 hover:bg-emerald-100 text-emerald-700" />
                                    <SubjectCard exam="neet" subject="physics" grade="11" label="Physics" color="bg-purple-50 hover:bg-purple-100 text-purple-700" />
                                    <SubjectCard exam="neet" subject="chemistry" grade="11" label="Chemistry" color="bg-teal-50 hover:bg-teal-100 text-teal-700" />
                                </div>
                            </div>

                            {/* Class 12 */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                                    Class 12
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <SubjectCard exam="neet" subject="biology" grade="12" label="Biology" color="bg-emerald-50 hover:bg-emerald-100 text-emerald-700" />
                                    <SubjectCard exam="neet" subject="physics" grade="12" label="Physics" color="bg-purple-50 hover:bg-purple-100 text-purple-700" />
                                    <SubjectCard exam="neet" subject="chemistry" grade="12" label="Chemistry" color="bg-teal-50 hover:bg-teal-100 text-teal-700" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function SubjectCard({ exam, subject, grade, label, color }: { exam: string, subject: string, grade: string, label: string, color: string }) {
    return (
        <Link
            href={`/lectures/${exam}/${subject}-${grade}`}
            className={`p-4 rounded-xl border border-transparent transition-all duration-300 flex items-center justify-between group ${color}`}
        >
            <span className="font-semibold">{label}</span>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
        </Link>
    );
}
