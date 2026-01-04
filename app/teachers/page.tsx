import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const teachers = [
    {
        id: "adil-sir",
        name: "Adil Sir",
        experience: "14 YEARS",
        role: "Founder & Senior Physics Faculty for JEE & NEET",
        shortBio: "With over 14 years of experience in teaching Physics for JEE and NEET, Adil Sir is a highly respected educator known for his crystal-clear concept delivery, structured approach, and result-oriented mentorship. His classes are designed to empower students with a deep understanding of Physics while sharpening their problem-solving skills essential for cracking top competitive exams.",
        image: "/assets/teachers/adilsir.png",
        imagePosition: "left",
    },
    {
        id: "kirti-maam",
        name: "Kirti Ma'am",
        experience: "15 YEARS",
        role: "Senior Chemistry Faculty",
        shortBio: "With an impressive 15-year track record in coaching students for JEE and NEET, Kirti Ma'am stands out as a seasoned and inspiring Chemistry faculty. Her passion for teaching and deep command over the subject have helped thousands of students grasp even the most challenging concepts with ease.",
        image: "/assets/teachers/kirtimam.png",
        imagePosition: "right",
    },
    {
        id: "mayank-sir",
        name: "Mayank Sir",
        experience: "8 YEARS",
        role: "Senior Mathematics Faculty",
        shortBio: "Dedicated, dynamic, and highly skilled in teaching Mathematics to JEE aspirants, Mayank Sir brings 8 years of experience and a genuine passion for making math engaging and accessible. His focus is on helping students move toward achieving their dream ranks.",
        image: "/assets/teachers/mayanksir.png",
        imagePosition: "left",
    },
];

export default function TeachersPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary via-primary-dark to-purple-900 text-white py-16 md:py-20 mt-16">
                <div className="container px-4 md:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
                            Our Teachers
                        </h1>
                        <p className="text-lg md:text-xl text-purple-100">
                            Meet the expert faculty who will guide you to success
                        </p>
                    </div>
                </div>
            </section>

            {/* Teachers List */}
            <section className="py-16 md:py-24 bg-gradient-to-b from-white via-purple-50/30 to-white">
                <div className="container px-4 md:px-6">
                    <div className="max-w-7xl mx-auto space-y-20 md:space-y-28">
                        {teachers.map((teacher, index) => (
                            <div
                                key={teacher.id}
                                className="group relative pb-16 md:pb-20"
                            >
                                <div
                                    className={`flex flex-col ${teacher.imagePosition === "right"
                                            ? "md:flex-row-reverse"
                                            : "md:flex-row"
                                        } gap-8 md:gap-12 items-center`}
                                >
                                    {/* Teacher Image */}
                                    <div className="w-full md:w-2/5 flex-shrink-0">
                                        <div className="relative w-full aspect-square max-w-md mx-auto transform transition-transform duration-500 group-hover:scale-105">
                                            <Image
                                                src={teacher.image}
                                                alt={teacher.name}
                                                width={400}
                                                height={400}
                                                className="w-full h-full object-contain drop-shadow-2xl"
                                                priority
                                            />
                                        </div>
                                    </div>

                                    {/* Teacher Info */}
                                    <div className="flex-1 text-center md:text-left">
                                        {/* Name and Experience */}
                                        <div className="mb-6">
                                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                                                {teacher.name}
                                            </h2>
                                            <p className="text-base md:text-lg font-bold text-primary mb-3">
                                                EXP: {teacher.experience}
                                            </p>
                                            <p className="text-xl md:text-2xl font-semibold text-gray-800">
                                                {teacher.role}
                                            </p>
                                        </div>

                                        {/* Short Bio */}
                                        <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">
                                            {teacher.shortBio}
                                        </p>

                                        {/* Read More Button */}
                                        <Link href={`/teachers/${teacher.id}`}>
                                            <Button
                                                size="lg"
                                                className="group-hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-xl"
                                            >
                                                Read More
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Thin Separator Line */}
                                {index < teachers.length - 1 && (
                                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
