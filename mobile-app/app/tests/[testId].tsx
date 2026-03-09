import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft, TrendingUp, Share2, Image as ImageIcon, PlayCircle, BarChart3, Award, BookOpen, Target, ChevronRight, HelpCircle } from 'lucide-react-native';
import { useAppColors } from '@/hooks/use-app-colors';
import { useAuth } from '@/context/AuthProvider';
import { getTestWithFullDetails, OfflineTest, TestResult } from '@/lib/offlineTests';
import Svg, { Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { TestPaperViewer } from '@/components/TestPaperViewer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

// Recommendation type
interface Recommendation {
    chapterTitle: string;
    reason: string;
    resources: {
        title: string;
        type: 'video' | 'quiz' | 'pyq';
        id: string;
    }[];
}

export default function TestResultScreen() {
    const colors = useAppColors();
    const router = useRouter();
    const { user } = useAuth();
    const { testId } = useLocalSearchParams<{ testId: string }>();

    const [test, setTest] = useState<OfflineTest | null>(null);
    const [myResult, setMyResult] = useState<TestResult | null>(null);
    const [classAverage, setClassAverage] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const [myPercentile, setMyPercentile] = useState<number | null>(null);
    const [myRank, setMyRank] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewerVisible, setViewerVisible] = useState(false);

    // Recommendations
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);

    useEffect(() => {
        async function loadTest() {
            if (!user?.id || !testId) return;
            try {
                const data = await getTestWithFullDetails(testId, user.id);
                if (data) {
                    setTest(data.test);
                    setMyResult(data.myResult);
                    setClassAverage(data.classAverage);
                    setTotalStudents(data.totalStudents);
                    setMyPercentile(data.myPercentile);
                    setMyRank(data.myRank);
                }
            } catch (err) {
                console.error('Failed to load test', err);
            } finally {
                setLoading(false);
            }
        }
        loadTest();
    }, [user, testId]);

    // Fetch recommendations
    useEffect(() => {
        async function fetchRecommendations() {
            if (!test || !myResult || !GROQ_API_KEY) return;

            setLoadingRecommendations(true);
            try {
                // Call Groq directly from mobile for recommendations
                const percentage = Math.round(((myResult.marks_obtained || 0) / test.max_marks) * 100);
                let performanceLevel = 'average';
                if (percentage >= 80) performanceLevel = 'excellent';
                else if (percentage >= 60) performanceLevel = 'good';
                else if (percentage < 40) performanceLevel = 'needs improvement';

                const prompt = `You are an educational AI assistant. A JEE/NEET student just took a test in ${test.subject} and scored ${myResult.marks_obtained}/${test.max_marks} (${percentage}%).
Performance Level: ${performanceLevel}

Based on this performance, recommend 2-3 study topics to help them improve.
${test.chapters && test.chapters.length > 0 ? `Test covered these chapters: ${test.chapters.join(', ')}` : ''}

Return ONLY valid JSON in this exact format:
{
    "recommendations": [
        {
            "chapterTitle": "Topic Name",
            "reason": "Brief encouraging reason why this will help",
            "resources": [
                { "title": "Watch Lecture", "type": "video", "id": "1" },
                { "title": "Practice Quiz", "type": "quiz", "id": "2" }
            ]
        }
    ]
}`;

                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${GROQ_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: 'llama-3.1-8b-instant',
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: 800,
                        temperature: 0.7,
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const responseText = data.choices?.[0]?.message?.content?.trim();
                    const jsonMatch = responseText?.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        const parsed = JSON.parse(jsonMatch[0]);
                        setRecommendations(parsed.recommendations || []);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch recommendations', err);
            } finally {
                setLoadingRecommendations(false);
            }
        }

        if (test && myResult) {
            fetchRecommendations();
        }
    }, [test, myResult]);

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!test) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
                    <Text style={{ fontSize: 16, color: colors.textSecondary, textAlign: 'center' }}>
                        Test not found.
                    </Text>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
                        <Text style={{ fontSize: 14, color: colors.primary, fontWeight: '500' }}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // New "Results Not Available" State
    if (!myResult) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={{ padding: 20 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
                        <ArrowLeft size={24} color={colors.text} />
                    </TouchableOpacity>

                    <View style={{
                        backgroundColor: colors.cardBg,
                        borderRadius: 20,
                        padding: 24,
                        borderWidth: 1,
                        borderColor: colors.border,
                        alignItems: 'center'
                    }}>
                        <View style={{
                            width: 80, height: 80, borderRadius: 40,
                            backgroundColor: '#FEF3C7',
                            alignItems: 'center', justifyContent: 'center',
                            marginBottom: 16
                        }}>
                            <Target size={40} color="#F59E0B" />
                        </View>

                        <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 8 }}>
                            {test.test_name}
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <View style={{ backgroundColor: colors.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
                                <Text style={{ fontSize: 12, color: colors.textSecondary }}>{test.subject}</Text>
                            </View>
                            <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                                {new Date(test.test_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </Text>
                        </View>

                        <View style={{
                            backgroundColor: '#FEF3C7',
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            borderRadius: 10,
                            marginBottom: 8
                        }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#92400E', textAlign: 'center' }}>
                                ⏳ Results Not Available Yet
                            </Text>
                        </View>

                        <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginBottom: 24 }}>
                            Your marks will appear here once entered by your teacher.
                        </Text>

                        {/* Question Paper Button even without results */}
                        {test.test_paper && test.test_paper.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setViewerVisible(true)}
                                style={{
                                    width: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    backgroundColor: colors.primary,
                                    paddingVertical: 14,
                                    borderRadius: 12,
                                }}
                            >
                                <ImageIcon size={18} color="#FFFFFF" />
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>
                                    View Question Paper
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            marginTop: 24,
                            backgroundColor: colors.cardBg, // Changed to secondary style since main action might be paper
                            paddingVertical: 14,
                            borderRadius: 12,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: colors.border
                        }}
                    >
                        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>Go Back</Text>
                    </TouchableOpacity>
                </View>

                {/* Viewer Modal */}
                <TestPaperViewer
                    visible={viewerVisible}
                    images={test.test_paper || []}
                    testName={test.test_name}
                    onClose={() => setViewerVisible(false)}
                />
            </SafeAreaView>
        );
    }

    const score = myResult.marks_obtained || 0;
    const maxMarks = test.max_marks;
    const percentage = Math.round((score / maxMarks) * 100);
    const hasTestPaper = test.test_paper && test.test_paper.length > 0;

    // Performance level
    const getPerformanceLevel = (pct: number) => {
        if (pct >= 90) return { label: 'Excellent', color: '#10B981', bgColor: '#D1FAE5' };
        if (pct >= 75) return { label: 'Very Good', color: '#3B82F6', bgColor: '#DBEAFE' };
        if (pct >= 60) return { label: 'Good', color: '#6366F1', bgColor: '#E0E7FF' };
        if (pct >= 40) return { label: 'Average', color: '#F59E0B', bgColor: '#FEF3C7' };
        return { label: 'Needs Work', color: '#EF4444', bgColor: '#FEE2E2' };
    };

    const performance = getPerformanceLevel(percentage);

    // Circle progress
    const circleSize = 160;
    const strokeWidth = 12;
    const radius = (circleSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - percentage / 100);

    // Subject Breakdown Helper
    const getSubjectBreakdown = (totalMarks: number, maxMarks: number, subject: string) => {
        if (subject !== "Full Test") {
            return [{ name: subject, score: totalMarks, max: maxMarks }];
        }
        const part = Math.floor(totalMarks / 3);
        const remainder = totalMarks % 3;
        const maxPart = Math.floor(maxMarks / 3);
        return [
            { name: "Physics", score: part + (remainder > 0 ? 1 : 0), max: maxPart },
            { name: "Chemistry", score: part + (remainder > 1 ? 1 : 0), max: maxPart },
            { name: "Mathematics", score: part, max: maxPart }
        ];
    };

    const subjectBreakdown = getSubjectBreakdown(score, maxMarks, test.subject);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                backgroundColor: colors.cardBg,
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                        <ArrowLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }} numberOfLines={1}>
                            {test.test_name}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                                {new Date(test.test_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </Text>
                            <View style={{ backgroundColor: colors.bg, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                                <Text style={{ fontSize: 11, color: colors.textSecondary }}>{test.subject}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={{ padding: 8 }}>
                    <Share2 size={20} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
                {/* Score Card - Orange Gradient */}
                <LinearGradient
                    colors={['#F7941D', '#F15A24']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        borderRadius: 24,
                        padding: 24,
                        marginBottom: 16,
                        overflow: 'hidden',
                    }}
                >
                    {/* Background decoration */}
                    <View style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                    <View style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,200,0,0.2)' }} />

                    {/* Score Circle */}
                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                        <View style={{ width: circleSize, height: circleSize, justifyContent: 'center', alignItems: 'center' }}>
                            <Svg width={circleSize} height={circleSize} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
                                <Circle
                                    cx={circleSize / 2}
                                    cy={circleSize / 2}
                                    r={radius}
                                    stroke="rgba(255,255,255,0.2)"
                                    strokeWidth={strokeWidth}
                                    fill="transparent"
                                />
                                <Circle
                                    cx={circleSize / 2}
                                    cy={circleSize / 2}
                                    r={radius}
                                    stroke="#FFFFFF"
                                    strokeWidth={strokeWidth}
                                    fill="transparent"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                />
                            </Svg>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontSize: 40, fontWeight: '700', color: '#FFFFFF' }}>{score}</Text>
                                <View style={{ height: 2, width: 40, backgroundColor: 'rgba(255,255,255,0.4)', marginVertical: 4 }} />
                                <Text style={{ fontSize: 22, color: 'rgba(255,255,255,0.9)' }}>{maxMarks}</Text>
                            </View>
                        </View>
                        <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 12 }}>
                            <Text style={{ fontSize: 13, color: '#FFFFFF', fontWeight: '500' }}>Class Average: {classAverage}</Text>
                        </View>
                    </View>

                    {/* Stats Grid */}
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 16, padding: 14 }}>
                            <Text style={{ fontSize: 11, color: '#FED7AA', fontWeight: '600', marginBottom: 4 }}>RANK</Text>
                            <Text style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF' }}>#{myRank ?? '-'}</Text>
                            <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>of {totalStudents}</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 16, padding: 14 }}>
                            <Text style={{ fontSize: 11, color: '#FED7AA', fontWeight: '600', marginBottom: 4 }}>PERCENTILE</Text>
                            <Text style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF' }}>{myPercentile ?? '-'}%</Text>
                            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4, alignSelf: 'flex-start' }}>
                                <Text style={{ fontSize: 10, color: '#FFFFFF', fontWeight: '600' }}>{performance.label}</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                    {/* View Question Paper */}
                    <TouchableOpacity
                        onPress={() => hasTestPaper && setViewerVisible(true)}
                        disabled={!hasTestPaper}
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            backgroundColor: hasTestPaper ? '#6366F1' : colors.cardBg,
                            paddingVertical: 14,
                            borderRadius: 12,
                            borderWidth: hasTestPaper ? 0 : 1,
                            borderColor: colors.border,
                        }}
                    >
                        <ImageIcon size={18} color={hasTestPaper ? '#FFFFFF' : colors.textSecondary} />
                        <Text style={{ fontSize: 14, fontWeight: '600', color: hasTestPaper ? '#FFFFFF' : colors.textSecondary }}>
                            {hasTestPaper ? 'View Paper' : 'No Paper'}
                        </Text>
                    </TouchableOpacity>

                    {/* View Syllabus */}
                    {test.chapters && test.chapters.length > 0 && (
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                backgroundColor: colors.cardBg,
                                paddingVertical: 14,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: colors.border,
                            }}
                        >
                            <BookOpen size={18} color={colors.primary} />
                            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primary }}>{test.chapters.length} Topics</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Subject Analysis */}
                <View style={{
                    backgroundColor: colors.cardBg,
                    borderRadius: 20,
                    padding: 20,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: colors.border,
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>Subject Analysis</Text>
                            <Text style={{ fontSize: 12, color: colors.textSecondary }}>Your performance</Text>
                        </View>
                        <BarChart3 size={22} color={colors.border} />
                    </View>

                    <View style={{ gap: 12 }}>
                        {subjectBreakdown.map((item, i) => {
                            const subjectPct = Math.round((item.score / item.max) * 100);
                            const subjectColors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
                            const barColor = subjectColors[i % subjectColors.length];

                            return (
                                <View key={i} style={{ backgroundColor: colors.bg, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>{item.name}</Text>
                                        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>{item.score}/{item.max}</Text>
                                    </View>
                                    <View style={{ height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' }}>
                                        <View style={{ height: '100%', width: `${subjectPct}%`, backgroundColor: barColor, borderRadius: 4 }} />
                                    </View>
                                    <View style={{ marginTop: 6 }}>
                                        <Text style={{ fontSize: 12, color: colors.textSecondary }}>{subjectPct}% Score</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Recommendations */}
                <View style={{
                    backgroundColor: '#EEF2FF',
                    borderRadius: 20,
                    padding: 20,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: '#C7D2FE',
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <Award size={22} color="#6366F1" />
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>Recommendations</Text>
                            <Text style={{ fontSize: 12, color: colors.textSecondary }}>Topics to improve your score</Text>
                        </View>
                    </View>

                    {loadingRecommendations ? (
                        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                            <ActivityIndicator size="small" color="#6366F1" />
                            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 8 }}>Analyzing your performance...</Text>
                        </View>
                    ) : recommendations.length > 0 ? (
                        <View style={{ gap: 12 }}>
                            {recommendations.map((rec, i) => (
                                <View key={i} style={{ backgroundColor: colors.cardBg, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>{rec.chapterTitle}</Text>
                                            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{rec.reason}</Text>
                                        </View>
                                        <View style={{ backgroundColor: '#EEF2FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                                            <Text style={{ fontSize: 10, fontWeight: '600', color: '#6366F1' }}>Suggested</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                                        {rec.resources.slice(0, 2).map((resource, j) => (
                                            <TouchableOpacity
                                                key={j}
                                                onPress={() => router.push('/lectures' as any)}
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    backgroundColor: colors.bg,
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 6,
                                                    borderRadius: 6,
                                                }}
                                            >
                                                {resource.type === 'video' && <PlayCircle size={14} color="#3B82F6" />}
                                                {resource.type === 'quiz' && <Target size={14} color="#10B981" />}
                                                {resource.type === 'pyq' && <BookOpen size={14} color="#F59E0B" />}
                                                <Text style={{ fontSize: 12, color: colors.text }}>{resource.title}</Text>
                                                <ChevronRight size={12} color={colors.textSecondary} />
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                            <Award size={32} color={colors.border} />
                            <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 8, textAlign: 'center' }}>Great job! Keep practicing.</Text>
                        </View>
                    )}
                </View>

                {/* Quick Actions */}
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity
                        onPress={() => router.push('/lectures' as any)}
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            backgroundColor: colors.cardBg,
                            paddingVertical: 14,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: colors.border,
                        }}
                    >
                        <PlayCircle size={18} color={colors.text} />
                        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>Lectures</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/tests' as any)}
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            backgroundColor: colors.primary,
                            paddingVertical: 14,
                            borderRadius: 12,
                        }}
                    >
                        <BarChart3 size={18} color="#FFFFFF" />
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#FFFFFF' }}>All Tests</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Test Paper Viewer Modal */}
            <TestPaperViewer
                visible={viewerVisible}
                images={test.test_paper || []}
                testName={test.test_name}
                onClose={() => setViewerVisible(false)}
            />
        </SafeAreaView>
    );
}
