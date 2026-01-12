"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
    getTestById,
    getTestStudents,
    getTestResults,
    saveTestResults,
    OfflineTest,
    TestResult
} from "@/lib/offlineTests";
import { supabase } from "@/lib/supabase";
import {
    FileText,
    Save,
    Loader2,
    ArrowLeft,
    Users,
    Award,
    Calendar,
    Check,
    AlertCircle,
    Trophy,
    Medal
} from "lucide-react";
import Link from "next/link";

interface StudentWithMarks {
    userId: string;
    name: string;
    rollNumber: string | null;
    marks: string;
    existingResult?: TestResult;
}

export default function EnterMarksPage({ params }: { params: Promise<{ testId: string }> }) {
    const resolvedParams = use(params);
    const { session } = useAuth();
    const router = useRouter();

    const [test, setTest] = useState<OfflineTest | null>(null);
    const [students, setStudents] = useState<StudentWithMarks[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showRankings, setShowRankings] = useState(false);

    useEffect(() => {
        fetchData();
    }, [resolvedParams.testId]);

    async function fetchData() {
        setLoading(true);
        try {
            // Fetch test
            const testData = await getTestById(resolvedParams.testId);
            if (!testData) {
                router.push("/teacher/tests");
                return;
            }
            setTest(testData);

            // Fetch assigned students
            const studentIds = await getTestStudents(resolvedParams.testId);

            // Fetch existing results
            const existingResults = await getTestResults(resolvedParams.testId);
            const resultsMap = new Map(existingResults.map((r) => [r.student_id, r]));

            // Fetch student details from enrollments
            const { data: enrollments } = await supabase
                .from("enrollments")
                .select("user_id, name, roll_number")
                .in("user_id", studentIds);

            const studentsWithMarks: StudentWithMarks[] = (enrollments || []).map(
                (enrollment) => {
                    const existingResult = resultsMap.get(enrollment.user_id);
                    return {
                        userId: enrollment.user_id,
                        name: enrollment.name,
                        rollNumber: enrollment.roll_number,
                        marks:
                            existingResult?.marks_obtained !== null &&
                                existingResult?.marks_obtained !== undefined
                                ? existingResult.marks_obtained.toString()
                                : "",
                        existingResult,
                    };
                }
            );

            // Sort by roll number or name
            studentsWithMarks.sort((a, b) => {
                if (a.rollNumber && b.rollNumber) {
                    return a.rollNumber.localeCompare(b.rollNumber);
                }
                return a.name.localeCompare(b.name);
            });

            setStudents(studentsWithMarks);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load test data");
        } finally {
            setLoading(false);
        }
    }

    function updateMarks(userId: string, value: string) {
        // Allow empty or valid numbers only
        if (value !== "" && (isNaN(parseInt(value)) || parseInt(value) < 0)) {
            return;
        }
        if (value !== "" && test && parseInt(value) > test.max_marks) {
            return;
        }

        setStudents((prev) =>
            prev.map((s) => (s.userId === userId ? { ...s, marks: value } : s))
        );
    }

    async function handleSave() {
        if (!test || !session?.user?.id) return;

        // Validate all marks
        const resultsToSave = students
            .filter((s) => s.marks !== "")
            .map((s) => ({
                student_id: s.userId,
                marks_obtained: parseInt(s.marks),
            }));

        if (resultsToSave.length === 0) {
            setError("Please enter marks for at least one student");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const success = await saveTestResults(
                test.id,
                resultsToSave,
                session.user.id
            );

            if (success) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
                // Refresh to show rankings
                await fetchData();
                setTest((prev) => (prev ? { ...prev, is_marks_entered: true } : prev));
            } else {
                throw new Error("Failed to save");
            }
        } catch (err) {
            console.error("Error saving marks:", err);
            setError("Failed to save marks. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    // Calculate rankings
    function getRankings() {
        const studentsWithMarks = students
            .filter((s) => s.marks !== "")
            .map((s) => ({ ...s, marksNum: parseInt(s.marks) }))
            .sort((a, b) => b.marksNum - a.marksNum);

        return studentsWithMarks.map((student, index) => {
            const rank = index + 1;
            const studentsBelow = studentsWithMarks.length - rank;
            const percentile = Math.round(
                (studentsBelow / studentsWithMarks.length) * 100
            );
            return { ...student, rank, percentile };
        });
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!test) {
        return (
            <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Test not found</p>
            </div>
        );
    }

    const enteredCount = students.filter((s) => s.marks !== "").length;
    const rankings = getRankings();

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/teacher/tests"
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {test.test_name}
                    </h1>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400">
                        <span>{test.subject}</span>
                        <span>•</span>
                        <span>Class {test.class}</span>
                        {test.batch && (
                            <>
                                <span>•</span>
                                <span>{test.batch}</span>
                            </>
                        )}
                        <span>•</span>
                        <span>Max: {test.max_marks} marks</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {test.is_marks_entered && (
                        <button
                            onClick={() => setShowRankings(!showRankings)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${showRankings
                                    ? "bg-purple-600 text-white"
                                    : "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                                }`}
                        >
                            <Trophy className="w-5 h-5" />
                            {showRankings ? "Hide Rankings" : "View Rankings"}
                        </button>
                    )}
                </div>
            </div>

            {/* Test Info Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <Calendar className="w-5 h-5" />
                            <span>
                                {new Date(test.test_date).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <Users className="w-5 h-5" />
                            <span>{students.length} students</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <Award className="w-5 h-5" />
                            <span>
                                {enteredCount}/{students.length} marks entered
                            </span>
                        </div>
                    </div>
                    {test.is_marks_entered && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                            <Check className="w-4 h-4" />
                            Marks Saved
                        </span>
                    )}
                </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
            )}
            {success && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                        Marks saved successfully!
                    </p>
                </div>
            )}

            {/* Rankings View */}
            {showRankings && rankings.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-purple-600" />
                            Test Rankings
                        </h3>
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {rankings.map((student) => (
                            <div
                                key={student.userId}
                                className={`flex items-center justify-between p-4 ${student.rank <= 3
                                        ? "bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-900/10"
                                        : ""
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${student.rank === 1
                                                ? "bg-yellow-100 text-yellow-700"
                                                : student.rank === 2
                                                    ? "bg-slate-200 text-slate-700"
                                                    : student.rank === 3
                                                        ? "bg-amber-100 text-amber-700"
                                                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                            }`}
                                    >
                                        {student.rank <= 3 ? (
                                            <Medal className="w-5 h-5" />
                                        ) : (
                                            `#${student.rank}`
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {student.name}
                                        </p>
                                        {student.rollNumber && (
                                            <p className="text-sm text-slate-500">
                                                Roll: {student.rollNumber}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                                            {student.marksNum}/{test.max_marks}
                                        </p>
                                        <p className="text-xs text-slate-500">Score</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                            {student.percentile}%
                                        </p>
                                        <p className="text-xs text-slate-500">Percentile</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Marks Entry */}
            {!showRankings && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                            Enter Marks
                        </h3>
                    </div>
                    {students.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">No students assigned to this test</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                #
                                            </th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                Roll No
                                            </th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                Student Name
                                            </th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                Marks (/{test.max_marks})
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {students.map((student, index) => (
                                            <tr
                                                key={student.userId}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                            >
                                                <td className="px-4 py-3 text-sm text-slate-500">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-sm font-mono text-slate-600 dark:text-slate-400">
                                                        {student.rollNumber || "-"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-slate-900 dark:text-white">
                                                        {student.name}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            value={student.marks}
                                                            onChange={(e) =>
                                                                updateMarks(student.userId, e.target.value)
                                                            }
                                                            placeholder="--"
                                                            min="0"
                                                            max={test.max_marks}
                                                            className="w-20 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-center text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                        <span className="text-sm text-slate-400">
                                                            / {test.max_marks}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    {enteredCount} of {students.length} marks entered
                                </span>
                                <button
                                    onClick={handleSave}
                                    disabled={saving || enteredCount === 0}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Marks
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
