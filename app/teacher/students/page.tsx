"use client";

import { useState, useEffect, useCallback } from "react";
import {
    getAllEnrollments,
    updateEnrollment,
    createEnrollment,
    lookupStudent,
    Enrollment
} from "@/lib/offlineTests";
import {
    Users,
    Search,
    Filter,
    Edit2,
    Check,
    X,
    Loader2,
    UserCheck,
    UserX,
    ChevronDown,
    Plus,
    UserPlus,
    Phone,
    Mail
} from "lucide-react";

export default function StudentsPage() {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [classFilter, setClassFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState({
        roll_number: "",
        batch: "",
        enrollment_status: "" as "ENROLLED" | "NOT_ENROLLED" | "",
    });
    const [saving, setSaving] = useState(false);

    // Add Student Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [lookupTerm, setLookupTerm] = useState("");
    const [lookupLoading, setLookupLoading] = useState(false);
    const [lookupResult, setLookupResult] = useState<{ user_id: string; full_name: string; email: string; phone: string } | null>(null);
    const [lookupError, setLookupError] = useState("");
    const [addClass, setAddClass] = useState<"11" | "12" | "Dropper">("11");
    const [addBatch, setAddBatch] = useState("");

    const fetchEnrollments = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllEnrollments();
            // Sort by roll number numerically/alphabetically if present, else by name
            data.sort((a, b) => {
                if (a.roll_number && b.roll_number) {
                    return a.roll_number.localeCompare(b.roll_number, undefined, { numeric: true });
                }
                if (a.roll_number) return -1;
                if (b.roll_number) return 1;
                return a.name.localeCompare(b.name);
            });
            setEnrollments(data);
        } catch (error) {
            console.error("Error fetching enrollments:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const filterEnrollments = useCallback(() => {
        let filtered = [...enrollments];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (e) =>
                    e.name.toLowerCase().includes(query) ||
                    e.roll_number?.toLowerCase().includes(query) ||
                    e.batch?.toLowerCase().includes(query) ||
                    e.phone_number?.includes(query) ||
                    e.email?.toLowerCase().includes(query)
            );
        }

        if (classFilter) {
            filtered = filtered.filter((e) => e.class === classFilter);
        }

        if (statusFilter) {
            filtered = filtered.filter((e) => e.enrollment_status === statusFilter);
        }

        setFilteredEnrollments(filtered);
    }, [enrollments, searchQuery, classFilter, statusFilter]);

    useEffect(() => {
        fetchEnrollments();
    }, [fetchEnrollments]);

    useEffect(() => {
        filterEnrollments();
    }, [filterEnrollments]);

    function startEditing(enrollment: Enrollment) {
        setEditingId(enrollment.id);
        setEditValues({
            roll_number: enrollment.roll_number || "",
            batch: enrollment.batch || "",
            enrollment_status: enrollment.enrollment_status,
        });
    }

    function cancelEditing() {
        setEditingId(null);
        setEditValues({ roll_number: "", batch: "", enrollment_status: "" });
    }

    async function saveEdit(enrollmentId: string) {
        setSaving(true);
        try {
            const updates: Record<string, string> = {};
            if (editValues.roll_number !== undefined) {
                updates.roll_number = editValues.roll_number;
            }
            if (editValues.batch !== undefined) {
                updates.batch = editValues.batch;
            }
            if (editValues.enrollment_status) {
                updates.enrollment_status = editValues.enrollment_status;
            }

            const success = await updateEnrollment(enrollmentId, updates);
            if (success) {
                // Update local state
                setEnrollments((prev) =>
                    prev.map((e) =>
                        e.id === enrollmentId
                            ? {
                                ...e,
                                roll_number: editValues.roll_number || e.roll_number,
                                batch: editValues.batch || e.batch,
                                enrollment_status:
                                    editValues.enrollment_status || e.enrollment_status,
                            }
                            : e
                    )
                );
                setEditingId(null);
            }
        } catch (error) {
            console.error("Error saving enrollment:", error);
        } finally {
            setSaving(false);
        }
    }

    async function toggleStatus(enrollment: Enrollment) {
        const newStatus =
            enrollment.enrollment_status === "ENROLLED" ? "NOT_ENROLLED" : "ENROLLED";
        setSaving(true);
        try {
            const success = await updateEnrollment(enrollment.id, {
                enrollment_status: newStatus,
            });
            if (success) {
                setEnrollments((prev) =>
                    prev.map((e) =>
                        e.id === enrollment.id ? { ...e, enrollment_status: newStatus } : e
                    )
                );
            }
        } catch (error) {
            console.error("Error toggling status:", error);
        } finally {
            setSaving(false);
        }
    }

    // Add Student Functions
    async function handleLookup() {
        if (!lookupTerm.trim()) return;
        setLookupLoading(true);
        setLookupError("");
        setLookupResult(null);

        try {
            const results = await lookupStudent(lookupTerm.trim());
            if (results && results.length > 0) {
                setLookupResult(results[0]);
            } else {
                setLookupError("No student found with this email or phone.");
            }
        } catch (err) {
            setLookupError("Error searching for student.");
        } finally {
            setLookupLoading(false);
        }
    }

    async function handleAddStudent() {
        if (!lookupResult) return;

        // Check if already enrolled
        const existing = enrollments.find(e => e.user_id === lookupResult.user_id);
        if (existing) {
            setLookupError("This student is already tracked in the system.");
            return;
        }

        setSaving(true);
        try {
            const newEnrollment = await createEnrollment({
                user_id: lookupResult.user_id,
                name: lookupResult.full_name,
                class: addClass,
                batch: addBatch || undefined,
                enrollment_status: "ENROLLED",
                phone_number: lookupResult.phone,
                email: lookupResult.email
            });

            if (newEnrollment) {
                setEnrollments(prev => [...prev, newEnrollment]);
                resetAddModal();
            } else {
                setLookupError("Failed to add student enrollment.");
            }
        } catch (err) {
            console.error("Error adding student:", err);
            setLookupError("Error creating enrollment record.");
        } finally {
            setSaving(false);
        }
    }

    function resetAddModal() {
        setShowAddModal(false);
        setLookupTerm("");
        setLookupResult(null);
        setLookupError("");
        setAddBatch("");
        setAddClass("11");
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    const enrolledCount = enrollments.filter(
        (e) => e.enrollment_status === "ENROLLED"
    ).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="w-7 h-7 text-blue-600" />
                        Student Management
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Manage student enrollments, roll numbers, and batches
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                    <UserPlus className="w-5 h-5" />
                    Enrol New Student
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {enrollments.length}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Total Students
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {enrolledCount}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Enrolled</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {enrollments.length - enrolledCount}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Not Enrolled
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, roll no, batch, phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Class Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.target.value)}
                            className="pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                        >
                            <option value="">All Classes</option>
                            <option value="11">Class 11</option>
                            <option value="12">Class 12</option>
                            <option value="Dropper">Dropper</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-4 pr-8 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                        >
                            <option value="">All Status</option>
                            <option value="ENROLLED">Enrolled</option>
                            <option value="NOT_ENROLLED">Not Enrolled</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {filteredEnrollments.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400">
                            {enrollments.length === 0
                                ? "No students found"
                                : "No students match your filters"}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Class
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Batch
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Roll Number
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredEnrollments.map((enrollment) => (
                                    <tr
                                        key={enrollment.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                        <td className="px-4 py-4">
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {enrollment.name}
                                            </p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300">
                                                Class {enrollment.class}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            {editingId === enrollment.id ? (
                                                <input
                                                    type="text"
                                                    value={editValues.batch}
                                                    onChange={(e) =>
                                                        setEditValues((prev) => ({
                                                            ...prev,
                                                            batch: e.target.value,
                                                        }))
                                                    }
                                                    placeholder="Enter batch"
                                                    className="w-24 px-2 py-1 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            ) : (
                                                <span className="text-slate-600 dark:text-slate-400">
                                                    {enrollment.batch || "-"}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            {editingId === enrollment.id ? (
                                                <input
                                                    type="text"
                                                    value={editValues.roll_number}
                                                    onChange={(e) =>
                                                        setEditValues((prev) => ({
                                                            ...prev,
                                                            roll_number: e.target.value,
                                                        }))
                                                    }
                                                    placeholder="Roll number"
                                                    className="w-28 px-2 py-1 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            ) : (
                                                <span className="text-slate-600 dark:text-slate-400 font-mono">
                                                    {enrollment.roll_number || "-"}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-1">
                                                {enrollment.phone_number && (
                                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                                        <Phone className="w-3 h-3" />
                                                        {enrollment.phone_number}
                                                    </div>
                                                )}
                                                {enrollment.email && (
                                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                                        <Mail className="w-3 h-3" />
                                                        <span className="truncate max-w-[150px]">{enrollment.email}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <button
                                                onClick={() => toggleStatus(enrollment)}
                                                disabled={saving || editingId === enrollment.id}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${enrollment.enrollment_status === "ENROLLED"
                                                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
                                                    : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50"
                                                    }`}
                                            >
                                                {enrollment.enrollment_status === "ENROLLED" ? (
                                                    <>
                                                        <UserCheck className="w-3.5 h-3.5" />
                                                        Enrolled
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserX className="w-3.5 h-3.5" />
                                                        Not Enrolled
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            {editingId === enrollment.id ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => saveEdit(enrollment.id)}
                                                        disabled={saving}
                                                        className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                                                    >
                                                        {saving ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Check className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={cancelEditing}
                                                        disabled={saving}
                                                        className="p-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => startEditing(enrollment)}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Student Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Enrol New Student
                            </h3>
                            <button
                                onClick={resetAddModal}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            {!lookupResult ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Search Student
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Enter Phone or Email"
                                                value={lookupTerm}
                                                onChange={(e) => setLookupTerm(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                                                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                onClick={handleLookup}
                                                disabled={lookupLoading || !lookupTerm.trim()}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                            >
                                                {lookupLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {lookupError && (
                                            <p className="text-sm text-red-600 dark:text-red-400">{lookupError}</p>
                                        )}
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                                        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">Instruction</h4>
                                        <p className="text-xs text-blue-700 dark:text-blue-300">
                                            Enter the exact phone number (as entered during onboarding) or email address to find the student.
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-600">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                                {lookupResult.full_name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white">{lookupResult.full_name}</p>
                                                <p className="text-sm text-slate-500">{lookupResult.email}</p>
                                                <p className="text-sm text-slate-500">{lookupResult.phone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Class
                                            </label>
                                            <select
                                                value={addClass}
                                                onChange={(e) => setAddClass(e.target.value as any)}
                                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="11">Class 11</option>
                                                <option value="12">Class 12</option>
                                                <option value="Dropper">Dropper</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Batch (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={addBatch}
                                                onChange={(e) => setAddBatch(e.target.value)}
                                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleAddStudent}
                                        disabled={saving}
                                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Enrolling...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-5 h-5" />
                                                Confirm Enrollment
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setLookupResult(null)}
                                        className="w-full py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
