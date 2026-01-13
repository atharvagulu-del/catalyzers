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
import { getChaptersForTest, Chapter } from "@/lib/lectureData";
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
    ArrowLeft,
    Clock,
    X
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
        start_time: "",
        end_time: "",
        max_marks: "",
    });

    // Students State
    const [students, setStudents] = useState<Enrollment[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

    // Chapter Selection State
    const [examType, setExamType] = useState<'JEE' | 'NEET'>('JEE');
    const [availableChapters, setAvailableChapters] = useState<{ unitTitle: string; chapters: Chapter[] }[]>([]);
    const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());
    const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());

    // Custom Topics State
    const [customTopics, setCustomTopics] = useState<string[]>([]);
    const [newCustomTopic, setNewCustomTopic] = useState('');

    const fetchStudents = useCallback(async () => {
        setLoadingStudents(true);
        try {
            // Fetch ALL students for the class, ignoring status/batch for now
            // to ensure we don't accidentally filter out valid students due to strict DB checks
            const enrollments = await getAllEnrollments({
                class: formData.class,
            });

            console.log("Fetched enrollments:", enrollments);

            let filtered = enrollments;

            // Local Batch Filter (Case Insensitive)
            if (formData.batch) {
                const batchSearch = formData.batch.toLowerCase().trim();
                filtered = filtered.filter(e =>
                    e.batch && e.batch.toLowerCase().includes(batchSearch)
                );
            }

            // Local Status Filter (Optional - currently hiding NOT_ENROLLED unless we find 0 enrolled)
            // Actually, let's show ALL students but sort ENROLLED first
            // This helps if a student is accidentally marked NOT_ENROLLED
            filtered.sort((a, b) => {
                // Enrolled first
                if (a.enrollment_status === 'ENROLLED' && b.enrollment_status !== 'ENROLLED') return -1;
                if (a.enrollment_status !== 'ENROLLED' && b.enrollment_status === 'ENROLLED') return 1;
                // Then by name
                return a.name.localeCompare(b.name);
            });

            setStudents(filtered);

            // Select only ENROLLED students by default
            const enrolledIds = filtered
                .filter(e => e.enrollment_status === 'ENROLLED')
                .map(e => e.user_id);

            setSelectedStudents(new Set(enrolledIds));
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

    // Load chapters when subject/class/exam changes
    useEffect(() => {
        if (formData.subject && formData.class) {
            const chapters = getChaptersForTest(
                examType,
                formData.subject,
                formData.class as '11' | '12' | 'Dropper'
            );
            setAvailableChapters(chapters);
            // Reset selections when subject/class changes
            setSelectedChapters(new Set());
            setExpandedUnits(new Set());
        }
    }, [formData.subject, formData.class, examType]);

    // Toggle unit expansion
    function toggleUnit(unitTitle: string) {
        setExpandedUnits((prev) => {
            const updated = new Set(prev);
            if (updated.has(unitTitle)) {
                updated.delete(unitTitle);
            } else {
                updated.add(unitTitle);
            }
            return updated;
        });
    }

    // Toggle chapter selection
    function toggleChapter(chapterId: string) {
        setSelectedChapters((prev) => {
            const updated = new Set(prev);
            if (updated.has(chapterId)) {
                updated.delete(chapterId);
            } else {
                updated.add(chapterId);
            }
            return updated;
        });
    }

    // Select all chapters in a unit
    function toggleUnitChapters(chapters: Chapter[]) {
        const chapterIds = chapters.map(c => c.id);
        const allSelected = chapterIds.every(id => selectedChapters.has(id));

        setSelectedChapters((prev) => {
            const updated = new Set(prev);
            if (allSelected) {
                chapterIds.forEach(id => updated.delete(id));
            } else {
                chapterIds.forEach(id => updated.add(id));
            }
            return updated;
        });
    }


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
        if (!formData.start_time) {
            setError("Start time is required");
            return false;
        }
        if (!formData.end_time) {
            setError("End time is required");
            return false;
        }
        if (new Date(formData.end_time) <= new Date(formData.start_time)) {
            setError("End time must be after start time");
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
                test_date: new Date(formData.start_time).toISOString().split('T')[0],
                start_time: new Date(formData.start_time).toISOString(),
                end_time: new Date(formData.end_time).toISOString(),
                max_marks: parseInt(formData.max_marks),
                created_by: session?.user?.id || "",
                chapters: Array.from(selectedChapters),
                custom_topics: customTopics.length > 0 ? customTopics : undefined,
                exam_type: examType,
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
                                students found
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
                                    No students found for this class/batch
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
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {student.name}
                                                </p>
                                                {student.enrollment_status !== 'ENROLLED' && (
                                                    <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                                                        Not Enrolled
                                                    </span>
                                                )}
                                            </div>
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
                        {/* Start Time */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                <Clock className="w-4 h-4 inline mr-2" />
                                Start Time *
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.start_time}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, start_time: e.target.value }))
                                }
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* End Time */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                <Clock className="w-4 h-4 inline mr-2" />
                                End Time *
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.end_time}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, end_time: e.target.value }))
                                }
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
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

                    {/* Exam Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                            <BookOpen className="w-4 h-4 inline mr-2" />
                            Exam Type
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setExamType('JEE')}
                                className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${examType === 'JEE'
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                    : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-blue-300'
                                    }`}
                            >
                                <div className="text-lg font-bold">JEE</div>
                                <p className="text-xs opacity-70">Engineering</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setExamType('NEET')}
                                className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${examType === 'NEET'
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                    : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-green-300'
                                    }`}
                            >
                                <div className="text-lg font-bold">NEET</div>
                                <p className="text-xs opacity-70">Medical</p>
                            </button>
                        </div>
                    </div>

                    {/* Chapter Selection - Improved UI */}
                    {formData.subject && formData.class && availableChapters.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <BookOpen className="w-4 h-4 inline mr-2" />
                                    Select Syllabus Topics
                                </label>
                                {selectedChapters.size > 0 && (
                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                                        {selectedChapters.size} topic{selectedChapters.size > 1 ? 's' : ''} selected
                                    </span>
                                )}
                            </div>

                            {/* Units/Chapters Grid */}
                            <div className="space-y-3 max-h-80 overflow-y-auto pr-1 -mr-1">
                                {availableChapters.map((unit, unitIndex) => (
                                    <div
                                        key={unit.unitTitle}
                                        className="bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                                    >
                                        {/* Unit Header */}
                                        <button
                                            type="button"
                                            onClick={() => toggleUnit(unit.unitTitle)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-sm">
                                                    {unitIndex + 1}
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-semibold text-slate-800 dark:text-white text-sm md:text-base">
                                                        {unit.unitTitle}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        {unit.chapters.length} topics • {unit.chapters.filter(c => selectedChapters.has(c.id)).length} selected
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleUnitChapters(unit.chapters);
                                                    }}
                                                    className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium transition-colors shadow-sm"
                                                >
                                                    {unit.chapters.every(c => selectedChapters.has(c.id)) ? 'Clear' : 'Select All'}
                                                </button>
                                                <ChevronDown
                                                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${expandedUnits.has(unit.unitTitle) ? 'rotate-180' : ''
                                                        }`}
                                                />
                                            </div>
                                        </button>

                                        {/* Chapter List */}
                                        {expandedUnits.has(unit.unitTitle) && (
                                            <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
                                                <div className="p-2 grid gap-1.5">
                                                    {unit.chapters.map((chapter) => {
                                                        const isSelected = selectedChapters.has(chapter.id);
                                                        return (
                                                            <label
                                                                key={chapter.id}
                                                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${isSelected
                                                                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                                                                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-transparent'
                                                                    }`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isSelected}
                                                                    onChange={() => toggleChapter(chapter.id)}
                                                                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className={`text-sm font-medium truncate ${isSelected
                                                                        ? 'text-blue-700 dark:text-blue-400'
                                                                        : 'text-slate-700 dark:text-slate-200'
                                                                        }`}>
                                                                        {chapter.title}
                                                                    </div>
                                                                    {chapter.description && (
                                                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                                                            {chapter.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                {isSelected && (
                                                                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                                                )}
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Summary Badge */}
                            {selectedChapters.size > 0 && (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-3 flex items-center justify-between border border-blue-100 dark:border-blue-800">
                                    <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                                        <Check className="w-4 h-4" />
                                        <span>
                                            <strong>{selectedChapters.size}</strong> topics will be included in this test&apos;s syllabus
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedChapters(new Set())}
                                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Clear All
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* No chapters message */}
                    {formData.subject && formData.class && availableChapters.length === 0 && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                No chapters available for {formData.subject} - Class {formData.class} ({examType}).
                                The test will be created without chapter tagging.
                            </p>
                        </div>
                    )}

                    {/* Custom Topics Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                <BookOpen className="w-4 h-4 inline mr-2" />
                                Add Custom Topics (Optional)
                            </label>
                            {customTopics.length > 0 && (
                                <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                                    {customTopics.length} custom
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Add topics that aren&apos;t in the predefined list above. These will appear in the syllabus.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newCustomTopic}
                                onChange={(e) => setNewCustomTopic(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && newCustomTopic.trim()) {
                                        e.preventDefault();
                                        setCustomTopics([...customTopics, newCustomTopic.trim()]);
                                        setNewCustomTopic('');
                                    }
                                }}
                                placeholder="e.g., Integration by Parts, Thermodynamics..."
                                className="flex-1 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (newCustomTopic.trim()) {
                                        setCustomTopics([...customTopics, newCustomTopic.trim()]);
                                        setNewCustomTopic('');
                                    }
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                Add
                            </button>
                        </div>
                        {/* Custom Topics List */}
                        {customTopics.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {customTopics.map((topic, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-lg text-sm"
                                    >
                                        <span>{topic}</span>
                                        <button
                                            type="button"
                                            onClick={() => setCustomTopics(customTopics.filter((_, i) => i !== idx))}
                                            className="ml-1 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Next Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={() => {
                                if (validateForm()) {
                                    setStep(2);
                                }
                            }}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                        >
                            Next: Select Students
                            <ChevronDown className="w-4 h-4 -rotate-90" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

