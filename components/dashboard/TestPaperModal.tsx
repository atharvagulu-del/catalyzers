"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";

export default function TestPaperModal({
    isOpen,
    onClose,
    testName,
    images
}: {
    isOpen: boolean;
    onClose: () => void;
    testName: string;
    images: string[];
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!isOpen || images.length === 0) return null;

    const goNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const goPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-black/50 z-10 backdrop-blur-md border-b border-white/10">
                    <div>
                        <h2 className="text-white font-semibold text-lg">{testName}</h2>
                        <p className="text-white/70 text-sm">Page {currentIndex + 1} of {images.length}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href={images[currentIndex]}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/90 text-sm transition-colors"
                        >
                            Open Original
                        </a>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Image Container */}
                <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
                    <div className="relative w-full h-full max-w-5xl max-h-full">
                        <Image
                            src={images[currentIndex]}
                            alt={`Test paper page ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={goPrev}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-all text-white/70 hover:text-white backdrop-blur-sm"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                            <button
                                onClick={goNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-all text-white/70 hover:text-white backdrop-blur-sm"
                            >
                                <ChevronRightIcon className="w-8 h-8" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="p-4 bg-black/80 backdrop-blur-md overflow-x-auto">
                        <div className="flex gap-3 justify-center min-w-min mx-auto">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${idx === currentIndex
                                            ? 'border-blue-500 opacity-100 scale-105'
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <Image src={img} alt={`Page ${idx + 1}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
