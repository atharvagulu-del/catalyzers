"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Trophy, Star, TrendingUp, Medal, Sparkles, GraduationCap, Microscope } from "lucide-react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import HeroParticles from "@/components/HeroParticles";

// Actual Results Data
const JEE_ADVANCED = [
    { name: "Vankatesh Amrutwar", college: "IIT Mumbai", percentile: null, image: "/assets/students/Vankatesh Amrutwar.png" },
    { name: "Yogeshwari Chandrawat", college: "IIT Delhi", percentile: null, image: "/assets/students/Yogeshwari Chandrawat.png" },
    { name: "Deepak Suthar", college: "IIT Delhi", percentile: "99.84", image: "/assets/students/Deepak Suthar.png" },
    { name: "Shreya Singh", college: "IIT Delhi", percentile: "99.77", image: "/assets/students/Shreya Singh.png" },
    { name: "Siddharth Sagar", college: "IIT Roorkee", percentile: null, image: "/assets/students/Siddharth Sagar.png" },
    { name: "Abhinav Shrivastava", college: "IIT Dhanbad", percentile: null, image: "/assets/students/Abhinav Shrivastava.png" },
    { name: "Palak Khandelwal", college: "IIT Dhanbad", percentile: null, image: "/assets/students/Palak Khandelwal.png" },
    { name: "Amit", college: "IIT Dhanbad", percentile: null, image: "/assets/students/Amit.png" },
    { name: "Rudra Gupta", college: "IIT Guwahati", percentile: "99.95", image: "/assets/students/Rudra Gupta.png" },
];

const JEE_MAINS = [
    { name: "Rudra Gupta", percentile: "99.95", image: "/assets/students/Rudra Gupta.png" },
    { name: "Deepak Suthar", percentile: "99.84", image: "/assets/students/Deepak Suthar.png" },
    { name: "Shreya Singh", percentile: "99.77", image: "/assets/students/Shreya Singh.png" },
    { name: "Yash", percentile: "99.20", image: "/assets/students/Yash.png" },
    { name: "Saloni Singla", percentile: "99.19", image: "/assets/students/Saloni Singla.png" },
    { name: "Aditya Choudhary", percentile: "98.88", image: "/assets/students/Aditya Choudhary.png", scaleClass: "scale-[1.35] group-hover:scale-[1.40]" },
    { name: "Ansh Gupta", percentile: "98.82", image: null },
    { name: "Rupam Ratan", percentile: "98.62", image: null },
    { name: "Bhavya Agarwal", percentile: "98.28", image: "/assets/students/Bhavya agrawal.png", scaleClass: "scale-[1.35] group-hover:scale-[1.40]" },
    { name: "Ishan Sunil Mittal", percentile: "96.20", image: null },
    { name: "Kevanna Mutha", percentile: "95.12", image: null },
];

const OTHER_ENGINEERING = [
    { name: "Saloni Singla", college: "IIIT Allahabad", percentile: "99.19", image: "/assets/students/Saloni Singla.png" },
    { name: "Gourav Sarvata", college: "NIT Patna", percentile: null, image: null },
    { name: "Yash", college: "BITS Pilani", percentile: "99.20", image: "/assets/students/Yash.png" },
    { name: "Bhavya Agarwal", college: "BITS Pilani", percentile: "98.28", image: "/assets/students/Bhavya agrawal.png", scaleClass: "scale-[1.35]" },
];

const MEDICAL_STUDENTS = [
    { name: "Dr. Smriti Ranjan", image: "/assets/students/Smriti.png" },
    { name: "Dr. Satish Kumar", image: "/assets/students/Satish Kumar.png" },
    { name: "Dr. Apeksha Prasad", image: "/assets/students/Anoksha Prasad.png" },
    { name: "Dr. Palak Jaiswal", image: "/assets/students/Palak Jaiswal.png" },
    { name: "Dr. Anushka Keshriya", image: "/assets/students/Anushka Shetriya.png" },
    { name: "Dr. Atul Patel", image: "/assets/students/Atul Patel.png" },
    { name: "Dr. Mamta Choudhary", image: "/assets/students/Mamta Choudhary.png" },
    { name: "Dr. Isha Gupta", image: "/assets/students/Isha Gupta.png" },
    { name: "Dr. Shriya Singh", image: "/assets/students/Shriya Singh.png" },
    { name: "Dr. Pawanraj Kanjolia", image: "/assets/students/Purvansh Kanjolia.png" },
    { name: "Dr. Shweta Jain", image: "/assets/students/Shweta Jain.png" },
    { name: "Dr. Manyata Nema", image: "/assets/students/Manyata Nema.png" },
    { name: "Dr. Tanu Maheshwari", image: "/assets/students/Tanu Maheshwari.png" },
    { name: "Dr. Ankit Yadav", image: "/assets/students/Ankit Yadav.png" },
    { name: "Dr. Rivan Pravesh", image: "/assets/students/V Ram Pravesh.png" },
    { name: "Dr. Shivam Maria", image: "/assets/students/Shivam Maria.png" },
    { name: "Dr. Fiza", image: "/assets/students/Fiza Sayed.png" },
    { name: "Dr. Shubham Bhargav", image: "/assets/students/Shubham Bhargava.png" },
    { name: "Dr. Priyanka Bapna", image: "/assets/students/Priyanka Bapna.png" },
    { name: "Dr. Priyanka Roonwal", image: "/assets/students/Priyanka Roonthala.png" },
    { name: "Dr. Abhishek Das", image: "/assets/students/Abhishek Das.png" },
    { name: "Dr. Yuka Yadav", image: "/assets/students/Yukta Yadav.png" },
    { name: "Dr. Sapna Kumari", image: "/assets/students/Sapna Kumari.png" },
    { name: "Dr. Shaurya Diwakar", image: "/assets/students/Shaurya Diwakar.png" },
    { name: "Dr. Monika", image: "/assets/students/Monika.png" },
    { name: "Dr. Nishant Baligar", image: "/assets/students/Nishant Balighar.png" },
    { name: "Dr. Twinkle Gangwani", image: "/assets/students/Twinkle Gangwani.png" },
    { name: "Bhavya Pratap Singh", image: "/assets/students/Bhanu Pratap Singh.png" },
    { name: "Mansi Bilodiya", image: "/assets/students/Mansi Bhalodia.png" },
    { name: "Dr. Shriti Jain", image: "/assets/students/Shruti Jain.png" },
    { name: "Dr. Mallika Meena", image: "/assets/students/Malika Meena.png" },
    { name: "Dr. Harshini Raj", image: "/assets/students/Harshini Raj.png" },
    { name: "Dr. Saumya Pathak", image: "/assets/students/Saumya Phatak.png" },
    { name: "Dr. Mansi Jaiswal", image: "/assets/students/Mansi Jajodiya.png" },
    { name: "Dr. Machhindra", image: null },
    { name: "Dr. Nitin Ahmed Vasti", image: null },
    { name: "Dr. Shivkali Awas", image: null },
    { name: "Dr. Asif Raza", image: null },
    { name: "Dr. Deepankar Rathore", image: "/assets/students/Dipankar Rabha.png" },
];

const TESTIMONIALS = [
    {
        name: "Deepak Suthar",
        college: "IIT Delhi",
        quote: "The personalized attention and high-quality study material at Catalyzers were the game-changers in my JEE preparation.",
        image: "/assets/students/Deepak Suthar.png"
    },
    {
        name: "Shreya Singh",
        college: "IIT Delhi",
        quote: "Constant mock tests and rigorous analysis helped me identify my weak spots and improve immensely.",
        image: "/assets/students/Shreya Singh.png"
    },
    {
        name: "Rudra Gupta",
        college: "IIT Guwahati",
        quote: "Catalyzers provided an environment composed of healthy competition and immense support which pushed me.",
        image: "/assets/students/Rudra Gupta.png"
    },
    {
        name: "Dr. Smriti Ranjan",
        college: "Top Medical College",
        quote: "The biology faculty is unmatched. Their conceptual clarity and NCERT-focused approach made cracking NEET easier.",
        image: "/assets/students/Smriti.png"
    },
    {
        name: "Yash",
        college: "BITS Pilani",
        quote: "I never felt like just another student. The mentorship and doubt-solving sessions gave me the confidence I needed.",
        image: "/assets/students/Yash.png"
    }
];

export default function ResultsPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-indigo-500/30">
            <Header />

            {/* Premium Hero Section */}
            <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-slate-950">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    {/* Core glowing orb */}
                    <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-indigo-600/10 blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[100px]" />
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px]" />

                    {/* Premium grid texture */}
                    <div className="absolute inset-0 z-0 opacity-[0.15]"
                        style={{
                            backgroundImage: 'linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)',
                            backgroundSize: '64px 64px'
                        }}
                    />
                </div>

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="max-w-5xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/50 border border-indigo-500/20 backdrop-blur-md animate-fade-in-up">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            <span className="text-sm font-semibold text-indigo-300 tracking-wider">CATALYZERS 2024 LEGACY</span>
                        </div>

                        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white leading-[1.05] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            The Benchmark of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                                Excellence
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Over <strong className="text-indigo-400">5,000+</strong> students selected in premium engineering and medical institutes in the last 3 years alone.
                        </p>
                    </div>
                </div>
            </section>

            {/* Dynamic Success Marquee */}
            <div className="w-full bg-indigo-600 border-y border-indigo-500 relative z-20 py-3 overflow-hidden">
                <Marquee speed={40} gradient={false} pauseOnHover={true}>
                    {[...JEE_ADVANCED, ...JEE_MAINS, ...MEDICAL_STUDENTS].slice(0, 20).map((student, idx) => (
                        <div key={idx} className="flex items-center space-x-2 mx-8 text-white/90">
                            <span className="font-bold text-sm uppercase tracking-wider">{student.name}</span>
                            <span className="text-indigo-300 mx-2">•</span>
                        </div>
                    ))}
                    <div className="flex items-center space-x-2 mx-8 text-white/90">
                        <span className="font-bold text-sm uppercase tracking-wider text-indigo-200">+4,980 MORE SELECTIONS</span>
                        <span className="text-indigo-300 mx-2">•</span>
                    </div>
                </Marquee>
            </div>

            {/* Highlights Bar */}
            <div className="w-full bg-slate-900 border-b border-slate-800 relative z-20 shadow-[0_0_40px_rgba(79,70,229,0.05)]">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center py-12 md:py-16 cursor-default relative overflow-hidden group">
                        {/* Decorative subtle pulse glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/10 blur-[50px] rounded-full group-hover:bg-amber-500/20 transition-all duration-700" />
                        
                        <Trophy className="w-12 h-12 md:w-16 md:h-16 text-amber-400 mb-6 opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] relative z-10" />
                        <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-400 tracking-tight mb-4 drop-shadow-2xl relative z-10">
                            3,000+
                        </span>
                        <span className="text-sm md:text-base lg:text-lg font-bold text-amber-400/90 tracking-[0.2em] uppercase relative z-10">
                            Verified Total Selections
                        </span>
                    </div>
                </div>
            </div>

            {/* SECTION 1: JEE STUDENTS */}
            <section className="py-32 bg-[#020617] relative overflow-hidden">
                {/* Background ambient lighting */}
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center mb-24 space-y-6">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                            <span className="font-bold tracking-widest uppercase text-sm">Engineering Hall of Fame</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight text-center">JEE Selections</h2>
                        <p className="text-slate-400 text-lg md:text-xl text-center max-w-2xl leading-relaxed">Outstanding performances across JEE Advanced, JEE Mains, and top engineering colleges in India.</p>
                    </div>

                    {/* JEE Advanced (IIT Selections) */}
                    <div className="mb-32 relative">
                        <div className="flex justify-center items-center gap-6 mb-16">
                            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-indigo-500/50"></div>
                            <h3 className="text-4xl font-black text-white whitespace-nowrap drop-shadow-lg">JEE Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">| IIT Selections</span></h3>
                            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-indigo-500/50"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto" style={{ perspective: "1000px" }}>
                            {JEE_ADVANCED.map((student, i) => (
                                <div key={i} className="group relative bg-[#0a0f1c] rounded-3xl p-[1px] overflow-hidden transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.4)] hover:bg-[#10172e] transform-gpu hover:scale-105 will-change-transform z-10 hover:z-20">
                                    {/* Animated RGB border effect on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 opacity-20 group-hover:opacity-100 transition-opacity duration-700 blur" />

                                    <div className="relative bg-[#050b14] rounded-[1.4rem] h-full overflow-hidden flex flex-col items-center">
                                        {/* Dynamic Glare overlay */}
                                        <div className="absolute inset-0 z-30 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none translate-x-[-100%] group-hover:translate-x-[100%] ease-in-out" style={{ transition: 'all 1.5s ease-in-out' }} />

                                        <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
                                            <div className="bg-slate-900/80 backdrop-blur-md text-white font-black text-xs px-4 py-2 rounded-xl border border-white/10 shadow-2xl transition-transform group-hover:scale-110">
                                                {student.college}
                                            </div>
                                            {student.percentile && (
                                                <div className="px-3 py-1.5 bg-emerald-500/10 backdrop-blur-md rounded-xl text-xs font-black text-emerald-400 border border-emerald-500/20 shadow-2xl transition-transform group-hover:scale-110">
                                                    {student.percentile} <span className="opacity-70 font-bold ml-0.5 text-[10px]">%ile</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="relative h-80 w-full mt-auto flex items-end justify-center bg-gradient-to-b from-transparent to-[#0a0f1c] overflow-hidden">
                                            {/* Glow behind image */}
                                            <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-indigo-500/30 blur-[60px] rounded-full group-hover:bg-indigo-500/70 transition-colors duration-700 ease-in-out" />
                                            {student.image && (
                                                <Image
                                                    src={student.image}
                                                    alt={student.name}
                                                    fill
                                                    className="object-contain object-bottom transition-transform duration-700 ease-out drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] z-10 p-6 pb-0 group-hover:scale-105"
                                                    unoptimized
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-[#050b14]/40 to-transparent z-10 pointer-events-none" />
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out bg-gradient-to-t from-[#050b14] via-[#050b14]/90 to-transparent pt-12">
                                            <h3 className="text-2xl font-black text-white drop-shadow-md tracking-tight leading-tight transform group-hover:scale-105 transition-transform duration-500">{student.name}</h3>
                                            <div className="h-1 w-12 bg-indigo-500 rounded-full mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-all duration-700 shadow-[0_0_15px_rgba(99,102,241,0.8)] group-hover:w-24" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* JEE Mains Top Results */}
                    <div className="mb-32">
                        <div className="flex justify-center items-center gap-6 mb-16">
                            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-slate-700"></div>
                            <h3 className="text-3xl font-bold text-white whitespace-nowrap">JEE Mains <span className="text-slate-500 font-medium">| Top Performers</span></h3>
                            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-slate-700"></div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
                            {JEE_MAINS.filter(s => s.image).map((student, i) => (
                                <div key={i} className="group relative bg-[#0a0f1c] rounded-2xl border border-slate-800/80 overflow-hidden hover:border-indigo-500/60 transition-all duration-500 flex flex-col translate-y-0 hover:-translate-y-2 shadow-lg hover:shadow-[0_15px_40px_-10px_rgba(79,70,229,0.2)]">
                                    <div className="relative aspect-[4/5] w-full bg-[#050b14] flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                                        {student.image ? (
                                            <Image
                                                src={student.image}
                                                alt={student.name}
                                                fill
                                                className={`object-cover object-top opacity-85 group-hover:opacity-100 ${(student as any).scaleClass || 'scale-100 group-hover:scale-105'} transition-transform duration-700 ease-out z-0`}
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center transform group-hover:scale-110 group-hover:border-indigo-500/40 transition-all duration-500 relative z-10 shadow-lg">
                                                <Trophy className="w-8 h-8 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-transparent to-transparent z-10" />
                                    </div>
                                    <div className="p-4 relative z-20 text-center flex flex-col items-center justify-between bg-gradient-to-t from-[#0a0f1c] to-transparent h-[100px]">
                                        <h4 className="font-bold text-slate-300 text-[15px] leading-snug group-hover:text-white transition-colors line-clamp-2">{student.name}</h4>
                                        <div className="inline-flex items-center justify-center px-4 py-1.5 mt-auto bg-slate-900 text-indigo-400 font-bold text-sm rounded-lg border border-slate-800 shadow-inner group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 group-hover:text-indigo-300 transition-colors duration-300">
                                            {student.percentile} <span className="text-[10px] font-bold ml-1 opacity-60 group-hover:opacity-100 tracking-wider"> %ILE</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Other Engineering Colleges */}
                    <div>
                        <div className="flex justify-center items-center gap-6 mb-12">
                            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-slate-800"></div>
                            <h3 className="text-2xl font-bold text-slate-400 whitespace-nowrap uppercase tracking-widest text-sm">Other Premium Institutes</h3>
                            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-slate-800"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
                            {OTHER_ENGINEERING.filter(s => s.image).map((student, i) => (
                                <div key={i} className="flex items-center gap-5 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700/80 transition-all duration-300 group hover:-translate-y-1">
                                    <div className="w-16 h-16 rounded-xl bg-[#050b14] border border-slate-800 relative overflow-hidden shrink-0 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] group-hover:border-indigo-500/30 transition-colors">
                                        {student.image ? (
                                            <Image
                                                src={student.image}
                                                alt={student.name}
                                                fill
                                                className={`object-cover object-top opacity-80 group-hover:opacity-100 ${(student as any).scaleClass || 'scale-100'} transition-all`}
                                                unoptimized
                                            />
                                        ) : (
                                            <GraduationCap className="w-7 h-7 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-200 text-[15px] truncate group-hover:text-white transition-colors">{student.name}</h4>
                                        <p className="text-indigo-400/90 text-[13px] font-semibold truncate mt-0.5">{student.college}</p>
                                        {student.percentile && (
                                            <p className="text-slate-500 font-medium text-[11px] mt-1.5 bg-slate-950 inline-block px-2 py-0.5 rounded border border-slate-800/60 group-hover:text-slate-400 group-hover:border-slate-700 transition-colors">{student.percentile} %ile</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: MEDICAL STUDENTS */}
            <section className="py-32 bg-slate-950 relative border-t border-slate-900/50 overflow-hidden">
                {/* Background ambient lighting */}
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center mb-24 space-y-6">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                            <span className="font-bold tracking-widest uppercase text-sm">Medical Hall of Fame</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight text-center">Medical Selections</h2>
                        <p className="text-slate-400 text-lg md:text-xl text-center max-w-2xl leading-relaxed">Future doctors emerging from our rigorous pre-medical preparation program.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-5">
                        {MEDICAL_STUDENTS.filter(s => s.image).map((student, i) => (
                            <div key={i} className="group relative bg-[#050b14] rounded-2xl overflow-hidden aspect-[3/4] border border-slate-800/60 hover:border-emerald-500/60 hover:shadow-[0_15px_30px_-10px_rgba(16,185,129,0.3)] transition-all duration-500 translate-y-0 hover:-translate-y-2 flex flex-col">
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none" />
                                {student.image ? (
                                    <Image
                                        src={student.image}
                                        alt={student.name}
                                        fill
                                        className="object-cover object-top opacity-85 group-hover:opacity-100 scale-100 group-hover:scale-105 transition-all duration-700 ease-out z-0"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0f1c] transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out z-0">
                                        <div className="w-16 h-16 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center shadow-lg group-hover:border-emerald-500/30 transition-colors">
                                            <Microscope className="w-8 h-8 text-slate-600 group-hover:text-emerald-500/80 transition-colors" />
                                        </div>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent z-10 pointer-events-none" />

                                <div className="absolute bottom-0 left-0 right-0 p-4 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out z-20 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent pt-10">
                                    <div className="text-[13px] sm:text-[14px] font-bold text-slate-300 line-clamp-2 drop-shadow-md leading-tight group-hover:text-white transition-colors">
                                        {student.name}
                                    </div>
                                    <div className="h-[2px] w-8 mx-auto mt-2 rounded bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Marquee Section */}
            <section className="py-24 bg-[#0a0f1c] relative border-y border-slate-800/60 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-[100%] pointer-events-none" />
                <div className="container px-4 md:px-6 relative z-10 mb-16">
                    <div className="flex flex-col items-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight text-center">Words of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Success</span></h2>
                        <p className="text-slate-400 text-lg text-center max-w-2xl">Hear straight from our toppers about their journey with Catalyzers.</p>
                    </div>
                </div>

                <div className="relative z-20 w-full pb-8">
                    {/* Fade Edges for Marquee */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0f1c] to-transparent z-30 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0f1c] to-transparent z-30 pointer-events-none" />

                    <Marquee speed={35} gradient={false} pauseOnHover={true} className="py-4">
                        {TESTIMONIALS.map((testimonial, idx) => (
                            <div key={idx} className="mx-4 w-[400px] bg-[#0f172a] border border-slate-800/80 rounded-3xl p-8 flex flex-col hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all duration-300 group shadow-lg hover:shadow-[0_15px_30px_-10px_rgba(79,70,229,0.15)] relative overflow-hidden">
                                <div className="absolute -top-6 -right-6 text-9xl text-slate-800/30 font-serif leading-none group-hover:text-indigo-500/10 transition-colors pointer-events-none">"</div>
                                <div className="flex gap-1 mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    ))}
                                </div>
                                <p className="text-slate-300 text-[15px] leading-relaxed mb-8 flex-1 italic group-hover:text-white transition-colors relative z-10">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-900 border-2 border-slate-800 group-hover:border-indigo-500/50 transition-colors">
                                        <Image src={testimonial.image} alt={testimonial.name} width={48} height={48} className="object-cover w-full h-full" unoptimized />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm tracking-wide">{testimonial.name}</div>
                                        <div className="text-indigo-400 text-xs font-semibold">{testimonial.college}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Marquee>
                </div>
            </section>

            {/* Ultra-Premium Call to Action Section */}
            <section className="relative py-24 md:py-32 bg-[#0a0f1c] overflow-hidden border-t border-slate-900/80">
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#10172e] to-[#0a0f1c] border border-indigo-500/20 p-10 md:p-24 text-center shadow-2xl group transition-all duration-700 hover:border-indigo-400/40 hover:shadow-[0_0_80px_-20px_rgba(79,70,229,0.3)]">
                        {/* Background Effects */}
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay z-0 pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-600/10 via-indigo-600/20 to-purple-600/10 blur-[100px] rounded-full pointer-events-none transition-transform duration-1000 group-hover:scale-125 group-hover:opacity-100 opacity-60" />
                        
                        {/* Interactive grid */}
                        <div className="absolute inset-0 z-0 opacity-[0.3] pointer-events-none"
                            style={{
                                backgroundImage: 'linear-gradient(to right, rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.05) 1px, transparent 1px)',
                                backgroundSize: '40px 40px',
                                maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
                            }}
                        />

                        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.05] mb-8 drop-shadow-xl transform transition-transform duration-700 group-hover:scale-105">
                                Will your photo be <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 inline-block mt-2">
                                    up here next year?
                                </span>
                            </h2>
                            <p className="text-xl md:text-2xl text-slate-300 font-medium mb-12 max-w-2xl leading-relaxed">
                                Join thousands of successful students who chose <strong className="text-indigo-400 font-black tracking-wider">Catalyzers</strong> to realize their dreams of getting into premium medical and engineering institutes.
                            </p>
                            
                            <a href="/courses#neet" className="inline-block relative group/btn">
                                <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-60 blur-lg group-hover/btn:opacity-100 transition-all duration-500 group-hover/btn:duration-200"></div>
                                <div className="relative inline-flex items-center justify-center px-10 py-5 text-lg font-black tracking-widest text-white uppercase transition-all duration-300 bg-slate-950 rounded-full group-hover/btn:bg-slate-900 group-hover/btn:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] gap-3 border border-white/10">
                                    Start Your Journey
                                    <Sparkles className="w-5 h-5 text-indigo-400 transition-transform duration-500 group-hover/btn:rotate-12 group-hover/btn:scale-110" />
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
