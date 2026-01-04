import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import ExamCategories from "@/components/ExamCategories";
import Statistics from "@/components/Statistics";
import Testimonials from "@/components/Testimonials";
import ContentSections from "@/components/ContentSections";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main className="min-h-screen">
            <Header />
            <HeroCarousel />
            <ExamCategories />
            <Statistics />
            <Testimonials />
            <ContentSections />
            <Footer />
        </main>
    );
}
