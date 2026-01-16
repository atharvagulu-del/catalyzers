import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Robust JSON extraction function
function extractJSON(text: string): unknown[] | null {
    // Remove markdown code blocks
    let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '');

    // Try to find JSON array
    const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
    if (!arrayMatch) return null;

    let jsonText = arrayMatch[0];

    // Fix common issues
    // 1. Remove trailing commas
    jsonText = jsonText.replace(/,\s*([}\]])/g, '$1');

    // 2. Fix unescaped newlines in strings
    jsonText = jsonText.replace(/:\s*"([^"]*)\n([^"]*)"/g, (match, p1, p2) => {
        return `: "${p1}\\n${p2}"`;
    });

    // 3. Remove control characters
    jsonText = jsonText.replace(/[\x00-\x1F\x7F]/g, (char) => {
        if (char === '\n' || char === '\r' || char === '\t') return '';
        return '';
    });

    // 4. Fix broken escape sequences
    jsonText = jsonText.replace(/\\([^"\\\/bfnrtu])/g, '\\\\$1');

    try {
        return JSON.parse(jsonText);
    } catch (e1) {
        console.log('First parse attempt failed, trying relaxed parse...');

        // Second attempt: more aggressive cleaning
        try {
            // Replace all newlines
            jsonText = jsonText.replace(/\r?\n/g, ' ');
            // Collapse multiple spaces
            jsonText = jsonText.replace(/\s+/g, ' ');
            return JSON.parse(jsonText);
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
                            cards.push(card);
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
        if (!genAI) {
            return NextResponse.json(
                { error: 'AI service not configured. Please set GEMINI_API_KEY.' },
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

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `Generate ${count} JEE/NEET flashcards for "${topic}" in ${subject}.

IMPORTANT: Return ONLY a JSON array. No explanations, no markdown.

Format each card as:
{"question": "...", "hint": "..." or null, "answer": "..."}

Use $...$ for math formulas.

Return ONLY the JSON array starting with [ and ending with ]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('Gemini raw response (first 300 chars):', text.substring(0, 300));

        // Extract and parse JSON
        let cards = extractJSON(text);

        if (!cards || !Array.isArray(cards) || cards.length === 0) {
            console.error('Failed to extract cards from:', text.substring(0, 500));
            return NextResponse.json(
                { error: 'Could not generate flashcards for this topic. Please try a different topic.' },
                { status: 500 }
            );
        }

        // Normalize and validate cards
        let normalizedCards = cards
            .filter((card: unknown): card is { question?: string; answer?: string; hint?: string } =>
                typeof card === 'object' && card !== null
            )
            .map(card => ({
                question: String(card.question || 'Question not available'),
                hint: card.hint ? String(card.hint) : null,
                answer: String(card.answer || 'Answer not available')
            }))
            .filter(card => card.question !== 'Question not available' && card.answer !== 'Answer not available');

        // If we got fewer than requested and fewer than 5, try to generate more
        const minCards = Math.max(5, count);
        if (normalizedCards.length < minCards) {
            console.log(`Only got ${normalizedCards.length} cards, trying to generate more...`);

            const morePrompt = `Generate ${minCards - normalizedCards.length} MORE JEE/NEET flashcards for "${topic}" in ${subject}.
Return ONLY a JSON array like: [{"question": "...", "hint": "..." or null, "answer": "..."}]
Use $...$ for formulas. Make these DIFFERENT from: ${normalizedCards.slice(0, 3).map(c => c.question.substring(0, 30)).join(', ')}`;

            try {
                const moreResult = await model.generateContent(morePrompt);
                const moreText = moreResult.response.text();
                const moreCards = extractJSON(moreText);

                if (moreCards && Array.isArray(moreCards)) {
                    const moreNormalized = moreCards
                        .filter((card: unknown): card is { question?: string; answer?: string; hint?: string } =>
                            typeof card === 'object' && card !== null
                        )
                        .map(card => ({
                            question: String(card.question || ''),
                            hint: card.hint ? String(card.hint) : null,
                            answer: String(card.answer || '')
                        }))
                        .filter(card => card.question && card.answer);

                    normalizedCards = [...normalizedCards, ...moreNormalized].slice(0, minCards);
                }
            } catch (e) {
                console.log('Failed to generate more cards:', e);
            }
        }

        if (normalizedCards.length === 0) {
            return NextResponse.json(
                { error: 'No valid flashcards were generated. Please try again.' },
                { status: 500 }
            );
        }

        console.log(`Successfully generated ${normalizedCards.length} flashcards for ${topic}`);

        return NextResponse.json({ cards: normalizedCards });
    } catch (error) {
        console.error('Flashcard generation error:', error);
        return NextResponse.json(
            { error: 'An error occurred while generating flashcards. Please try again.' },
            { status: 500 }
        );
    }
}
