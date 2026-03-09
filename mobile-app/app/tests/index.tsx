import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Calendar, Clock, TrendingUp, CheckCircle, Timer, Filter, Target, ChevronLeft, BookOpen, Award, PlayCircle, AlertCircle } from 'lucide-react-native';
import { useAppColors } from '@/hooks/use-app-colors';
import { useAuth } from '@/context/AuthProvider';
import { getMyEnrollment, getMyTestsWithResults, TestWithResults, getTestStatus, Enrollment } from '@/lib/offlineTests';
import TestCard from '@/components/TestCard';
import { supabase } from '@/lib/supabase';

export default function TestsListScreen() {
    const colors = useAppColors();
    const router = useRouter();
    const { user } = useAuth();

    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [tests, setTests] = useState<TestWithResults[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Filters
    const [subjectFilter, setSubjectFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const subjectOptions = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];

    const fetchData = useCallback(async () => {
        if (!user?.id) return;

        try {
            const [enrollmentData, testsData] = await Promise.all([
                getMyEnrollment(user.id),
                getMyTestsWithResults(user.id),
            ]);

            setEnrollment(enrollmentData);
            setTests(testsData);
        } catch (error) {
            console.error('Error fetching tests:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();

        // Refresh every 30 seconds for real-time feel
        const interval = setInterval(fetchData, 30000);

        // Real-time subscription for test results
        const channel = supabase
            .channel('test-results-updates')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'test_results',
                filter: `student_id=eq.${user?.id}`
            }, () => {
                fetchData();
            })
            .subscribe();

        return () => {
            clearInterval(interval);
            supabase.removeChannel(channel);
        };
    }, [fetchData, user?.id]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, [fetchData]);

    // Filter tests
    const filteredTests = useMemo(() => {
        return tests.filter(t => {
            if (subjectFilter !== 'all' && t.subject.toLowerCase() !== subjectFilter.toLowerCase()) {
                return false;
            }
            if (statusFilter !== 'all') {
                const status = getTestStatus(t);
                if (statusFilter !== status) return false;
            }
            return true;
        });
    }, [tests, subjectFilter, statusFilter]);

    // Group tests by status
    const liveTests = filteredTests.filter(t => getTestStatus(t) === 'live');
    const resultsOutTests = filteredTests.filter(t => getTestStatus(t) === 'results_out');
    const endedTests = filteredTests.filter(t => getTestStatus(t) === 'ended');
    const upcomingTests = filteredTests.filter(t => getTestStatus(t) === 'upcoming');

    // Stats
    const allResultsOut = tests.filter(t => getTestStatus(t) === 'results_out');
    const avgPercentile = allResultsOut.length > 0
        ? Math.round(allResultsOut.reduce((sum, t) => sum + (t.my_percentile || 0), 0) / allResultsOut.length)
        : null;

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    // Not enrolled
    if (!enrollment || enrollment.enrollment_status !== 'ENROLLED') {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
                    <View style={{ width: 64, height: 64, backgroundColor: colors.cardBg, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                        <BookOpen size={32} color={colors.primary} />
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 8, textAlign: 'center' }}>
                        Unlock Offline Tests
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 24, lineHeight: 20 }}>
                        Join our offline classroom program to access exclusive tests and personalized feedback.
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/courses' as any)}
                        style={{
                            backgroundColor: colors.primary,
                            paddingHorizontal: 24,
                            paddingVertical: 14,
                            borderRadius: 12,
                        }}
                    >
                        <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 15 }}>Explore Courses</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <ChevronLeft size={28} color={colors.text} />
                    </TouchableOpacity>
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>My Tests</Text>
                        <Text style={{ fontSize: 13, color: colors.textSecondary }}>View schedule & results</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' }} />
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#047857' }}>Enrolled</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{ padding: 16 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Subject Filter */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity
                            onPress={() => setSubjectFilter('all')}
                            style={{
                                paddingHorizontal: 14,
                                paddingVertical: 8,
                                borderRadius: 8,
                                backgroundColor: subjectFilter === 'all' ? colors.primary : colors.cardBg,
                                borderWidth: 1,
                                borderColor: subjectFilter === 'all' ? colors.primary : colors.border,
                            }}
                        >
                            <Text style={{ fontSize: 13, fontWeight: '600', color: subjectFilter === 'all' ? '#FFFFFF' : colors.text }}>All</Text>
                        </TouchableOpacity>
                        {subjectOptions.map(subject => (
                            <TouchableOpacity
                                key={subject}
                                onPress={() => setSubjectFilter(subject)}
                                style={{
                                    paddingHorizontal: 14,
                                    paddingVertical: 8,
                                    borderRadius: 8,
                                    backgroundColor: subjectFilter === subject ? colors.primary : colors.cardBg,
                                    borderWidth: 1,
                                    borderColor: subjectFilter === subject ? colors.primary : colors.border,
                                }}
                            >
                                <Text style={{ fontSize: 13, fontWeight: '600', color: subjectFilter === subject ? '#FFFFFF' : colors.text }}>{subject}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                {/* Status Filter */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        {[
                            { key: 'all', label: 'All' },
                            { key: 'results_out', label: 'Results Out' },
                            { key: 'ended', label: 'Awaiting' },
                            { key: 'upcoming', label: 'Upcoming' },
                        ].map(item => (
                            <TouchableOpacity
                                key={item.key}
                                onPress={() => setStatusFilter(item.key)}
                                style={{
                                    paddingHorizontal: 14,
                                    paddingVertical: 8,
                                    borderRadius: 8,
                                    backgroundColor: statusFilter === item.key ? '#6366F1' : colors.cardBg,
                                    borderWidth: 1,
                                    borderColor: statusFilter === item.key ? '#6366F1' : colors.border,
                                }}
                            >
                                <Text style={{ fontSize: 13, fontWeight: '600', color: statusFilter === item.key ? '#FFFFFF' : colors.text }}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                {/* Stats Overview */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
                    <View style={{ flex: 1, backgroundColor: colors.cardBg, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center' }}>
                                <Calendar size={18} color="#3B82F6" />
                            </View>
                            <View>
                                <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>{upcomingTests.length}</Text>
                                <Text style={{ fontSize: 11, color: colors.textSecondary }}>Upcoming</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, backgroundColor: colors.cardBg, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center' }}>
                                <CheckCircle size={18} color="#10B981" />
                            </View>
                            <View>
                                <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>{allResultsOut.length}</Text>
                                <Text style={{ fontSize: 11, color: colors.textSecondary }}>Results</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, backgroundColor: colors.cardBg, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#EDE9FE', justifyContent: 'center', alignItems: 'center' }}>
                                <TrendingUp size={18} color="#7C3AED" />
                            </View>
                            <View>
                                <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>{avgPercentile ?? '-'}%</Text>
                                <Text style={{ fontSize: 11, color: colors.textSecondary }}>Avg %ile</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Live Tests */}
                {liveTests.length > 0 && (
                    <View style={{ marginBottom: 24 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <PlayCircle size={20} color="#EF4444" />
                            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>Live Now</Text>
                            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' }} />
                        </View>
                        {liveTests.map(test => (
                            <TestCard
                                key={test.id}
                                test={test}
                                onPress={() => router.push(`/tests/test-result/${test.id}` as any)}
                            />
                        ))}
                    </View>
                )}

                {/* Results Out */}
                {resultsOutTests.length > 0 && (
                    <View style={{ marginBottom: 24 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <Award size={20} color="#10B981" />
                            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>Results Out</Text>
                        </View>
                        {resultsOutTests.map(test => (
                            <TestCard
                                key={test.id}
                                test={test}
                                onPress={() => router.push(`/tests/test-result/${test.id}` as any)}
                            />
                        ))}
                    </View>
                )}

                {/* Awaiting Results */}
                {endedTests.length > 0 && (
                    <View style={{ marginBottom: 24 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <AlertCircle size={20} color="#F59E0B" />
                            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>Awaiting Results</Text>
                        </View>
                        {endedTests.map(test => (
                            <TestCard
                                key={test.id}
                                test={test}
                                onPress={() => router.push(`/tests/test-result/${test.id}` as any)}
                            />
                        ))}
                    </View>
                )}

                {/* Upcoming */}
                {upcomingTests.length > 0 && (
                    <View style={{ marginBottom: 24 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <Clock size={20} color="#3B82F6" />
                            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>Upcoming Tests</Text>
                        </View>
                        {upcomingTests.map(test => (
                            <TestCard
                                key={test.id}
                                test={test}
                                onPress={() => router.push(`/tests/test-result/${test.id}` as any)}
                            />
                        ))}
                    </View>
                )}

                {/* Empty State */}
                {filteredTests.length === 0 && (
                    <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                        <Calendar size={48} color={colors.border} />
                        <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: 12 }}>No tests found</Text>
                        <TouchableOpacity onPress={() => { setSubjectFilter('all'); setStatusFilter('all'); }}>
                            <Text style={{ fontSize: 14, color: colors.primary, marginTop: 8, fontWeight: '500' }}>Clear Filters</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
