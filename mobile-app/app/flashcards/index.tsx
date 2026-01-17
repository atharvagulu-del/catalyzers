import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppColors } from '@/hooks/use-app-colors';
import { ChevronLeft, CheckCircle2, FlaskConical, Atom, Calculator, Search, Loader2 } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { getSubjectsAndTopics, JEE_CHAPTERS } from '@/lib/flashcards';

const SUBJECT_CONFIG = {
    'Physics': { icon: Atom, color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' }, // Blue
    'Chemistry': { icon: FlaskConical, color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' }, // Emerald
    'Maths': { icon: Calculator, color: '#A855F7', bg: '#FAF5FF', border: '#E9D5FF' }, // Purple
};

export default function FlashcardsHomeScreen() {
    const router = useRouter();
    const colors = useAppColors();
    const [selectedSubject, setSelectedSubject] = useState<string>('Physics');
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [cardCount, setCardCount] = useState<number>(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [isStarting, setIsStarting] = useState(false);

    const [chapters, setChapters] = useState<string[]>([]);

    useEffect(() => {
        setChapters(JEE_CHAPTERS[selectedSubject] || []);
        setSelectedTopic(null); // Reset topic when subject changes
    }, [selectedSubject]);

    const filteredChapters = chapters.filter(c =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStart = () => {
        if (!selectedTopic) return;
        setIsStarting(true);
        // Simulate generation delay for effect if needed, or just nav
        setTimeout(() => {
            router.push({
                pathname: '/flashcards/session',
                params: { subject: selectedSubject, topic: selectedTopic, count: cardCount }
            });
            setIsStarting(false);
        }, 500);
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
            <StatusBar barStyle={colors.statusBarStyle} />

            {/* Header */}
            <View style={{
                paddingTop: 60,
                paddingBottom: 20,
                paddingHorizontal: 20,
                backgroundColor: colors.cardBg,
                borderBottomWidth: 1,
                borderBottomColor: colors.border
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16, padding: 4 }}>
                        <ChevronLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <View>
                        <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text }}>Flash Cards</Text>
                        <Text style={{ fontSize: 13, color: colors.textSecondary }}>Select a chapter to start revision</Text>
                    </View>
                </View>
            </View>

            <View style={{ flex: 1 }}>
                {/* Subject Selection */}
                <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        {Object.keys(SUBJECT_CONFIG).map((subject, index) => {
                            const config = SUBJECT_CONFIG[subject as keyof typeof SUBJECT_CONFIG];
                            const isSelected = selectedSubject === subject;
                            const Icon = config.icon;

                            return (
                                <TouchableOpacity
                                    key={subject}
                                    onPress={() => setSelectedSubject(subject)}
                                    activeOpacity={0.7}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 16,
                                        paddingHorizontal: 8,
                                        borderRadius: 16,
                                        alignItems: 'center',
                                        backgroundColor: isSelected ? config.bg : colors.cardBg,
                                        borderWidth: 2,
                                        borderColor: isSelected ? config.border : colors.border,
                                        elevation: isSelected ? 0 : 2,
                                        shadowColor: '#000',
                                        shadowOpacity: isSelected ? 0 : 0.05,
                                        shadowRadius: 4,
                                        shadowOffset: { width: 0, height: 2 }
                                    }}
                                >
                                    <View style={{
                                        width: 40, height: 40, borderRadius: 10,
                                        backgroundColor: isSelected ? config.color : colors.iconBg,
                                        alignItems: 'center', justifyContent: 'center', marginBottom: 8
                                    }}>
                                        <Icon size={20} color={isSelected ? '#FFF' : colors.textSecondary} />
                                    </View>
                                    <Text style={{
                                        fontSize: 12, fontWeight: '600',
                                        color: isSelected ? colors.text : colors.textSecondary
                                    }}>
                                        {subject}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Card Count Selection */}
                <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBg, padding: 4, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignSelf: 'flex-start' }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginLeft: 12, marginRight: 8 }}>Cards:</Text>
                        {[5, 10].map((count) => (
                            <TouchableOpacity
                                key={count}
                                onPress={() => setCardCount(count)}
                                style={{
                                    paddingVertical: 6,
                                    paddingHorizontal: 16,
                                    borderRadius: 8,
                                    backgroundColor: cardCount === count ? colors.text : 'transparent',
                                }}
                            >
                                <Text style={{
                                    fontSize: 13,
                                    fontWeight: '600',
                                    color: cardCount === count ? (colors.isDark ? '#000' : '#FFF') : colors.text
                                }}>{count}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Chapter List */}
                <View style={{ flex: 1, marginTop: 16, paddingHorizontal: 20, paddingBottom: 100 }}>
                    <View style={{
                        flexDirection: 'row', alignItems: 'center',
                        backgroundColor: colors.cardBg, padding: 12, borderRadius: 12,
                        borderWidth: 1, borderColor: colors.border, marginBottom: 16
                    }}>
                        <Search size={18} color={colors.textTertiary} style={{ marginRight: 8 }} />
                        <TextInput
                            placeholder={`Search ${selectedSubject} chapters...`}
                            placeholderTextColor={colors.textTertiary}
                            style={{ flex: 1, fontSize: 14, color: colors.text }}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: 12 }}>
                        {filteredChapters.length} Chapters Found
                    </Text>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                        {filteredChapters.map((topic, index) => {
                            const isSelected = selectedTopic === topic;
                            return (
                                <Animated.View key={topic} entering={FadeInDown.delay(index * 30).springify()}>
                                    <TouchableOpacity
                                        onPress={() => setSelectedTopic(isSelected ? null : topic)}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            padding: 16,
                                            marginBottom: 10,
                                            backgroundColor: isSelected ? '#EFF6FF' : colors.cardBg,
                                            borderRadius: 14,
                                            borderWidth: 1,
                                            borderColor: isSelected ? '#3B82F6' : colors.border
                                        }}
                                    >
                                        <Text style={{
                                            width: 24, fontSize: 12, fontWeight: '700',
                                            color: colors.textTertiary, marginRight: 12
                                        }}>
                                            {(index + 1).toString().padStart(2, '0')}
                                        </Text>
                                        <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: colors.text }}>
                                            {topic}
                                        </Text>
                                        <View style={{
                                            width: 20, height: 20, borderRadius: 10,
                                            borderWidth: 2, borderColor: isSelected ? '#3B82F6' : colors.textTertiary,
                                            alignItems: 'center', justifyContent: 'center',
                                            backgroundColor: isSelected ? '#3B82F6' : 'transparent'
                                        }}>
                                            {isSelected && <CheckCircle2 size={12} color="#FFF" />}
                                        </View>
                                    </TouchableOpacity>
                                </Animated.View>
                            );
                        })}
                    </ScrollView>
                </View>
            </View>

            {/* Start Button */}
            <View style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: 20, backgroundColor: colors.cardBg, borderTopWidth: 1, borderTopColor: colors.border
            }}>
                <TouchableOpacity
                    onPress={handleStart}
                    disabled={!selectedTopic || isStarting}
                    style={{
                        backgroundColor: !selectedTopic || isStarting ? colors.border : '#3B82F6',
                        paddingVertical: 16,
                        borderRadius: 16,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        shadowColor: !selectedTopic ? 'transparent' : '#3B82F6',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: !selectedTopic ? 0 : 0.3,
                        shadowRadius: 10,
                        elevation: !selectedTopic ? 0 : 4
                    }}
                >
                    {isStarting ? (
                        <ActivityIndicator color="#FFF" style={{ marginRight: 8 }} />
                    ) : null}
                    <Text style={{ fontSize: 16, fontWeight: '700', color: !selectedTopic ? colors.textTertiary : '#FFF' }}>
                        {isStarting ? 'Generating...' : 'Start Revision'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
