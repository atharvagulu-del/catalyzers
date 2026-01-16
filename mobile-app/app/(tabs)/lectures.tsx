import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Atom, FlaskConical, Calculator, Dna, PlayCircle } from 'lucide-react-native';
import { useAuth } from '@/context/AuthProvider';
import { Skeleton } from '@/components/Skeleton';
import { useAppColors } from '@/hooks/use-app-colors';

const subjects = [
    { id: 'maths', title: 'Mathematics', icon: Calculator, slug: 'mathematics', color: '#3B82F6', gradient: ['#3B82F6', '#2563EB'] },
    { id: 'physics', title: 'Physics', icon: Atom, slug: 'physics', color: '#8B5CF6', gradient: ['#8B5CF6', '#7C3AED'] },
    { id: 'chemistry', title: 'Chemistry', icon: FlaskConical, slug: 'chemistry', color: '#10B981', gradient: ['#10B981', '#059669'] },
    { id: 'biology', title: 'Biology', icon: Dna, slug: 'biology', color: '#F59E0B', gradient: ['#F59E0B', '#D97706'] }
];

export default function LecturesScreen() {
    const router = useRouter();
    const colors = useAppColors();
    const exam = 'jee';
    const grade = '11';
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            const timer = setTimeout(() => setIsLoading(false), 500);
            return () => clearTimeout(timer);
        }, [])
    );

    const filteredSubjects = subjects.filter(sub => {
        if (exam === 'jee' && sub.id === 'biology') return false;
        if (exam === 'neet' && sub.id === 'maths') return false;
        return true;
    });

    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
            <View style={{ marginTop: 40, marginBottom: 30 }}>
                <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 8 }}>Lectures</Text>
                <Text style={{ fontSize: 16, color: colors.textSecondary }}>Class {grade} {exam.toUpperCase()} Syllabus</Text>
            </View>

            <View style={{ gap: 16 }}>
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <View key={i} style={{ height: 100, borderRadius: 16, overflow: 'hidden' }}>
                            <Skeleton height="100%" />
                        </View>
                    ))
                ) : (
                    filteredSubjects.map((subject, index) => {
                        const Icon = subject.icon;
                        return (
                            <MotiView key={subject.id} from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 400, delay: index * 100 }}>
                                <TouchableOpacity activeOpacity={0.9} onPress={() => router.push(`/lectures/${exam}-${subject.slug}-${grade}`)} style={{ height: 100, borderRadius: 16, overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: colors.border }}>
                                    <LinearGradient colors={[colors.cardBg, colors.bg]} style={{ flex: 1, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                                            <View style={{ width: 50, height: 50, borderRadius: 12, backgroundColor: `${subject.color}20`, alignItems: 'center', justifyContent: 'center' }}>
                                                <Icon size={28} color={subject.color} />
                                            </View>
                                            <View>
                                                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>{subject.title}</Text>
                                                <Text style={{ fontSize: 13, color: colors.textTertiary }}>Browse Chapters</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center' }}>
                                            <PlayCircle size={16} color={colors.textSecondary} />
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </MotiView>
                        );
                    })
                )}
            </View>
        </ScrollView>
    );
}
