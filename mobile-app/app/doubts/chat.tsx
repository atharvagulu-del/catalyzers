import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';
import { Send, Image as ImageIcon, Sparkles, MoreVertical, ChevronLeft, PlayCircle } from 'lucide-react-native';
import { useAppColors } from '@/hooks/use-app-colors';
import LottieView from 'lottie-react-native';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useAuth } from '@/context/AuthProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { findRelatedLectures, LectureSuggestion } from '@/lib/lectureSearch';
import { supabase } from '@/lib/supabase';

// Initialize Gemini
const GEMINI_API_KEY = "AIzaSyC6P-GduvrcbgI5gSnXacPIuJzwE0_FB9c";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface Message {
    id: string;
    role: 'user' | 'mentor';
    content: string;
    timestamp: Date;
    suggestions?: LectureSuggestion[];
}

// Updated Prompt to avoid LaTeX issues and be more mobile-friendly
const SYSTEM_PROMPT_CONTEXT_CHECK = `System: You are "Catalyzer Assist", a friendly academic mentor for JEE/NEET students.

**MANDATORY CONTEXT CHECK:**
Detect topic switches (e.g. Physics -> Math). 
IF SWITCH DETECTED: Start response with exactly: [DIFF_TOPIC]. Do not say anything else.

**IF SAME TOPIC:**
- Explain clearly using simple text formatting.
- **AVOID LaTeX** ($...$) as it may not render on some mobile devices.
- Use readable text for math: e.g. "x^2 + y^2", "integral of...", "sqrt(x)".
- Use **Bold** for key terms.
- Use bullet points.
- Keep it concise (< 200 words).
- Be encouraging!`;

const SYSTEM_PROMPT_NO_CHECK = `System: You are "Catalyzer Assist".
RULES:
- **AVOID LaTeX**. Use clear text representation for math (e.g. x^2, theta, pi).
- Use **Bold** for emphasis.
- Keep explanation short and simple.
- Answer directly.`;

export default function DoubtChatScreen() {
    const colors = useAppColors();
    const router = useRouter();
    const { user } = useAuth();
    const { initialQuery, sessionId: paramSessionId } = useLocalSearchParams<{ initialQuery: string, sessionId: string }>();

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(paramSessionId || null);

    const scrollViewRef = useRef<ScrollView>(null);
    const hasInitialQueryProcessed = useRef(false);

    useEffect(() => {
        if (paramSessionId) {
            loadSession(paramSessionId);
        } else if (initialQuery && !hasInitialQueryProcessed.current) {
            hasInitialQueryProcessed.current = true;
            sendMessage(initialQuery, true); // First message skips context check
        }
    }, [initialQuery, paramSessionId]);

    const loadSession = async (id: string) => {
        try {
            const { data, error } = await supabase
                .from('doubt_messages')
                .select('*')
                .eq('session_id', id)
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (data) {
                const loadedMessages: Message[] = data.map((msg: any) => {
                    // Re-generate suggestions for mentor messages
                    // because they aren't stored in DB
                    let suggestions: LectureSuggestion[] = [];
                    if (msg.role === 'mentor') {
                        suggestions = findRelatedLectures(msg.content, 1);
                    }

                    return {
                        id: msg.id.toString(),
                        role: msg.role === 'user' ? 'user' : 'mentor',
                        content: msg.content,
                        timestamp: new Date(msg.created_at),
                        suggestions: suggestions
                    };
                });
                setMessages(loadedMessages);
                setTimeout(() => scrollToBottom(), 500);
            }
        } catch (error) {
            console.error('Error loading session:', error);
        }
    };

    const createSession = async (title: string) => {
        if (!user) return null;
        try {
            const { data, error } = await supabase
                .from('doubt_sessions')
                .insert({
                    user_id: user.id,
                    title: title.substring(0, 50),
                    status: 'open'
                })
                .select()
                .single();

            if (error) throw error;
            return data.id;
        } catch (error) {
            console.error('Error creating session:', error);
            return null;
        }
    };

    const saveMessage = async (sessId: string, role: 'user' | 'mentor', content: string) => {
        try {
            await supabase.from('doubt_messages').insert({
                session_id: sessId,
                role: role,
                content: content
            });
        } catch (error) {
            console.error('Error saving message:', error);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const callGemini = async (userText: string, history: Message[], skipCheck: boolean) => {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
        const systemInstruction = skipCheck ? SYSTEM_PROMPT_NO_CHECK : SYSTEM_PROMPT_CONTEXT_CHECK;

        const chatHistory = [
            { role: 'user', parts: [{ text: systemInstruction }] },
            ...history.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }))
        ];

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: { maxOutputTokens: 1000 },
        });

        const result = await chat.sendMessage(userText);
        return result.response.text();
    };

    const sendMessage = async (text?: string, skipContextCheck: boolean = false) => {
        const messageText = typeof text === 'string' ? text : input;
        if (!messageText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        scrollToBottom();

        // Ensure session exists
        let currentSessionId = sessionId;
        if (!currentSessionId && user) {
            currentSessionId = await createSession(messageText);
            setSessionId(currentSessionId);
        }

        if (currentSessionId) {
            saveMessage(currentSessionId, 'user', messageText);
        }

        try {
            const shouldSkip = skipContextCheck || messages.length === 0;
            const responseText = await callGemini(userMessage.content, messages, shouldSkip);

            if (responseText.includes("[DIFF_TOPIC]")) {
                Alert.alert(
                    "New Topic Detected",
                    "For better accuracy, should we start a new chat?",
                    [
                        {
                            text: "Continue Here",
                            onPress: () => {
                                sendMessageForce(userMessage.content, currentSessionId);
                            }
                        },
                        {
                            text: "Start New Chat",
                            onPress: async () => {
                                setMessages([]);
                                setSessionId(null);
                                const newId = await createSession(userMessage.content);
                                setSessionId(newId);
                                if (newId) saveMessage(newId, 'user', userMessage.content);
                                sendMessageForce(userMessage.content, newId);
                            },
                            style: 'default'
                        }
                    ]
                );
                setIsTyping(false);
                return;
            }

            // Normal response processing
            const relatedLectures = findRelatedLectures(userMessage.content + " " + responseText, 1);

            const aiMessage: Message = {
                id: Date.now().toString() + '_ai',
                role: 'mentor',
                content: responseText,
                timestamp: new Date(),
                suggestions: relatedLectures
            };

            setMessages(prev => [...prev, aiMessage]);
            if (currentSessionId) {
                saveMessage(currentSessionId, 'mentor', responseText);
            }

        } catch (error: any) {
            console.error(error);
            let errorText = "I'm having trouble connecting right now.";
            if (error.message && error.message.includes("API key")) {
                errorText += " (API Key Error)";
            }
            const errorMessage: Message = {
                id: Date.now().toString() + '_err',
                role: 'mentor',
                content: errorText,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
            scrollToBottom();
        }
    };

    const sendMessageForce = async (text: string, activeSessionId: string | null) => {
        setIsTyping(true);
        try {
            // Use NO_CHECK prompt for forced continuation
            const response = await callGemini(text, [], true);
            const relatedLectures = findRelatedLectures(text + " " + response, 1);

            const aiMessage: Message = {
                id: Date.now().toString() + '_ai',
                role: 'mentor',
                content: response,
                timestamp: new Date(),
                suggestions: relatedLectures
            };

            setMessages(prev => {
                if (prev.length === 0) {
                    return [{
                        id: Date.now().toString(),
                        role: 'user',
                        content: text,
                        timestamp: new Date()
                    }, aiMessage];
                }
                return [...prev, aiMessage];
            });

            if (activeSessionId) {
                saveMessage(activeSessionId, 'mentor', response);
            }

        } catch (e) {
            console.error(e);
        } finally {
            setIsTyping(false);
            scrollToBottom();
        }
    };

    const handleLecturePress = (urlData: string) => {
        try {
            // LectureSearch now returns a JSON string for the URL
            const navData = JSON.parse(urlData);
            console.log("Navigating to:", navData);
            router.push(navData);
        } catch (e) {
            console.warn("Using fallback navigation for legacy URLs", urlData);
            // Fallback if data is not JSON (legacy)
            Alert.alert("Navigation Error", "Could not open lecture.");
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <Stack.Screen options={{ headerShown: false }} />

                {/* Chat Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <ChevronLeft size={28} color={colors.text} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <View style={{ width: 32, height: 32 }}>
                                <LottieView
                                    source={require('@/assets/animations/Anima Bot.json')}
                                    autoPlay
                                    loop
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </View>
                            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>Catalyzer Assist</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => router.push('/doubts/history')}>
                        <MoreVertical size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Messages Container */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                >
                    <ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {messages.length === 0 && !initialQuery && (
                            <View style={{ alignItems: 'center', marginTop: 40, opacity: 0.7 }}>
                                <Text style={{ fontSize: 16, color: colors.textSecondary }}>Start asking your doubt...</Text>
                            </View>
                        )}

                        {messages.map((msg, index) => (
                            <Animated.View
                                key={msg.id}
                                entering={FadeIn.delay(index * 50)}
                                layout={Layout.springify()}
                                style={{
                                    flexDirection: 'column',
                                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    marginBottom: 24
                                }}
                            >
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    width: '100%'
                                }}>
                                    {msg.role === 'mentor' && (
                                        <View style={{ width: 36, height: 36, marginRight: 8, marginTop: -4 }}>
                                            <LottieView
                                                source={require('@/assets/animations/Anima Bot.json')}
                                                autoPlay
                                                loop
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        </View>
                                    )}

                                    <View style={{
                                        maxWidth: '85%',
                                        backgroundColor: msg.role === 'user' ? colors.primary : colors.cardBg,
                                        borderRadius: 20,
                                        padding: 14,
                                        borderTopLeftRadius: msg.role === 'mentor' ? 4 : 20,
                                        borderTopRightRadius: msg.role === 'user' ? 4 : 20,
                                        borderWidth: msg.role === 'mentor' ? 1 : 0,
                                        borderColor: colors.border
                                    }}>
                                        {msg.role === 'mentor' ? (
                                            <Markdown style={{
                                                body: { color: colors.text, fontSize: 15, lineHeight: 22 },
                                                paragraph: { marginBottom: 10 },
                                                code_inline: { backgroundColor: colors.bg, borderRadius: 4, fontFamily: 'System' },
                                            }}>
                                                {msg.content}
                                            </Markdown>
                                        ) : (
                                            <Text style={{ color: 'white', fontSize: 16 }}>{msg.content}</Text>
                                        )}
                                    </View>
                                </View>

                                {/* Lecture Suggestions */}
                                {msg.suggestions && msg.suggestions.length > 0 && (
                                    <View style={{ marginTop: 12, marginLeft: 44, width: '80%' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                            <Sparkles size={16} color={colors.primary} style={{ marginRight: 6 }} />
                                            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary }}>Suggested Lecture</Text>
                                        </View>
                                        {msg.suggestions.map((suggestion, i) => (
                                            <TouchableOpacity
                                                key={i}
                                                onPress={() => handleLecturePress(suggestion.url)}
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    backgroundColor: colors.cardBg,
                                                    padding: 10,
                                                    borderRadius: 12,
                                                    marginBottom: 8,
                                                    borderWidth: 1,
                                                    borderColor: colors.border
                                                }}
                                            >
                                                <PlayCircle size={24} color={colors.primary} style={{ marginRight: 10 }} />
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }} numberOfLines={1}>{suggestion.title}</Text>
                                                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>{suggestion.subject}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </Animated.View>
                        ))}

                        {isTyping && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 44, marginBottom: 20 }}>
                                <View style={{ backgroundColor: colors.cardBg, padding: 10, borderRadius: 16, borderWidth: 1, borderColor: colors.border }}>
                                    <View style={{ width: 24, height: 24 }}>
                                        <LottieView
                                            source={require('@/assets/animations/AI logo Foriday.json')}
                                            autoPlay
                                            loop
                                            style={{ width: '100%', height: '100%' }}
                                        />
                                    </View>
                                </View>
                                <Text style={{ fontSize: 13, color: colors.textTertiary, marginLeft: 8 }}>Thinking...</Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* Input Area */}
                    <View style={{ padding: 16, backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: colors.cardBg,
                            borderRadius: 30,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderWidth: 1,
                            borderColor: colors.border
                        }}>
                            <TouchableOpacity style={{ padding: 8 }}>
                                <ImageIcon size={24} color={colors.textTertiary} />
                            </TouchableOpacity>

                            <TextInput
                                style={{ flex: 1, marginHorizontal: 8, fontSize: 16, color: colors.text, maxHeight: 100 }}
                                placeholder="Type a doubt..."
                                placeholderTextColor={colors.textTertiary}
                                value={input}
                                onChangeText={setInput}
                                multiline
                            />

                            <TouchableOpacity
                                onPress={() => sendMessage()}
                                disabled={!input.trim() || isTyping}
                                style={{
                                    backgroundColor: input.trim() ? colors.primary : colors.iconBg,
                                    width: 40, height: 40,
                                    borderRadius: 20,
                                    alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <Send size={20} color={input.trim() ? 'white' : colors.textTertiary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
