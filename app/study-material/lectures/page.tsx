"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { PlayCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";

const LECTURES = [
    {
        id: "3gT1hoFyWlk",
        title: "Quantum Numbers Most Repeated Questions",
        subject: "JEE Chemistry",
        duration: "PYQs Session",
    },
    {
        id: "s6ic0kZD_JA",
        title: "Atomic Radius Most Repeated Questions 🔥",
        subject: "Isoelectronic Species Tricks & PYQs",
        duration: "PYQs Session",
    },
    {
        id: "hbOpRSZLBfM",
        title: "Ionisation Potential Most Repeated Questions + Tricks",
        subject: "JEE & NEET Chemistry",
        duration: "PYQs Session",
    },
    {
        id: "AVCC-UdH2z4",
        title: "Electron Affinity PYQs ⚡ Most Important Questions",
        subject: "Short Tricks | JEE & NEET",
        duration: "PYQs Session",
    },
    {
        id: "BuNgTZyKIiU",
        title: "Electronegativity Most Important Questions 🔥",
        subject: "Repeated PYQs for JEE Mains & NEET",
        duration: "PYQs Session",
    },
    {
        id: "JNhAWG1vU9w",
        title: "Acidic, Basic & Amphoteric Oxides: Super Revision",
        subject: "Revision with PYQs",
        duration: "PYQs Session",
    },
    {
        id: "wgvo7x5uoJo",
        title: "Crack Hybridisation & VSEPR Theory",
        subject: "Top PYQs for JEE & NEET",
        duration: "PYQs Session",
    },
    {
        id: "Uwj2sr48Ll0",
        title: "Dipole Moment Most Repeated Questions",
        subject: "Important PYQs with Tricks",
        duration: "PYQs Session",
    },
    {
        id: "wi3DGE1W5Qg",
        title: "Fajan's Rule – Most Important Questions & PYQs",
        subject: "JEE Main, Advanced & NEET",
        duration: "PYQs Session",
    }
];

export default function FreeLecturesPage() {
    const [activeVideoId, setActiveVideoId] = useState(LECTURES[0].id);

    const activeLecture = LECTURES.find(l => l.id === activeVideoId) || LECTURES[0];

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <Header />

            <div className="flex-1 flex flex-col md:flex-row mt-[70px] h-[calc(100vh-70px)] overflow-hidden relative z-10">
                {/* Sidebar (Similar to student panel) */}
                <div className="w-full md:w-[350px] lg:w-[400px] bg-white border-r border-slate-200 flex flex-col h-full shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
                    <div className="p-5 md:p-6 border-b border-slate-100 bg-white">
                        <Link href="/study-material" className="text-sm text-blue-600 font-bold flex items-center hover:underline mb-3 transition-all w-fit">
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back to Study Material
                        </Link>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Chemistry Masterclass</h2>
                        <p className="text-slate-500 text-sm mt-1 font-medium">Free PYQ Practice Series</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar]:w-1.5">
                        {LECTURES.map((lecture, idx) => {
                            const isActive = activeVideoId === lecture.id;
                            
                            return (
                                <button
                                    key={lecture.id}
                                    onClick={() => setActiveVideoId(lecture.id)}
                                    className={`w-full text-left p-4 rounded-2xl transition-all flex gap-4 border ${
                                        isActive 
                                        ? "bg-blue-50/80 border-blue-200 shadow-sm shadow-blue-500/5" 
                                        : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                                    }`}
                                >
                                    <div className="mt-0.5 shrink-0">
                                        {isActive ? (
                                            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30">
                                                <PlayCircle className="w-4 h-4 text-white" />
                                            </div>
                                        ) : (
                                            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center border border-slate-200 font-bold text-xs">
                                                {idx + 1}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-bold leading-snug mb-1.5 ${isActive ? "text-blue-900" : "text-slate-700"}`}>
                                            {lecture.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className={`font-semibold ${isActive ? "text-blue-600" : "text-slate-500"}`}>
                                                {lecture.subject}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Video Area */}
                <div className="flex-1 overflow-y-auto bg-slate-50 relative [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar]:w-1.5">
                    <div className="max-w-5xl mx-auto p-4 md:p-8 lg:p-10">
                        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden mb-8">
                            {/* Video Player Container */}
                            <div className="aspect-video w-full bg-slate-900 relative">
                                <iframe 
                                    className="absolute inset-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=0&rel=0`} 
                                    title="YouTube video player" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            </div>

                            {/* Video Info */}
                            <div className="p-6 md:p-8 lg:p-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 font-bold text-[10px] rounded-lg uppercase tracking-wider">
                                        Free Lecture
                                    </span>
                                    <span className="px-3 py-1.5 bg-slate-100 text-slate-600 border border-slate-200 font-bold text-[10px] rounded-lg uppercase tracking-wider">
                                        {activeLecture.duration}
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                                    {activeLecture.title}
                                </h1>
                                <p className="text-slate-600 text-lg font-medium border-b border-slate-100 pb-8 mb-8">
                                    {activeLecture.subject}
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6 md:p-8 rounded-[1.5rem] border border-blue-100 shadow-sm">
                                    <div>
                                        <h4 className="font-extrabold text-blue-900 text-xl mb-2">Want structured prep?</h4>
                                        <p className="text-sm md:text-base text-blue-800 font-medium max-w-lg">
                                            Join our premium batches for full syllabus coverage, high-yield DPPs, and personalized 1-on-1 mentorship.
                                        </p>
                                    </div>
                                    <Link href="/courses" className="shrink-0 w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 hover:-translate-y-0.5">
                                        Explore Courses
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
