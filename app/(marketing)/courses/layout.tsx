import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Courses - Catalyzer Kota | NEET & JEE Coaching",
    description: "Explore our comprehensive NEET and JEE coaching programs in Kota for 11th, 12th, and Dropper students. Individual subject courses also available.",
};

export default function CoursesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
