import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { supabase } from './supabase';

// Types
export interface Notification {
    id: string;
    user_id: string;
    title: string;
    body: string;
    type: string;
    data: Record<string, any>;
    read: boolean;
    created_at: string;
}

// Check if running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Configure how notifications are handled when the app is in foreground
export function configureNotificationHandler() {
    if (isExpoGo) return;

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
}

// Register for push notifications and return the token
export async function registerForPushNotificationsAsync(): Promise<string | null> {
    if (isExpoGo) {
        console.log("Push notifications are not supported in Expo Go. Use a development build.");
        return null;
    }

    try {
        configureNotificationHandler();

        // Create multiple notification channels for Android
        if (Platform.OS === 'android') {
            // Main channel for test notifications
            await Notifications.setNotificationChannelAsync('test-updates', {
                name: 'Test Updates',
                description: 'Notifications about tests, results, and schedules',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#F7941D', // Catalyzers orange
                sound: 'default',
            });

            // Default fallback channel
            await Notifications.setNotificationChannelAsync('default', {
                name: 'General',
                importance: Notifications.AndroidImportance.DEFAULT,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#F7941D',
            });
        }

        if (!Device.isDevice) {
            console.log('Must use physical device for Push Notifications');
            return null;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Push notification permission not granted');
            return null;
        }

        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

        const pushTokenString = (await Notifications.getExpoPushTokenAsync({
            projectId,
        })).data;

        console.log("Expo Push Token:", pushTokenString);
        return pushTokenString;
    } catch (e: unknown) {
        console.log("Error getting push token (expected in Expo Go):", e);
        return null;
    }
}

// Save push token to Supabase
export async function savePushToken(userId: string, token: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('push_tokens')
            .upsert({
                user_id: userId,
                expo_push_token: token,
                device_type: Platform.OS,
            }, {
                onConflict: 'user_id,expo_push_token'
            });

        if (error) {
            console.error('Error saving push token:', error);
            return false;
        }
        console.log('Push token saved successfully');
        return true;
    } catch (e) {
        console.error('Error saving push token:', e);
        return false;
    }
}

// Fetch notifications for a user
export async function fetchNotifications(userId: string, limit = 50): Promise<Notification[]> {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }

    return data || [];
}

// Get unread notification count
export async function getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

    if (error) {
        console.error('Error getting unread count:', error);
        return 0;
    }

    return count || 0;
}

// Mark notification as read
export async function markAsRead(notificationId: string): Promise<boolean> {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

    if (error) {
        console.error('Error marking notification as read:', error);
        return false;
    }

    return true;
}

// Mark all notifications as read
export async function markAllAsRead(userId: string): Promise<boolean> {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

    if (error) {
        console.error('Error marking all as read:', error);
        return false;
    }

    return true;
}

// Subscribe to realtime notifications
export function subscribeToNotifications(
    userId: string,
    onNewNotification: (notification: Notification) => void
) {
    const channel = supabase
        .channel('notifications-channel')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${userId}`,
            },
            (payload) => {
                console.log('New notification received:', payload);
                onNewNotification(payload.new as Notification);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}
