import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAppColors } from '@/hooks/use-app-colors';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MessageSquare, Clock, ArrowRight } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function DoubtHistoryScreen() {
    const colors = useAppColors();
    const router = useRouter();
    const { user } = useAuth();
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('doubt_sessions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSessions(data || []);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
                        <ChevronLeft size={28} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>Saved Doubts</Text>
                </View>

                {loading ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : sessions.length === 0 ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                        <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: colors.cardBg, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                            <MessageSquare size={30} color={colors.textSecondary} />
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 }}>No doubts yet</Text>
                        <Text style={{ fontSize: 14, color: colors.textTertiary, textAlign: 'center' }}>Start a conversation to see it here.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={sessions}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ padding: 16 }}
                        renderItem={({ item, index }) => (
                            <Animated.View entering={FadeInUp.delay(index * 50)}>
                                <TouchableOpacity
                                    onPress={() => router.push({ pathname: '/doubts/chat', params: { sessionId: item.id } })}
                                    style={{
                                        backgroundColor: colors.cardBg,
                                        borderRadius: 16,
                                        padding: 16,
                                        marginBottom: 12,
                                        borderWidth: 1,
                                        borderColor: colors.border,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <View style={{ flex: 1, marginRight: 12 }}>
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 6 }} numberOfLines={1}>
                                            {item.title || "Untitled Doubt"}
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Clock size={12} color={colors.textTertiary} style={{ marginRight: 4 }} />
                                            <Text style={{ fontSize: 12, color: colors.textTertiary }}>{formatDate(item.created_at)}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
                                        <ArrowRight size={16} color={colors.textSecondary} />
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                    />
                )}
            </SafeAreaView>
        </View>
    );
}
