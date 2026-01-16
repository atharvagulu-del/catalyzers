import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';

export function useAppContent() {
    const { session } = useAuth();
    const [loading, setLoading] = useState(true);
    const [upcomingTests, setUpcomingTests] = useState<any[]>([]);
    const [recentFlashcards, setRecentFlashcards] = useState<any[]>([]);

    useEffect(() => {
        if (!session?.user) return;

        async function fetchData() {
            try {
                // Fetch Upcoming Tests
                const { data: tests } = await supabase
                    .from('tests')
                    .select('*')
                    .gte('start_time', new Date().toISOString())
                    .order('start_time', { ascending: true })
                    .limit(3);

                setUpcomingTests(tests || []);

                // Fetch Recent Flashcards Activity
                // (Placeholder query logic for now)
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [session]);

    return {
        loading,
        upcomingTests,
    };
}
