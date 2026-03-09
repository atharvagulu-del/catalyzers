import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Info, HelpCircle } from 'lucide-react-native';
import { useAppColors } from '@/hooks/use-app-colors';

export default function TestInstructionScreen() {
    const { testId, resourceEncoded } = useLocalSearchParams();
    const router = useRouter();
    const colors = useAppColors();

    // Parse data immediately - no loading needed since it comes from URL params
    const testData = useMemo(() => {
        if (resourceEncoded) {
            try {
                return JSON.parse(resourceEncoded as string);
            } catch {
                return null;
            }
        }
        return null;
    }, [resourceEncoded]);

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
