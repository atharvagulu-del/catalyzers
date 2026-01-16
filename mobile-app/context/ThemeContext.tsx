import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: (coords?: { x: number, y: number }) => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark', // Default to dark
    toggleTheme: () => { },
    setTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemScheme = useNativeColorScheme();
    const [theme, setThemeState] = useState<Theme>('dark'); // Default to dark for consistency with current design
    const [isLoaded, setIsLoaded] = useState(false);

    const [transitionState, setTransitionState] = useState<{ x: number, y: number, active: boolean } | null>(null);

    useEffect(() => {
        // Load saved theme
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('user-theme');
                if (savedTheme) {
                    setThemeState(savedTheme as Theme);
                } else {
                    setThemeState('dark');
                }
            } catch (error) {
                console.error('Failed to load theme:', error);
            } finally {
                setIsLoaded(true);
            }
        };
        loadTheme();
    }, []);

    const setTheme = async (newTheme: Theme) => {
        setThemeState(newTheme);
        try {
            await AsyncStorage.setItem('user-theme', newTheme);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };

    const toggleTheme = (coords?: { x: number, y: number }) => {
        if (coords) {
            setTransitionState({ ...coords, active: true });
            // The overlay will handle the actual theme switch timing
        } else {
            setTheme(theme === 'dark' ? 'light' : 'dark');
        }
    };

    // Helper to actually switch theme (called by overlay)
    const switchThemeInternal = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const finishTransition = () => {
        setTransitionState(null);
    };

    if (!isLoaded) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, transitionState, switchThemeInternal, finishTransition } as any}>
            {children}
        </ThemeContext.Provider>
    );
};
export const useTheme = () => useContext(ThemeContext);
