import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Calendar, Clock, TrendingUp, CheckCircle, Timer, BookOpen, Award, PlayCircle, AlertCircle, X } from 'lucide-react-native';
import { useAppColors } from '@/hooks/use-app-colors';
import { useAuth } from '@/context/AuthProvider';
import { getMyEnrollment, getMyTestsWithResults, TestWithResults, getTestStatus, Enrollment } from '@/lib/offlineTests';
import TestCard from '@/components/TestCard';
import { supabase } from '@/lib/supabase';

// Simple Syllabus Modal
function SyllabusModal({ visible, onClose, testName, chapters }: { visible: boolean; onClose: () => void; testName: string; chapters: string[] }) {
    const colors = useAppColors();

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                <View style={{ backgroundColor: colors.cardBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '70%' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>Syllabus</Text>
                            <Text style={{ fontSize: 13, color: colors.textSecondary }} numberOfLines={1}>{testName}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
                            <X size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {chapters.length > 0 ? chapters.map((chapter, i) => (
                            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary + '20', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.primary }}>{i + 1}</Text>
                                </View>
                                <Text style={{ flex: 1, fontSize: 14, color: colors.text }}>{chapter}</Text>
                            </View>
                        )) : (
                            <Text style={{ color: colors.textSecondary, textAlign: 'center', paddingVertical: 20 }}>No syllabus available</Text>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

export default function TestsTabScreen() {
    const colors = useAppColors();
    const router = useRouter();
    const { user } = useAuth();

    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [tests, setTests] = useState<TestWithResults[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Subject filter only
    const [subjectFilter, setSubjectFilter] = useState<string>('all');
    const subjectOptions = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];

    // Syllabus modal
    const [syllabusModal, setSyllabusModal] = useState<{ visible: boolean; testName: string; chapters: string[] }>({ visible: false, testName: '', chapters: [] });

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

        // Refresh every 30 seconds
        const interval = setInterval(fetchData, 30000);

        // Real-time subscription for results AND new tests
        const resultsChannel = supabase
            .channel('test-results-tab')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'test_results', filter: `student_id=eq.${user?.id}` }, fetchData)
            .subscribe();

        const testsChannel = supabase
            .channel('test-assignments-tab')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'test_students', filter: `student_id=eq.${user?.id}` }, fetchData)
            .subscribe();

        return () => {
            clearInterval(interval);
            supabase.removeChannel(resultsChannel);
            supabase.removeChannel(testsChannel);
        };
    }, [fetchData, user?.id]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, [fetchData]);

    // Filter by subject only
    const filteredTests = useMemo(() => {
        return tests.filter(t => {
            if (subjectFilter !== 'all' && t.subject.toLowerCase() !== subjectFilter.toLowerCase()) return false;
            return true;
        });
    }, [tests, subjectFilter]);

    // Group by status - ORDER: Upcoming, Awaiting, Results Out
    const liveTests = filteredTests.filter(t => getTestStatus(t) === 'live');
    const upcomingTests = filteredTests.filter(t => getTestStatus(t) === 'upcoming');
    const endedTests = filteredTests.filter(t => getTestStatus(t) === 'ended');
    const resultsOutTests = filteredTests.filter(t => getTestStatus(t) === 'results_out');

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
                        style={{ backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 }}
                    >
                        <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 15 }}>Explore Courses</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <View>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text }}>My Tests</Text>
                    <Text style={{ fontSize: 13, color: colors.textSecondary }}>View schedule & results</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' }} />
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#047857' }}>Enrolled</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{ padding: 16 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Subject Filter Only */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity
                            onPress={() => setSubjectFilter('all')}
                            style={{
                                paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
                                backgroundColor: subjectFilter === 'all' ? colors.primary : colors.cardBg,
                                borderWidth: 1, borderColor: subjectFilter === 'all' ? colors.primary : colors.border,
                            }}
                        >
                            <Text style={{ fontSize: 13, fontWeight: '600', color: subjectFilter === 'all' ? '#FFF' : colors.text }}>All</Text>
                        </TouchableOpacity>
                        {subjectOptions.map(subject => (
                            <TouchableOpacity
                                key={subject}
                                onPress={() => setSubjectFilter(subject)}
                                style={{
                                    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
                                    backgroundColor: subjectFilter === subject ? colors.primary : colors.cardBg,
                                    borderWidth: 1, borderColor: subjectFilter === subject ? colors.primary : colors.border,
                                }}
                            >
                                <Text style={{ fontSize: 13, fontWeight: '600', color: subjectFilter === subject ? '#FFF' : colors.text }}>{subject}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                {/* Test Sections - ORDER: Live, Upcoming, Awaiting, Results */}
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
                                onViewSyllabus={() => setSyllabusModal({ visible: true, testName: test.test_name, chapters: test.chapters || [] })}
                            />
                        ))}
                    </View>
                )}

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
                                onViewSyllabus={() => setSyllabusModal({ visible: true, testName: test.test_name, chapters: test.chapters || [] })}
                            />
                        ))}
                    </View>
                )}

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
                                onViewSyllabus={() => setSyllabusModal({ visible: true, testName: test.test_name, chapters: test.chapters || [] })}
                            />
                        ))}
                    </View>
                )}

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
                                onViewSyllabus={() => setSyllabusModal({ visible: true, testName: test.test_name, chapters: test.chapters || [] })}
                                onViewResult={() => router.push(`/tests/test-result/${test.id}` as any)}
                            />
                        ))}
                    </View>
                )}

                {/* Empty */}
                {filteredTests.length === 0 && (
                    <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                        <Calendar size={48} color={colors.border} />
                        <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: 12 }}>No tests found</Text>
                        {subjectFilter !== 'all' && (
                            <TouchableOpacity onPress={() => setSubjectFilter('all')}>
                                <Text style={{ fontSize: 14, color: colors.primary, marginTop: 8, fontWeight: '500' }}>Clear Filter</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Syllabus Modal */}
            <SyllabusModal
                visible={syllabusModal.visible}
                onClose={() => setSyllabusModal({ visible: false, testName: '', chapters: [] })}
                testName={syllabusModal.testName}
                chapters={syllabusModal.chapters}
            />
        </SafeAreaView>
    );
}
