import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ChevronLeft, Calculator, Atom, FlaskConical, BookOpen, ChevronRight, FileText } from 'lucide-react-native';
import { Skeleton } from '@/components/Skeleton';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { revisionData } from '@/lib/revisionData';
import { useAppColors } from '@/hooks/use-app-colors';

// Map subject IDs to icons and colors for mobile
const subjectMeta: Record<string, { icon: any, color: string }> = {
    'Maths': { icon: Calculator, color: '#3B82F6' },
    'Physics': { icon: Atom, color: '#8B5CF6' },
    'Chemistry': { icon: FlaskConical, color: '#10B981' },
};

export default function RevisionFormulaScreen() {
    const router = useRouter();
    const colors = useAppColors();
    const [isLoading, setIsLoading] = useState(true);
    const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            const timer = setTimeout(() => setIsLoading(false), 500);
            return () => clearTimeout(timer);
        }, [])
    );

    const toggleSubject = (id: string) => {
        setExpandedSubject(prev => (prev === id ? null : id));
    };

    const handleOpenTopic = (chapter: any) => {
        // Updated to use Native View if content exists
        // Fallback to "Coming Soon" if no content is manually added yet
        router.push({
            pathname: '/revision-formula/view',
            params: {
                title: chapter.title,
                content: chapter.content || `# ${chapter.title}\n\n*Content coming soon...*`
            }
        });
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.bg, padding: 20 }}>
                <View style={{ paddingTop: 50, marginBottom: 20 }}>
                    <Skeleton width={40} height={40} borderRadius={20} />
                </View>
                <View style={{ gap: 8, marginBottom: 30 }}>
                    <Skeleton width={180} height={32} borderRadius={4} />
                    <Skeleton width={250} height={16} borderRadius={4} />
                </View>
                <View style={{ gap: 16 }}>
                    {[1, 2, 3].map(i => <Skeleton key={i} width="100%" height={80} borderRadius={16} />)}
                </View>
            </View>
        );
    }

    return (
        <Animated.View entering={FadeIn} style={{ flex: 1, backgroundColor: colors.bg }}>
            {/* Header */}
            <View style={{ paddingTop: 50, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ backgroundColor: colors.iconBg, padding: 10, borderRadius: 20, marginRight: 16 }}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>Revision Formula</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 20 }}>
                        Quick-access formulas for JEE revision. Tap any topic to view.
                    </Text>
                </View>

                {/* Subject Accordions */}
                <View style={{ gap: 16 }}>
                    {revisionData.map((subject, sIndex) => {
                        const meta = subjectMeta[subject.id] || { icon: BookOpen, color: '#6B7280' };
                        const Icon = meta.icon;
                        const isExpanded = expandedSubject === subject.id;

                        return (
                            <Animated.View key={subject.id} entering={FadeInDown.delay(sIndex * 100)}>
                                {/* Subject Header */}
                                <TouchableOpacity
                                    onPress={() => toggleSubject(subject.id)}
                                    activeOpacity={0.8}
                                    style={{
                                        backgroundColor: colors.cardBg,
                                        borderRadius: 16,
                                        padding: 16,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        borderColor: isExpanded ? meta.color : colors.border,
                                        borderBottomLeftRadius: isExpanded ? 0 : 16,
                                        borderBottomRightRadius: isExpanded ? 0 : 16,
                                    }}
                                >
                                    <View style={{
                                        width: 48, height: 48, borderRadius: 12,
                                        backgroundColor: `${meta.color}20`,
                                        alignItems: 'center', justifyContent: 'center',
                                        marginRight: 16
                                    }}>
                                        <Icon size={24} color={meta.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text }}>{subject.title}</Text>
                                        <Text style={{ fontSize: 12, color: colors.textTertiary, marginTop: 2 }}>{subject.chapters.length} Topics</Text>
                                    </View>
                                    <ChevronRight size={20} color={colors.textTertiary} style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }} />
                                </TouchableOpacity>

                                {/* Chapter List (Expanded) */}
                                {isExpanded && (
                                    <View style={{
                                        backgroundColor: colors.cardBgSecondary,
                                        borderBottomLeftRadius: 16,
                                        borderBottomRightRadius: 16,
                                        borderWidth: 1,
                                        borderTopWidth: 0,
                                        borderColor: meta.color,
                                        paddingVertical: 8
                                    }}>
                                        {subject.chapters.map((chapter, cIndex) => (
                                            <TouchableOpacity
                                                key={chapter.id}
                                                onPress={() => handleOpenTopic(chapter)}
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    paddingVertical: 14,
                                                    paddingHorizontal: 16,
                                                    borderBottomWidth: cIndex < subject.chapters.length - 1 ? 1 : 0,
                                                    borderBottomColor: colors.border
                                                }}
                                            >
                                                <FileText size={16} color={meta.color} style={{ marginRight: 12 }} />
                                                <Text style={{ flex: 1, color: colors.text, fontSize: 14 }}>{chapter.title}</Text>
                                                <ChevronRight size={16} color={colors.textTertiary} />
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </Animated.View>
                        );
                    })}
                </View>

            </ScrollView>
        </Animated.View>
    );
}
