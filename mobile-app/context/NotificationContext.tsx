import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthProvider';
import {
    Notification,
    fetchNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    subscribeToNotifications,
} from '@/lib/notifications';
import { Alert, Vibration } from 'react-native';
import { router } from 'expo-router';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    refreshNotifications: () => Promise<void>;
    markNotificationAsRead: (id: string) => Promise<void>;
    markAllNotificationsAsRead: () => Promise<void>;
    handleNotificationPress: (notification: Notification) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { session } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const unsubscribeRef = useRef<(() => void) | null>(null);

    const userId = session?.user?.id;

    // Fetch notifications
    const refreshNotifications = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        try {
            const [notifs, count] = await Promise.all([
                fetchNotifications(userId),
                getUnreadCount(userId)
            ]);
            setNotifications(notifs);
            setUnreadCount(count);
        } catch (error) {
            console.error('Error refreshing notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Mark single notification as read
    const markNotificationAsRead = useCallback(async (id: string) => {
        const success = await markAsRead(id);
        if (success) {
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    }, []);

    // Mark all as read
    const markAllNotificationsAsRead = useCallback(async () => {
        if (!userId) return;
        const success = await markAllAsRead(userId);
        if (success) {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        }
    }, [userId]);

    // Handle notification tap - navigate to appropriate screen
    const handleNotificationPress = useCallback((notification: Notification) => {
        // Mark as read
        if (!notification.read) {
            markNotificationAsRead(notification.id);
        }

        // Navigate based on notification type
        const testId = notification.data?.test_id;

        switch (notification.type) {
            case 'result_out':
                // Navigate to test result screen
                if (testId) router.push(`/tests/test-result/${testId}`);
                break;
            case 'test_scheduled':
            case 'test_reminder':
            case 'paper_uploaded':
            case 'solution_uploaded':
                // Navigate to test detail/active screen
                if (testId) router.push(`/tests/active?testId=${testId}`);
                break;
            default:
                // Stay on notifications screen
                break;
        }
    }, [markNotificationAsRead]);

    // Handle new notification from realtime
    const handleNewNotification = useCallback((notification: Notification) => {
        // Add to list
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Vibrate based on notification type
        if (notification.type === 'result_out') {
            Vibration.vibrate([0, 200, 100, 200]); // Double vibrate for results
        } else {
            Vibration.vibrate(200);
        }

        // Get appropriate button text based on type
        const getButtonText = () => {
            switch (notification.type) {
                case 'result_out': return 'View Results';
                case 'test_scheduled': return 'View Test';
                case 'test_reminder': return 'View Test';
                case 'paper_uploaded': return 'View Paper';
                case 'solution_uploaded': return 'View Solutions';
                default: return 'View';
            }
        };

        // Show in-app alert
        Alert.alert(
            notification.title,
            notification.body,
            [
                { text: 'Later', style: 'cancel' },
                {
                    text: getButtonText(),
                    onPress: () => handleNotificationPress(notification),
                    style: 'default'
                },
            ],
            { cancelable: true }
        );
    }, [handleNotificationPress]);

    // Setup realtime subscription
    useEffect(() => {
        if (!userId) return;

        // Initial fetch
        refreshNotifications();

        // Subscribe to realtime
        unsubscribeRef.current = subscribeToNotifications(userId, handleNewNotification);

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, [userId, refreshNotifications, handleNewNotification]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                refreshNotifications,
                markNotificationAsRead,
                markAllNotificationsAsRead,
                handleNotificationPress,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
