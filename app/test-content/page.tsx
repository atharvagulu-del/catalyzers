/**
 * Debug helper - Open http://localhost:3000/test-content in browser
 * to see what content is being fetched
 */

'use client';

import { useEffect, useState } from 'react';
import { lectureData } from '@/lib/lectureData';
import { getChapterResources } from '@/lib/contentManager';

export default function TestContentPage() {
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function test() {
            try {
                // Test fetching dynamic content
                const key = 'jee-mathematics-12';
                const subjectData = lectureData[key];

                if (!subjectData) {
                    setResults({ error: 'Subject data not found' });
                    setLoading(false);
                    return;
                }

                // Get first chapter
                const firstUnit = subjectData.units[0];
                const firstChapter = firstUnit?.chapters[0];

                if (!firstChapter) {
                    setResults({ error: 'No chapter found' });
                    setLoading(false);
                    return;
                }

                console.log('Testing with:', {
                    exam: 'JEE',
                    subject: subjectData.subject,
                    grade: subjectData.grade,
                    chapterId: firstChapter.id
                });

                // Fetch from database directly
                const dbResponse = await fetch(
                    `/api/admin/content?subject=${subjectData.subject}&grade=${subjectData.grade}&examType=JEE&chapterId=${firstChapter.id}&includeInactive=true`
                );
                const dbData = await dbResponse.json();

                //Fetch using contentManager
                const mergedResources = await getChapterResources(
                    'JEE',
                    subjectData.subject,
                    subjectData.grade,
                    firstChapter.id,
                    firstChapter.resources
                );

                setResults({
                    chapterInfo: {
                        id: firstChapter.id,
                        title: firstChapter.title,
                        staticResourcesCount: firstChapter.resources.length
                    },
                    databaseContent: dbData,
                    mergedResourcesCount: mergedResources.length,
                    staticResources: firstChapter.resources.map(r => ({
                        id: r.id,
                        title: r.title,
                        type: r.type,
                        url: r.url
                    })),
                    mergedResources: mergedResources.map(r => ({
                        id: r.id,
                        title: r.title,
                        type: r.type,
                        url: r.url
                    }))
                });
            } catch (error: any) {
                setResults({ error: error.message });
            } finally {
                setLoading(false);
            }
        }

        test();
    }, []);

    if (loading) {
        return <div className="p-8">Loading test...</div>;
    }

    return (
        <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Content Debug Test</h1>
            <pre className="bg-white dark:bg-gray-800 p-4 rounded-lg overflow-auto text-xs">
                {JSON.stringify(results, null, 2)}
            </pre>
        </div>
    );
}
