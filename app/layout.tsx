import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    metadataBase: new URL("https://catalyzers.live"),
    title: {
        default: "Catalyzers Institute | JEE & NEET Coaching in Kota",
        template: "%s | Catalyzers Institute",
    },
    description:
        "Catalyzers Institute is Kota's trusted coaching institute for JEE & NEET preparation. Expert faculty, affordable fees, personalized doubt solving, and proven results for 11th, 12th & Dropper students.",
    keywords: [
        "Catalyzers Institute",
        "Catalyzers Kota",
        "JEE coaching Kota",
        "NEET coaching Kota",
        "IIT JEE preparation",
        "NEET preparation",
        "best coaching institute Kota",
        "Adil Sir physics",
        "Kirti maam chemistry",
        "affordable JEE coaching",
        "online JEE NEET classes",
        "dropper batch Kota",
        "class 11 12 coaching",
    ],
    authors: [{ name: "Catalyzers Institute", url: "https://catalyzers.live" }],
    creator: "Catalyzers Institute",
    openGraph: {
        type: "website",
        locale: "en_IN",
        url: "https://catalyzers.live",
        siteName: "Catalyzers Institute",
        title: "Catalyzers Institute | JEE & NEET Coaching in Kota",
        description:
            "Expert JEE & NEET coaching in Kota with Adil Sir, Kirti Ma'am & Mayank Sir. Affordable fees, personalized attention & proven results.",
        images: [
            {
                url: "/assets/og-image.png",
                width: 1200,
                height: 630,
                alt: "Catalyzers Institute - JEE & NEET Coaching Kota",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Catalyzers Institute | JEE & NEET Coaching in Kota",
        description:
            "Expert JEE & NEET coaching in Kota. Affordable fees, personalized attention & proven results.",
        images: ["/assets/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: {
        canonical: "https://catalyzers.live",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={cn("font-sans")}>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                >
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
