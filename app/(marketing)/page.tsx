"use client";

import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import StudentTestimonials from "@/components/StudentTestimonials";
import ExamCategories from "@/components/ExamCategories";
import Statistics from "@/components/Statistics";
import Testimonials from "@/components/Testimonials";
import ContentSections from "@/components/ContentSections";
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
            <ExamCategories />
            <Statistics />
            <StudentTestimonials />
            <Testimonials />
            <ContentSections />
            <Footer />
        </main>
    );
}
