"use client";

import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import HeroText from "@/components/HeroText";
import StudentTestimonials from "@/components/StudentTestimonials";
import ExamCategories from "@/components/ExamCategories";
import Testimonials from "@/components/Testimonials";
import RoadmapSection from "@/components/RoadmapSection";
import HallOfFame from "@/components/HallOfFame";
import ComparePrep from "@/components/ComparePrep";
import ContentSections from "@/components/ContentSections";
import LiveClassPromo from "@/components/LiveClassPromo";
import AppPromo from "@/components/AppPromo";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // Auto-redirect if logged in
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                router.push("/dashboard");
            }
        };
        checkSession();
    }, [router]);

    return (
        <main className="min-h-screen">
            <Header />
            <HeroCarousel />
            <HeroText />
            <ExamCategories />
            <RoadmapSection />
            <HallOfFame />
            <ComparePrep />
            <ContentSections />
            <LiveClassPromo />
            <StudentTestimonials />
            <Testimonials />
            <AppPromo />
            <Footer />
        </main>
    );
}
