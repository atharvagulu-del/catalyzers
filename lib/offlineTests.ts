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

export interface TeacherProfile {
    id: string;
    user_id: string;
    name: string;
    subjects: string[];
    classes: string[];
    is_admin: boolean;
    created_at: string;
}

export async function lookupStudent(searchTerm: string): Promise<{ user_id: string; full_name: string; email: string; phone: string }[]> {
    const { data, error } = await supabase
        .rpc('lookup_student_by_identifier', { search_term: searchTerm });

    if (error) {
        console.error('Error looking up student:', error);
        return [];
    }
    return data || [];
}

export interface OfflineTest {
    id: string;
    created_by: string;
    test_name: string;
    subject: string;
    class: '11' | '12' | 'Dropper';
    batch: string | null;
    test_date: string;
    max_marks: number;
    is_marks_entered: boolean;
    created_at: string;
}

export interface TestStudent {
    id: string;
    test_id: string;
    student_id: string;
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
    all_results?: TestResultWithStudent[];
    total_students?: number;
    my_rank?: number;
    my_percentile?: number;
}

export interface TestResultWithStudent extends TestResult {
    student_name?: string;
    enrollment?: Enrollment;
}

// ==========================================
// TEACHER PROFILE QUERIES
// ==========================================

export async function checkIsTeacher(userId: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('teacher_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

    return !error && !!data;
}

export async function getTeacherProfile(userId: string): Promise<TeacherProfile | null> {
    const { data, error } = await supabase
        .from('teacher_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) return null;
    return data;
}

// ==========================================
// ENROLLMENT QUERIES
// ==========================================

export async function getMyEnrollment(userId: string): Promise<Enrollment | null> {
    const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) return null;
    return data;
}

export async function getAllEnrollments(filters?: {
    class?: string;
    batch?: string;
    status?: 'ENROLLED' | 'NOT_ENROLLED';
}): Promise<Enrollment[]> {
    let query = supabase.from('enrollments').select('*');

    if (filters?.class) {
        query = query.eq('class', filters.class);
    }
    if (filters?.batch) {
        query = query.eq('batch', filters.batch);
    }
    if (filters?.status) {
        query = query.eq('enrollment_status', filters.status);
    }

    const { data, error } = await query.order('name');

    if (error) {
        console.error('Error fetching enrollments:', error);
        return [];
    }
    return data || [];
}

export async function updateEnrollment(
    enrollmentId: string,
    updates: {
        roll_number?: string;
        enrollment_status?: 'ENROLLED' | 'NOT_ENROLLED';
        batch?: string;
    }
): Promise<boolean> {
    const { error } = await supabase
        .from('enrollments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', enrollmentId);

    return !error;
}

export async function createEnrollment(enrollment: {
    user_id: string;
    name: string;
    class: '11' | '12' | 'Dropper';
    batch?: string;
    roll_number?: string;
    enrollment_status?: 'ENROLLED' | 'NOT_ENROLLED';
    phone_number?: string;
    email?: string;
}): Promise<Enrollment | null> {
    const { data, error } = await supabase
        .from('enrollments')
        .insert(enrollment)
        .select()
        .single();

    if (error) {
        console.error('Error creating enrollment:', error);
        return null;
    }
    return data;
}

// ==========================================
// OFFLINE TESTS QUERIES
// ==========================================

export async function createTest(test: {
    test_name: string;
    subject: string;
    class: '11' | '12' | 'Dropper';
    batch?: string;
    test_date: string;
    max_marks: number;
    created_by: string;
}): Promise<OfflineTest | null> {
    const { data, error } = await supabase
        .from('offline_tests')
        .insert(test)
        .select()
        .single();

    if (error) {
        console.error('Error creating test:', error);
        return null;
    }
    return data;
}

export async function getAllTests(filters?: {
    class?: string;
    subject?: string;
}): Promise<OfflineTest[]> {
    let query = supabase.from('offline_tests').select('*');

    if (filters?.class) {
        query = query.eq('class', filters.class);
    }
    if (filters?.subject) {
        query = query.eq('subject', filters.subject);
    }

    const { data, error } = await query.order('test_date', { ascending: false });

    if (error) {
        console.error('Error fetching tests:', error);
        return [];
    }
    return data || [];
}

export async function getTestById(testId: string): Promise<OfflineTest | null> {
    const { data, error } = await supabase
        .from('offline_tests')
        .select('*')
        .eq('id', testId)
        .single();

    if (error) return null;
    return data;
}

export async function updateTestMarksEnteredStatus(testId: string, status: boolean): Promise<boolean> {
    const { error } = await supabase
        .from('offline_tests')
        .update({ is_marks_entered: status })
        .eq('id', testId);

    return !error;
}

// ==========================================
// TEST STUDENTS QUERIES
// ==========================================

export async function assignStudentsToTest(
    testId: string,
    studentIds: string[]
): Promise<boolean> {
    const assignments = studentIds.map(studentId => ({
        test_id: testId,
        student_id: studentId,
    }));

    const { error } = await supabase
        .from('test_students')
        .insert(assignments);

    if (error) {
        console.error('Error assigning students:', error);
        return false;
    }
    return true;
}

export async function getTestStudents(testId: string): Promise<string[]> {
    const { data, error } = await supabase
        .from('test_students')
        .select('student_id')
        .eq('test_id', testId);

    if (error) {
        console.error('Error fetching test students:', error);
        return [];
    }
    return data?.map(ts => ts.student_id) || [];
}

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

// ==========================================
// TEST RESULTS QUERIES
// ==========================================

export async function saveTestResults(
    testId: string,
    results: { student_id: string; marks_obtained: number }[],
    enteredBy: string
): Promise<boolean> {
    // Upsert results
    const resultsToSave = results.map(r => ({
        test_id: testId,
        student_id: r.student_id,
        marks_obtained: r.marks_obtained,
        entered_by: enteredBy,
        entered_at: new Date().toISOString(),
    }));

    const { error } = await supabase
        .from('test_results')
        .upsert(resultsToSave, {
            onConflict: 'test_id,student_id',
        });

    if (error) {
        console.error('Error saving results:', error);
        return false;
    }

    // Mark test as having marks entered
    await updateTestMarksEnteredStatus(testId, true);

    return true;
}

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

// ==========================================
// TEST WITH RESULTS & RANKINGS
// ==========================================

export async function getMyTestsWithResults(userId: string): Promise<TestWithResults[]> {
    const tests = await getMyAssignedTests(userId);

    const testsWithResults: TestWithResults[] = [];

    for (const test of tests) {
        // Get my result
        const myResult = await getMyTestResult(test.id, userId);

        // Get all results for ranking calculation
        const allResults = await getTestResults(test.id);

        // Calculate rank and percentile if marks are entered
        let myRank: number | undefined;
        let myPercentile: number | undefined;
        const totalStudents = allResults.length;

        if (myResult?.marks_obtained !== null && myResult?.marks_obtained !== undefined) {
            // Sort results by marks (descending)
            const sortedResults = allResults
                .filter(r => r.marks_obtained !== null)
                .sort((a, b) => (b.marks_obtained || 0) - (a.marks_obtained || 0));

            // Find my rank
            const myIndex = sortedResults.findIndex(r => r.student_id === userId);
            if (myIndex !== -1) {
                myRank = myIndex + 1;
                // Percentile = (Number of students below me / Total students) * 100
                const studentsBelow = sortedResults.length - myRank;
                myPercentile = Math.round((studentsBelow / sortedResults.length) * 100);
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

export async function getTestResultsWithRankings(testId: string): Promise<{
    test: OfflineTest | null;
    results: (TestResult & { rank: number; percentile: number; enrollment?: Enrollment })[];
}> {
    const test = await getTestById(testId);
    if (!test) {
        return { test: null, results: [] };
    }

    const results = await getTestResults(testId);
    const studentIds = results.map(r => r.student_id);

    // Get enrollments for all students
    const { data: enrollments } = await supabase
        .from('enrollments')
        .select('*')
        .in('user_id', studentIds);

    const enrollmentMap = new Map(enrollments?.map(e => [e.user_id, e]) || []);

    // Sort by marks and calculate rankings
    const sortedResults = results
        .filter(r => r.marks_obtained !== null)
        .sort((a, b) => (b.marks_obtained || 0) - (a.marks_obtained || 0));

    const rankedResults = sortedResults.map((result, index) => {
        const rank = index + 1;
        const studentsBelow = sortedResults.length - rank;
        const percentile = Math.round((studentsBelow / sortedResults.length) * 100);

        return {
            ...result,
            rank,
            percentile,
            enrollment: enrollmentMap.get(result.student_id),
        };
    });

    return { test, results: rankedResults };
}

// ==========================================
// TEACHER DASHBOARD STATS
// ==========================================

export async function getTeacherDashboardStats(): Promise<{
    totalStudents: number;
    enrolledStudents: number;
    totalTests: number;
    testsWithMarks: number;
}> {
    const [enrollments, tests] = await Promise.all([
        getAllEnrollments(),
        getAllTests(),
    ]);

    return {
        totalStudents: enrollments.length,
        enrolledStudents: enrollments.filter(e => e.enrollment_status === 'ENROLLED').length,
        totalTests: tests.length,
        testsWithMarks: tests.filter(t => t.is_marks_entered).length,
    };
}
