import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Search, ChevronRight, PlayCircle, FileText, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react-native';
import { lectureData } from '@/lib/lectureData';
import { Skeleton } from '@/components/Skeleton';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAppColors } from '@/hooks/use-app-colors';

export default function SubjectDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colors = useAppColors();
    const subjectKey = typeof id === 'string' ? id : '';
    const subjectData = lectureData[subjectKey];

    const [searchQuery, setSearchQuery] = useState('');
    const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate network delay for smooth feel
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (!subjectData) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: colors.text }}>Subject Not Found</Text>
            </View>
        );
    }

    const filteredUnits = subjectData.units.filter(unit =>
        unit.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleUnit = (unitId: string) => {
        // Layout animation handles the smooth transition automatically
        setExpandedUnit(expandedUnit === unitId ? null : unitId);
    }

    const handleResourcePress = (unitId: string, chapterId: string, currentRes: any, index: number) => {
        if (currentRes.type === 'video') {
            router.push({
                pathname: '/lectures/player',
                params: {
                    subjectId: subjectKey,
                    unitId,
                    chapterId,
                    resourceId: currentRes.id,
                    resourceIndex: index,
                    videoId: currentRes.url,
                    title: currentRes.title,
                    description: 'Watch this lecture to master the concept.'
                }
            });
        } else if (currentRes.type === 'quiz' || currentRes.type === 'pyq') {
            // Navigate to Test Instructions
            router.push({
                pathname: '/tests/[id]',
                params: {
                    testId: currentRes.id,
                    resourceEncoded: JSON.stringify({
                        ...currentRes,
                        subjectName: subjectData.subject,
                        chapterName: subjectData.units.find(u => u.id === unitId)?.chapters.find(c => c.id === chapterId)?.title || 'Chapter Test'
                    })
                }
            });
        } else {
            console.warn('Resource type not supported');
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
            {/* Header */}
            <View style={{ paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.bg }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <View>
                    <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>{subjectData.subject}</Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Class {subjectData.grade}</Text>
                </View>
            </View>

            {/* Search */}
            <View style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.iconBg, borderRadius: 12, paddingHorizontal: 16, height: 44 }}>
                    <Search size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
                    <TextInput
                        placeholder="Search chapters..."
                        placeholderTextColor={colors.textTertiary}
                        style={{ flex: 1, color: colors.text }}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {isLoading ? (
                <View style={{ padding: 20, gap: 16 }}>
                    {[1, 2, 3].map(i => <Skeleton key={i} width="100%" height={60} borderRadius={12} />)}
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                    {filteredUnits.map((unit, index) => (
                        <Animated.View key={unit.id} entering={FadeInDown.delay(index * 100)}>
                            <View style={{ backgroundColor: colors.cardBg, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border }}>
                                <TouchableOpacity onPress={() => toggleUnit(unit.id)} activeOpacity={0.8}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, flex: 1 }}>{unit.title}</Text>
                                        {expandedUnit === unit.id ? <ChevronUp size={20} color={colors.textSecondary} /> : <ChevronDown size={20} color={colors.textSecondary} />}
                                    </View>
                                </TouchableOpacity>

                                {expandedUnit === unit.id && (
                                    <View style={{ marginTop: 16, gap: 12 }}>
                                        {unit.chapters.map((chapter, cIndex) => (
                                            <View key={chapter.id}>
                                                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 8 }}>{chapter.title}</Text>
                                                {chapter.resources.map((resource, rIndex) => {
                                                    const Icon = resource.type === 'video' ? PlayCircle : resource.type === 'quiz' || resource.type === 'pyq' ? HelpCircle : FileText;
                                                    return (
                                                        <TouchableOpacity
                                                            key={resource.id}
                                                            onPress={() => handleResourcePress(unit.id, chapter.id, resource, rIndex)}
                                                            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.iconBg, padding: 12, borderRadius: 8, marginBottom: 8 }}
                                                        >
                                                            <Icon size={16} color={colors.primary} style={{ marginRight: 12 }} />
                                                            <Text style={{ color: colors.text, flex: 1, fontSize: 13 }}>{resource.title}</Text>
                                                            <ChevronRight size={16} color={colors.textTertiary} />
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        </Animated.View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}
