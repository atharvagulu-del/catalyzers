import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Info, HelpCircle } from 'lucide-react-native';
import { Skeleton } from '@/components/Skeleton'; // Import reusable skeleton
import { useAppColors } from '@/hooks/use-app-colors';

export default function TestInstructionScreen() {
    const { testId, resourceEncoded } = useLocalSearchParams();
    const router = useRouter();
    const colors = useAppColors();
    const [testData, setTestData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading for Skeleton feel
        const timer = setTimeout(() => {
            if (resourceEncoded) {
                setTestData(JSON.parse(resourceEncoded as string));
            }
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [resourceEncoded]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.bg, padding: 20 }}>
                <View style={{ marginTop: 60, marginBottom: 20 }}>
                    <Skeleton height={28} width={40} borderRadius={8} />
                </View>
                <View style={{ marginBottom: 20 }}>
                    <Skeleton height={60} width={60} borderRadius={16} />
                </View>
                <View style={{ marginBottom: 16 }}>
                    <Skeleton height={32} width={200} borderRadius={8} />
                </View>
                <View style={{ marginBottom: 32 }}>
                    <Skeleton height={60} width="100%" borderRadius={8} />
                </View>
                <View style={{ marginBottom: 40 }}>
                    <Skeleton height={200} width="100%" borderRadius={16} />
                </View>
            </View>
        );
    }

    if (!testData) return null;

    const handleStart = () => {
        router.push({
            pathname: '/tests/active',
            params: { testData: JSON.stringify(testData) }
        });
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
            <View style={{ padding: 20, paddingTop: 60 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
                    <ChevronLeft color={colors.text} size={28} />
                </TouchableOpacity>

                <View style={{
                    width: 60, height: 60, borderRadius: 16,
                    backgroundColor: '#1E3A8A', alignItems: 'center', justifyContent: 'center', marginBottom: 20
                }}>
                    <HelpCircle size={32} color="#60A5FA" />
                </View>

                <Text style={{ color: colors.text, fontSize: 28, fontWeight: 'bold', marginBottom: 12 }}>
                    {testData.title}
                </Text>

                <Text style={{ color: colors.textSecondary, fontSize: 16, lineHeight: 24, marginBottom: 32 }}>
                    This test contains {testData.questionCount} questions designed to test your understanding of {testData.chapterName}.
                </Text>

                <View style={{ backgroundColor: colors.cardBg, borderRadius: 16, padding: 20, gap: 16 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: colors.textSecondary }}>Questions</Text>
                        <Text style={{ color: colors.text, fontWeight: 'bold' }}>{testData.questionCount}</Text>
                    </View>
                    <View style={{ height: 1, backgroundColor: '#1F2937' }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#9CA3AF' }}>Time Limit (Est.)</Text>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{testData.questionCount * 2} Mins</Text>
                    </View>
                    <View style={{ height: 1, backgroundColor: '#1F2937' }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#9CA3AF' }}>Total Marks</Text>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{testData.questionCount * 4}</Text>
                    </View>
                </View>
            </View>

            <View style={{ flex: 1 }} />

            <View style={{ padding: 20 }}>
                <TouchableOpacity
                    onPress={handleStart}
                    style={{
                        backgroundColor: '#2563EB',
                        height: 56,
                        borderRadius: 28,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Start Test</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
