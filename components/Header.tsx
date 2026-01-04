"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>

                    {/* Logo */}
                    <a href="/" className="flex items-center gap-3">
                        <div className="relative h-10 w-10">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 2L2 7L12 12L22 7L12 2Z"
                                        fill="white"
                                        fillOpacity="0.9"
                                    />
                                    <path
                                        d="M2 17L12 22L22 17"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M2 12L12 17L22 12"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                            Catalyzer
                        </span>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <a
                            href="/"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Home
                        </a>
                        <a
                            href="/courses"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Courses
                        </a>
                        <a
                            href="/teachers"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Teachers
                        </a>
                        <a
                            href="/#results"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Results
                        </a>
                        <a
                            href="/#about"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            About
                        </a>
                        <a
                            href="/#contact"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Contact
                        </a>
                    </nav>

                    {/* Book Demo Button */}
                    <a href="https://cal.com/atharva-gulve-9osunz/free-counselling" target="_blank" rel="noopener noreferrer">
                        <Button size="default" className="shadow-md">
                            Book Free Demo
                        </Button>
                    </a>
                </div>
            </header>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 top-16 z-50 bg-white md:hidden animate-slide-in overflow-y-auto">
                    <nav className="flex flex-col p-6 gap-4">
                        <a
                            href="/"
                            className="text-lg font-medium hover:text-primary transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </a>
                        <a
                            href="/courses"
                            className="text-lg font-medium hover:text-primary transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Courses
                        </a>
                        <a
                            href="/#results"
                            className="text-lg font-medium hover:text-primary transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Results
                        </a>
                        <a
                            href="/#about"
                            className="text-lg font-medium hover:text-primary transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            About
                        </a>
                        <a
                            href="/#contact"
                            className="text-lg font-medium hover:text-primary transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Contact
                        </a>
                    </nav>
                </div>
            )}
        </>
    );
}
