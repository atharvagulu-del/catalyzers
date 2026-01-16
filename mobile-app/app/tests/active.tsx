import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, BackHandler, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Clock, HelpCircle, Lightbulb, CheckCircle2 } from 'lucide-react-native';
import { QuestionRenderer } from '@/components/QuestionRenderer';
import { useAppColors } from '@/hooks/use-app-colors';

export default function ActiveTestScreen() {
    const { testData } = useLocalSearchParams();
    const router = useRouter();
    const colors = useAppColors();
    const data = useMemo(() => testData ? JSON.parse(testData as string) : null, [testData]);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number | null>>({});
    const [timeLeft, setTimeLeft] = useState((data?.questionCount || 10) * 120);
    const [hintVisible, setHintVisible] = useState(false);

    // Fade animation for hint
    const hintOpacity = useMemo(() => new Animated.Value(0), []);

    useEffect(() => {
        if (hintVisible) {
            Animated.timing(hintOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }).start();
        } else {
            hintOpacity.setValue(0);
        }
    }, [hintVisible]);

    useEffect(() => {
        const backAction = () => {
            Alert.alert("Hold on!", "Are you sure you want to quit the test?", [
                { text: "Cancel", onPress: () => null, style: "cancel" },
                { text: "YES", onPress: () => router.back() }
            ]);
            return true;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Reset hint on question change
    useEffect(() => {
        setHintVisible(false);
    }, [currentQuestionIndex]);

    if (!data) return null;

    const questions = data.questions || [];
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return null;

    const handleSelectOption = (idx: number) => {
        setAnswers(prev => ({ ...prev, [currentQ.id]: idx }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const toggleHint = () => {
        setHintVisible(!hintVisible);
    }

    const handleSubmit = () => {
        let score = 0;
        let correctCount = 0;
        let incorrectCount = 0;

        questions.forEach((q: any) => {
            const userAns = answers[q.id];
            if (userAns !== undefined && userAns !== null) {
                if (userAns === q.correctAnswer) {
                    score += 4;
                    correctCount++;
                } else {
                    score -= 1;
                    incorrectCount++;
                }
            }
        });

        const result = {
            score,
            totalMarks: questions.length * 4,
            correctCount,
            incorrectCount,
            unattempted: questions.length - (correctCount + incorrectCount),
            answers,
            questions: data.questions,
            testTitle: data.title
        };

        router.replace({
            pathname: '/tests/result',
            params: { resultData: JSON.stringify(result) }
        });
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#1F2937' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#1F2937', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Clock size={16} color="#F59E0B" style={{ marginRight: 6 }} />
                        <Text style={{ color: '#F59E0B', fontWeight: 'bold', fontVariant: ['tabular-nums'], fontSize: 16 }}>
                            {formatTime(timeLeft)}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => Alert.alert('Exit Test', 'Submit test now?', [{ text: 'Cancel' }, { text: 'Submit', onPress: handleSubmit }])}>
                    <Text style={{ color: '#EF4444', fontWeight: '600' }}>End Test</Text>
                </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={{ height: 4, backgroundColor: '#1F2937', width: '100%' }}>
                <View style={{
                    height: '100%',
                    backgroundColor: '#3B82F6',
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
                }} />
            </View>

            {/* Question Area */}
            <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Text style={{ color: '#9CA3AF', fontSize: 14 }}>Question {currentQuestionIndex + 1} of {questions.length}</Text>
                    <Text style={{ color: '#10B981', fontWeight: 'bold' }}>+4 / <Text style={{ color: '#EF4444' }}>-1</Text></Text>
                </View>

                {/* Question Text (WebView for Formatting) */}
                <View style={{ minHeight: 100, marginBottom: 20 }}>
                    <QuestionRenderer content={currentQ.text} height={120} />
                </View>

                {/* Image Support */}
                {currentQ.image && (
                    <View style={{ marginBottom: 20, alignItems: 'center', backgroundColor: 'white', borderRadius: 8, padding: 10 }}>
                        <QuestionRenderer content={`<img src="${currentQ.image}" />`} height={200} />
                    </View>
                )}

                {/* Options */}
                <View style={{ gap: 12 }}>
                    {currentQ.options?.map((opt: string, idx: number) => {
                        const isSelected = answers[currentQ.id] === idx;
                        return (
                            <TouchableOpacity
                                key={idx}
                                activeOpacity={0.7}
                                onPress={() => handleSelectOption(idx)}
                                style={{
                                    borderWidth: 2,
                                    borderColor: isSelected ? '#3B82F6' : '#1F2937',
                                    borderRadius: 12,
                                    padding: 16,
                                    backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.15)' : '#111827',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    shadowColor: isSelected ? '#3B82F6' : undefined,
                                    shadowOpacity: isSelected ? 0.3 : 0,
                                    shadowRadius: 10,
                                    elevation: isSelected ? 5 : 0
                                }}
                            >
                                <View style={{
                                    width: 24, height: 24, borderRadius: 12,
                                    borderWidth: 2, borderColor: isSelected ? '#3B82F6' : '#4B5563',
                                    alignItems: 'center', justifyContent: 'center',
                                    marginRight: 16,
                                    backgroundColor: isSelected ? '#3B82F6' : 'transparent'
                                }}>
                                    {isSelected && <CheckCircle2 size={16} color="white" />}
                                </View>
                                <Text style={{ color: isSelected ? 'white' : '#D1D5DB', fontSize: 16, flex: 1 }}>{opt}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Hint Section */}
                <View style={{ marginTop: 30 }}>
                    <TouchableOpacity
                        onPress={toggleHint}
                        style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', padding: 8 }}
                    >
                        <Lightbulb size={18} color={hintVisible ? '#F59E0B' : '#6B7280'} />
                        <Text style={{ color: hintVisible ? '#F59E0B' : '#6B7280', marginLeft: 8, fontWeight: '600' }}>
                            {hintVisible ? 'Hide Hint' : 'Get a Hint'}
                        </Text>
                    </TouchableOpacity>

                    {hintVisible && (
                        <Animated.View style={{
                            marginTop: 12,
                            padding: 16,
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            borderRadius: 12,
                            borderLeftWidth: 3,
                            borderLeftColor: '#F59E0B',
                            opacity: hintOpacity
                        }}>
                            <Text style={{ color: '#D1D5DB' }}>{currentQ.hint || 'No hint available for this question.'}</Text>
                        </Animated.View>
                    )}
                </View>

            </ScrollView>

            {/* Navigation Footer */}
            <View style={{
                padding: 16, borderTopWidth: 1, borderTopColor: '#1F2937', backgroundColor: '#000',
                flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 50
            }}>
                <TouchableOpacity
                    onPress={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    style={{
                        flexDirection: 'row', alignItems: 'center',
                        opacity: currentQuestionIndex === 0 ? 0.3 : 1,
                        padding: 8
                    }}
                >
                    <ChevronLeft size={24} color="#3B82F6" />
                    <Text style={{ color: '#3B82F6', fontSize: 16, fontWeight: '600', marginLeft: 4 }}>Previous</Text>
                </TouchableOpacity>

                {currentQuestionIndex === questions.length - 1 ? (
                    <TouchableOpacity
                        onPress={handleSubmit}
                        style={{ backgroundColor: '#10B981', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 30 }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Submit Test</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={handleNext}
                        style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}
                    >
                        <Text style={{ color: '#3B82F6', fontSize: 16, fontWeight: '600', marginRight: 4 }}>Next</Text>
                        <ChevronRight size={24} color="#3B82F6" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
