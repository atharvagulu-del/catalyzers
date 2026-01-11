import { supabase } from "@/lib/supabase";

export interface LastVisitedItem {
    id: string; // unique resource id
    type: 'video' | 'quiz' | 'pyq' | 'notes';
    title: string;
    subtitle: string; // e.g. "Physics - Class 11"
    url: string; // full path to resume
    timestamp: number;
    duration?: string; // for videos
    questionCount?: number; // for tests
}

export const saveLastVisited = async (userId: string, item: Omit<LastVisitedItem, 'timestamp'>) => {
    try {
        const { error } = await supabase
            .from('user_learning_history')
            .upsert({
                user_id: userId,
                resource_id: item.id,
                resource_type: item.type,
                title: item.title,
                subtitle: item.subtitle,
                url: item.url,
                duration: item.duration,
                question_count: item.questionCount,
                last_accessed_at: new Date().toISOString()
            });

        if (error) {
            console.error("Supabase error saving history:", error);
        }
    } catch (e) {
        console.error("Failed to save learning history", e);
    }
};

export const getLastVisited = async (userId: string): Promise<LastVisitedItem | null> => {
    try {
        const { data, error } = await supabase
            .from('user_learning_history')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            // It's normal to have no rows if user hasn't visited anything yet
            if (error.code !== 'PGRST116') {
                console.error("Supabase error loading history:", error);
            }
            return null;
        }

        if (!data) return null;

        return {
            id: data.resource_id,
            type: data.resource_type as any,
            title: data.title,
            subtitle: data.subtitle,
            url: data.url,
            timestamp: new Date(data.last_accessed_at).getTime(),
            duration: data.duration,
            questionCount: data.question_count
        };
    } catch (e) {
        console.error("Failed to load learning history", e);
        return null;
    }
};

