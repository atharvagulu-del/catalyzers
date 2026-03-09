import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Bell, Check, CheckCheck } from 'lucide-react-native';
import { useNotifications } from '@/context/NotificationContext';
import { useAppColors } from '@/hooks/use-app-colors';
import { Notification } from '@/lib/notifications';

export default function NotificationsScreen() {
    const colors = useAppColors();
    const {
        notifications,
        unreadCount,
        loading,
        refreshNotifications,
        markAllNotificationsAsRead,
        handleNotificationPress
    } = useNotifications();

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'result_out':
                return '📊';
            case 'test_scheduled':
                return '📅';
            case 'test_reminder':
                return '⏰';
            case 'paper_uploaded':
                return '📄';
            case 'solution_uploaded':
                return '✅';
            default:
                return '🔔';
        }
    };

    const renderNotification = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            onPress={() => handleNotificationPress(item)}
            style={[
                styles.notificationCard,
                {
                    backgroundColor: item.read ? colors.bg : colors.cardBg,
                    borderColor: item.read ? colors.border : colors.primary,
                    borderLeftWidth: item.read ? 1 : 4,
                }
            ]}
        >
            <View style={styles.notificationIcon}>
                <Text style={styles.iconEmoji}>{getNotificationIcon(item.type)}</Text>
            </View>
            <View style={styles.notificationContent}>
                <Text style={[styles.notificationTitle, { color: colors.text }]}>
                    {item.title}
                </Text>
                <Text style={[styles.notificationBody, { color: colors.textSecondary }]} numberOfLines={2}>
                    {item.body}
                </Text>
                <Text style={[styles.notificationTime, { color: colors.textSecondary }]}>
                    {formatTime(item.created_at)}
                </Text>
            </View>
            {!item.read && (
                <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
            )}
        </TouchableOpacity>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Bell size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No notifications yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                You'll be notified when your test results are ready
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={markAllNotificationsAsRead} style={styles.markAllButton}>
                        <CheckCheck size={20} color={colors.primary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Notifications List */}
            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={refreshNotifications}
                        tintColor={colors.primary}
                    />
                }
                ListEmptyComponent={renderEmpty}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '700',
    },
    markAllButton: {
        padding: 8,
    },
    listContent: {
        padding: 16,
        gap: 12,
        flexGrow: 1,
    },
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 8,
    },
    notificationIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(100,100,100,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconEmoji: {
        fontSize: 22,
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    notificationBody: {
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 6,
    },
    notificationTime: {
        fontSize: 11,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginLeft: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 100,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
});
