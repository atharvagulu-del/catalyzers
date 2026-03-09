import React, { useState, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions, StyleSheet, StatusBar, ScrollView, Animated, PanResponder } from 'react-native';
import { Image } from 'expo-image';
import { X, ChevronLeft, ChevronRight, Maximize2, RotateCcw } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TestPaperViewerProps {
    visible: boolean;
    images: string[];
    testName: string;
    onClose: () => void;
}

export function TestPaperViewer({ visible, images, testName, onClose }: TestPaperViewerProps) {
    const insets = useSafeAreaInsets();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fullScreen, setFullScreen] = useState(false);
    const scrollRef = useRef<ScrollView>(null);
    const [zoomScale, setZoomScale] = useState(1);

    // Early return AFTER all hooks
    if (!visible || images.length === 0) return null;

    const toggleFullScreen = () => {
        setFullScreen(!fullScreen);
        setZoomScale(1);
    };

    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setZoomScale(1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setZoomScale(1);
        }
    };

    const handleZoomIn = () => {
        setZoomScale(prev => Math.min(prev + 0.5, 3));
    };

    const handleZoomOut = () => {
        setZoomScale(prev => Math.max(prev - 0.5, 1));
    };

    const resetZoom = () => {
        setZoomScale(1);
    };

    const imageHeight = fullScreen ? SCREEN_HEIGHT : SCREEN_HEIGHT * 0.85;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <View style={[styles.container, { paddingTop: fullScreen ? 0 : insets.top }]}>

                {/* Header */}
                {!fullScreen && (
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                            <X color="#FFF" size={24} />
                        </TouchableOpacity>

                        <View style={styles.headerCenter}>
                            <Text style={styles.headerTitle} numberOfLines={1}>{testName}</Text>
                            <Text style={styles.headerSubtitle}>Page {currentIndex + 1} of {images.length}</Text>
                        </View>

                        <TouchableOpacity onPress={toggleFullScreen} style={styles.headerButton}>
                            <Maximize2 color="#FFF" size={22} />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Full screen exit button */}
                {fullScreen && (
                    <TouchableOpacity
                        onPress={toggleFullScreen}
                        style={[styles.fullScreenButton, { top: insets.top + 10 }]}
                    >
                        <X color="#FFF" size={24} />
                    </TouchableOpacity>
                )}

                {/* Main Image - With Manual Zoom */}
                <ScrollView
                    ref={scrollRef}
                    style={styles.imageArea}
                    contentContainerStyle={styles.imageContainer}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    maximumZoomScale={3}
                    minimumZoomScale={1}
                    bouncesZoom={true}
                    centerContent={true}
                >
                    <View style={{
                        transform: [{ scale: zoomScale }],
                        width: SCREEN_WIDTH,
                        height: imageHeight,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Image
                            source={{ uri: images[currentIndex] }}
                            style={{
                                width: SCREEN_WIDTH,
                                height: imageHeight,
                            }}
                            contentFit="contain"
                            transition={100}
                        />
                    </View>
                </ScrollView>

                {/* Navigation & Zoom Controls */}
                {!fullScreen && (
                    <View style={[styles.controlsRow, { paddingBottom: insets.bottom + 8 }]}>
                        {/* Prev Button */}
                        <TouchableOpacity
                            onPress={handlePrev}
                            disabled={currentIndex === 0}
                            style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
                        >
                            <ChevronLeft color={currentIndex === 0 ? '#666' : '#FFF'} size={28} />
                        </TouchableOpacity>

                        {/* Zoom Controls */}
                        <View style={styles.zoomControls}>
                            <TouchableOpacity onPress={handleZoomOut} style={styles.zoomButton} disabled={zoomScale <= 1}>
                                <Text style={[styles.zoomText, zoomScale <= 1 && styles.zoomTextDisabled]}>−</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={resetZoom} style={styles.zoomResetButton}>
                                <Text style={styles.zoomLabel}>{Math.round(zoomScale * 100)}%</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleZoomIn} style={styles.zoomButton} disabled={zoomScale >= 3}>
                                <Text style={[styles.zoomText, zoomScale >= 3 && styles.zoomTextDisabled]}>+</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Next Button */}
                        <TouchableOpacity
                            onPress={handleNext}
                            disabled={currentIndex === images.length - 1}
                            style={[styles.navButton, currentIndex === images.length - 1 && styles.navButtonDisabled]}
                        >
                            <ChevronRight color={currentIndex === images.length - 1 ? '#666' : '#FFF'} size={28} />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Fullscreen controls */}
                {fullScreen && (
                    <View style={[styles.fullScreenControls, { bottom: insets.bottom + 20 }]}>
                        <TouchableOpacity onPress={handlePrev} disabled={currentIndex === 0} style={styles.fsNavBtn}>
                            <ChevronLeft color={currentIndex === 0 ? '#666' : '#FFF'} size={32} />
                        </TouchableOpacity>
                        <Text style={styles.fsPageText}>{currentIndex + 1} / {images.length}</Text>
                        <TouchableOpacity onPress={handleNext} disabled={currentIndex === images.length - 1} style={styles.fsNavBtn}>
                            <ChevronRight color={currentIndex === images.length - 1 ? '#666' : '#FFF'} size={32} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    headerSubtitle: {
        color: '#AAA',
        fontSize: 12,
        marginTop: 2,
    },
    fullScreenButton: {
        position: 'absolute',
        right: 16,
        zIndex: 100,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageArea: {
        flex: 1,
    },
    imageContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    navButton: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navButtonDisabled: {
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    zoomControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 25,
        paddingHorizontal: 4,
    },
    zoomButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    zoomText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '600',
    },
    zoomTextDisabled: {
        color: '#555',
    },
    zoomResetButton: {
        paddingHorizontal: 8,
    },
    zoomLabel: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        minWidth: 50,
        textAlign: 'center',
    },
    fullScreenControls: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    fsNavBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fsPageText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
    },
});
