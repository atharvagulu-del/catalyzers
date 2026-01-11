"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, ZoomIn, ZoomOut } from "lucide-react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Configure worker for pdfjs-dist v3.x (uses .js)
// Configure worker to match the installed pdfjs-dist version dynamically
// Note: pdfjs-dist v4+ uses .mjs for the worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const options = {
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
};

interface ChapterPDFViewerProps {
    file: string;
    startPage: number;
    endPage: number;
    onClose?: () => void;
}

export default function ChapterPDFViewer({ file, startPage, endPage, onClose }: ChapterPDFViewerProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(startPage);
    const [scale, setScale] = useState(1.0);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Reset to start page when chapter changes
    useEffect(() => {
        setCurrentPage(startPage);
        setErrorMsg(null);
    }, [startPage]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setLoading(false);
    }

    const previousPage = () => {
        if (currentPage > startPage) setCurrentPage(prev => prev - 1);
    };

    const nextPage = () => {
        if (currentPage < endPage) setCurrentPage(prev => prev + 1);
    };

    return (
        <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-950 rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-10">
                <div className="flex items-center gap-2">
                    {/* Page number text removed */}
                </div>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors"><ZoomOut className="w-4 h-4 text-slate-600 dark:text-slate-400" /></button>
                    <span className="text-xs font-mono w-12 text-center text-slate-600 dark:text-slate-300">{Math.round(scale * 100)}%</span>
                    <button onClick={() => setScale(s => Math.min(2.0, s + 0.1))} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors"><ZoomIn className="w-4 h-4 text-slate-600 dark:text-slate-400" /></button>
                </div>
            </div>

            {/* Document Area */}
            <div className="flex-1 overflow-auto relative flex justify-center p-4 custom-scrollbar">
                <div className="shadow-lg">
                    <Document
                        file={file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={(error) => {
                            setLoading(false);
                            setErrorMsg(error.message);
                            console.error("PDF Error:", error);
                        }}
                        options={options}
                        loading={
                            <div className="flex items-center justify-center p-12">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                            </div>
                        }
                        error={
                            <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg">
                                <p className="font-bold">Failed to load PDF.</p>
                                <p className="text-sm mt-2">{errorMsg || "Unknown error occurred"}</p>
                                <p className="text-xs text-slate-400 mt-2">File path: {file}</p>
                            </div>
                        }
                    >
                        {/* Only render ONE page at a time to strictly control view */}
                        <AnimatePresence mode="wait">
                            {!loading && !errorMsg && (
                                <motion.div
                                    key={currentPage}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.15 }}
                                    className="w-full flex justify-center"
                                >
                                    <Page
                                        pageNumber={currentPage}
                                        scale={scale}
                                        renderTextLayer={true}
                                        renderAnnotationLayer={true}
                                        className="bg-white"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Document>
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                    onClick={previousPage}
                    disabled={currentPage <= startPage}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {currentPage - startPage + 1} / {endPage - startPage + 1}
                </span>

                <button
                    onClick={nextPage}
                    disabled={currentPage >= endPage}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                    Next <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
