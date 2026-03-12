import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen, FileText, Video, Award } from "lucide-react";

export const metadata = {
    title: "Free Study Material | Catalyzers",
    description: "Access our free study material, mock tests, and video resources.",
};

export default function StudyMaterialPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white py-20 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                            Free Study Resources
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
                            Access our curated collection of free study materials, practice tests, and foundational video lectures to kickstart your preparation.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="#notes" className="bg-white text-blue-900 hover:bg-blue-50 px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl">
                                Browse Notes
                            </a>
                            <a href="/dashboard" className="bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/50 text-white px-6 py-3 rounded-xl font-bold transition-all backdrop-blur-sm">
                                Login for More
                            </a>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="py-20 px-4 max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                id: "notes",
                                title: "Revision Notes",
                                description: "Chapter-wise quick revision notes for all subjects.",
                                icon: <FileText className="w-8 h-8 text-blue-600" />,
                                color: "bg-blue-50 border-blue-100",
                            },
                            {
                                id: "tests",
                                title: "Mock Tests",
                                description: "Attempt free chapter-wise and full-length mock tests.",
                                icon: <Award className="w-8 h-8 text-indigo-600" />,
                                color: "bg-indigo-50 border-indigo-100",
                            },
                            {
                                id: "videos",
                                title: "Concept Videos",
                                description: "Watch free conceptual videos to strengthen basics.",
                                icon: <Video className="w-8 h-8 text-purple-600" />,
                                color: "bg-purple-50 border-purple-100",
                            },
                            {
                                id: "books",
                                title: "E-Books",
                                description: "Download free e-books and past year papers.",
                                icon: <BookOpen className="w-8 h-8 text-sky-600" />,
                                color: "bg-sky-50 border-sky-100",
                            },
                        ].map((item) => (
                            <div key={item.id} className={`p-6 rounded-2xl border ${item.color} hover:shadow-md transition-all`}>
                                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed mb-6">{item.description}</p>
                                <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center gap-2">
                                    Explore &rarr;
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-16 px-4 bg-white border-t border-slate-100">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">Want the full experience?</h2>
                        <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                            Register now to unlock all premium video lectures, personalized performance tracking, and direct doubt resolution with expert mentors.
                        </p>
                        <a href="/dashboard" className="inline-block bg-[#5A4BDA] hover:bg-[#4a3ca0] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl">
                            Create Free Account
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
