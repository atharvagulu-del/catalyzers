"use client";

import { useState, useEffect } from "react";
import { getAllTests, OfflineTest, getTestStudents } from "@/lib/offlineTests";
import {
    FileText,
    Search,
    Filter,
    Calendar,
    Award,
    Users,
    ChevronRight,
    Loader2,
    Plus,
    ChevronDown
} from "lucide-react";
import Link from "next/link";

interface TestWithStudentCount extends OfflineTest {
    studentCount: number;
}

export default function TestsListPage() {
    const [tests, setTests] = useState<TestWithStudentCount[]>([]);
    const [filteredTests, setFilteredTests] = useState<TestWithStudentCount[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [classFilter, setClassFilter] = useState<string>("");
    const [subjectFilter, setSubjectFilter] = useState<string>("");

    useEffect(() => {
        fetchTests();
    }, []);

    useEffect(() => {
        filterTests();
    }, [tests, searchQuery, classFilter, subjectFilter]);

    async function fetchTests() {
        setLoading(true);
        try {
            const testsData = await getAllTests();

            // Fetch student counts for each test
            const testsWithCounts = await Promise.all(
                testsData.map(async (test) => {
                    const students = await getTestStudents(test.id);
                    return { ...test, studentCount: students.length };
                })
            );

            setTests(testsWithCounts);
        } catch (error) {
            console.error("Error fetching tests:", error);
        } finally {
            setLoading(false);
        }
    }

    function filterTests() {
        let filtered = [...tests];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (t) =>
                    t.test_name.toLowerCase().includes(query) ||
                    t.subject.toLowerCase().includes(query)
            );
        }

        if (classFilter) {
            filtered = filtered.filter((t) => t.class === classFilter);
        }

        if (subjectFilter) {
            filtered = filtered.filter((t) => t.subject === subjectFilter);
        }

        setFilteredTests(filtered);
    }

    // Get unique subjects for filter
    const subjects = [...new Set(tests.map((t) => t.subject))];

    const today = new Date().toISOString().split("T")[0];
    const upcomingCount = tests.filter((t) => t.test_date >= today).length;
    const marksEnteredCount = tests.filter((t) => t.is_marks_entered).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-7 h-7 text-blue-600" />
                        All Tests
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        View and manage all scheduled tests
                    </p>
                </div>
                <Link
                    href="/teacher/tests/create"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create Test
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {tests.length}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Total Tests
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {upcomingCount}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Upcoming
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {marksEnteredCount}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Marks Entered
                            </p>
                        </div>
                    </div>
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
                            placeholder="Search by test name or subject..."
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

                    {/* Subject Filter */}
                    <div className="relative">
                        <select
                            value={subjectFilter}
                            onChange={(e) => setSubjectFilter(e.target.value)}
                            className="pl-4 pr-8 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                        >
                            <option value="">All Subjects</option>
                            {subjects.map((subject) => (
                                <option key={subject} value={subject}>
                                    {subject}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Tests List */}
            {filteredTests.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-12 border border-slate-200 dark:border-slate-700 text-center">
                    <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                        {tests.length === 0
                            ? "No tests created yet"
                            : "No tests match your filters"}
                    </p>
                    {tests.length === 0 && (
                        <Link
                            href="/teacher/tests/create"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Create Your First Test
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredTests.map((test) => {
                        const isPast = test.test_date < today;
                        return (
                            <div
                                key={test.id}
                                className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPast
                                                    ? "bg-slate-100 dark:bg-slate-700"
                                                    : "bg-blue-100 dark:bg-blue-900/30"
                                                }`}
                                        >
                                            <FileText
                                                className={`w-6 h-6 ${isPast
                                                        ? "text-slate-500"
                                                        : "text-blue-600 dark:text-blue-400"
                                                    }`}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                {test.test_name}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    {test.subject}
                                                </span>
                                                <span className="text-slate-300 dark:text-slate-600">
                                                    •
                                                </span>
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    Class {test.class}
                                                    {test.batch && ` • ${test.batch}`}
                                                </span>
                                                <span className="text-slate-300 dark:text-slate-600">
                                                    •
                                                </span>
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    Max: {test.max_marks}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {/* Student Count */}
                                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                            <Users className="w-4 h-4" />
                                            <span className="text-sm">{test.studentCount}</span>
                                        </div>
                                        {/* Date */}
                                        <div className="text-right">
                                            <div
                                                className={`text-sm font-medium ${isPast
                                                        ? "text-slate-500"
                                                        : "text-blue-600 dark:text-blue-400"
                                                    }`}
                                            >
                                                {new Date(test.test_date).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </div>
                                            {isPast ? (
                                                <span className="text-xs text-slate-400">Past</span>
                                            ) : (
                                                <span className="text-xs text-blue-500">Upcoming</span>
                                            )}
                                        </div>
                                        {/* Status */}
                                        {test.is_marks_entered ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                                <Award className="w-3 h-3" />
                                                Done
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30 text-xs font-medium text-amber-700 dark:text-amber-400">
                                                Pending
                                            </span>
                                        )}
                                        {/* Action */}
                                        <Link
                                            href={`/teacher/tests/${test.id}/marks`}
                                            className="flex items-center gap-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm font-medium"
                                        >
                                            {test.is_marks_entered ? "View/Edit" : "Enter Marks"}
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
