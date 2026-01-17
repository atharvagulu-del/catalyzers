import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    interpolateColor,
    runOnJS,
    withTiming,
    Easing
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 64; // Smaller width (was -40)
const CARD_HEIGHT = CARD_WIDTH * 1.35; // Slightly shorter aspect ratio
const SWIPE_THRESHOLD = 80;

interface FlashCardProps {
    question: string;
    hint: string | null;
    answer: string;
    isActive: boolean;
    onRate: (rating: 'known' | 'learning') => void;
}

export interface FlashCardRef {
    swipeLeft: () => void;
    swipeRight: () => void;
}

const FlashCard = forwardRef<FlashCardRef, FlashCardProps>(({ question, hint, answer, isActive, onRate }, ref) => {
    const [isFlipped, setIsFlipped] = useState(false);

    // Animation Values
    const translationX = useSharedValue(0);
    const flipValue = useSharedValue(0);
    // Removed scale entry animation for "instant/smooth" feel without bounce
    const cardOpacity = useSharedValue(0);
    const cardY = useSharedValue(20);

    useImperativeHandle(ref, () => ({
        swipeLeft: () => {
            if (!isFlipped) {
                setIsFlipped(true);
                flipValue.value = 180; // Instant flip for logic
            }
            // Smooth swipe out
            translationX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 350, easing: Easing.out(Easing.cubic) }, () => {
                runOnJS(onRate)('learning');
            });
        },
        swipeRight: () => {
            if (!isFlipped) {
                setIsFlipped(true);
                flipValue.value = 180;
            }
            translationX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 350, easing: Easing.out(Easing.cubic) }, () => {
                runOnJS(onRate)('known');
            });
        }
    }));

    useEffect(() => {
        if (isActive) {
            // Subtle entry, no bounce
            cardOpacity.value = withTiming(1, { duration: 300 });
            cardY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
        }
    }, [isActive]);

    const handleFlip = () => {
        if (Math.abs(translationX.value) < 10) {
            setIsFlipped((prev) => !prev);
            // Standard smooth flip, no spring bounce
            flipValue.value = withTiming(isFlipped ? 0 : 180, {
                duration: 400,
                easing: Easing.inOut(Easing.cubic) // Smooth acceleration/deceleration
            });
        }
    };

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translationX.value = event.translationX;
        })
        .onEnd((event) => {
            if (event.translationX > SWIPE_THRESHOLD) {
                translationX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
                    runOnJS(onRate)('known');
                });
            } else if (event.translationX < -SWIPE_THRESHOLD) {
                translationX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
                    runOnJS(onRate)('learning');
                });
            } else {
                translationX.value = withSpring(0, { damping: 20, stiffness: 200 }); // Quick reset
            }
        });

    // Background Color Interpolation
    const getInterpolatedColor = () => {
        "worklet";
        // White -> Light -> Dark (Vivid Colors)
        return interpolateColor(
            translationX.value,
            [-SCREEN_WIDTH, -SCREEN_WIDTH / 3, 0, SCREEN_WIDTH / 3, SCREEN_WIDTH],
            ['#F59E0B', '#FEF3C7', '#FFFFFF', '#D1FAE5', '#10B981']
        );
    };

    // Border Color Interpolation (Failsafe visibility)
    const getBorderColor = () => {
        "worklet";
        return interpolateColor(
            translationX.value,
            [-SCREEN_WIDTH / 3, 0, SCREEN_WIDTH / 3],
            ['#B45309', '#E2E8F0', '#047857'] // Dark Amber -> Gray -> Dark Green
        );
    };

    // Front Style (Question)
    const frontAnimatedStyle = useAnimatedStyle(() => {
        const rotateValue = interpolate(flipValue.value, [0, 180], [0, 180]);
        return {
            transform: [
                { rotateY: `${rotateValue}deg` }
            ],
            opacity: interpolate(flipValue.value, [89, 90], [1, 0]),
            zIndex: isFlipped ? 0 : 1,
            backgroundColor: getInterpolatedColor(),
            borderColor: getBorderColor(),
            borderWidth: interpolate(Math.abs(translationX.value), [0, 50], [1, 2], 'clamp') // Thicker border on drag
        };
    });

    // Back Style (Answer)
    const backAnimatedStyle = useAnimatedStyle(() => {
        const rotateValue = interpolate(flipValue.value, [0, 180], [180, 360]);
        return {
            transform: [
                { rotateY: `${rotateValue}deg` }
            ],
            opacity: interpolate(flipValue.value, [89, 90], [0, 1]),
            zIndex: isFlipped ? 1 : 0,
            backgroundColor: getInterpolatedColor(),
            borderColor: getBorderColor(),
            borderWidth: interpolate(Math.abs(translationX.value), [0, 50], [1, 2], 'clamp')
        };
    });

    const containerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translationX.value },
                { translateY: cardY.value },
                { rotate: `${translationX.value / 35}deg` },
            ],
            opacity: cardOpacity.value
        };
    });

    const renderKaTeX = (content: string, isBack: boolean = false) => `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
            <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
            <style>
                html, body {
                    background-color: transparent !important;
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    width: 100%;
                    overflow: height;
                }
                body {
                    font-family: -apple-system, system-ui;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    color: #1E293B;
                    text-align: center;
                    padding: 16px;
                    box-sizing: border-box;
                }
                .math-content { font-size: 18px; line-height: 1.5; }
            </style>
        </head>
        <body>
            <div class="math-content">${content}</div>
            <script>
                renderMathInElement(document.body, {
                    delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
                    throwOnError: false
                });
            </script>
        </body>
        </html>
    `;

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[
                { width: CARD_WIDTH, height: CARD_HEIGHT, alignItems: 'center', justifyContent: 'center' },
                containerAnimatedStyle
            ]}>
                {/* Front Side */}
                <Animated.View style={[
                    {
                        width: '100%', height: '100%', position: 'absolute', backfaceVisibility: 'hidden',
                        borderRadius: 20,
                        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
                    },
                    frontAnimatedStyle
                ]}>
                    <TouchableOpacity activeOpacity={1} onPress={handleFlip} style={{ flex: 1 }}>
                        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)', alignItems: 'center' }}>
                            <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: '#94A3B8' }}>QUESTION</Text>
                        </View>
                        <View style={{ flex: 1, pointerEvents: 'none' }}>
                            <WebView
                                opaque={false}
                                originWhitelist={['*']}
                                source={{ html: renderKaTeX(question) }}
                                style={{ backgroundColor: 'transparent' }}
                                scrollEnabled={false}
                            />
                        </View>
                        <View style={{ padding: 14, alignItems: 'center' }}>
                            <Text style={{ fontSize: 11, color: '#94A3B8', fontWeight: '500' }}>Tap to flip</Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                {/* Back Side */}
                <Animated.View style={[
                    {
                        width: '100%', height: '100%', position: 'absolute', backfaceVisibility: 'hidden',
                        borderRadius: 20,
                        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
                        overflow: 'hidden'
                    },
                    backAnimatedStyle
                ]}>
                    <TouchableOpacity activeOpacity={1} onPress={handleFlip} style={{ flex: 1 }}>
                        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)', alignItems: 'center' }}>
                            <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: '#64748B' }}>ANSWER</Text>
                        </View>
                        <View style={{ flex: 1, pointerEvents: 'none' }}>
                            <WebView
                                opaque={false}
                                originWhitelist={['*']}
                                source={{ html: renderKaTeX(answer, true) }}
                                style={{ backgroundColor: 'transparent' }}
                                scrollEnabled={false}
                            />
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </GestureDetector>
    );
});

export default FlashCard;
