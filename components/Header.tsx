"use client";

import { Button } from "@/components/ui/button";
import { Menu, X, Phone, LogOut, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider"; // Use Supabase Auth Hook
import LoginDrawer from "@/components/auth/LoginDrawer";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginDrawerOpen, setLoginDrawerOpen] = useState(false);
    const [callDropdownOpen, setCallDropdownOpen] = useState(false);
    const { session, user, fullName } = useAuth();

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="container flex h-16 items-center gap-3 md:gap-0 md:justify-between px-4 md:px-6">
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
                    <Link href="/" className="flex items-center gap-3">
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
                        <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                            Catalyzer
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                            Home
                        </Link>
                        <Link href="/courses" className="text-sm font-medium hover:text-primary transition-colors">
                            Courses
                        </Link>
                        <Link href="/teachers" className="text-sm font-medium hover:text-primary transition-colors">
                            Teachers
                        </Link>
                        <Link href="/#results" className="text-sm font-medium hover:text-primary transition-colors">
                            Results
                        </Link>
                        <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                            About
                        </Link>
                        <Link href="/lectures" className="text-sm font-medium hover:text-primary transition-colors">
                            Lectures
                        </Link>
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3 ml-auto md:ml-0">
                        {/* Call Button & Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setCallDropdownOpen(!callDropdownOpen)}
                                className="w-10 h-10 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                            </button>

                            <AnimatePresence>
                                {callDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setCallDropdownOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50"
                                        >
                                            <a
                                                href="tel:+919999999999"
                                                className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                                            >
                                                Request a Callback
                                            </a>
                                            <a
                                                href="https://cal.com/atharva-gulve-9osunz/free-counselling"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                                            >
                                                Book Free Demo
                                            </a>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Login / Profile */}
                        {session ? (
                            // Logged In State
                            <div className="flex items-center gap-3">
                                <Link href={user?.user_metadata?.role === 'teacher' ? "/teacher" : "/dashboard"}>
                                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg hover:ring-2 hover:ring-offset-2 hover:ring-primary transition-all cursor-pointer">
                                        {fullName ? fullName[0].toUpperCase() : user?.email?.[0].toUpperCase() || "U"}
                                    </div>
                                </Link>
                            </div>
                        ) : (
                            // Logged Out State
                            <Button
                                onClick={() => setLoginDrawerOpen(true)}
                                variant="outline"
                                className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-6"
                            >
                                Login
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Login Drawer */}
            <LoginDrawer
                isOpen={loginDrawerOpen}
                onClose={() => setLoginDrawerOpen(false)}
            />

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 top-16 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed insert-y-0 left-0 top-16 bottom-0 w-[75%] max-w-sm bg-white z-50 md:hidden overflow-y-auto shadow-xl"
                        >
                            <nav className="flex flex-col p-6 gap-2">
                                <Link
                                    href="/"
                                    className="text-lg font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors py-3 px-4 rounded-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/courses"
                                    className="text-lg font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors py-3 px-4 rounded-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Courses
                                </Link>
                                <Link
                                    href="/teachers"
                                    className="text-lg font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors py-3 px-4 rounded-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Teachers
                                </Link>
                                <Link
                                    href="/#results"
                                    className="text-lg font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors py-3 px-4 rounded-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Results
                                </Link>
                                <Link
                                    href="/lectures"
                                    className="text-lg font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors py-3 px-4 rounded-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Lectures
                                </Link>

                                <div className="my-4 border-t border-slate-100" />

                                {!session && (
                                    <button
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            setLoginDrawerOpen(true);
                                        }}
                                        className="text-lg font-medium text-blue-600 hover:bg-blue-50 transition-colors py-3 px-4 rounded-lg text-left"
                                    >
                                        Log in / Register
                                    </button>
                                )}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
