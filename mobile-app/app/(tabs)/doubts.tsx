import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAppColors } from '@/hooks/use-app-colors';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, History, Image as ImageIcon } from 'lucide-react-native';

export default function DoubtsLandingScreen() {
    const colors = useAppColors();
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text }}>Doubts</Text>
                <TouchableOpacity
                    style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.cardBg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}
                    onPress={() => { /* Navigate to History */ }}
                >
                    <History size={20} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingBottom: 100 }}>
                {/* Lottie Animation centered */}
                <View style={{ width: 220, height: 220, marginBottom: 30 }}>
                    <LottieView
                        source={require('@/assets/animations/Anima Bot.json')}
                        autoPlay
                        loop
                        style={{ width: '100%', height: '100%' }}
                    />
                </View>

                <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 10 }}>
                    How can I help you today?
                </Text>
                <Text style={{ fontSize: 15, color: colors.textSecondary, textAlign: 'center', marginBottom: 40 }}>
                    Clear your doubts instantly{'\n'}Simplify your concepts
                </Text>

                {/* Type Here Trigger */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => router.push('/doubts/chat')}
                    style={{
                        width: '100%',
                        height: 56,
                        backgroundColor: colors.cardBg,
                        borderRadius: 28,
                        borderWidth: 1,
                        borderColor: colors.border,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        marginBottom: 20
                    }}
                >
                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary + '20', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                        <ImageIcon size={18} color={colors.primary} />
                    </View>
                    <Text style={{ fontSize: 16, color: colors.textTertiary }}>Type here</Text>
                </TouchableOpacity>

                <Text style={{ color: colors.textTertiary, fontSize: 13, fontWeight: '600', marginBottom: 20 }}>OR</Text>

                {/* View Saved Doubts Button */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => router.push('/doubts/history')}
                    style={{
                        width: '100%',
                        height: 56,
                        backgroundColor: colors.cardBg,
                        borderRadius: 28,
                        borderWidth: 1,
                        borderColor: colors.primary,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 16
                    }}
                >
                    <History size={20} color={colors.primary} style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.primary }}>View Saved Doubts</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
