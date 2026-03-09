import { NextRequest, NextResponse } from 'next/server';

// Groq API Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

if (!GROQ_API_KEY) {
    console.error('GROQ_API_KEY is not set');
}

// Helper function to fix LaTeX backslashes that were corrupted by JSON parsing
function fixLatexBackslashes(text: string): string {
    // JSON escape sequences like \f, \n, \t, \r, \b get converted to actual control characters
    // We need to convert them back to their LaTeX forms
    // Form-feed \f (ASCII 12) -> should be \f for \frac
    // Backspace \b (ASCII 8) -> should be \b for \beta, \bar, etc.
    // Tab \t (ASCII 9) -> should be \t for \theta, \times, etc.
    // Newline \n (ASCII 10) -> should be \n for \neq, \nu, etc.
    // Carriage return \r (ASCII 13) -> should be \r for \rho, \rightarrow, etc.
    return text
        .replace(/\f/g, '\\f')  // Form-feed -> \f (for \frac)
        .replace(/\x08/g, '\\b')  // Backspace -> \b (for \beta)
        .replace(/\t/g, '\\t')  // Tab -> \t (for \theta)
        .replace(/\n/g, '\\n')  // Newline -> \n (for \neq) - but be careful with actual newlines
        .replace(/\r/g, '\\r');  // Carriage return -> \r (for \rho)
}

// Robust JSON extraction function
function extractJSON(text: string): unknown[] | null {
    // Remove markdown code blocks
    let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '');

    // CRITICAL FIX: Escape backslashes BEFORE JSON parsing to preserve LaTeX commands
    // JSON escape sequences like \f, \n, \t, \r, \b will corrupt LaTeX commands
    // We need to convert single backslashes to double backslashes before parsing
    // But we must not double-escape already escaped ones (\\)
    const PLACEHOLDER = '\u0000DOUBLE_BACKSLASH\u0000';
    cleaned = cleaned
        .replace(/\\\\/g, PLACEHOLDER)  // Save already escaped \\
        .replace(/\\([^"\\])/g, '\\\\$1')  // Escape single backslashes (but not \" or \\)
        .replace(new RegExp(PLACEHOLDER, 'g'), '\\\\');  // Restore \\

    // Try to find JSON array
    const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
    if (!arrayMatch) return null;

    let jsonText = arrayMatch[0];

    // Fix common issues
    // 1. Remove trailing commas
    jsonText = jsonText.replace(/,\s*([}\]])/g, '$1');

    // 2. Remove control characters (they shouldn't be in the text at this point)
    jsonText = jsonText.replace(/[\x00-\x1F\x7F]/g, '');

    try {
        const parsed = JSON.parse(jsonText);
        // Post-process to fix any remaining LaTeX issues
        if (Array.isArray(parsed)) {
            return parsed.map((card: any) => ({
                ...card,
                question: card.question ? fixLatexBackslashes(card.question) : card.question,
                hint: card.hint ? fixLatexBackslashes(card.hint) : card.hint,
                answer: card.answer ? fixLatexBackslashes(card.answer) : card.answer
            }));
        }
        return parsed;
    } catch (e1) {
        console.log('First parse attempt failed, trying relaxed parse...');

        // Second attempt: more aggressive cleaning
        try {
            // Replace all newlines
            jsonText = jsonText.replace(/\r?\n/g, ' ');
            // Collapse multiple spaces
            jsonText = jsonText.replace(/\s+/g, ' ');
            const parsed = JSON.parse(jsonText);
            // Post-process to fix LaTeX
            if (Array.isArray(parsed)) {
                return parsed.map((card: any) => ({
                    ...card,
                    question: card.question ? fixLatexBackslashes(card.question) : card.question,
                    hint: card.hint ? fixLatexBackslashes(card.hint) : card.hint,
                    answer: card.answer ? fixLatexBackslashes(card.answer) : card.answer
                }));
            }
            return parsed;
        } catch (e2) {
            console.log('Second parse attempt failed, trying line-by-line extraction...');

            // Third attempt: extract cards one by one
            try {
                const cardMatches = cleaned.matchAll(/\{[^{}]*"question"[^{}]*"answer"[^{}]*\}/g);
                const cards: unknown[] = [];
                for (const match of cardMatches) {
                    try {
                        const card = JSON.parse(match[0].replace(/\r?\n/g, ' '));
                        if (card.question && card.answer) {
                            // Fix LaTeX in extracted cards
                            cards.push({
                                ...card,
                                question: fixLatexBackslashes(card.question),
                                hint: card.hint ? fixLatexBackslashes(card.hint) : card.hint,
                                answer: fixLatexBackslashes(card.answer)
                            });
                        }
                    } catch {
                        // Skip malformed card
                    }
                }
                if (cards.length > 0) return cards;
            } catch {
                // Continue to return null
            }

            return null;
        }
    }
}

export async function POST(request: NextRequest) {
    try {
        if (!GROQ_API_KEY) {
            return NextResponse.json(
                { error: 'AI service not configured. Please set GROQ_API_KEY.' },
                { status: 500 }
            );
        }

        const { subject, topic, count = 10 } = await request.json();

        if (!subject || !topic) {
            return NextResponse.json(
                { error: 'Subject and topic are required' },
                { status: 400 }
            );
        }

        const prompt = `Generate ${count} JEE/NEET flashcards for "${topic}" in ${subject}.

IMPORTANT: Return ONLY a JSON array. No explanations, no markdown.

Format each card as:
{"question": "...", "hint": "..." or null, "answer": "..."}

Use $...$ for math formulas.

Return ONLY the JSON array starting with [ and ending with ]`;

        console.log(`[Flashcards] Calling Groq llama-3.3-70b-versatile...`);

        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 2000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`[Flashcards] Groq Error: ${response.status} - ${errText}`);
            return NextResponse.json(
                { error: 'Failed to generate flashcards. Please try again.' },
                { status: 500 }
            );
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim();

        if (!text) {
            return NextResponse.json(
                { error: 'Empty response from AI' },
                { status: 500 }
            );
        }

        console.log(`[Flashcards] Success with Groq`);

        // Parse and validate the response
        const cards = extractJSON(text);

        if (!cards || !Array.isArray(cards)) {
            console.error('[Flashcards] Failed to parse AI response');
            return NextResponse.json(
                { error: 'Failed to parse AI response' },
                { status: 500 }
            );
        }

        // Validate each card has required fields
        const validCards = cards.filter((card: any) =>
            card &&
            typeof card.question === 'string' &&
            typeof card.answer === 'string'
        );

        if (validCards.length === 0) {
            return NextResponse.json(
                { error: 'No valid flashcards generated' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            cards: validCards,
            count: validCards.length
        });

    } catch (error: any) {
        console.error('[Flashcards] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
