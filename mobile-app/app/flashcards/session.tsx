import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppColors } from '@/hooks/use-app-colors';
import { X } from 'lucide-react-native';
import { FlashcardDeck, Flashcard, getDeckForTopic, getShuffledCards } from '@/lib/flashcards';
import FlashCardComponent, { FlashCardRef } from '@/components/FlashCard';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function FlashcardSessionScreen() {
    const { subject, topic, count } = useLocalSearchParams<{ subject: string, topic: string, count: string }>();
    const router = useRouter();
    const colors = useAppColors();

    // Stats and Deck
    const [deck, setDeck] = useState<FlashcardDeck | null>(null);
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isComplete, setIsComplete] = useState(false);

    const [knownCount, setKnownCount] = useState(0);
    const [learningCount, setLearningCount] = useState(0);

    // Ref to trigger swipe from buttons
    const activeCardRef = useRef<FlashCardRef>(null);

    useEffect(() => {
        const load = async () => {
            if (subject && topic) {
                // If count is provided, use shuffle with count, otherwise default deck
                let loadedCards: Flashcard[] = [];
                if (count) {
                    loadedCards = getShuffledCards(subject, topic, parseInt(count));
                } else {
                    const result = await getDeckForTopic(subject, topic);
                    if (result) loadedCards = result.cards;
                }
                setCards(loadedCards);
            }
            setIsLoading(false);
        };
        load();
    }, [subject, topic, count]);

    const handleRate = (rating: 'known' | 'learning') => {
        if (rating === 'known') setKnownCount(c => c + 1);
        else setLearningCount(c => c + 1);

        // Small delay to allow swipe animation to finish before unmounting (though key change handles unmount)
        setTimeout(() => {
            if (currentIndex < cards.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setIsComplete(true);
            }
        }, 100);
    };

    // Button Handlers
    const onLearningPress = () => {
        activeCardRef.current?.swipeLeft();
    };

    const onKnownPress = () => {
        activeCardRef.current?.swipeRight();
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (isComplete) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Animated.View entering={ZoomIn} style={{ alignItems: 'center', width: '100%' }}>
                    <Text style={{ fontSize: 64, marginBottom: 20 }}>🎉</Text>
                    <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 8 }}>Session Complete!</Text>
                    <Text style={{ fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginBottom: 40 }}>
                        Great job reviewing {topic}
                    </Text>

                    <View style={{ flexDirection: 'row', gap: 16, marginBottom: 40, width: '100%' }}>
                        <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#ECFDF5', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#10B981' }}>
                            <Text style={{ fontSize: 32, fontWeight: '700', color: '#10B981' }}>{knownCount}</Text>
                            <Text style={{ fontSize: 12, color: '#059669', fontWeight: '600', textTransform: 'uppercase', marginTop: 4 }}>Known</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#FFFBEB', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#F59E0B' }}>
                            <Text style={{ fontSize: 32, fontWeight: '700', color: '#F59E0B' }}>{learningCount}</Text>
                            <Text style={{ fontSize: 12, color: '#D97706', fontWeight: '600', textTransform: 'uppercase', marginTop: 4 }}>Learning</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ backgroundColor: colors.primary, paddingVertical: 18, borderRadius: 16, width: '100%', alignItems: 'center' }}
                    >
                        <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 16 }}>Back to Topics</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: colors.bg }}>
                <StatusBar barStyle={colors.statusBarStyle} />

                {/* Header */}
                <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, backgroundColor: colors.cardBg, borderRadius: 12 }}>
                        <X size={20} color={colors.text} />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>{topic}</Text>
                        <Text style={{ fontSize: 12, color: colors.textSecondary }}>Card {currentIndex + 1} of {cards.length}</Text>
                    </View>
                    <View style={{ width: 36 }} />
                </View>

                {/* Progress Bar */}
                <View style={{ height: 4, backgroundColor: colors.border, marginHorizontal: 20, borderRadius: 2, marginTop: 10, marginBottom: 20, overflow: 'hidden' }}>
                    <View style={{
                        height: '100%',
                        backgroundColor: colors.primary,
                        width: `${((currentIndex + 1) / cards.length) * 100}%`
                    }} />
                </View>

                {/* Card Area */}
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {cards[currentIndex] && (
                        <View key={currentIndex} style={{ shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 }}>
                            {/* Stacked Cards visual */}
                            <View style={{
                                position: 'absolute', top: 12, left: 12, right: -12, height: '100%',
                                backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 24, zIndex: -1,
                                transform: [{ rotate: '3deg' }]
                            }} />
                            <FlashCardComponent
                                ref={activeCardRef}
                                question={cards[currentIndex].question}
                                hint={cards[currentIndex].hint}
                                answer={cards[currentIndex].answer}
                                isActive={true}
                                onRate={handleRate}
                            />
                        </View>
                    )}
                </View>

                {/* Action Buttons (Matches Web) */}
                <View style={{ padding: 24, paddingBottom: 40, flexDirection: 'row', gap: 16 }}>
                    <TouchableOpacity
                        onPress={onLearningPress}
                        activeOpacity={0.7}
                        style={{
                            flex: 1,
                            paddingVertical: 16,
                            borderRadius: 16,
                            backgroundColor: '#FEF3C7',
                            borderWidth: 2,
                            borderColor: '#F59E0B',
                            alignItems: 'center',
                            shadowColor: '#F59E0B',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8
                        }}
                    >
                        <Text style={{ color: '#D97706', fontWeight: 'bold', fontSize: 16 }}>Still Learning</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onKnownPress}
                        activeOpacity={0.7}
                        style={{
                            flex: 1,
                            paddingVertical: 16,
                            borderRadius: 16,
                            backgroundColor: '#10B981',
                            borderWidth: 2,
                            borderColor: '#059669',
                            alignItems: 'center',
                            shadowColor: '#10B981',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 8
                        }}
                    >
                        <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>I Know This</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </GestureHandlerRootView>
    );
}
