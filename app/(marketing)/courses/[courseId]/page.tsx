import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseDetailsContent from "@/components/CourseDetailsContent";

export default function CourseDetailsPage({
    params,
}: {
    params: { courseId: string };
}) {
    return (
        <main className="min-h-screen">
            <Header />
            <CourseDetailsContent courseId={params.courseId} />
            <Footer />
        </main>
    );
}
