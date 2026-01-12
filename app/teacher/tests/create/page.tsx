"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
    createTest,
    assignStudentsToTest,
    getAllEnrollments,
    Enrollment
} from "@/lib/offlineTests";
import {
    FileText,
    Calendar,
    BookOpen,
    Hash,
    Users,
    Check,
    Loader2,
    ChevronDown,
    AlertCircle,
    ArrowLeft
} from "lucide-react";
import Link from "next/link";

const SUBJECTS = [
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "English",
    "Full Test",
];

export default function CreateTestPage() {
    const { session } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState(1); // 1: Form, 2: Select Students
    const [loading, setLoading] = useState(false);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [error, setError] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        test_name: "",
        subject: "",
        class: "" as "11" | "12" | "Dropper" | "",
        batch: "",
        test_date: "",
        max_marks: "",
    });

    // Students State
    const [students, setStudents] = useState<Enrollment[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

    const fetchStudents = useCallback(async () => {
        setLoadingStudents(true);
        try {
            const enrollments = await getAllEnrollments({
                class: formData.class,
                batch: formData.batch || undefined,
                status: "ENROLLED",
            });
            setStudents(enrollments);
            // Select all by default
            setSelectedStudents(new Set(enrollments.map((e) => e.user_id)));
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoadingStudents(false);
        }
    }, [formData.class, formData.batch]);

    useEffect(() => {
        if (step === 2 && formData.class) {
            fetchStudents();
        }
    }, [step, formData.class, fetchStudents]);

    function validateForm(): boolean {
        if (!formData.test_name.trim()) {
            setError("Test name is required");
            return false;
        }
        if (!formData.subject) {
            setError("Subject is required");
            return false;
        }
        if (!formData.class) {
            setError("Class is required");
            return false;
        }
        if (!formData.test_date) {
            setError("Test date is required");
            return false;
        }
        if (!formData.max_marks || parseInt(formData.max_marks) <= 0) {
            setError("Valid max marks is required");
            return false;
        }
        setError("");
        return true;
    }

    function handleNextStep() {
        if (validateForm()) {
            setStep(2);
        }
    }

    function toggleStudent(userId: string) {
        setSelectedStudents((prev) => {
            const updated = new Set(prev);
            if (updated.has(userId)) {
                updated.delete(userId);
            } else {
                updated.add(userId);
            }
            return updated;
        });
    }

    function toggleAll() {
        if (selectedStudents.size === students.length) {
            setSelectedStudents(new Set());
        } else {
            setSelectedStudents(new Set(students.map((s) => s.user_id)));
        }
    }

    async function handleSubmit() {
        if (selectedStudents.size === 0) {
            setError("Please select at least one student");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Create test
            const test = await createTest({
                test_name: formData.test_name.trim(),
                subject: formData.subject,
                class: formData.class as "11" | "12" | "Dropper",
                batch: formData.batch || undefined,
                test_date: formData.test_date,
                max_marks: parseInt(formData.max_marks),
                created_by: session?.user?.id || "",
            });

            if (!test) {
                throw new Error("Failed to create test");
            }

            // Assign students
            const success = await assignStudentsToTest(
                test.id,
                Array.from(selectedStudents)
            );

            if (!success) {
                throw new Error("Failed to assign students");
            }

            // Navigate to tests list
            router.push("/teacher/tests");
        } catch (err) {
            console.error("Error creating test:", err);
            setError("Failed to create test. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/teacher/tests"
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Create New Test
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        {step === 1 ? "Step 1: Test Details" : "Step 2: Select Students"}
                    </p>
                </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1
                            ? "bg-blue-600 text-white"
                            : "bg-slate-200 text-slate-500"
                            }`}
                    >
                        {step > 1 ? <Check className="w-4 h-4" /> : "1"}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Details
                    </span>
                </div>
                <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded">
                    <div
                        className={`h-full bg-blue-600 rounded transition-all ${step >= 2 ? "w-full" : "w-0"
                            }`}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2
                            ? "bg-blue-600 text-white"
                            : "bg-slate-200 text-slate-500"
                            }`}
                    >
                        2
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Students
                    </span>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
            )}

            {step === 1 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
                    {/* Test Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <FileText className="w-4 h-4 inline mr-2" />
                            Test Name *
                        </label>
                        <input
                            type="text"
                            value={formData.test_name}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, test_name: e.target.value }))
                            }
                            placeholder="e.g., Physics Unit Test 1"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <BookOpen className="w-4 h-4 inline mr-2" />
                            Subject *
                        </label>
                        <div className="relative">
                            <select
                                value={formData.subject}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, subject: e.target.value }))
                                }
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                            >
                                <option value="">Select Subject</option>
                                {SUBJECTS.map((subject) => (
                                    <option key={subject} value={subject}>
                                        {subject}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Class */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Class *
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.class}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            class: e.target.value as "11" | "12" | "Dropper",
                                        }))
                                    }
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                                >
                                    <option value="">Select Class</option>
                                    <option value="11">Class 11</option>
                                    <option value="12">Class 12</option>
                                    <option value="Dropper">Dropper</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Batch */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Batch (Optional)
                            </label>
                            <input
                                type="text"
                                value={formData.batch}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, batch: e.target.value }))
                                }
                                placeholder="e.g., Batch A"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Test Date *
                            </label>
                            <input
                                type="date"
                                value={formData.test_date}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, test_date: e.target.value }))
                                }
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Max Marks */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                <Hash className="w-4 h-4 inline mr-2" />
                                Maximum Marks *
                            </label>
                            <input
                                type="number"
                                value={formData.max_marks}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, max_marks: e.target.value }))
                                }
                                placeholder="e.g., 100"
                                min="1"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Next Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleNextStep}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                        >
                            Next: Select Students
                            <Users className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                Select Students
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Class {formData.class}
                                {formData.batch && ` • ${formData.batch}`} • {students.length}{" "}
                                enrolled students
                            </p>
                        </div>
                        <button
                            onClick={toggleAll}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            {selectedStudents.size === students.length
                                ? "Deselect All"
                                : "Select All"}
                        </button>
                    </div>

                    {/* Students List */}
                    <div className="max-h-96 overflow-y-auto">
                        {loadingStudents ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        ) : students.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 dark:text-slate-400">
                                    No enrolled students found for this class/batch
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                {students.map((student) => (
                                    <label
                                        key={student.id}
                                        className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.has(student.user_id)}
                                            onChange={() => toggleStudent(student.user_id)}
                                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {student.name}
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {student.roll_number && `Roll: ${student.roll_number}`}
                                                {student.roll_number && student.batch && " • "}
                                                {student.batch && `Batch: ${student.batch}`}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                        <button
                            onClick={() => setStep(1)}
                            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
                        >
                            Back
                        </button>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                {selectedStudents.size} selected
                            </span>
                            <button
                                onClick={handleSubmit}
                                disabled={loading || selectedStudents.size === 0}
                                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Create Test
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
