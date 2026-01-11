"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const classes = ["Class 11", "Class 12", "Dropper"];
const exams = ["JEE (Main + Adv)", "NEET (UG)", "Foundation (9-10)"];

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        class: "",
        exam: ""
    });

    // Clear ghost data on mount to prevent auto-fill from previous sessions
    useEffect(() => {
        // We only clear if we are genuinely starting fresh. 
        // For now, let's clear it to be safe as per user feedback about "auto selecting"
        localStorage.removeItem('userProfile');
    }, []);

    const handleNext = async () => {
        if (step < 3) setStep(step + 1);
        else {
            // Save to localStorage immediately - this is our "Offline Mode" guarantee
            localStorage.setItem('userProfile', JSON.stringify(formData));

            try {
                // Try to save to Supabase, but don't block if it fails
                const { supabase } = await import("@/lib/supabase");

                // key fix: check if we actually have a user first
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    await supabase.auth.updateUser({
                        data: {
                            full_name: formData.name,
                            class: formData.class,
                            exam: formData.exam,
                            onboarded: true
                        }
                    });
                } else {
                    console.log("Onboarding: No active session, skipping cloud save.");
                }
            } catch (error) {
                // Silently fail for cloud save, but allow user to proceed
                console.error("Cloud save failed (likely email not verified), proceeding locally:", error);
            } finally {
                // Redirect to dashboard (user requested this specifically)
                // The dashboard layout will handle showing lectures or whatever based on this data
                router.refresh();
                router.push("/dashboard");
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden"
            >
                {/* Progress Bar */}
                <div className="h-2 bg-slate-100">
                    <motion.div
                        className="h-full bg-blue-600"
                        initial={{ width: "33%" }}
                        animate={{ width: `${step * 33.33}%` }}
                    />
                </div>

                <div className="p-8">
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">
                        {step === 1 && "What's your name?"}
                        {step === 2 && "Which class are you in?"}
                        {step === 3 && "What is your target exam?"}
                    </h1>
                    <p className="text-slate-500 mb-8">
                        {step === 1 && "Let's personalize your learning experience."}
                        {step === 2 && "We'll show you the right courses."}
                        {step === 3 && "Almost there! One last step."}
                    </p>

                    <div className="space-y-4">
                        {step === 1 && (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter your full name"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-lg"
                                autoFocus
                            />
                        )}

                        {step === 2 && (
                            <div className="grid gap-3">
                                {classes.map((cls) => (
                                    <button
                                        key={cls}
                                        onClick={() => setFormData({ ...formData, class: cls })}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${formData.class === cls
                                            ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                                            : "border-slate-100 hover:border-blue-200 text-slate-600"
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            {cls}
                                            {formData.class === cls && <Check className="w-5 h-5" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {step === 3 && (
                            <div className="grid gap-3">
                                {exams.map((exam) => (
                                    <button
                                        key={exam}
                                        onClick={() => setFormData({ ...formData, exam: exam })}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${formData.exam === exam
                                            ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                                            : "border-slate-100 hover:border-blue-200 text-slate-600"
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            {exam}
                                            {formData.exam === exam && <Check className="w-5 h-5" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button
                            onClick={handleNext}
                            disabled={
                                (step === 1 && !formData.name) ||
                                (step === 2 && !formData.class) ||
                                (step === 3 && !formData.exam)
                            }
                            className="w-full py-6 text-lg rounded-xl"
                        >
                            {step === 3 ? "Complete Profile" : "Continue"}
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
