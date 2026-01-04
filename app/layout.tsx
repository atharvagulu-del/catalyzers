import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Catalyzer - India's Trusted & Affordable Educational Platform",
    description: "Catalyzer is India's top online ed-tech platform that provides affordable and comprehensive learning experience to students of classes 6 to 12 and those preparing for JEE and NEET exams.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
