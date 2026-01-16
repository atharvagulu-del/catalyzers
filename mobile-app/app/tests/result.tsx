import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle, XCircle, Home, RotateCcw } from 'lucide-react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useAppColors } from '@/hooks/use-app-colors';

export default function TestResultScreen() {
    const { resultData } = useLocalSearchParams();
    const router = useRouter();
    const colors = useAppColors();
    const result = useMemo(() => resultData ? JSON.parse(resultData as string) : null, [resultData]);

    if (!result) return null;

    // Prepare data for Gifted Charts
    const pieData = [
        { value: result.correctCount, color: '#10B981', gradientCenterColor: '#34D399', focused: true }, // Green
        { value: result.incorrectCount, color: '#EF4444', gradientCenterColor: '#F87171' }, // Red
        { value: result.unattempted, color: '#374151', gradientCenterColor: '#4B5563' } // Gray
    ];

    // Calculate percentage
    const percentage = Math.round((result.score / result.totalMarks) * 100);
    const percentageColor = percentage >= 80 ? '#10B981' : percentage >= 50 ? '#FBBF24' : '#EF4444';

    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, paddingBottom: 50 }}>
            {/* Header */}
            <View style={{ alignItems: 'center', marginTop: 40, marginBottom: 30 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 16, marginBottom: 8 }}>Test Result</Text>
                <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
                    {result.testTitle}
                </Text>
            </View>

            {/* Score Card */}
            <View style={{ backgroundColor: colors.cardBg, borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ color: colors.textSecondary, marginBottom: 24, fontWeight: '600' }}>PERFORMANCE SUMMARY</Text>

                <PieChart
                    data={pieData}
                    donut
                    showGradient
                    sectionAutoFocus
                    radius={90}
                    innerRadius={65}
                    innerCircleColor={colors.cardBg}
                    centerLabelComponent={() => {
                        return (
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 32, color: colors.text, fontWeight: 'bold' }}>
                                    {percentage}%
                                </Text>
                                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Accuracy</Text>
                            </View>
                        );
                    }}
                />

                <View style={{ flexDirection: 'row', gap: 24, marginTop: 32 }}>
                    <View style={{ alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 6 }} />
                            <Text style={{ color: '#D1D5DB', fontWeight: '600' }}>Correct</Text>
                        </View>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{result.correctCount}</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', marginRight: 6 }} />
                            <Text style={{ color: '#D1D5DB', fontWeight: '600' }}>Incorrect</Text>
                        </View>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{result.incorrectCount}</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#374151', marginRight: 6 }} />
                            <Text style={{ color: '#D1D5DB', fontWeight: '600' }}>Skipped</Text>
                        </View>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{result.unattempted}</Text>
                    </View>
                </View>

                <View style={{ marginTop: 24, width: '100%', backgroundColor: colors.iconBg, padding: 16, borderRadius: 12, alignItems: 'center' }}>
                    <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 4, textTransform: 'uppercase' }}>Total Score</Text>
                    <Text style={{ color: colors.text, fontSize: 32, fontWeight: '800' }}>
                        {result.score} <Text style={{ fontSize: 16, color: colors.textTertiary, fontWeight: '400' }}>/ {result.totalMarks}</Text>
                    </Text>
                </View>
            </View>

            {/* Question Breakdown */}
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 16 }}>Question Analysis</Text>

            <View style={{ gap: 12 }}>
                {result.questions.map((q: any, index: number) => {
                    const userAns = result.answers[q.id];
                    const isCorrect = userAns === q.correctAnswer;
                    const isSkipped = userAns === undefined || userAns === null;

                    return (
                        <View key={q.id} style={{ backgroundColor: colors.cardBg, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ color: colors.textSecondary, fontWeight: 'bold' }}>Q{index + 1}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {isSkipped ? (
                                        <Text style={{ color: '#6B7280', fontSize: 12 }}>Skipped</Text>
                                    ) : isCorrect ? (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <CheckCircle size={14} color="#10B981" style={{ marginRight: 4 }} />
                                            <Text style={{ color: '#10B981', fontSize: 12 }}>Correct</Text>
                                        </View>
                                    ) : (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <XCircle size={14} color="#EF4444" style={{ marginRight: 4 }} />
                                            <Text style={{ color: '#EF4444', fontSize: 12 }}>Incorrect</Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            <Text style={{ color: colors.text, marginBottom: 12 }}>{q.text}</Text>

                            <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 12, borderRadius: 8 }}>
                                <Text style={{ color: '#10B981', fontWeight: 'bold', fontSize: 12, marginBottom: 4 }}>SOLUTION</Text>
                                <Text style={{ color: '#D1FAE5', fontSize: 13 }}>{q.explanation}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* Actions */}
            <View style={{ marginTop: 40, gap: 16 }}>
                <TouchableOpacity
                    onPress={() => router.dismissAll()}
                    style={{ backgroundColor: '#374151', padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Home size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={{ color: 'white', fontWeight: '600' }}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
