import { useTheme } from '@/context/ThemeContext';

export const useAppColors = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return {
        // Backgrounds
        bg: isDark ? '#000000' : '#F3F4F6',
        cardBg: isDark ? '#111827' : '#FFFFFF',
        cardBgSecondary: isDark ? '#1F2937' : '#F9FAFB',

        // Borders
        border: isDark ? '#1F2937' : '#E5E7EB',
        borderLight: isDark ? '#374151' : '#D1D5DB',

        // Text
        text: isDark ? '#FFFFFF' : '#111827',
        textSecondary: isDark ? '#9CA3AF' : '#6B7280',
        textTertiary: isDark ? '#6B7280' : '#9CA3AF',

        // Accent - Switched to Premium Indigo to distinguish from competitors
        primary: '#4F46E5',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',

        // Icon backgrounds
        iconBg: isDark ? '#1F2937' : '#F3F4F6',
        iconBgSecondary: isDark ? '#2A2A2A' : '#E5E7EB',
        shadowBg: isDark ? '#1A1A1A' : '#D1D5DB',

        // Status bar
        statusBarStyle: isDark ? 'light-content' : 'dark-content' as 'light-content' | 'dark-content',

        isDark,
    };
};
