import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, interpolate, Easing } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

const { width, height } = Dimensions.get('window');
const MAX_RADIUS = Math.hypot(width, height);

export const ThemeTransitionOverlay = () => {
    // @ts-ignore - explicitly using internal context methods
    const { transitionState, switchThemeInternal, finishTransition, theme } = useTheme();

    // 0: inactive, 1: expanding, 2: completed/fading
    const progress = useSharedValue(0);

    // Determine target color based on CURRENT theme (we want the opposite)
    const targetTheme = theme === 'dark' ? 'light' : 'dark';
    const targetColor = targetTheme === 'light' ? '#F3F4F6' : '#000000';

    useEffect(() => {
        if (transitionState?.active) {
            progress.value = 0;

            // Start expansion
            progress.value = withTiming(1, { duration: 600, easing: Easing.inOut(Easing.quad) }, (finished) => {
                if (finished) {
                    // Switch the actual global theme
                    runOnJS(switchThemeInternal)();

                    // Small delay to ensure render happens behind the curtain
                    // Then just reset/remove overlay (since colors match now)
                    runOnJS(finishTransition)();
                }
            });
        }
    }, [transitionState]);

    const circleStyle = useAnimatedStyle(() => {
        if (!transitionState) return { display: 'none' };

        const scale = interpolate(progress.value, [0, 1], [0, MAX_RADIUS / 10]);
        // Note: we start with a small circle (radius 20) and scale it up. 
        // 20 * (MAX_RADIUS/10) should cover screen? 
        // Let's use direct radius instead.

        /* 
           We want a circle growing from (x,y). 
           We use scale because it's more performant than width/height.
        */

        return {
            position: 'absolute',
            left: transitionState.x,
            top: transitionState.y,
            width: 0,
            height: 0,
            backgroundColor: targetColor,
            borderRadius: 9999,
            transform: [
                { translateX: -MAX_RADIUS }, // Centering logic is tricky with scale
                { translateY: -MAX_RADIUS },
                { scale: interpolate(progress.value, [0, 1], [0, 2]) }
            ],
            // Simplified approach: just a big circle centered on touch
        };
    });

    // Simplify: Just render a View at x,y and scale it massive
    const simpleStyle = useAnimatedStyle(() => {
        if (!transitionState) return { opacity: 0 };

        // Target size: enough to cover screen from any corner
        const size = MAX_RADIUS * 2.5;

        return {
            position: 'absolute',
            left: transitionState.x - size / 2,
            top: transitionState.y - size / 2,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: targetColor,
            transform: [{ scale: progress.value }],
            opacity: 1,
            zIndex: 9999,
            elevation: 9999, // Android
        };
    });

    if (!transitionState?.active) return null;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Animated.View style={simpleStyle} />
        </View>
    );
};
