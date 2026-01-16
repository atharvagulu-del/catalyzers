import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import YoutubePlayer from 'react-native-youtube-iframe';
import { ChevronDown, PlayCircle, SkipForward, FileText, CheckCircle2, ClipboardList, PenTool, Trophy } from 'lucide-react-native';
import { lectureData } from '@/lib/lectureData';
import { Skeleton } from '@/components/Skeleton';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function VideoPlayerScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [playing, setPlaying] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const {
        subjectId,
        unitId,
        chapterId,
        resourceId,
        resourceIndex
    } = params;

    // Simulate loading delay for smooth skeleton effect
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, [resourceId]); // Re-trigger on resource change

    // Safe Casts & Lookups
    const currentSubjectId = typeof subjectId === 'string' ? subjectId : '';
    const initialIndex = typeof resourceIndex === 'string' ? parseInt(resourceIndex, 10) : 0;

    const subjectData = lectureData[currentSubjectId];
    const unit = subjectData?.units.find(u => u.id === unitId);
    const chapter = unit?.chapters.find(c => c.id === chapterId);
    const currentResource = chapter?.resources[initialIndex];

    // Robust Up Next Logic (Cross-Chapter for BOTH Video and Quiz)
    const upNextOptions = useMemo(() => {
        if (!unit || !chapter) return { video: null, quiz: null, finalTest: null };

        // 1. Check CURRENT Chapter for next items
        const allResources = chapter.resources;
        let nextVideo = null;
        let nextQuiz = null;

        for (let i = initialIndex + 1; i < allResources.length; i++) {
            const r = allResources[i];
            if (!nextVideo && r.type === 'video') {
                nextVideo = { ...r, index: i, isNextChapter: false };
            }
            if (!nextQuiz && (r.type === 'quiz' || r.type === 'pyq')) {
                nextQuiz = { ...r, index: i, chapterName: chapter.title };
            }
            if (nextVideo && nextQuiz) break;
        }

        let finalTest = null;

        // 2. Cross-Chapter Search
        const currentChapterIdx = unit.chapters.findIndex(c => c.id === chapterId);

        if (currentChapterIdx !== -1 && currentChapterIdx < unit.chapters.length) {
            for (let cIdx = currentChapterIdx + 1; cIdx < unit.chapters.length; cIdx++) {
                const nextChap = unit.chapters[cIdx];

                if (!nextVideo) {
                    const videoInNextChap = nextChap.resources.find(r => r.type === 'video');
                    if (videoInNextChap) {
                        nextVideo = {
                            ...videoInNextChap,
                            index: nextChap.resources.indexOf(videoInNextChap),
                            isNextChapter: true,
                            chapterId: nextChap.id,
                            chapterTitle: nextChap.title
                        };
                    }
                }

                if (!nextQuiz) {
                    const quizInNextChap = nextChap.resources.find(r => r.type === 'quiz' || r.type === 'pyq');
                    if (quizInNextChap) {
                        nextQuiz = {
                            ...quizInNextChap,
                            index: nextChap.resources.indexOf(quizInNextChap),
                            chapterName: nextChap.title,
                            isNextChapter: true,
                            chapterId: nextChap.id
                        };
                    }
                }

                if (!finalTest) {
                    const majorTest = nextChap.resources.find(r =>
                        r.type === 'quiz' && (r.title.includes('Full') || r.title.includes('Test') || r.title.includes('Unit'))
                    );
                    if (majorTest) {
                        finalTest = {
                            ...majorTest,
                            index: nextChap.resources.indexOf(majorTest),
                            chapterName: nextChap.title,
                            isNextChapter: true,
                            chapterId: nextChap.id
                        };
                    }
                }

                if (nextVideo && nextQuiz && finalTest) break;
            }
        }

        if (nextQuiz && finalTest && nextQuiz.id === finalTest.id) {
            finalTest = null;
        }

        // 3. LOGIC FIX: HIDE Final Test if Videos Remain
        // We effectively categorize: Video Phase -> Final Test Phase
        if (nextVideo) {
            finalTest = null;
        }

        return { video: nextVideo, quiz: nextQuiz, finalTest };
    }, [unit, chapter, initialIndex]);

    const onStateChange = useCallback((state: string) => {
        if (state === 'ended') {
            setPlaying(false);
        }
    }, []);

    const handleNavigate = (resource: any) => {
        if (!resource) return;

        // Trigger local loading first
        setIsLoading(true);

        if (resource.type === 'video') {
            const targetChapterId = resource.isNextChapter ? resource.chapterId : chapterId;
            const targetResourceIndex = resource.index;

            router.replace({
                pathname: '/lectures/player',
                params: {
                    subjectId: currentSubjectId,
                    unitId: unitId,
                    chapterId: targetChapterId,
                    resourceId: resource.id,
                    resourceIndex: targetResourceIndex.toString(),
                    videoId: resource.url,
                    title: resource.title,
                    description: resource.isNextChapter ? `Starting new chapter: ${resource.chapterTitle}` : 'Watch this lecture to master the concept.'
                }
            });
        } else {
            router.push({
                pathname: '/tests/[id]',
                params: {
                    testId: resource.id,
                    resourceEncoded: JSON.stringify({
                        ...resource,
                        subjectName: subjectData?.subject,
                        chapterName: resource.chapterName || chapter?.title || 'Chapter Test'
                    })
                }
            });
        }
    }

    // Fallback video ID logic
    const videoId = (currentResource?.url && currentResource.url !== 'placeholder')
        ? currentResource.url
        : (params.videoId as string) || 'bHiHg2zD7o4';

    const videoTitle = currentResource?.title || params.title || 'Lecture Video';
    const videoDesc = params.description || '';

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.bg }}>
                {/* Header Skeleton */}
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 60 }}>
                    <Skeleton width={40} height={40} borderRadius={20} />
                    <View style={{ flex: 1, marginLeft: 16, gap: 8 }}>
                        <Skeleton width={120} height={20} borderRadius={4} />
                        <Skeleton width={80} height={14} borderRadius={4} />
                    </View>
                </View>

                {/* Video Skeleton */}
                <Skeleton width="100%" height={Dimensions.get('window').width * (9 / 16)} borderRadius={0} />

                <View style={{ padding: 20 }}>
                    {/* Title Skeleton */}
                    <Skeleton width="80%" height={28} borderRadius={4} />
                    <View style={{ marginTop: 8 }} />
                    <Skeleton width="100%" height={16} borderRadius={4} />
                    <View style={{ marginTop: 4 }} />
                    <Skeleton width="90%" height={16} borderRadius={4} />

                    {/* Up Next Skeleton */}
                    <View style={{ marginTop: 32 }}>
                        <Skeleton width={80} height={16} borderRadius={4} />
                        <View style={{ marginTop: 12 }} />
                        <Skeleton width="100%" height={70} borderRadius={12} />
                        <View style={{ marginTop: 12 }} />
                        <Skeleton width="100%" height={70} borderRadius={12} />
                    </View>
                </View>
            </View>
        );
    }

    return (
        <Animated.View entering={FadeIn} style={{ flex: 1, backgroundColor: colors.bg }}>
            {/* Header / Close Button */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 60 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ backgroundColor: colors.iconBg, padding: 8, borderRadius: 20 }}>
                    <ChevronDown size={24} color="white" />
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text numberOfLines={1} style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
                        {chapter?.title || 'Lecture'}
                    </Text>
                    <Text numberOfLines={1} style={{ color: colors.textSecondary, fontSize: 12 }}>
                        {unit?.title}
                    </Text>
                </View>
            </View>

            {/* Video Player */}
            <View style={{ width: '100%', aspectRatio: 16 / 9, backgroundColor: 'black' }}>
                <YoutubePlayer
                    height={Dimensions.get('window').width * (9 / 16)}
                    play={playing}
                    videoId={videoId}
                    onChangeState={onStateChange}
                    initialPlayerParams={{ modestbranding: true, rel: false }}
                    webViewStyle={{ opacity: 0.99 }}
                />
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 50 }}>
                {/* Title Block */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: 8, lineHeight: 28 }}>{videoTitle}</Text>
                    <Text style={{ color: colors.textSecondary, lineHeight: 22 }}>
                        {videoDesc}
                    </Text>
                </View>

                {/* Up Next Options */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ color: colors.textTertiary, fontSize: 13, fontWeight: '600', marginBottom: 12, textTransform: 'uppercase' }}>Up Next</Text>

                    {upNextOptions.video ? (
                        <TouchableOpacity
                            onPress={() => handleNavigate(upNextOptions.video)}
                            style={{
                                backgroundColor: colors.cardBg,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: colors.border,
                                padding: 12,
                                marginBottom: 12,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <View style={{
                                width: 48, height: 48, borderRadius: 8,
                                backgroundColor: '#1E3A8A',
                                alignItems: 'center', justifyContent: 'center',
                                marginRight: 16
                            }}>
                                <PlayCircle size={20} color="#60A5FA" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }} numberOfLines={1}>
                                    {upNextOptions.video.title}
                                </Text>
                                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                                    {upNextOptions.video.isNextChapter ? `Start: ${upNextOptions.video.chapterTitle}` : 'Next Topic Video'}
                                </Text>
                            </View>
                            <SkipForward size={20} color="#3B82F6" />
                        </TouchableOpacity>
                    ) : (
                        !upNextOptions.finalTest && (
                            <View style={{ padding: 12, opacity: 0.5, marginBottom: 12 }}>
                                <Text style={{ color: colors.textTertiary }}>No more videos in this unit.</Text>
                            </View>
                        )
                    )}

                    {upNextOptions.quiz && (
                        <TouchableOpacity
                            onPress={() => handleNavigate(upNextOptions.quiz)}
                            style={{
                                backgroundColor: colors.cardBg,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: colors.border,
                                padding: 12,
                                marginBottom: 12,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <View style={{
                                width: 48, height: 48, borderRadius: 8,
                                backgroundColor: '#7C2D12',
                                alignItems: 'center', justifyContent: 'center',
                                marginRight: 16
                            }}>
                                {upNextOptions.quiz.title.toLowerCase().includes('full') ? (
                                    <ClipboardList size={20} color="#FDBA74" />
                                ) : (
                                    <PenTool size={20} color="#FDBA74" />
                                )}
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }} numberOfLines={1}>
                                    {upNextOptions.quiz.title}
                                </Text>
                                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                                    {upNextOptions.quiz.title.toLowerCase().includes('pyq') ? 'Practice Questions' : 'Assessment'}
                                </Text>
                            </View>
                            <SkipForward size={20} color="#F97316" />
                        </TouchableOpacity>
                    )}

                    {upNextOptions.finalTest && (
                        <TouchableOpacity
                            onPress={() => handleNavigate(upNextOptions.finalTest)}
                            style={{
                                backgroundColor: 'rgba(124, 45, 18, 0.4)',
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: '#7C2D12',
                                padding: 12,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <View style={{
                                width: 48, height: 48, borderRadius: 8,
                                backgroundColor: '#7C2D12',
                                alignItems: 'center', justifyContent: 'center',
                                marginRight: 16
                            }}>
                                <Trophy size={20} color="#FDBA74" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }} numberOfLines={1}>
                                    {upNextOptions.finalTest.title}
                                </Text>
                                <Text style={{ color: '#FDBA74', fontSize: 13, fontWeight: '500' }}>
                                    Unit Final Assessment
                                </Text>
                            </View>
                            <SkipForward size={20} color="#F97316" />
                        </TouchableOpacity>
                    )}

                </View>

                {/* About Chapter */}
                <View style={{ marginBottom: 24, padding: 16, backgroundColor: colors.cardBg, borderRadius: 16 }}>
                    <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>About this Chapter</Text>
                    <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>Chapter: <Text style={{ color: colors.text }}>{chapter?.title}</Text></Text>
                    <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>Unit: <Text style={{ color: colors.text }}>{unit?.title}</Text></Text>
                    <Text style={{ color: colors.textSecondary }}>Progress: <Text style={{ color: colors.text }}>{initialIndex + 1} / {chapter?.resources.length}</Text></Text>
                </View>

            </ScrollView>
        </Animated.View>
    );
}
