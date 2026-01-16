import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DailyGoal {
    id: string;
    type: 'resume' | 'weak' | 'revision';
    title: string;
    subtitle: string;
    link?: string;
    priority: number;
    completed: boolean;
    isAutomated: boolean; // true = system must tick, false = user can tick
    resourceId?: string;
    autoCheckOn?: 'open' | 'complete';
}

interface DailyPlan {
    date: string;
    goals: DailyGoal[];
}

// Get local date string YYYY-MM-DD
const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const STORAGE_KEY = 'daily_plan';

export const getOrCreateDailyPlan = async (): Promise<DailyGoal[]> => {
    const today = getTodayString();

    try {
        // 1. Check if plan exists for today
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
            const plan: DailyPlan = JSON.parse(stored);

            // If plan is for today, return it
            if (plan.date === today) {
                return plan.goals;
            }
        }

        // 2. Generate new goals for today
        const goals: DailyGoal[] = [];

        // Goal 1: Resume/Start - Auto-completes on "open"
        goals.push({
            id: `resume-${Date.now()}`,
            type: 'resume',
            title: 'Complete 1 lecture',
            subtitle: 'Watch any video from your subjects',
            priority: 1,
            completed: false,
            isAutomated: true,
            resourceId: 'lecture-watch',
            autoCheckOn: 'open'
        });

        // Goal 2: Practice - Auto-completes on "complete"
        goals.push({
            id: `weak-${Date.now()}`,
            type: 'weak',
            title: 'Solve 10 practice questions',
            subtitle: 'Complete any test or quiz',
            priority: 2,
            completed: false,
            isAutomated: true,
            resourceId: 'test-complete',
            autoCheckOn: 'complete'
        });

        // Goal 3: Revision - Manual toggle
        goals.push({
            id: `rev-${Date.now()}`,
            type: 'revision',
            title: 'Revise formula sheet',
            subtitle: 'Review key concepts',
            priority: 3,
            completed: false,
            isAutomated: false
        });

        // 3. Save to AsyncStorage
        const newPlan: DailyPlan = {
            date: today,
            goals
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPlan));

        return goals;
    } catch (error) {
        console.error('Error getting daily plan:', error);
        // Return default goals on error
        return [];
    }
};

// Toggle manual goals
export const toggleGoalStatus = async (goalId: string, completed: boolean): Promise<DailyGoal[]> => {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const plan: DailyPlan = JSON.parse(stored);
        const updatedGoals = plan.goals.map(g =>
            g.id === goalId ? { ...g, completed } : g
        );

        plan.goals = updatedGoals;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plan));

        return updatedGoals;
    } catch (error) {
        console.error('Error toggling goal:', error);
        return [];
    }
};

// Auto-complete goals based on user actions
export const checkGoalCompletion = async (
    resourceId: string,
    action: 'open' | 'complete' = 'open'
): Promise<DailyGoal[]> => {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const plan: DailyPlan = JSON.parse(stored);
        let changed = false;

        const updatedGoals = plan.goals.map(g => {
            if (g.isAutomated && !g.completed && g.resourceId === resourceId) {
                const requiredAction = g.autoCheckOn || 'open';

                if (requiredAction === 'complete' && action !== 'complete') {
                    return g;
                }

                changed = true;
                return { ...g, completed: true };
            }
            return g;
        });

        if (changed) {
            plan.goals = updatedGoals;
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
        }

        return updatedGoals;
    } catch (error) {
        console.error('Error checking goal completion:', error);
        return [];
    }
};
