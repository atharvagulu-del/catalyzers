import { NextRequest, NextResponse } from 'next/server';
import { getLecturesForChapters, getChaptersForTest, Chapter, Resource } from '@/lib/lectureData';

// Groq API Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

interface RecommendationRequest {
    testId: string;
    score: number;
    maxMarks: number;
    subject: string;
    chapters: string[];
    examType: 'JEE' | 'NEET';
    grade: '11' | '12' | 'Dropper';
}

interface RecommendationResponse {
    recommendations: {
        chapterTitle: string;
        reason: string;
        resources: {
            title: string;
            type: 'video' | 'quiz' | 'pyq';
            id: string;
        }[];
    }[];
}

export async function POST(request: NextRequest) {
    try {
        const body: RecommendationRequest = await request.json();
        const { score, maxMarks, subject, chapters, examType, grade } = body;

        const percentage = Math.round((score / maxMarks) * 100);

        // Get available lectures for the subject/grade
        let availableChapters: { chapterTitle: string; resources: Resource[] }[] = [];

        if (chapters && chapters.length > 0) {
            // Use specific chapters from the test
            availableChapters = getLecturesForChapters(examType, subject, grade, chapters);
        } else {
            // Fallback: get all chapters for the subject
            const allUnits = getChaptersForTest(examType, subject, grade);
            availableChapters = allUnits.flatMap(unit =>
                unit.chapters.map(ch => ({
                    chapterTitle: ch.title,
                    resources: ch.resources
                }))
            ).slice(0, 5); // Limit to 5 chapters
        }

        // If no chapters available, return empty recommendations
        if (availableChapters.length === 0) {
            return NextResponse.json({
                recommendations: []
            });
        }

        // Build context for AI
        const chaptersContext = availableChapters.map(ch => ({
            title: ch.chapterTitle,
            resources: ch.resources.map(r => ({
                title: r.title,
                type: r.type,
                id: r.id
            }))
        }));

        // Determine performance level for better prompting
        let performanceLevel = 'average';
        if (percentage >= 80) performanceLevel = 'excellent';
        else if (percentage >= 60) performanceLevel = 'good';
        else if (percentage < 40) performanceLevel = 'needs improvement';

        const prompt = `You are an educational AI assistant helping a ${examType} aspirant (Class ${grade}).

The student just took a test in ${subject} and scored ${score}/${maxMarks} (${percentage}%).
Performance Level: ${performanceLevel}

Based on this performance, recommend lectures from our library to help them improve.

Available Chapters and Resources:
${JSON.stringify(chaptersContext, null, 2)}

Instructions:
1. Select 2-3 chapters that would be most beneficial for this student
2. For each chapter, pick 1-2 resources (prefer a mix of video and quiz/pyq)
3. Provide a brief, encouraging reason why this chapter/resource will help them

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
    "recommendations": [
        {
            "chapterTitle": "Chapter Name",
            "reason": "Brief encouraging reason why this will help",
            "resources": [
                { "title": "Resource Title", "type": "video", "id": "resource-id" },
                { "title": "Resource Title", "type": "quiz", "id": "resource-id" }
            ]
        }
    ]
}`;

        try {
            if (!GROQ_API_KEY) {
                throw new Error("GROQ_API_KEY not set");
            }

            console.log('[Test Recommendations] Calling Groq llama-3.3-70b-versatile...');

            const response = await fetch(GROQ_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 1000,
                    temperature: 0.7,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                throw new Error(`Groq API error: ${response.status}`);
            }

            const data = await response.json();
            const responseText = data.choices?.[0]?.message?.content?.trim();

            // Parse the response
            let recommendations: RecommendationResponse['recommendations'] = [];

            try {
                // Try to extract JSON from the response
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    recommendations = parsed.recommendations || [];
                }
            } catch (parseError) {
                console.error('Failed to parse Groq response:', parseError);
                // Fallback: generate simple recommendations
                recommendations = generateFallbackRecommendations(availableChapters, percentage);
            }

            return NextResponse.json({ recommendations });

        } catch (aiError) {
            console.error('Groq API error:', aiError);
            // Fallback recommendations if AI fails
            const fallbackRecs = generateFallbackRecommendations(availableChapters, percentage);
            return NextResponse.json({ recommendations: fallbackRecs });
        }

    } catch (error) {
        console.error('Error in test-recommendations API:', error);
        return NextResponse.json(
            { error: 'Failed to generate recommendations' },
            { status: 500 }
        );
    }
}

// Fallback if Groq fails
function generateFallbackRecommendations(
    chapters: { chapterTitle: string; resources: Resource[] }[],
    percentage: number
): RecommendationResponse['recommendations'] {
    // Take first 2-3 chapters
    const selectedChapters = chapters.slice(0, Math.min(3, chapters.length));

    return selectedChapters.map(ch => {
        // Get a mix of video and quiz/pyq
        const videos = ch.resources.filter(r => r.type === 'video').slice(0, 1);
        const quizzes = ch.resources.filter(r => r.type === 'quiz' || r.type === 'pyq').slice(0, 1);
        const selectedResources = [...videos, ...quizzes];

        let reason = '';
        if (percentage < 40) {
            reason = `Review the fundamentals of ${ch.chapterTitle} to build a stronger foundation.`;
        } else if (percentage < 60) {
            reason = `Practice more problems in ${ch.chapterTitle} to improve your score.`;
        } else if (percentage < 80) {
            reason = `Master advanced concepts in ${ch.chapterTitle} to reach excellence.`;
        } else {
            reason = `Challenge yourself with advanced problems in ${ch.chapterTitle}.`;
        }

        return {
            chapterTitle: ch.chapterTitle,
            reason,
            resources: selectedResources.map(r => ({
                title: r.title,
                type: r.type as 'video' | 'quiz' | 'pyq',
                id: r.id
            }))
        };
    });
}
