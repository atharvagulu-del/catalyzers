"use client";

import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import LoginDrawer from "@/components/auth/LoginDrawer";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginDrawerOpen, setLoginDrawerOpen] = useState(false);
    const [callDropdownOpen, setCallDropdownOpen] = useState(false);
    const { session, user, fullName } = useAuth();

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
                <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 md:px-8">
                    {/* Left: Mobile Menu + Logo */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 rounded-md hover:bg-slate-100 transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6 text-slate-700" />
                            ) : (
                                <Menu className="h-6 w-6 text-slate-700" />
                            )}
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <div className="relative h-11 w-11">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-sm">
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
                            <span className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                                Catalyzers
                            </span>
                        </Link>
                    </div>

                    {/* Center: Navigation */}
                    <nav className="hidden md:flex items-center gap-2 lg:gap-4">
                        {[
                            { href: "/", label: "Home" },
                            { href: "/courses", label: "Courses" },
                            { href: "/teachers", label: "Teachers" },
                            { href: "/results", label: "Results" },
                            { href: "/about", label: "About" },
                            { href: "/lectures", label: "Lectures" },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-base font-semibold text-slate-700 hover:text-primary hover:bg-slate-50 transition-all px-4 py-2 rounded-xl"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3 md:gap-4">
                        {/* Call Button & Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setCallDropdownOpen(!callDropdownOpen)}
                                className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors shadow-sm"
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
                                            className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50"
                                        >
                                            <a
                                                href="tel:+919999999999"
                                                className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
                                            >
                                                Request a Callback
                                            </a>
                                            <a
                                                href="https://cal.com/atharva-gulve-9osunz/free-counselling"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
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
                            <Link href={user?.user_metadata?.role === 'teacher' ? "/teacher" : "/dashboard"}>
                                <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-primary text-white flex items-center justify-center font-bold text-base hover:ring-4 hover:ring-primary/20 transition-all cursor-pointer shadow-md">
                                    {fullName ? fullName[0].toUpperCase() : user?.email?.[0].toUpperCase() || "U"}
                                </div>
                            </Link>
                        ) : (
                            <Button
                                onClick={() => setLoginDrawerOpen(true)}
                                className="bg-[#5A4BDA] hover:bg-[#4a3ca0] text-white font-bold px-5 md:px-6 h-10 md:h-11 text-sm md:text-base rounded-xl shadow-md transition-all hover:shadow-lg"
                            >
                                Login / Register
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
                            className="fixed inset-0 top-14 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed insert-y-0 left-0 top-14 bottom-0 w-[75%] max-w-sm bg-white z-50 md:hidden overflow-y-auto shadow-xl"
                        >
                            <nav className="flex flex-col p-4 gap-1">
                                {[
                                    { href: "/", label: "Home" },
                                    { href: "/courses", label: "Courses" },
                                    { href: "/teachers", label: "Teachers" },
                                    { href: "/results", label: "Results" },
                                    { href: "/about", label: "About" },
                                    { href: "/lectures", label: "Lectures" },
                                ].map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors py-2.5 px-4 rounded-lg"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}

                                <div className="my-3 border-t border-slate-100" />

                                {!session && (
                                    <button
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            setLoginDrawerOpen(true);
                                        }}
                                        className="text-base font-medium text-blue-600 hover:bg-blue-50 transition-colors py-2.5 px-4 rounded-lg text-left"
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
