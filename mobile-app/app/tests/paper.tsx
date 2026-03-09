import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react-native';
import { useAppColors } from '@/hooks/use-app-colors';
import * as Linking from 'expo-linking';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function TestPaperScreen() {
    const colors = useAppColors();
    const router = useRouter();
    const { images: imagesParam, testName } = useLocalSearchParams<{ images: string; testName: string }>();

    const images: string[] = imagesParam ? JSON.parse(imagesParam) : [];
    const [currentIndex, setCurrentIndex] = useState(0);

    if (images.length === 0) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }} edges={['top']}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 16 }}>No images available</Text>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
                        <Text style={{ color: '#3B82F6', fontSize: 14 }}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const goNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const goPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    const openOriginal = () => {
        Linking.openURL(images[currentIndex]);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <SafeAreaView edges={['top']} style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(255,255,255,0.1)',
                }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }} numberOfLines={1}>
                            {testName}
                        </Text>
                        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                            Page {currentIndex + 1} of {images.length}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <TouchableOpacity
                            onPress={openOriginal}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 8,
                            }}
                        >
                            <ExternalLink size={14} color="#FFFFFF" />
                            <Text style={{ fontSize: 12, color: '#FFFFFF' }}>Open</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                            <X size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            {/* Image Container */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={{ uri: images[currentIndex] }}
                    style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.65 }}
                    resizeMode="contain"
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <TouchableOpacity
                            onPress={goPrev}
                            style={{
                                position: 'absolute',
                                left: 16,
                                top: '50%',
                                transform: [{ translateY: -25 }],
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <ChevronLeft size={28} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={goNext}
                            style={{
                                position: 'absolute',
                                right: 16,
                                top: '50%',
                                transform: [{ translateY: -25 }],
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <ChevronRight size={28} color="#FFFFFF" />
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {/* Thumbnails */}
            {images.length > 1 && (
                <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    <View style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
                        <FlatList
                            data={images}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: 10, justifyContent: 'center', flexGrow: 1 }}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    onPress={() => setCurrentIndex(index)}
                                    style={{
                                        width: 56,
                                        height: 72,
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                        borderWidth: 2,
                                        borderColor: index === currentIndex ? '#3B82F6' : 'transparent',
                                        opacity: index === currentIndex ? 1 : 0.6,
                                    }}
                                >
                                    <Image
                                        source={{ uri: item }}
                                        style={{ width: '100%', height: '100%' }}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </SafeAreaView>
            )}
        </View>
    );
}
