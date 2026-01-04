export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container px-4 md:px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* About Section */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-lg">About Catalyzer</h4>
                        <p className="text-sm leading-relaxed">
                            India&apos;s Trusted & Affordable Educational Platform,
                            empowering millions of
                            students to achieve their dreams.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-lg">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#courses"
                                    className="text-sm hover:text-primary transition-colors"
                                >
                                    Courses
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#results"
                                    className="text-sm hover:text-primary transition-colors"
                                >
                                    Results
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#about"
                                    className="text-sm hover:text-primary transition-colors"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#contact"
                                    className="text-sm hover:text-primary transition-colors"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-lg">Legal</h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#privacy"
                                    className="text-sm hover:text-primary transition-colors"
                                >
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#terms"
                                    className="text-sm hover:text-primary transition-colors"
                                >
                                    Terms of Use
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#refund"
                                    className="text-sm hover:text-primary transition-colors"
                                >
                                    Refund Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-lg">Connect With Us</h4>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors"
                                aria-label="Facebook"
                            >
                                <span className="text-xl">📘</span>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors"
                                aria-label="Twitter"
                            >
                                <span className="text-xl">🐦</span>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors"
                                aria-label="Instagram"
                            >
                                <span className="text-xl">📷</span>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors"
                                aria-label="YouTube"
                            >
                                <span className="text-xl">📺</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 text-center">
                    <p className="text-sm">
                        &copy; 2026 Catalyzer. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Floating Help Button */}
            <button
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
                aria-label="Get Help"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" />
                    <path d="M12 16V12M12 8H12.01" strokeLinecap="round" />
                </svg>
            </button>
        </footer>
    );
}
