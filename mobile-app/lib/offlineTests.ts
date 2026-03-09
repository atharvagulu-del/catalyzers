import { supabase } from './supabase';

// Types
export interface Enrollment {
    id: string;
    user_id: string;
    name: string;
    class: '11' | '12' | 'Dropper';
    batch: string | null;
    roll_number: string | null;
    enrollment_status: 'ENROLLED' | 'NOT_ENROLLED';
    phone_number?: string;
    email?: string;
    created_at: string;
    updated_at: string;
}

export interface OfflineTest {
    id: string;
    created_by: string;
    test_name: string;
    subject: string;
    class: '11' | '12' | 'Dropper';
    batch: string | null;
    test_date: string;
    start_time: string;
    end_time: string;
    max_marks: number;
    is_marks_entered: boolean;
    chapters?: string[];
    custom_topics?: string[];
    exam_type?: 'JEE' | 'NEET';
    test_paper?: string[];
    solution_paper?: string[];
    created_at: string;
}

export interface TestResult {
    id: string;
    test_id: string;
    student_id: string;
    marks_obtained: number | null;
    entered_by: string | null;
    entered_at: string;
}

export interface TestWithResults extends OfflineTest {
    my_result?: TestResult;
    total_students?: number;
    my_rank?: number;
    my_percentile?: number;
}

// Get enrollment for current user
export async function getMyEnrollment(userId: string): Promise<Enrollment | null> {
    const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) return null;
    return data;
}

// Get tests assigned to the student
export async function getMyAssignedTests(userId: string): Promise<OfflineTest[]> {
    // First get test IDs the student is assigned to
    const { data: assignments, error: assignmentError } = await supabase
        .from('test_students')
        .select('test_id')
        .eq('student_id', userId);

    if (assignmentError || !assignments?.length) {
        return [];
    }

    const testIds = assignments.map(a => a.test_id);

    // Then get the tests
    const { data: tests, error: testError } = await supabase
        .from('offline_tests')
        .select('*')
        .in('id', testIds)
        .order('test_date', { ascending: false });

    if (testError) {
        console.error('Error fetching tests:', testError);
        return [];
    }

    return tests || [];
}

// Get test result for a specific test
export async function getMyTestResult(testId: string, userId: string): Promise<TestResult | null> {
    const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('test_id', testId)
        .eq('student_id', userId)
        .single();

    if (error) return null;
    return data;
}

// Get all results for a test (for ranking)
export async function getTestResults(testId: string): Promise<TestResult[]> {
    const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('test_id', testId);

    if (error) {
        console.error('Error fetching results:', error);
        return [];
    }
    return data || [];
}

// Get all tests with results for a student
export async function getMyTestsWithResults(userId: string): Promise<TestWithResults[]> {
    const tests = await getMyAssignedTests(userId);
    const testsWithResults: TestWithResults[] = [];

    for (const test of tests) {
        const myResult = await getMyTestResult(test.id, userId);
        const allResults = await getTestResults(test.id);

        let myRank: number | undefined;
        let myPercentile: number | undefined;
        const totalStudents = allResults.length;

        if (myResult?.marks_obtained !== null && myResult?.marks_obtained !== undefined) {
            const sortedResults = allResults
                .filter(r => r.marks_obtained !== null && r.marks_obtained !== undefined)
                .sort((a, b) => (b.marks_obtained || 0) - (a.marks_obtained || 0));

            const myIndex = sortedResults.findIndex(r => r.student_id === userId);
            if (myIndex !== -1) {
                myRank = myIndex + 1;
                // Percentile formula: ((N - R) / (N - 1)) * 100
                // For single student, show 100%ile
                const totalWithMarks = sortedResults.length;
                if (totalWithMarks === 1) {
                    myPercentile = 100;
                } else {
                    const studentsBelow = totalWithMarks - myRank;
                    myPercentile = Math.round((studentsBelow / (totalWithMarks - 1)) * 100);
                }
            }
        }

        testsWithResults.push({
            ...test,
            my_result: myResult || undefined,
            total_students: totalStudents,
            my_rank: myRank,
            my_percentile: myPercentile,
        });
    }

    return testsWithResults;
}

// Get full test details with class average
export async function getTestWithFullDetails(testId: string, userId: string): Promise<{
    test: OfflineTest | null;
    myResult: TestResult | null;
    classAverage: number;
    totalStudents: number;
    myRank: number | null;
    myPercentile: number | null;
} | null> {
    const { data: test, error: testError } = await supabase
        .from('offline_tests')
        .select('*')
        .eq('id', testId)
        .single();

    if (testError || !test) return null;

    const { data: allResults } = await supabase
        .from('test_results')
        .select('*')
        .eq('test_id', testId);

    const results = allResults || [];
    const totalStudents = results.length;

    const myResult = results.find(r => r.student_id === userId) || null;

    const validResults = results.filter(r => r.marks_obtained !== null);
    const classAverage = validResults.length > 0
        ? Math.round(validResults.reduce((sum, r) => sum + (r.marks_obtained || 0), 0) / validResults.length)
        : 0;

    let myRank: number | null = null;
    let myPercentile: number | null = null;

    if (myResult?.marks_obtained !== null && myResult?.marks_obtained !== undefined) {
        // Sort all valid results by marks (descending)
        const sortedResults = [...validResults].sort((a, b) => (b.marks_obtained || 0) - (a.marks_obtained || 0));

        // Find this user's position and calculate rank
        const myMarks = myResult.marks_obtained;

        // Count how many students have HIGHER marks than this student
        const studentsWithHigherMarks = sortedResults.filter(r => (r.marks_obtained || 0) > myMarks).length;
        myRank = studentsWithHigherMarks + 1; // Rank is 1-indexed

        const total = sortedResults.length;

        console.log('[PERCENTILE DEBUG]', {
            userId,
            myMarks,
            total,
            myRank,
            studentsWithHigherMarks,
            allMarks: sortedResults.map(r => r.marks_obtained)
        });

        if (total === 1) {
            myPercentile = 100;
        } else {
            // Percentile = percentage of students scoring LESS than or EQUAL to this student
            // Formula: ((N - Rank) / (N - 1)) * 100
            const studentsBelow = total - myRank;
            myPercentile = Math.round((studentsBelow / (total - 1)) * 100);
        }

        console.log('[PERCENTILE RESULT]', { myRank, myPercentile });
    }

    return {
        test,
        myResult,
        classAverage,
        totalStudents,
        myRank,
        myPercentile,
    };
}

// Helper to determine test status
export type TestStatus = 'upcoming' | 'live' | 'ended' | 'results_out';

export function getTestStatus(test: TestWithResults): TestStatus {
    const now = new Date();
    const start = new Date(test.start_time);
    const end = new Date(test.end_time);

    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'live';
    if (test.is_marks_entered && test.my_result?.marks_obtained !== null && test.my_result?.marks_obtained !== undefined) return 'results_out';
    return 'ended';
}
