"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
    getTestById,
    getTestStudents,
    getTestResults,
    saveTestResults,
    updateTestPaper,
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
    Medal,
    Clock,
    Upload,
    Image as ImageIcon,
    X,
    Plus
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface StudentWithMarks {
    userId: string;
    name: string;
    rollNumber: string | null;
    marks: string;
    existingResult?: TestResult;
}

export default function EnterMarksPage({ params }: { params: { testId: string } }) {
    const { session } = useAuth();
    const router = useRouter();

    const [test, setTest] = useState<OfflineTest | null>(null);
    const [students, setStudents] = useState<StudentWithMarks[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showRankings, setShowRankings] = useState(false);

    // Test Paper Upload State
    const [testPaperImages, setTestPaperImages] = useState<string[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch test
            const testData = await getTestById(params.testId);
            if (!testData) {
                router.push("/teacher/tests");
                return;
            }
            setTest(testData);

            // Load existing test paper images
            if (testData.test_paper && testData.test_paper.length > 0) {
                setTestPaperImages(testData.test_paper);
            }

            // Fetch assigned students
            const studentIds = await getTestStudents(params.testId);

            // Fetch existing results
            const existingResults = await getTestResults(params.testId);
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
    }, [params.testId, router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const isTestEnded = test ? new Date() > new Date(test.end_time) : false;

    function updateMarks(userId: string, value: string) {
        // Allow empty or valid numbers only
        if (value !== "" && (isNaN(parseInt(value)) || parseInt(value) < 0)) {
            return;
        }
        if (value !== "" && test && parseInt(value) > test.max_marks) {
            return;
        }

        if (!isTestEnded) return;

        setStudents((prev) =>
            prev.map((s) => (s.userId === userId ? { ...s, marks: value } : s))
        );
    }

    async function handleSave() {
        if (!test || !session?.user?.id) return;

        // Validate test paper images - minimum 2 required
        if (testPaperImages.length < 2) {
            setError("Please upload at least 2 test paper images before saving marks. Students need to see the test paper for revision.");
            return;
        }

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

        const total = studentsWithMarks.length;

        return studentsWithMarks.map((student, index) => {
            const rank = index + 1;
            // For single student, show 100%ile
            // Otherwise: percentage of students scoring less than this student
            let percentile: number;
            if (total === 1) {
                percentile = 100;
            } else {
                const studentsBelow = total - rank;
                percentile = Math.round((studentsBelow / (total - 1)) * 100);
            }
            return { ...student, rank, percentile };
        });
    }

    // Handle test paper image upload
    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files || files.length === 0 || !test) return;

        setUploadingImage(true);
        setError("");

        try {
            const newImageUrls: string[] = [];

            for (const file of Array.from(files)) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    setError('Please upload only image files');
                    continue;
                }

                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    setError('Image too large. Max 5MB per image.');
                    continue;
                }

                // Generate unique filename
                const fileExt = file.name.split('.').pop();
                const fileName = `${test.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

                // Upload to Supabase Storage
                const { error: uploadError } = await supabase.storage
                    .from('test-papers')
                    .upload(fileName, file);

                if (uploadError) {
                    console.error('Upload error:', uploadError);
                    setError('Failed to upload image. Make sure "test-papers" bucket exists.');
                    continue;
                }

                // Get public URL
                const { data: urlData } = supabase.storage
                    .from('test-papers')
                    .getPublicUrl(fileName);

                if (urlData.publicUrl) {
                    newImageUrls.push(urlData.publicUrl);
                }
            }

            if (newImageUrls.length > 0) {
                const updatedImages = [...testPaperImages, ...newImageUrls];
                setTestPaperImages(updatedImages);

                // Save to database
                await updateTestPaper(test.id, updatedImages);
            }
        } catch (err) {
            console.error('Error uploading image:', err);
            setError('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    }

    // Remove test paper image
    async function handleRemoveImage(index: number) {
        if (!test) return;

        const updatedImages = testPaperImages.filter((_, i) => i !== index);
        setTestPaperImages(updatedImages);
        await updateTestPaper(test.id, updatedImages);
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
                                {new Date(test.start_time).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <Clock className="w-5 h-5" />
                            <span>
                                {new Date(test.start_time).toLocaleTimeString("en-IN", {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })} - {new Date(test.end_time).toLocaleTimeString("en-IN", {
                                    hour: "2-digit",
                                    minute: "2-digit"
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

            {/* Time Lock Warning */}
            {!isTestEnded && !test.is_marks_entered && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center gap-3 mb-6">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-amber-800 dark:text-amber-300">Test in Progress</h4>
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                            Marks entry will be enabled after the test ends at {new Date(test.end_time).toLocaleTimeString("en-IN", { timeStyle: 'short' })}.
                        </p>
                    </div>
                </div>
            )}

            {/* Test Paper Upload Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-slate-900 dark:text-white">Test Paper Images</h3>
                    </div>
                    <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                        {uploadingImage ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Upload className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                            {uploadingImage ? "Uploading..." : "Upload Images"}
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="hidden"
                        />
                    </label>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Upload test paper images so students can review after results are out.
                </p>

                {testPaperImages.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
                        <ImageIcon className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                        <p className="text-slate-500 dark:text-slate-400 text-sm">No test paper images uploaded yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {testPaperImages.map((imageUrl, index) => (
                            <div key={index} className="relative group aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                <Image
                                    src={imageUrl}
                                    alt={`Test paper page ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
                                    Page {index + 1}
                                </div>
                            </div>
                        ))}

                        {/* Add More Button */}
                        <label className="aspect-[3/4] rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
                            <Plus className="w-8 h-8 text-slate-400 mb-1" />
                            <span className="text-xs text-slate-500">Add More</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                                className="hidden"
                            />
                        </label>
                    </div>
                )}
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
                                                            disabled={!isTestEnded}
                                                            className={`w-20 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-center text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isTestEnded ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                    disabled={saving || enteredCount === 0 || !isTestEnded}
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
