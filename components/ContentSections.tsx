import Image from "next/image";

const features = [
    {
        icon: "/assets/icons/course.svg",
        title: "Comprehensive Courses",
        description:
            "Intensive programs covering every topic in depth with regular assessments",
        color: "from-blue-500 to-cyan-500",
    },
    {
        icon: "/assets/icons/teacher.svg",
        title: "Expert Faculty",
        description:
            "Learn from India's best educators with years of teaching experience",
        color: "from-purple-500 to-pink-500",
    },
    {
        icon: "/assets/icons/savemoney.svg",
        title: "Affordable Pricing",
        description: "Quality education at prices that don't burden families",
        color: "from-green-500 to-emerald-500",
    },
    {
        icon: "/assets/icons/target.svg",
        title: "Result-Oriented",
        description: "Proven track record of success in competitive exams",
        color: "from-orange-500 to-red-500",
    },
];

export default function ContentSections() {
    return (
        <>
            {/* Vidyapeeth Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-accent/10 to-primary/10">
                <div className="container px-4 md:px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Catalyzer Vidyapeeth
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Experience offline coaching at our state-of-the-art centers across
                        India
                    </p>
                    <a href="/courses">
                        <button className="px-8 py-3 bg-white border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-xl">
                            Enroll Now
                        </button>
                    </a>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container px-4 md:px-6">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8">
                        Know About{" "}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Catalyzer
                        </span>
                    </h2>
                    <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
                        <p>
                            Catalyzer is revolutionizing education in India by making quality
                            learning accessible and affordable to every student. With our
                            comprehensive courses, expert faculty, and innovative teaching
                            methods, we&apos;ve helped millions of students achieve their academic
                            goals.
                        </p>
                        <p>
                            From competitive exam preparation to school curriculum support, we
                            offer a complete learning ecosystem that nurtures talent and
                            builds confidence.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why We Stand Out */}
            <section className="py-16 md:py-24 bg-gray-50">
                <div className="container px-4 md:px-6">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12">
                        We Stand Out{" "}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Because
                        </span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            return (
                                <div
                                    key={feature.title}
                                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div
                                        className={`inline-flex items-center justify-center w-20 h-20 rounded-xl bg-white mb-4 p-4 shadow-sm`}
                                    >
                                        <Image
                                            src={feature.icon}
                                            alt={feature.title}
                                            width={48}
                                            height={48}
                                            className="w-12 h-12"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Key Focus Areas */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container px-4 md:px-6">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12">
                        Our Key{" "}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Focus Areas
                        </span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {[
                            {
                                title: "Lakshya Program",
                                description:
                                    "Comprehensive JEE preparation with personalized mentorship",
                            },
                            {
                                title: "Udaan Program",
                                description:
                                    "NEET preparation with medical experts and extensive practice",
                            },
                            {
                                title: "Arjuna Program",
                                description: "Foundation courses for Class 6-10 students",
                            },
                            {
                                title: "Prayas Program",
                                description: "Board exam preparation with concept clarity focus",
                            },
                        ].map((program, index) => (
                            <div
                                key={program.title}
                                className="border-l-4 border-primary pl-6 py-4 hover:bg-purple-50 transition-colors duration-300 rounded-r-lg"
                            >
                                <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                                <p className="text-gray-600">{program.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What Makes Us Different */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-purple-50">
                <div className="container px-4 md:px-6">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12">
                        What Makes Us{" "}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Different
                        </span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                title: "Pedagogical Excellence",
                                description:
                                    "Our unique teaching methodology ensures concept clarity and long-term retention",
                            },
                            {
                                title: "State Board Support",
                                description:
                                    "Comprehensive coverage of all major state boards alongside CBSE",
                            },
                            {
                                title: "Live Doubt Solving",
                                description:
                                    "Instant doubt resolution with dedicated faculty support",
                            },
                            {
                                title: "Regular Assessments",
                                description:
                                    "Continuous evaluation to track progress and identify improvement areas",
                            },
                        ].map((item, index) => (
                            <div
                                key={item.title}
                                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <h3 className="text-2xl font-bold mb-3 text-primary">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
