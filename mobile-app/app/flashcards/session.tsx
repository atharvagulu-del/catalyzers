import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StatusBar, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppColors } from '@/hooks/use-app-colors';
import { X, RefreshCw } from 'lucide-react-native';
import { Flashcard } from '@/lib/flashcards';
import FlashCardComponent, { FlashCardRef } from '@/components/FlashCard';
import Animated, { ZoomIn, FadeIn, SlideInRight, Layout, FadeInDown } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.85, 340); // Match FlashCard.tsx
const CARD_HEIGHT = Math.min(SCREEN_HEIGHT * 0.60, 550); // Match FlashCard.tsx

// Backend API Configuration - Use your website's API endpoint
// In production, this should be your deployed website URL
const BACKEND_API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "https://catalyzers.vercel.app";

// Fallback: Direct Groq API (only works in development with EXPO_PUBLIC_GROQ_API_KEY set)
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Helper function to fix LaTeX backslashes that were corrupted by JSON parsing
function fixLatexBackslashes(text: string): string {
    return text
        .replace(/\f/g, '\\f')   // Form-feed -> \f (for \frac)
        .replace(/\x08/g, '\\b') // Backspace -> \b (for \beta)
        .replace(/\t/g, '\\t')   // Tab -> \t (for \theta)
        .replace(/\r/g, '\\r');  // Carriage return -> \r (for \rho)
}

// Generate flashcards - tries backend API first, falls back to direct Groq in dev
async function generateFlashcardsWithGroq(subject: string, topic: string, count: number): Promise<Flashcard[]> {
    console.log("[Flashcards] Generating cards for:", subject, topic, count);

    // Try backend API first (works in production without API key on client)
    try {
        console.log("[Flashcards] Trying backend API:", BACKEND_API_URL);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(`${BACKEND_API_URL}/api/flashcards/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ subject, topic, count }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            console.log("[Flashcards] Backend API success, got", data.cards?.length, "cards");

            if (data.cards && Array.isArray(data.cards)) {
                return data.cards.map((card: any, i: number) => ({
                    id: `generated-${i}`,
                    deck_id: `${subject}::${topic}`,
                    question: fixLatexBackslashes(card.question || ""),
                    hint: card.hint ? fixLatexBackslashes(card.hint) : null,
                    answer: fixLatexBackslashes(card.answer || ""),
                    order: i
                }));
            }
        } else {
            console.log("[Flashcards] Backend API returned:", response.status);
        }
    } catch (error: any) {
        console.log("[Flashcards] Backend API failed:", error.message);
    }

    // Fallback: Direct Groq API (development only)
    if (!GROQ_API_KEY) {
        console.error("[Flashcards] No backend available and no GROQ_API_KEY set");
        return [];
    }

    console.log("[Flashcards] Falling back to direct Groq API...");

    // Request challenging JEE/NEET level questions with LaTeX
    const prompt = `Generate exactly ${count} CHALLENGING flashcards for JEE/NEET on "${topic}" (${subject}).

DIFFICULTY LEVEL: Advanced JEE Mains / NEET level - NOT basic definitions!

Return ONLY a valid JSON array. Keep answers SHORT (max 50 words each).

Format: [{"question":"Q1","hint":null,"answer":"Short A1"},{"question":"Q2","hint":"Optional hint","answer":"Short A2"}]

CRITICAL RULES:
- For LaTeX math, use DOUBLE BACKSLASHES in JSON: "\\\\frac{1}{2}" not "\\frac{1}{2}"
- Wrap formulas in $...$ like $F = ma$ or $\\\\frac{v}{u} = \\\\frac{f}{f-u}$
- Questions should be APPLICATION-BASED and NUMERICAL where possible
- Include formula applications, not just definitions
- Answers must be CONCISE (1-2 sentences max)
- Example: "The formula is $\\\\frac{1}{f} = \\\\frac{1}{v} - \\\\frac{1}{u}$"
- No markdown, no explanation, ONLY the JSON array`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);

        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1500,
                temperature: 0.7
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("[Flashcards] API error response:", errorText);
            throw new Error(`Groq API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim();

        if (!text) {
            throw new Error("Empty response");
        }

        // Parse JSON with LaTeX escaping
        let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();

        const PLACEHOLDER = '\u0000DOUBLE_BACKSLASH\u0000';
        cleaned = cleaned
            .replace(/\\\\/g, PLACEHOLDER)
            .replace(/\\([^"\\])/g, '\\\\$1')
            .replace(new RegExp(PLACEHOLDER, 'g'), '\\\\');

        let arrayMatch = cleaned.match(/\[[\s\S]*\]/);
        if (!arrayMatch) {
            throw new Error("No JSON array found");
        }

        let jsonText = arrayMatch[0];
        let parsed;

        try {
            parsed = JSON.parse(jsonText);
        } catch {
            jsonText = jsonText
                .replace(/\r?\n/g, ' ')
                .replace(/\t/g, ' ')
                .replace(/\s+/g, ' ');
            parsed = JSON.parse(jsonText);
        }

        console.log("[Flashcards] Successfully parsed", parsed.length, "cards");

        return parsed.map((card: any, i: number) => ({
            id: `generated-${i}`,
            deck_id: `${subject}::${topic}`,
            question: fixLatexBackslashes(card.question || ""),
            hint: card.hint ? fixLatexBackslashes(card.hint) : null,
            answer: fixLatexBackslashes(card.answer || ""),
            order: i
        }));
    } catch (error: any) {
        console.error("[Flashcards] Groq API error:", error.message);
        return [];
    }
}

export default function FlashcardSessionScreen() {
    const { subject, topic, count } = useLocalSearchParams<{ subject: string, topic: string, count: string }>();
    const router = useRouter();
    const colors = useAppColors();

    // Stats and Deck
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isComplete, setIsComplete] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [knownCount, setKnownCount] = useState(0);
    const [learningCount, setLearningCount] = useState(0);

    // Ref to trigger swipe from buttons
    const activeCardRef = useRef<FlashCardRef>(null);

    const loadCards = async () => {
        setIsLoading(true);
        setError(null);
        setCurrentIndex(0);
        setKnownCount(0);
        setLearningCount(0);
        setIsComplete(false);

        if (subject && topic) {
            const cardCount = parseInt(count || "5");
            console.log(`[Flashcards] Generating ${cardCount} cards for ${subject} - ${topic}`);

            const generatedCards = await generateFlashcardsWithGroq(subject, topic, cardCount);

            if (generatedCards.length === 0) {
                setError("Failed to generate flashcards. Please try again.");
            } else {
                setCards(generatedCards);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadCards();
    }, [subject, topic, count]);

    const handleRate = (rating: 'known' | 'learning') => {
        if (rating === 'known') setKnownCount(c => c + 1);
        else setLearningCount(c => c + 1);

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
                <StatusBar barStyle={colors.statusBarStyle} />
                <ActivityIndicator size="large" color={colors.primary} />
                <Animated.Text
                    entering={FadeIn.delay(300)}
                    style={{ marginTop: 16, fontSize: 16, color: colors.textSecondary, textAlign: 'center' }}
                >
                    Generating flashcards for{'\n'}{topic}...
                </Animated.Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <StatusBar barStyle={colors.statusBarStyle} />
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFAB2E20', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                    <Text style={{ fontSize: 24, color: '#FFAB2E' }}>!</Text>
                </View>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, textAlign: 'center', marginBottom: 8 }}>
                    {error}
                </Text>
                <TouchableOpacity
                    onPress={loadCards}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: colors.primary,
                        paddingHorizontal: 24,
                        paddingVertical: 12,
                        borderRadius: 12,
                        marginTop: 20
                    }}
                >
                    <RefreshCw size={18} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#FFF', fontWeight: '600' }}>Try Again</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
                    <Text style={{ color: colors.textSecondary }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (isComplete) {
        const percentage = Math.round((knownCount / (knownCount + learningCount)) * 100) || 0;

        return (
            <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <StatusBar barStyle={colors.statusBarStyle} />
                <Animated.View entering={ZoomIn} style={{ alignItems: 'center', width: '100%' }}>
                    <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#04CA8F20', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                        <Text style={{ fontSize: 36, color: '#04CA8F' }}>✓</Text>
                    </View>
                    <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 8 }}>Session Complete!</Text>
                    <Text style={{ fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginBottom: 8 }}>
                        Great job reviewing {topic}
                    </Text>
                    <Text style={{ fontSize: 32, fontWeight: '800', color: '#04CA8F', marginBottom: 32 }}>
                        {percentage}% Mastered
                    </Text>

                    <View style={{ flexDirection: 'row', gap: 16, marginBottom: 40, width: '100%' }}>
                        <Animated.View
                            entering={FadeInDown.delay(200)}
                            style={{ flex: 1, alignItems: 'center', backgroundColor: 'transparent', padding: 20, borderRadius: 20, borderWidth: 2, borderColor: '#04CA8F' }}
                        >
                            <Text style={{ fontSize: 32, fontWeight: '700', color: '#04CA8F' }}>{knownCount}</Text>
                            <Text style={{ fontSize: 12, color: '#04CA8F', fontWeight: '600', textTransform: 'uppercase', marginTop: 4 }}>Knew This</Text>
                        </Animated.View>
                        <Animated.View
                            entering={FadeInDown.delay(300)}
                            style={{ flex: 1, alignItems: 'center', backgroundColor: 'transparent', padding: 20, borderRadius: 20, borderWidth: 2, borderColor: '#FFAB2E' }}
                        >
                            <Text style={{ fontSize: 32, fontWeight: '700', color: '#FFAB2E' }}>{learningCount}</Text>
                            <Text style={{ fontSize: 12, color: '#FFAB2E', fontWeight: '600', textTransform: 'uppercase', marginTop: 4 }}>Still Learning</Text>
                        </Animated.View>
                    </View>

                    <TouchableOpacity
                        onPress={loadCards}
                        style={{
                            width: '100%',
                            backgroundColor: colors.primary,
                            paddingVertical: 16,
                            borderRadius: 16,
                            alignItems: 'center',
                            marginBottom: 12
                        }}
                    >
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFF' }}>Practice Again</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            width: '100%',
                            paddingVertical: 16,
                            borderRadius: 16,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: colors.border
                        }}
                    >
                        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textSecondary }}>Back to Chapters</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }

    const currentCard = cards[currentIndex];

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
            <StatusBar barStyle={colors.statusBarStyle} />

            {/* Header */}
            <View style={{
                paddingTop: 50,
                paddingHorizontal: 20,
                paddingBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderBottomColor: colors.border
            }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                    <X size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textSecondary }}>{topic}</Text>
                    <Text style={{ fontSize: 12, color: colors.textTertiary }}>
                        Card {currentIndex + 1} of {cards.length}
                    </Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {/* Progress Bar */}
            <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
                <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' }}>
                    <Animated.View
                        style={{
                            width: `${((currentIndex + 1) / cards.length) * 100}%`,
                            height: '100%',
                            backgroundColor: colors.primary,
                            borderRadius: 3
                        }}
                        layout={Layout.springify()}
                    />
                </View>
            </View>

            {/* Card Area with Stack Effect */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                {/* Stacked cards behind (visual effect) */}
                {currentIndex < cards.length - 1 && (
                    <View style={{
                        position: 'absolute',
                        width: CARD_WIDTH,
                        height: CARD_HEIGHT,
                        backgroundColor: colors.cardBg,
                        borderRadius: 20,
                        transform: [{ scale: 0.95 }, { translateY: 8 }],
                        opacity: 0.5,
                        borderWidth: 1,
                        borderColor: colors.border
                    }} />
                )}

                {currentCard && (
                    <FlashCardComponent
                        key={currentCard.id}
                        ref={activeCardRef}
                        question={currentCard.question}
                        hint={currentCard.hint}
                        answer={currentCard.answer}
                        isActive={true}
                        onRate={handleRate}
                    />
                )}
            </View>

            {/* Action Buttons - Matching Website Style */}
            <View style={{
                flexDirection: 'row',
                paddingHorizontal: 24,
                paddingBottom: 40,
                paddingTop: 16,
                gap: 12
            }}>
                <TouchableOpacity
                    onPress={onLearningPress}
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        paddingVertical: 14,
                        borderRadius: 999,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 2,
                        borderColor: '#FFAB2E'
                    }}
                    activeOpacity={0.8}
                >
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFAB2E' }}>Still Learning</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onKnownPress}
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        paddingVertical: 14,
                        borderRadius: 999,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 2,
                        borderColor: '#04CA8F'
                    }}
                    activeOpacity={0.8}
                >
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#04CA8F' }}>I Know This</Text>
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );
}
