import { supabase } from "@/lib/supabase";

// ============================================
// LECTURE TIME TRACKING
// ============================================

export interface LectureProgress {
    resourceId: string;
    resourceTitle: string;
    subject: string;
    totalSeconds: number;
}

/**
 * Track lecture watch time - called periodically while video plays
 * Increments total_seconds for the given resource
 */
export const trackLectureWatchTime = async (
    userId: string,
    resourceId: string,
    resourceTitle: string,
    subject: string,
    secondsToAdd: number = 30
) => {
    try {
        // First, try to get existing record
        const { data: existing } = await supabase
            .from('user_lecture_progress')
            .select('total_seconds')
            .eq('user_id', userId)
            .eq('resource_id', resourceId)
            .single();

        if (existing) {
            // Update existing record
            await supabase
                .from('user_lecture_progress')
                .update({
                    total_seconds: existing.total_seconds + secondsToAdd,
                    last_updated_at: new Date().toISOString()
                })
                .eq('user_id', userId)
                .eq('resource_id', resourceId);
        } else {
            // Insert new record
            await supabase
                .from('user_lecture_progress')
                .insert({
                    user_id: userId,
                    resource_id: resourceId,
                    resource_title: resourceTitle,
                    subject: subject,
                    total_seconds: secondsToAdd
                });
        }
    } catch (e) {
        console.error("Failed to track lecture time:", e);
    }
};

// ============================================
// TEST RESULT TRACKING
// ============================================

export interface TestResult {
    testId: string;
    testTitle: string;
    testType: 'full_chapter' | 'topic_pyq' | 'topic_quiz';
    subject: string;
    totalQuestions: number;
    correctAnswers: number;
    // Penalty-based scoring fields
    totalWrongAttempts?: number;
    totalHintsUsed?: number;
    totalSkips?: number;
    effectiveScore?: number; // Score with penalties applied (out of totalQuestions)
}

/**
 * Save a completed test result
 * Should be called when quiz shows final result screen
 */
export const saveTestResult = async (userId: string, result: TestResult) => {
    try {
        // Use effective score if available, otherwise fall back to raw percentage
        const scorePercentage = result.effectiveScore !== undefined
            ? (result.effectiveScore / result.totalQuestions) * 100
            : (result.correctAnswers / result.totalQuestions) * 100;

        await supabase
            .from('user_test_results')
            .insert({
                user_id: userId,
                test_id: result.testId,
                test_title: result.testTitle,
                test_type: result.testType,
                subject: result.subject,
                total_questions: result.totalQuestions,
                correct_answers: result.correctAnswers,
                score_percentage: Math.round(scorePercentage * 100) / 100,
                total_wrong_attempts: result.totalWrongAttempts || 0,
                total_hints_used: result.totalHintsUsed || 0,
                total_skips: result.totalSkips || 0,
                effective_score: result.effectiveScore || result.correctAnswers
            });

        return { success: true };
    } catch (e) {
        console.error("Failed to save test result:", e);
        return { success: false };
    }
};

// ============================================
// PERFORMANCE STATS AGGREGATION
// ============================================

export interface PerformanceStats {
    testsTaken: number;
    lectureHours: number;
    questionsSolved: number;
    averageAccuracy: number;
    subjectProgress: SubjectProgress[]; // Legacy, kept for compatibility
    recentTests: RecentTest[]; // New: per-test records
}

export interface RecentTest {
    id: string;
    testTitle: string;
    subject: string;
    totalQuestions: number;
    effectiveScore: number;
    scorePercentage: number;
    completedAt: string; // ISO date
    lastActivity: string; // relative time
}

export interface SubjectProgress {
    subject: string;
    lastTopic: string;
    completionPercent: number;
    testScore: string; // e.g. "45/50"
    lastActivity: string; // relative time
}

/**
 * Get aggregated performance stats for the user
 */
export const getPerformanceStats = async (userId: string): Promise<PerformanceStats> => {
    try {
        // Get all test results
        const { data: testResults, error: testError } = await supabase
            .from('user_test_results')
            .select('*')
            .eq('user_id', userId);

        if (testError) throw testError;

        // Get all lecture progress
        const { data: lectureProgress, error: lectureError } = await supabase
            .from('user_lecture_progress')
            .select('*')
            .eq('user_id', userId);

        if (lectureError) throw lectureError;

        // Calculate aggregates
        const testsTaken = testResults?.length || 0;

        const totalSeconds = lectureProgress?.reduce((acc, lp) => acc + (lp.total_seconds || 0), 0) || 0;
        const lectureHours = Math.round((totalSeconds / 3600) * 10) / 10; // Round to 1 decimal

        const questionsSolved = testResults?.reduce((acc, tr) => acc + (tr.total_questions || 0), 0) || 0;

        // Calculate accuracy from effective scores (penalty-based)
        const totalEffective = testResults?.reduce((acc, tr) => acc + (tr.effective_score || tr.correct_answers || 0), 0) || 0;
        const averageAccuracy = questionsSolved > 0
            ? Math.round((totalEffective / questionsSolved) * 100)
            : 0;

        // Group by subject for progress table
        const subjectMap = new Map<string, {
            tests: typeof testResults,
            lectures: typeof lectureProgress
        }>();

        testResults?.forEach(tr => {
            const sub = tr.subject || 'Unknown';
            if (!subjectMap.has(sub)) {
                subjectMap.set(sub, { tests: [], lectures: [] });
            }
            subjectMap.get(sub)!.tests.push(tr);
        });

        lectureProgress?.forEach(lp => {
            const sub = lp.subject || 'Unknown';
            if (!subjectMap.has(sub)) {
                subjectMap.set(sub, { tests: [], lectures: [] });
            }
            subjectMap.get(sub)!.lectures.push(lp);
        });

        const subjectProgress: SubjectProgress[] = [];
        subjectMap.forEach((data, subject) => {
            const subjectTests = data.tests;
            const totalQ = subjectTests.reduce((a, t) => a + t.total_questions, 0);
            const correctQ = subjectTests.reduce((a, t) => a + t.correct_answers, 0);

            // Find most recent activity
            const allDates = [
                ...subjectTests.map(t => new Date(t.completed_at)),
                ...data.lectures.map(l => new Date(l.last_updated_at))
            ].filter(d => !isNaN(d.getTime()));

            const lastDate = allDates.length > 0
                ? new Date(Math.max(...allDates.map(d => d.getTime())))
                : null;

            // Calculate relative time
            let lastActivity = 'No activity';
            if (lastDate) {
                const diffMs = Date.now() - lastDate.getTime();
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                if (diffDays === 0) lastActivity = 'Today';
                else if (diffDays === 1) lastActivity = 'Yesterday';
                else if (diffDays < 7) lastActivity = `${diffDays} days ago`;
                else lastActivity = `${Math.floor(diffDays / 7)} weeks ago`;
            }

            // Get last topic from most recent test
            const sortedTests = [...subjectTests].sort(
                (a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
            );
            const lastTopic = sortedTests[0]?.test_title?.replace(/^(Full Chapter Test: |PYQs: |Quiz: )/i, '') || 'No tests yet';

            // Rough completion estimate based on tests taken
            const completionPercent = Math.min(100, subjectTests.length * 15);

            subjectProgress.push({
                subject,
                lastTopic,
                completionPercent,
                testScore: totalQ > 0 ? `${correctQ}/${totalQ}` : '0/0',
                lastActivity
            });
        });

        // Generate per-test records sorted by most recent
        const recentTests: RecentTest[] = (testResults || [])
            .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
            .map(tr => {
                const completedDate = new Date(tr.completed_at);
                const diffMs = Date.now() - completedDate.getTime();
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                let lastActivity = 'Today';
                if (diffDays === 1) lastActivity = 'Yesterday';
                else if (diffDays > 1 && diffDays < 7) lastActivity = `${diffDays} days ago`;
                else if (diffDays >= 7) lastActivity = `${Math.floor(diffDays / 7)} weeks ago`;

                return {
                    id: tr.id,
                    testTitle: tr.test_title,
                    subject: tr.subject,
                    totalQuestions: tr.total_questions,
                    effectiveScore: tr.effective_score || tr.correct_answers,
                    scorePercentage: tr.score_percentage,
                    completedAt: tr.completed_at,
                    lastActivity
                };
            });

        return {
            testsTaken,
            lectureHours,
            questionsSolved,
            averageAccuracy,
            subjectProgress,
            recentTests
        };
    } catch (e) {
        console.error("Failed to get performance stats:", e);
        return {
            testsTaken: 0,
            lectureHours: 0,
            questionsSolved: 0,
            averageAccuracy: 0,
            subjectProgress: [],
            recentTests: []
        };
    }
};
