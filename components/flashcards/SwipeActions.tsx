"use client";

import { motion } from 'framer-motion';

interface SwipeActionsProps {
    onLearning: () => void;
    onKnow: () => void;
    disabled?: boolean;
    // Track which button was just pressed for fill effect
    activeButton?: 'learning' | 'know' | null;
}

export default function SwipeActions({ onLearning, onKnow, disabled = false, activeButton }: SwipeActionsProps) {
    return (
        <div className="flex items-center justify-center gap-6 md:gap-10 py-4">
            {/* Still Learning Button - Orange */}
            <motion.button
                onClick={onLearning}
                disabled={disabled}
                whileHover={!disabled ? { scale: 1.03 } : {}}
                whileTap={!disabled ? { scale: 0.97 } : {}}
                className={`px-6 py-3 md:px-8 md:py-3.5 rounded-full text-sm md:text-base font-semibold border-2 transition-all duration-200
                    ${disabled
                        ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-white'
                        : activeButton === 'learning'
                            ? 'bg-amber-500 border-amber-500 text-white'
                            : 'border-amber-500 text-amber-600 bg-white hover:bg-amber-50'
                    }`}
            >
                Still learning
            </motion.button>

            {/* I Know This Button - Green */}
            <motion.button
                onClick={onKnow}
                disabled={disabled}
                whileHover={!disabled ? { scale: 1.03 } : {}}
                whileTap={!disabled ? { scale: 0.97 } : {}}
                className={`px-6 py-3 md:px-8 md:py-3.5 rounded-full text-sm md:text-base font-semibold border-2 transition-all duration-200
                    ${disabled
                        ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-white'
                        : activeButton === 'know'
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-emerald-500 text-emerald-600 bg-white hover:bg-emerald-50'
                    }`}
            >
                I know this
            </motion.button>
        </div>
    );
}
