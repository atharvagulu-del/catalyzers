"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Sparkles, MoreVertical, X, Loader2, BookOpen, ArrowRight, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase-client';
import Link from 'next/link';
import LatexRenderer from './LatexRenderer';
import { findRelatedLectures } from '@/lib/lectureSearch';
import { LottieAnimation } from '@/components/ui/LottieAnimation';
import robotAnimation from '@/public/assets/animations/Anima Bot.json';
import loadingAnimation from '@/public/assets/animations/AI logo Foriday.json';

interface LectureSuggestion {
    title: string;
    chapterTitle: string;
    subject: string;
    url: string;
}

interface Message {
    id: string;
    role: 'user' | 'mentor';
    content: string;
    timestamp: Date;
    feedbackSubmitted?: boolean;
    feedbackType?: 'positive' | 'negative' | 'report';
    isTyping?: boolean;
}

interface DoubtChatInterfaceProps {
    sessionId: string | null;
    onNewSession: () => void;
    onSessionCreated?: (id: string) => void;
    onToggleSidebar?: () => void;
}

export default function DoubtChatInterface({ sessionId, onNewSession, onSessionCreated, onToggleSidebar }: DoubtChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [suggestedLectures, setSuggestedLectures] = useState<LectureSuggestion[]>([]);
    const [chatClosed, setChatClosed] = useState(false);
    const [pendingContextSwitch, setPendingContextSwitch] = useState<{ reply: string, userMessage: string } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const skipNextFetchRef = useRef(false); // Flag to skip fetch after creating session ourselves

    // Load Messages
    useEffect(() => {
        if (!sessionId) {
            // Instant Reset
            setMessages([]);
            setChatClosed(false);
            setSuggestedLectures([]);
            setInput(''); // Also clear input
            setLoadingHistory(false); // Ensure loading is off
            return;
        }

        // Skip fetch if we just created this session ourselves
        if (skipNextFetchRef.current) {
            skipNextFetchRef.current = false;
            return;
        }

        const fetchHistory = async () => {
            setLoadingHistory(true);

            // First check if session is actually resolved
            const { data: sessionData } = await supabase
                .from('doubt_sessions')
                .select('status')
                .eq('id', sessionId)
                .single();

            // Only close chat if session is explicitly resolved
            const isResolved = sessionData?.status === 'resolved';
            setChatClosed(isResolved);

            const { data } = await supabase
                .from('doubt_messages')
                .select('*')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: true });

            if (data && data.length > 0) {
                setMessages(data.map(m => ({
                    id: m.id,
                    role: m.role,
                    content: m.content,
                    timestamp: new Date(m.created_at)
                })));

                // Recalculate video suggestions from the first user message
                const firstUserMsg = data.find(m => m.role === 'user');
                if (firstUserMsg) {
                    const lectures = findRelatedLectures(firstUserMsg.content);
                    setSuggestedLectures(lectures);
                }
            }
            setLoadingHistory(false);
            setTimeout(scrollToBottom, 100);
        };

        fetchHistory();
    }, [sessionId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const sendMessage = async (text: string, overrideSessionId?: string | null) => {
        if (!text.trim() || chatClosed) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // Get current session for Auth
            const { data: { session: currentAuthSession } } = await supabase.auth.getSession();

            if (!currentAuthSession) {
                throw new Error("You must be logged in to send a message.");
            }

            // Determine if we need a new session
            // If overrideSessionId is explicitly null, we ignore current state sessionId
            let currentSessionId = overrideSessionId === undefined ? sessionId : overrideSessionId;

            // Optimistic Session Creation if needed
            if (!currentSessionId) {
                const { data: session, error: sessionError } = await supabase
                    .from('doubt_sessions')
                    .insert({
                        user_id: currentAuthSession.user.id,
                        title: userMessage.content.slice(0, 30) + '...',
                        status: 'open'
                    })
                    .select()
                    .single();

                if (sessionError) {
                    console.error('Session creation error:', sessionError);
                    throw new Error('Failed to create session');
                }

                if (session) {
                    currentSessionId = session.id;
                    if (onSessionCreated) onSessionCreated(session.id);
                }
            }

            // Note: User message is saved by the API route, not here (to prevent duplicates)

            // Call API
            const response = await fetch('/api/doubts/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentAuthSession.access_token}`
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    sessionId: currentSessionId,
                    history: messages
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to get response');
            }

            const data = await response.json();

            setIsTyping(false);

            if (data.isDifferentTopic) {
                setPendingContextSwitch({ reply: data.reply, userMessage: text });
                return;
            }

            const aiMessage: Message = {
                id: Date.now().toString() + 'ai',
                role: 'mentor',
                content: data.reply || "I'm having trouble connecting. Please try again.",
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);

            // Update lecture suggestions with each new response
            if (data.suggestedLectures && data.suggestedLectures.length > 0) {
                setSuggestedLectures(data.suggestedLectures);
            }

        } catch (error: any) {
            console.error(error);
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now().toString() + 'err',
                role: 'mentor',
                content: `Error: ${error.message || 'Something went wrong.'}`,
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleContinueContext = () => {
        if (!pendingContextSwitch) return;

        // User chose to continue the earlier conversation
        // Remove the off-topic user message that was added to the chat
        // and show an acknowledgement message
        setMessages(prev => {
            // Remove the last message (the off-topic question)
            const filtered = prev.slice(0, -1);
            // Add acknowledgement from AI
            return [...filtered, {
                id: Date.now().toString() + 'ack',
                role: 'mentor' as const,
                content: "Alright, let's continue with what we were discussing! What else would you like to know about this topic?",
                timestamp: new Date()
            }];
        });

        setPendingContextSwitch(null);
    };

    const handleNewContext = async () => {
        if (!pendingContextSwitch) return;
        const text = pendingContextSwitch.userMessage;
        setPendingContextSwitch(null);

        // Clear UI immediately for fresh start
        setMessages([]);
        setChatClosed(false);
        setSuggestedLectures([]);
        setInput('');

        // Show the user message in new chat
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date()
        };
        setMessages([userMessage]);
        setIsTyping(true);

        try {
            const { data: { session: currentAuthSession } } = await supabase.auth.getSession();
            if (!currentAuthSession) throw new Error("Not authenticated");

            // Create a brand new session
            const { data: newSession, error: sessionError } = await supabase
                .from('doubt_sessions')
                .insert({
                    user_id: currentAuthSession.user.id,
                    title: text.slice(0, 30) + '...',
                    status: 'open'
                })
                .select()
                .single();

            if (sessionError || !newSession) {
                console.error('Session creation error:', sessionError);
                throw new Error('Failed to create new session');
            }

            // Store session ID for later - DON'T notify parent yet to avoid remount
            const createdSessionId = newSession.id;

            // Note: User message is saved by the API route, not here (to prevent duplicates)

            // Call API with empty history (fresh start)
            const response = await fetch('/api/doubts/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentAuthSession.access_token}`
                },
                body: JSON.stringify({
                    message: text,
                    sessionId: createdSessionId,
                    history: [], // Fresh start - no history
                    skipContextCheck: true // Don't check context for new session
                })
            });

            const data = await response.json();
            setIsTyping(false);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            const aiMessage: Message = {
                id: Date.now().toString() + 'ai',
                role: 'mentor',
                content: data.reply || "I'm having trouble connecting. Please try again.",
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);

            if (data.suggestedLectures) {
                setSuggestedLectures(data.suggestedLectures);
            }

            // NOW notify parent of new session - after AI message is shown
            // Set flag to skip fetch since we already have the messages
            skipNextFetchRef.current = true;
            setTimeout(() => {
                if (onSessionCreated) onSessionCreated(createdSessionId);
            }, 100);
        } catch (error: any) {
            console.error('handleNewContext error:', error);
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now().toString() + 'err',
                role: 'mentor',
                content: `Error: ${error.message}`,
                timestamp: new Date()
            }]);
        }
    };

    const handleSend = () => {
        sendMessage(input);
    };

    const handleSendFromClick = (text: string) => {
        sendMessage(text);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-none md:rounded-[32px] border-0 md:border border-slate-200 dark:border-slate-800 shadow-none md:shadow-sm overflow-hidden relative font-sans">
            {/* Header - Simplified & Clean */}
            <div className="h-16 px-4 md:px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={onToggleSidebar}
                        className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    {/* No avatar in header needed if it's cleaner, or just small text */}
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-lg">Catalyzer Assist</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]">
                {loadingHistory ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : messages.length === 0 ? (
                    /* EMPTY STATE / WELCOME UI */
                    <div className="h-full flex flex-col items-center justify-center mt-0 relative z-10">
                        {/* Large Animated Character */}
                        <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4 flex items-center justify-center">
                            <div className="absolute inset-0 bg-blue-400/20 blur-[40px] rounded-full animate-pulse" />
                            <LottieAnimation animationData={robotAnimation} loop={true} />
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1 text-center">
                            How can I help you today?
                        </h2>

                        {/* Scrolling Subtext - Allen Style (Step Animation) */}
                        <div className="h-[84px] md:h-[96px] overflow-hidden relative w-full max-w-lg mx-auto mt-4 scroller-mask">
                            <div className="absolute inset-0 flex flex-col items-center justify-start animate-scroll-step">
                                {/* 5 Unique Phrases - No AI Mentions */}
                                <span className="h-[28px] md:h-[32px] leading-[28px] md:leading-[32px] text-base md:text-lg text-slate-700 dark:text-slate-200 text-center font-bold">Clear your doubts instantly</span>
                                <span className="h-[28px] md:h-[32px] leading-[28px] md:leading-[32px] text-base md:text-lg text-slate-700 dark:text-slate-200 text-center font-bold">Simplify your concepts</span>
                                <span className="h-[28px] md:h-[32px] leading-[28px] md:leading-[32px] text-base md:text-lg text-slate-700 dark:text-slate-200 text-center font-bold">Understand with real examples</span>
                                <span className="h-[28px] md:h-[32px] leading-[28px] md:leading-[32px] text-base md:text-lg text-slate-700 dark:text-slate-200 text-center font-bold">Master complex topics easily</span>
                                <span className="h-[28px] md:h-[32px] leading-[28px] md:leading-[32px] text-base md:text-lg text-slate-700 dark:text-slate-200 text-center font-bold">Step-by-step solutions</span>

                                {/* Duplicate for seamless loop */}
                                <span className="h-[28px] md:h-[32px] leading-[28px] md:leading-[32px] text-base md:text-lg text-slate-700 dark:text-slate-200 text-center font-bold">Clear your doubts instantly</span>
                                <span className="h-[28px] md:h-[32px] leading-[28px] md:leading-[32px] text-base md:text-lg text-slate-700 dark:text-slate-200 text-center font-bold">Simplify your concepts</span>
                                <span className="h-[28px] md:h-[32px] leading-[28px] md:leading-[32px] text-base md:text-lg text-slate-700 dark:text-slate-200 text-center font-bold">Understand with real examples</span>
                                <span className="h-[28px] md:h-[32px] leading-[28px] md:leading-[32px] text-base md:text-lg text-slate-700 dark:text-slate-200 text-center font-bold">Master complex topics easily</span>
                                <span className="h-[28px] md:h-[32px] leading-[28px] md:leading-[32px] text-base md:text-lg text-slate-700 dark:text-slate-200 text-center font-bold">Step-by-step solutions</span>
                            </div>
                        </div>

                        {/* Quick Start Buttons */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-6 flex gap-3"
                        >
                            <button
                                onClick={() => setInput("What are Newton's Laws of Motion?")}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all text-sm"
                            >
                                Ask Catalyzer
                            </button>
                            <button
                                onClick={() => setInput("Search for recent physics questions")}
                                className="px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-slate-800 dark:text-slate-300 rounded-full font-medium transition-all text-sm"
                            >
                                Search Questions
                            </button>
                        </motion.div>
                    </div>
                ) : (
                    /* MESSAGE LIST */
                    messages.map((msg, idx) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex w-full mb-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`
                                relative max-w-[85%] md:max-w-[75%] rounded-2xl p-5 text-[15px] leading-relaxed shadow-sm
                                ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-sm'
                                    : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm ml-12' // Added ml-12 for avatar space
                                }
                            `}>
                                {/* AI Icon/Avatar - Positioned Outside but safe */}
                                {msg.role === 'mentor' && (
                                    <div className="absolute -left-12 top-0 w-10 h-10 flex items-center justify-center">
                                        <div className="w-14 h-14"> {/* Slightly larger container for Lottie */}
                                            <LottieAnimation animationData={robotAnimation} loop={true} />
                                        </div>
                                    </div>
                                )}

                                {msg.role === 'mentor' ? (
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <LatexRenderer content={msg.content} />
                                    </div>
                                ) : (
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                )}

                                {msg.role === 'mentor' && (
                                    <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                                        {!msg.feedbackSubmitted ? (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        const newMessages = messages.map(m =>
                                                            m.id === msg.id ? { ...m, feedbackSubmitted: true, feedbackType: 'report' as const } : m
                                                        );
                                                        setMessages(newMessages);
                                                    }}
                                                    className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    Report Incorrect
                                                </button>
                                                <div className="flex-1"></div>
                                                <button
                                                    onClick={async () => {
                                                        const newMessages = messages.map(m =>
                                                            m.id === msg.id ? { ...m, feedbackSubmitted: true, feedbackType: 'positive' as const } : m
                                                        );
                                                        setMessages(newMessages);

                                                        // Mark Session as Resolved
                                                        if (sessionId) {
                                                            await supabase
                                                                .from('doubt_sessions')
                                                                .update({ status: 'resolved' })
                                                                .eq('id', sessionId);
                                                        }
                                                    }}
                                                    className="px-3 py-1 rounded-full border border-blue-200 text-blue-600 text-xs font-medium hover:bg-blue-50 transition-colors"
                                                >
                                                    Yes, Got it
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const newMessages = messages.map(m =>
                                                            m.id === msg.id ? { ...m, feedbackSubmitted: true, feedbackType: 'negative' as const } : m
                                                        );
                                                        setMessages(newMessages);

                                                        // Auto-send help request
                                                        handleSendFromClick("I need more help with this...");
                                                    }}
                                                    className="px-3 py-1 rounded-full border border-slate-200 text-slate-500 text-xs font-medium hover:bg-slate-50 transition-colors"
                                                >
                                                    No, I need help
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                                <span className="text-green-500">✓ Feedback Received</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}

                {/* CONTEXT SWITCH DECISION CARD */}
                {pendingContextSwitch && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="flex w-full mb-6 justify-start"
                    >
                        <div className="relative max-w-[85%] bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900 rounded-2xl p-5 shadow-lg ml-12">
                            <div className="absolute -left-12 top-0 w-10 h-10 flex items-center justify-center">
                                <div className="w-14 h-14">
                                    <LottieAnimation animationData={robotAnimation} loop={true} />
                                </div>
                            </div>

                            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">New Topic Detected? 🤔</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                This looks like a different question. To ensure higher accuracy, I&apos;ll start a new chat for this one. You can always access both chats from your history list.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={handleNewContext}
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-xl active:scale-95"
                                >
                                    Start new question
                                </button>
                                <button
                                    onClick={handleContinueContext}
                                    className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full font-semibold text-sm transition-all"
                                >
                                    Continue earlier question
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex items-center gap-3 ml-1 mb-6">
                        <div className="w-10 h-10 flex-shrink-0">
                            <LottieAnimation animationData={robotAnimation} loop={true} />
                        </div>
                        <div className="bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm">
                            <div className="w-8 h-8">
                                <LottieAnimation animationData={loadingAnimation} loop={true} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Suggested Lectures - Improved visibility */}
                {!loadingHistory && messages.length > 0 && messages[messages.length - 1].role === 'mentor' && suggestedLectures.length > 0 && (
                    <div className="ml-0 md:ml-12 mt-4 mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-5 h-5 text-blue-600 flex items-center justify-center bg-blue-50 rounded-full">
                                <BookOpen className="w-3 h-3" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Recommended Lectures</span>
                        </div>
                        {/* Show up to 2 suggestions */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {suggestedLectures.slice(0, 2).map((lecture, idx) => (
                                <Link key={idx} href={lecture.url} className="block group">
                                    <div className="h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between group-hover:scale-[1.01]">
                                        <div>
                                            <h4 className="font-semibold text-blue-600 dark:text-blue-400 text-sm line-clamp-2">{lecture.title}</h4>
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{lecture.subject} • {lecture.chapterTitle}</p>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">Video</span>
                                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Clean & Rounded */}
            <div className="p-6 pt-2 bg-white dark:bg-slate-900">
                <div className="max-w-4xl mx-auto relative flex items-center gap-2 bg-[#F8FAFC] dark:bg-slate-800/50 p-2 rounded-[24px] border border-transparent focus-within:border-blue-200 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all shadow-inner">
                    <button className="p-3 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-white inset-shadow-sm">
                        <ImageIcon className="w-5 h-5" />
                    </button>

                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={chatClosed ? "This session is closed." : "Type here..."}
                            disabled={chatClosed || isTyping}
                            className="w-full bg-transparent border-none focus:ring-0 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 py-2.5 text-[15px]"
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping || chatClosed}
                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                    >
                        {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div >
    );
}
