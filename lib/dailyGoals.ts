import { supabase } from "@/lib/supabase";
import { getLastVisited } from "./learningHistory";

export interface DailyGoal {
    id: string;
    type: 'resume' | 'weak' | 'revision';
    title: string;
    subtitle: string;
    link: string;
    priority: number;
    completed: boolean;
    isAutomated: boolean; // true = system must tick, false = user can tick
    resourceId?: string; // to match with system events
    autoCheckOn?: 'open' | 'complete'; // trigger type
}

// Helper: Get local date string YYYY-MM-DD to ensure midnight rotation happens at user's midnight, not UTC
const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getOrCreateDailyPlan = async (userId: string): Promise<DailyGoal[]> => {
    const today = getTodayString();

    // 1. Check if plan exists for today
    const { data: existingPlan, error } = await supabase
        .from('daily_plans')
        .select('goals')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

    // REPAIR STRATEGY: Check if existing plan has the old "Rotational Motion" goal
    const hasLegacyGoal = existingPlan?.goals?.some((g: any) => g.title === "Practice Rotational Motion");

    if (existingPlan && existingPlan.goals && !hasLegacyGoal) {
        return existingPlan.goals as DailyGoal[];
    }

    // 2. Generate new goals (or regenerate if legacy found)
    const goals: DailyGoal[] = [];

    // Priority 1: Resume unfinished work OR Start Fresh
    const lastVisited = await getLastVisited(userId);
    if (lastVisited) {
        goals.push({
            id: `resume-${Date.now()}`,
            type: 'resume',
            title: `Resume ${lastVisited.title}`,
            subtitle: `Continue ${lastVisited.subtitle}`,
            link: lastVisited.url,
            priority: 1,
            completed: false,
            isAutomated: true,
            resourceId: lastVisited.id,
            autoCheckOn: 'open'
        });
    } else {
        // Fallback: Start with the first logical unit (Sets)
        goals.push({
            id: `start-${Date.now()}`,
            type: 'resume',
            title: "Start Learning Mathematics",
            subtitle: "Begin with Sets, Relations & Functions",
            link: "/lectures/jee/mathematics-11/sets-relations-functions/sets-intro?resource=v-sets-1",
            priority: 1,
            completed: false,
            isAutomated: true,
            resourceId: 'v-sets-1',
            autoCheckOn: 'open'
        });
    }

    // Priority 2: Weak Area -> Practice Trigonometry (Requires Completion)
    goals.push({
        id: `weak-${Date.now()}`,
        type: 'weak',
        title: "Practice Trigonometric Functions",
        subtitle: "Complete all questions to finish",
        link: "/lectures/jee/mathematics-11/trigonometric-functions/trig-functions?resource=p-trig-2",
        priority: 2,
        completed: false,
        isAutomated: true,
        resourceId: 'p-trig-2',
        autoCheckOn: 'complete' // Must actually finish
    });

    // Priority 3: Light Revision (Manual)
    goals.push({
        id: `rev-${Date.now()}`,
        type: 'revision',
        title: "Quick Chemistry Revision",
        subtitle: "Review Atomic Structure",
        link: "/lectures/jee/chemistry-11",
        priority: 3,
        completed: false,
        isAutomated: false // Soft goal
    });

    const finalGoals = goals.slice(0, 3);

    // 3. Save to DB (Upsert to overwrite if legacy existed)
    const { error: insertError } = await supabase
        .from('daily_plans')
        .upsert({
            user_id: userId,
            date: today,
            goals: finalGoals
        }, { onConflict: 'user_id, date' });

    if (insertError) {
        console.error("Error creating daily plan:", insertError);
        return finalGoals;
    }

    return finalGoals;
};

// For Manual Ticks (Soft Goals)
export const toggleGoalStatus = async (userId: string, goalId: string, completed: boolean) => {
    const today = getTodayString();

    // Fetch current goals
    const { data } = await supabase
        .from('daily_plans')
        .select('goals')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

    if (!data) return;

    const updatedGoals = (data.goals as DailyGoal[]).map(g =>
        g.id === goalId ? { ...g, completed } : g
    );

    await supabase
        .from('daily_plans')
        .update({ goals: updatedGoals })
        .eq('user_id', userId)
        .eq('date', today);

    return updatedGoals;
};

// For System Auto-Ticks
export const checkGoalCompletion = async (userId: string, resourceId: string, action: 'open' | 'complete' = 'open') => {
    const today = getTodayString();

    // Fetch current goals
    const { data } = await supabase
        .from('daily_plans')
        .select('goals')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

    if (!data) return;

    let changed = false;
    const updatedGoals = (data.goals as DailyGoal[]).map(g => {
        // Match Resource ID AND Automation Flag
        if (g.isAutomated && !g.completed && g.resourceId === resourceId) {
            // Check Action Requirement
            // If goal expects 'complete' but action is 'open', ignore.
            // If goal expects 'open', action 'open' OR 'complete' works (completion implies opened).
            const requiredAction = g.autoCheckOn || 'open';

            if (requiredAction === 'complete' && action !== 'complete') {
                return g; // Not yet
            }

            changed = true;
            return { ...g, completed: true };
        }
        return g;
    });

    if (changed) {
        await supabase
            .from('daily_plans')
            .update({ goals: updatedGoals })
            .eq('user_id', userId)
            .eq('date', today);
    }

    return updatedGoals;
};
