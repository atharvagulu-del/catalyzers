import { NextRequest, NextResponse } from "next/server";
import { getAllChaptersForAI, ChapterInfo } from "@/lib/lectureSearch";

// Groq API Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

if (!GROQ_API_KEY) {
    console.error("Missing GROQ_API_KEY environment variable");
}

// Get all available lectures for AI to suggest
const ALL_CHAPTERS = getAllChaptersForAI();

export async function POST(req: NextRequest) {
    try {
        const { subject, chapter, prompt, keyConcepts, explanation, studentName } = await req.json();

        if (!explanation || explanation.trim().length < 10) {
            return NextResponse.json(
                { error: "Explanation too short" },
                { status: 400 }
            );
        }

        const name = studentName || "there";

        // Filter chapters relevant to the subject
        const relevantChapters = ALL_CHAPTERS.filter(ch =>
            ch.subject.toLowerCase().includes(subject.toLowerCase())
        ).slice(0, 30);

        // Create compact lecture list for AI
        const lectureList = relevantChapters.map((ch, i) =>
            `${i}. ${ch.title} (${ch.unitTitle})`
        ).join('\n');

        // Build a detailed prompt with VERY STRICT lecture suggestion rules
        const systemPrompt = `You are an expert ${subject} teacher giving personal feedback to a student named ${name}.

${name} was asked to explain: "${prompt}"

Key concepts: ${keyConcepts?.join(", ") || "general understanding"}

${name}'s answer:
"""
${explanation}
"""

FEEDBACK RULES:
1. Speak to ${name} using "you" 
2. Be encouraging and reference their exact words
3. Be specific about any gaps

⚠️ CRITICAL LECTURE RULE - READ THIS CAREFULLY:

needsLecture = FALSE if ${name}:
- Understood the CORE CONCEPT (even if details are missing)
- Got the main idea right
- Just needs minor clarification or examples
- Explained it in different but correct words

needsLecture = TRUE ONLY if ${name}:
- Got the concept COMPLETELY WRONG
- Showed they have NO understanding of basics
- Said something factually incorrect about the fundamentals

If ${name}'s explanation shows they understood the main idea, YOU MUST set needsLecture to false.

Missing details or examples is NOT a reason to suggest a lecture.
Incomplete explanation is NOT a reason to suggest a lecture.
Only FUNDAMENTAL MISUNDERSTANDING is a reason to suggest a lecture.

Lectures:
${lectureList}

JSON response:
{
  "correct": "What ${name} got right",
  "missing": "What to improve (minor gaps only if they understood the core)",
  "needsLecture": false,
  "nextSteps": {
    "text": "A quick tip",
    "lectureIndex": null
  }
}

REMEMBER: If "correct" shows they understood, needsLecture MUST be false.`;

        if (!GROQ_API_KEY) {
            return NextResponse.json(
                { error: "AI service not configured" },
                { status: 500 }
            );
        }

        try {
            console.log(`[Explain It] Calling Groq llama-3.3-70b-versatile...`);

            const response = await fetch(GROQ_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "user", content: systemPrompt }],
                    max_tokens: 1000,
                    temperature: 0.7,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error(`[Explain It] Groq Error: ${response.status} - ${errText}`);
                return NextResponse.json(
                    { error: "Failed to analyze. Please try again." },
                    { status: 500 }
                );
            }

            const data = await response.json();
            let rawText = data.choices?.[0]?.message?.content?.trim();

            if (rawText) {
                console.log(`[Explain It] Success with Groq`);

                // Clean up response
                rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

                try {
                    const aiResponse = JSON.parse(rawText);

                    // Build final response
                    const feedback = {
                        correct: aiResponse.correct,
                        missing: aiResponse.missing,
                        nextSteps: {
                            text: aiResponse.nextSteps?.text || "Keep practicing!",
                            lectureSlug: null as string | null,
                            lectureTitle: null as string | null
                        }
                    };

                    // Add lecture suggestion if AI recommends one
                    if (aiResponse.needsLecture === true && aiResponse.nextSteps?.lectureIndex !== null && aiResponse.nextSteps?.lectureIndex !== undefined) {
                        const lectureIndex = parseInt(aiResponse.nextSteps.lectureIndex);
                        if (lectureIndex >= 0 && lectureIndex < relevantChapters.length) {
                            const lecture = relevantChapters[lectureIndex];
                            feedback.nextSteps.lectureSlug = lecture.url;
                            feedback.nextSteps.lectureTitle = lecture.title;
                            console.log(`[Explain It] Suggesting lecture: ${lecture.title}`);
                        }
                    }

                    // Validate response structure
                    if (feedback.correct && feedback.missing && feedback.nextSteps) {
                        return NextResponse.json(feedback);
                    }
                } catch (parseErr) {
                    console.error(`[Explain It] Parse error:`, parseErr);
                }
            }
        } catch (err: any) {
            console.error(`[Explain It] Exception:`, err.message);
        }

        // API call failed - return error
        console.error("[Explain It] Groq call failed");
        return NextResponse.json(
            { error: "Failed to analyze. Please try again." },
            { status: 500 }
        );
    } catch (error: any) {
        console.error("Explain It API error:", error);
        return NextResponse.json(
            { error: "Internal error. Please try again." },
            { status: 500 }
        );
    }
}
