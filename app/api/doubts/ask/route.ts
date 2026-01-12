import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getAllChaptersForAI, findRelatedLectures, type ChapterInfo } from '@/lib/lectureSearch';
import fs from 'fs';
import path from 'path';

// Credentials from lib/supabase.ts
const supabaseUrl = "https://rnoxehthfxffirafloth.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJub3hlaHRoZnhmZmlyYWZsb3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMjEzNzQsImV4cCI6MjA4MzU5NzM3NH0.9HqDWUW6iYUL6tIkiY3PnJ1vYJobWEunoeMi1XQkV9A";

// Google Gemini API Key - Must be set in Environment Variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Free tier rate limit
const DAILY_LIMIT = 50;

// Get all available chapters for AI to choose from
const ALL_CHAPTERS = getAllChaptersForAI();

// Helper function to call Gemini API
async function callGemini(prompt: string, history: any[], skipContextCheck: boolean = false): Promise<{ text: string, isDifferentTopic: boolean } | null> {
    if (!GEMINI_API_KEY) {
        throw new Error("Missing GEMINI_API_KEY");
    }

    // Build system prompt based on whether we should check context
    const systemPrompt = skipContextCheck
        ? `System: You are "Catalyzer Assist", a friendly academic mentor for JEE/NEET students.
RULES:
- Use LaTeX for math: inline $...$ and block $$...$$
- Use numbered lists for steps
- Use bullet points for key concepts
- DO NOT use markdown tables
- Keep responses concise (under 300 words)
- Be encouraging and exam-focused
- Never mention being an AI
- Answer the user's question directly without checking if it's a new topic.`
        : `System: You are "Catalyzer Assist", a friendly academic mentor for JEE/NEET students.

**MANDATORY CONTEXT CHECK - DO THIS FIRST:**
Look at the conversation history and the NEW question. Detect topic switches between:
- Different SUBJECTS: Physics ↔ Chemistry ↔ Mathematics ↔ Biology
- Different CHAPTERS within a subject: Mechanics ↔ Thermodynamics, Organic ↔ Inorganic, Trigonometry ↔ Calculus

**IF you detect a topic switch:**
1. Start your response with EXACTLY: [DIFF_TOPIC]
2. Then add a brief note like "Switching to Chemistry."
3. DO NOT answer the question at all. Just output [DIFF_TOPIC] and stop.

**Examples of topic switches that MUST trigger [DIFF_TOPIC]:**
- "Newton's laws" → "equation of straight line" (Physics → Math)
- "inertia" → "trigonometric functions" (Physics → Math)
- "straight line" → "mole concept" (Math → Chemistry)
- "photosynthesis" → "Newton's law" (Biology → Physics)

**IF the question is about the SAME topic as history, answer normally with:**
- LaTeX for math: inline $...$ and block $$...$$
- Numbered lists for steps
- Bullet points for key concepts
- Concise responses (under 300 words)
- Encouraging, exam-focused tone`;

    const messages = [
        {
            role: "user",
            parts: [{ text: systemPrompt }]
        },
        ...history.map((msg: any) => ({
            role: msg.role === 'mentor' ? 'model' : 'user',
            parts: [{ text: msg.content || "" }]
        })),
        { role: "user", parts: [{ text: prompt }] }
    ];

    // FREE TIER MODELS ONLY
    // Models from User's Access List
    const configurations = [
        { model: "gemini-2.0-flash", version: "v1beta" },
        { model: "gemini-2.0-flash-lite", version: "v1beta" },
        { model: "gemini-2.5-flash", version: "v1beta" },
        { model: "gemini-2.5-pro", version: "v1beta" }
    ];

    for (const config of configurations) {
        try {
            console.log(`[Gemini Chat] Trying ${config.model} (${config.version})...`);
            const response = await fetch(`https://generativelanguage.googleapis.com/${config.version}/models/${config.model}:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: messages })
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error(`[Gemini Chat] ${config.model} Error: ${response.status} - ${errText}`);
                if (config === configurations[configurations.length - 1]) return null;
                continue;
            }

            const data = await response.json();
            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (rawText) {
                console.log(`[Gemini Chat] Success with ${config.model}`);
                const isDifferentTopic = rawText.includes("[DIFF_TOPIC]");

                if (isDifferentTopic) {
                    // Return a fixed prompt message, NOT the AI's answer
                    return {
                        text: "This looks like a different question. To ensure higher accuracy, I'll start a new chat for this one. You can always access both chats from your history list.",
                        isDifferentTopic: true
                    };
                }

                return { text: rawText.trim(), isDifferentTopic: false };
            }
        } catch (err: any) {
            console.error(`[Gemini Chat] Exception on ${config.model}:`, err.message);
        }
    }

    return null; // Signal failure
}

// AI-POWERED LECTURE FINDER - Asks AI to pick the best lecture
async function findLectureWithAI(userQuestion: string): Promise<ChapterInfo | null> {
    if (!GEMINI_API_KEY) return null;

    // Create a compact list of chapters for AI to choose from
    const chapterList = ALL_CHAPTERS.map((ch, i) =>
        `${i}. ${ch.subject}: ${ch.unitTitle} > ${ch.title} [Topics: ${ch.description}]`
    ).join('\n');

    const prompt = `You are an expert JEE/NEET academic tutor matching student questions to the perfect lecture.

Student Question: "${userQuestion}"

Available Lectures (format: Index. Subject: Unit > Chapter [Keywords]):
${chapterList}

MATCHING RULES:
1. Look at the KEYWORDS in brackets - if ANY keyword matches the student's question, prefer that lecture
2. Handle typos: "pully" → "pulley", "projectal" → "projectile", "newtons" → "newton"
3. Match concepts to physics/chemistry topics:
   - "pulley", "rope", "string tension" → Constraint Motion & Pulleys
   - "fall", "drop", "gravity" → Motion Under Gravity OR Gravitation
   - "force", "newton", "F=ma" → Newton's Laws
   - "friction", "rough surface" → Friction
   - "mole", "molarity", "concentration" → Mole Concept / Concentration Terms
   - "balance equation", "redox" → Balancing Redox
4. If multiple matches, prefer the one with MORE matching keywords
5. If truly irrelevant (e.g. "best restaurants"), return index -1

Reply with ONLY: { "index": NUMBER }
No markdown, no explanation, just the JSON object.`;

    // FREE TIER MODELS ONLY
    const configurations = [
        { model: "gemini-2.0-flash-lite", version: "v1beta" },  // UNLIMITED
        { model: "gemini-2.5-flash-lite", version: "v1beta" },  // UNLIMITED
        { model: "gemini-2.0-flash", version: "v1beta" }        // 4K req/min
    ];

    for (const config of configurations) {
        try {
            // Silently try models for lecture finding
            const response = await fetch(`https://generativelanguage.googleapis.com/${config.version}/models/${config.model}:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json" } // Force JSON mode
                })
            });

            if (response.ok) {
                const data = await response.json();
                let answerRaw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

                if (answerRaw) {
                    answerRaw = answerRaw.replace(/```json/g, '').replace(/```/g, '');
                    try {
                        const parsed = JSON.parse(answerRaw);
                        const index = parsed.index;
                        if (index >= 0 && index < ALL_CHAPTERS.length) {
                            console.log(`[Gemini Lecture Finder] Selected: ${ALL_CHAPTERS[index].title}`);
                            return ALL_CHAPTERS[index];
                        }
                    } catch (e) {
                        // ignore parse error
                    }
                }
                // If invalid answer, try next
                continue;
            } else {
                // Ignore 404/400 errors for lecture finder to ensure silent fallback
            }
        } catch (err) {
            // ignore exception
        }
    }
    // All AI attempts failed -> return null so keyword search takes over
    console.log("[Gemini Lecture Finder] All AI models failed. Falling back to keyword search.");
    return null;
}

export async function POST(req: Request) {
    try {
        const cookieStore = cookies();
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    get(name: string) { return cookieStore.get(name)?.value },
                    set() { },
                    remove() { },
                },
                global: {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                }
            }
        );

        // 1. Authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // 2. Body
        const { message, sessionId: clientSessionId, history, skipContextCheck } = await req.json();
        if (!message?.trim()) {
            return NextResponse.json({ error: "Message required" }, { status: 400 });
        }

        // 3. Rate Limit
        const today = new Date().toISOString().split('T')[0];
        const { data: limits } = await supabase
            .from('user_doubt_limits')
            .select('*')
            .eq('user_id', user.id)
            .single();

        let currentCount = 0;
        if (limits) {
            if (limits.last_reset_date !== today) {
                await supabase.from('user_doubt_limits')
                    .update({ daily_count: 1, last_reset_date: today })
                    .eq('user_id', user.id);
                currentCount = 1;
            } else {
                if (limits.daily_count >= DAILY_LIMIT) {
                    return NextResponse.json({ error: `Daily limit (${DAILY_LIMIT}) reached` }, { status: 429 });
                }
                await supabase.from('user_doubt_limits')
                    .update({ daily_count: limits.daily_count + 1 })
                    .eq('user_id', user.id);
                currentCount = limits.daily_count + 1;
            }
        } else {
            await supabase.from('user_doubt_limits').insert({
                user_id: user.id,
                daily_count: 1,
                last_reset_date: today
            });
            currentCount = 1;
        }

        // 4. Session
        let sessionId = clientSessionId;
        if (!sessionId) {
            const { data: newSession, error: sessError } = await supabase.from('doubt_sessions').insert({
                user_id: user.id,
                title: message.substring(0, 50),
                status: 'open'
            }).select('id').single();

            if (sessError) {
                console.error('[Session Error]', sessError);
                return NextResponse.json({ error: `Session creation failed: ${sessError.message}` }, { status: 500 });
            }
            if (!newSession) {
                return NextResponse.json({ error: "Session creation failed: No data returned" }, { status: 500 });
            }
            sessionId = newSession.id;
        }

        // Save User Message
        await supabase.from('doubt_messages').insert({
            session_id: sessionId,
            role: 'user',
            content: message
        });

        // 5. AI Response + Lecture Search
        const [aiResult, aiLecture] = await Promise.all([
            callGemini(message, history || [], skipContextCheck === true),
            findLectureWithAI(message)
        ]);

        const isDifferentTopic = aiResult?.isDifferentTopic || false;
        let finalResponse = aiResult?.text;

        // Determine final lecture suggestion
        let suggestedLectures: any[] = [];

        if (aiLecture) {
            console.log(`[API] AI found lecture: ${aiLecture.title}`);
            suggestedLectures = [{
                title: aiLecture.title,
                chapterTitle: aiLecture.unitTitle,
                subject: aiLecture.subject,
                url: aiLecture.url
            }];
        } else {
            console.log('[API] AI found no lecture, falling back to keyword search');
            suggestedLectures = findRelatedLectures(message);
        }

        // SMART FALLBACK
        if (!finalResponse) {
            console.warn('[API] AI Chat returned null. Applying Smart Fallback.');
            if (suggestedLectures.length > 0) {
                const lectureTitle = suggestedLectures[0].title;
                const isPhysics = suggestedLectures[0].subject?.toLowerCase()?.includes('physics');
                const emoji = isPhysics ? '🍎' : '🧪';
                finalResponse = `I'm having a bit of trouble connecting to my brain right now, but I found the perfect resource for you!\n\n${emoji} **${lectureTitle}** covers exactly what you're asking about.\n\nCheck it out below! 👇`;
            } else {
                finalResponse = "I apologize, but I'm having trouble connecting right now. Please try asking with specific topic keywords like 'Thermodynamics' or 'Vectors'.";
            }
        }

        // If it IS a different topic, we DO NOT save the mentor message yet?
        // User screenshot shows the bot ASKS "Start new question?".
        // This means we return a special response.
        // Actually, we should probably return the "Diff Topic" signal and let frontend handle it.
        // BUT if we save the message now, it will appear in chat.
        // Decision: If it's a topic switch, we still return the answer but flag it.
        // Frontend will choose whether to SHOW the answer or the "Decision Card".
        // If user clicks "New Chat", frontend discards this answer and starts fresh.
        // If user clicks "Continue", frontend reveals this answer.
        // So we SHOULD save it? If we save it, a reload shows it.
        // Better: Don't save if it's a context switch?
        // No, save it. Frontend can hide it.

        await supabase.from('doubt_messages').insert({
            session_id: sessionId,
            role: 'mentor',
            content: finalResponse
        });

        return NextResponse.json({
            reply: finalResponse,
            sessionId,
            suggestedLectures,
            isFirstResponse: history?.length === 0 || !history,
            isDifferentTopic // Send flag to frontend
        });

    } catch (error: any) {
        console.error('General API Error:', error);
        return NextResponse.json({ error: `Internal Error: ${error.message}` }, { status: 500 });
    }
}
