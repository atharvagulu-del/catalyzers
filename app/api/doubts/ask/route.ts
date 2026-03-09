import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getAllChaptersForAI, findRelatedLectures, type ChapterInfo } from '@/lib/lectureSearch';
import fs from 'fs';
import path from 'path';

// Credentials from environment (with fallbacks for development)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rnoxehthfxffirafloth.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJub3hlaHRoZnhmZmlyYWZsb3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMjEzNzQsImV4cCI6MjA4MzU5NzM3NH0.9HqDWUW6iYUL6tIkiY3PnJ1vYJobWEunoeMi1XQkV9A";

// Groq API Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

if (!GROQ_API_KEY) {
    console.error("Missing GROQ_API_KEY environment variable");
}

// Free tier rate limit
const DAILY_LIMIT = 50;

// Get all available chapters for AI to choose from
const ALL_CHAPTERS = getAllChaptersForAI();

// Helper function to call Groq API
async function callGroq(prompt: string, history: any[], skipContextCheck: boolean = false): Promise<{ text: string, isDifferentTopic: boolean } | null> {
    if (!GROQ_API_KEY) {
        throw new Error("Missing GROQ_API_KEY");
    }

    // Build system prompt based on whether we should check context
    const systemPrompt = skipContextCheck
        ? `You are "Catalyzers Assist", an academic mentor for JEE/NEET students.
RULES:
- Use LaTeX: inline $...$ and block $$...$$
- Be CONCISE - max 100-150 words
- Use bullet points, not long paragraphs
- Focus on the KEY formula or concept
- Skip unnecessary introductions
- Never mention being an AI
- Answer directly and helpfully`
        : `You are "Catalyzers Assist", an academic mentor for JEE/NEET students.

**CONTEXT CHECK:**
If the user switches topics (Physics↔Math↔Chemistry↔Biology), respond with exactly: [DIFF_TOPIC]
Do not answer. Just output [DIFF_TOPIC] and stop.

**IF SAME TOPIC:**
- Use LaTeX: inline $...$ and block $$...$$
- Be CONCISE - max 100-150 words
- Use bullet points
- Focus on KEY formulas/concepts
- No long introductions`;

    const messages = [
        { role: "system", content: systemPrompt },
        ...history.map((msg: any) => ({
            role: msg.role === 'mentor' ? 'assistant' : 'user',
            content: msg.content || ""
        })),
        { role: "user", content: prompt }
    ];

    try {
        console.log(`[Groq Chat] Calling llama-3.3-70b-versatile...`);
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: messages,
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`[Groq Chat] Error: ${response.status} - ${errText}`);
            return null;
        }

        const data = await response.json();
        const rawText = data.choices?.[0]?.message?.content;

        if (rawText) {
            console.log(`[Groq Chat] Success`);
            const isDifferentTopic = rawText.includes("[DIFF_TOPIC]");

            if (isDifferentTopic) {
                return {
                    text: "This looks like a different question. To ensure higher accuracy, I'll start a new chat for this one. You can always access both chats from your history list.",
                    isDifferentTopic: true
                };
            }

            return { text: rawText.trim(), isDifferentTopic: false };
        }
    } catch (err: any) {
        console.error(`[Groq Chat] Exception:`, err.message);
    }

    return null; // Signal failure
}

// AI-POWERED LECTURE FINDER - Asks AI to pick the best lecture
async function findLectureWithAI(userQuestion: string): Promise<ChapterInfo | null> {
    if (!GROQ_API_KEY) return null;

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

    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",  // Faster model for quick lookups
                messages: [{ role: "user", content: prompt }],
                max_tokens: 50,
                temperature: 0.1,
                response_format: { type: "json_object" }
            })
        });

        if (response.ok) {
            const data = await response.json();
            let answerRaw = data.choices?.[0]?.message?.content?.trim();

            if (answerRaw) {
                answerRaw = answerRaw.replace(/```json/g, '').replace(/```/g, '');
                try {
                    const parsed = JSON.parse(answerRaw);
                    const index = parsed.index;
                    if (index >= 0 && index < ALL_CHAPTERS.length) {
                        console.log(`[Groq Lecture Finder] Selected: ${ALL_CHAPTERS[index].title}`);
                        return ALL_CHAPTERS[index];
                    }
                } catch (e) {
                    // ignore parse error
                }
            }
        }
    } catch (err) {
        // ignore exception
    }
    // All AI attempts failed -> return null so keyword search takes over
    console.log("[Groq Lecture Finder] AI lookup failed. Falling back to keyword search.");
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
            callGroq(message, history || [], skipContextCheck === true),
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
