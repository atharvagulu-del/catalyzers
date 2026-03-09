import { supabase } from './supabase';
import { Resource, Chapter } from './lectureData';

export interface DynamicContent {
    id: string;
    resource_id: string;
    chapter_id: string;
    subject: string;
    grade: string;
    exam_type: string;
    content_type: 'video' | 'quiz' | 'pyq' | 'article';
    title: string;
    youtube_url?: string;
    youtube_id?: string;
    duration?: string;
    questions?: any[];
    sort_order: number;
    is_active: boolean;
}

/**
 * Fetch dynamic content for a specific chapter
 */
export async function getDynamicContentForChapter(
    examType: string,
    subject: string,
    grade: string,
    chapterId: string
): Promise<DynamicContent[]> {
    try {
        console.log('Fetching dynamic content with params:', {
            examType,
            subject,
            grade,
            chapterId
        });

        const { data, error } = await supabase
            .from('chapter_content')
            .select('*')
            .eq('exam_type', examType)
            .eq('subject', subject)
            .eq('grade', grade)
            .eq('chapter_id', chapterId)
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) {
            console.error('Error fetching dynamic content:', error);
            return [];
        }

        console.log('Fetched dynamic content:', data);
        return data || [];
    } catch (err) {
        console.error('Error in getDynamicContentForChapter:', err);
        return [];
    }
}

/**
 * Merge dynamic content into chapter resources
 * This replaces placeholder resources with real uploaded content
 */
export function mergeChapterContent(
    staticResources: Resource[],
    dynamicContent: DynamicContent[]
): Resource[] {
    // Create a map of resource IDs to dynamic content
    const dynamicMap = new Map<string, DynamicContent>();
    dynamicContent.forEach(dc => {
        if (dc.resource_id) {
            dynamicMap.set(dc.resource_id, dc);
        }
    });

    // Merge: Replace static resources with dynamic ones if they exist
    const mergedResources: Resource[] = staticResources.map(resource => {
        const dynamic = dynamicMap.get(resource.id);
        if (dynamic) {
            // Replace with dynamic content
            return {
                ...resource,
                title: dynamic.title,
                type: dynamic.content_type as any,
                duration: dynamic.duration,
                url: dynamic.youtube_id || resource.url,
                questions: dynamic.questions || resource.questions,
                completed: resource.completed
            };
        }
        return resource;
    });

    // Add any additional dynamic content that doesn't have a static counterpart
    dynamicContent.forEach(dc => {
        if (!dc.resource_id || !staticResources.find(r => r.id === dc.resource_id)) {
            mergedResources.push({
                id: dc.id,
                title: dc.title,
                type: dc.content_type as any,
                duration: dc.duration,
                url: dc.youtube_id,
                questions: dc.questions,
                questionCount: dc.questions?.length
            });
        }
    });

    return mergedResources;
}

/**
 * Get all resources for a chapter with dynamic content merged in
 */
export async function getChapterResources(
    examType: string,
    subject: string,
    grade: string,
    chapterId: string,
    staticResources: Resource[]
): Promise<Resource[]> {
    const dynamicContent = await getDynamicContentForChapter(
        examType,
        subject,
        grade,
        chapterId
    );

    return mergeChapterContent(staticResources, dynamicContent);
}

/**
 * Get all resources/topics from static data for admin panel display
 */
export function getAllResourcesForChapter(chapter: Chapter): Resource[] {
    return chapter.resources || [];
}
