import Image from "next/image";
import Header from "@/components/Header";
import { Trophy, Star, TrendingUp, Award, Medal, GraduationCap } from "lucide-react";

// Expanded dummy data for the dedicated results page
const resultsData = {
    stats: [
        { label: "Selections in IITs", value: "500+", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Selections in NITs/IIITs", value: "1200+", icon: Star, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Selections in Top Medical Colleges", value: "800+", icon: Medal, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Success Rate", value: "94%", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
    ],
    categories: [
        {
            title: "JEE Advanced Top Rankers",
            description: "Exceptional performance in India's toughest engineering entrance exam.",
            themeColor: "indigo",
            students: [
                { name: "Vankatesh Amrutwar", rank: "AIR 45", college: "IIT Bombay", image: "/assets/toppers/vankateshamrutwariitbombay.png" },
                { name: "Deepak Suthar", rank: "AIR 112", college: "IIT Delhi", image: "/assets/toppers/deepaksuthariitdelhi.png" },
                { name: "Palak Khandelwal", rank: "AIR 245", college: "IIT Dhanbad", image: "/assets/toppers/palakkhandelwaliitdhanbad.png" },
                { name: "Rudra Gupta", rank: "AIR 301", college: "IIT Guwahati", image: "/assets/toppers/rudraguptaiitguwahti.png" },
            ]
        },
        {
            title: "NEET Top Scorers",
            description: "Securing seats in the most prestigious medical institutes across the country.",
            themeColor: "emerald",
            students: [
                { name: "Aarushi Verma", rank: "Score: 715/720", college: "AIIMS Delhi", image: "/assets/toppers/yogeshwarichandrawatiitdelhi.png" }, // Reusing image for dummy
                { name: "Rohan Sharma", rank: "Score: 710/720", college: "MAMC Delhi", image: "/assets/toppers/siddharthsagariitroorke.png" }, // Reusing image for dummy
                { name: "Meera Patel", rank: "Score: 705/720", college: "AFMC Pune", image: "/assets/toppers/palakkhandelwaliitdhanbad.png" }, // Reusing image for dummy
                { name: "Kabir Singh", rank: "Score: 700/720", college: "KGMU Lucknow", image: "/assets/toppers/rudraguptaiitguwahti.png" }, // Reusing image for dummy
            ]
        }
    ]
};

export default function ResultsPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#020617] text-white">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[100px]" />
                    <div
                        className="absolute inset-0 z-0 opacity-[0.1]"
                        style={{
                            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                            backgroundSize: '32px 32px'
                        }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 to-transparent z-1" />
                </div>

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                            <Award className="w-5 h-5 text-yellow-400" />
                            <span className="text-sm font-bold text-yellow-500 uppercase tracking-widest">Legacy of Excellence</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8">
                            Celebrating Our <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                                Champions
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                            Results speak louder than words. Discover the inspiring stories of students who transformed their dreams into reality with Catalyzers.
                        </p>
                    </div>
                </div>
            </section>

            {/* Impact Stats Section */}
            <section className="-mt-16 relative z-20 pb-16">
                <div className="container px-4 md:px-6">
                    <div className="max-w-6xl mx-auto bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 md:p-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                            {resultsData.stats.map((stat, idx) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={idx} className="flex flex-col items-center text-center">
                                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 transform hover:scale-110 transition-transform`}>
                                            <Icon className="w-7 h-7 md:w-8 md:h-8" />
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">{stat.value}</h3>
                                        <p className="text-sm md:text-base font-medium text-slate-500">{stat.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Results Grids */}
            <section className="py-16 md:py-24">
                <div className="container px-4 md:px-6">
                    <div className="max-w-7xl mx-auto space-y-32">
                        {resultsData.categories.map((category, idx) => (
                            <div key={idx} className="space-y-12">
                                {/* Category Header */}
                                <div className="text-center max-w-3xl mx-auto relative">
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                                        {category.title}
                                    </h2>
                                    <p className="text-lg text-slate-600">
                                        {category.description}
                                    </p>
                                </div>

                                {/* Category Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                    {category.students.map((student, sIdx) => (
                                        <div
                                            key={sIdx}
                                            className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:border-slate-300 transition-all duration-300 hover:-translate-y-2 relative"
                                        >
                                            {/* Rank Badge */}
                                            <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                                                <span className="text-sm font-extrabold text-slate-900">{student.rank}</span>
                                            </div>

                                            {/* Image Container */}
                                            <div className="aspect-square bg-slate-100 relative overflow-hidden">
                                                <div className={`absolute inset-0 bg-${category.themeColor}-100/50 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity z-0`} />
                                                <Image
                                                    src={student.image}
                                                    alt={student.name}
                                                    width={400}
                                                    height={400}
                                                    className="w-full h-full object-cover object-top scale-[1.05] group-hover:scale-100 transition-transform duration-500 relative z-1"
                                                    unoptimized
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="p-6 md:p-8 text-center bg-white relative z-10">
                                                <h3 className="text-xl font-bold text-slate-900 mb-2 truncate" title={student.name}>
                                                    {student.name}
                                                </h3>
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 w-full justify-center group-hover:bg-slate-100 transition-colors">
                                                    <GraduationCap className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm font-semibold truncate">{student.college}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
