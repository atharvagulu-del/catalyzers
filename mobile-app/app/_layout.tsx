import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css";

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/context/AuthProvider';
import { NotificationProvider } from '@/context/NotificationContext';
import { ThemeProvider as CustomThemeProvider } from '@/context/ThemeContext';
import { ThemeTransitionOverlay } from '@/components/ThemeTransitionOverlay';

import { useEffect, useRef, useState } from 'react';
import Constants from 'expo-constants';

export const unstable_settings = {
  initialRouteName: 'login',
};

// Check if running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListenerRef = useRef<any>(undefined);
  const responseListenerRef = useRef<any>(undefined);

  useEffect(() => {
    if (isExpoGo) {
      console.log("Skipping push notification setup - not supported in Expo Go");
      return;
    }

    const setupNotifications = async () => {
      try {
        const { registerForPushNotificationsAsync } = await import('@/lib/notifications');
        const Notifications = await import('expo-notifications');

        const token = await registerForPushNotificationsAsync();
        if (token) setExpoPushToken(token);

        notificationListenerRef.current = Notifications.addNotificationReceivedListener(notification => {
          // Handled by NotificationContext
        });

        responseListenerRef.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log("Notification Interaction:", response);
        });
      } catch (e) {
        console.log("Notifications setup skipped:", e);
      }
    };

    setupNotifications();

    return () => {
      notificationListenerRef.current?.remove?.();
      responseListenerRef.current?.remove?.();
    };
  }, []);

  return (
    <AuthProvider>
      <CustomThemeProvider>
        <NotificationProvider>
          <RootLayoutNav expoPushToken={expoPushToken} />
          <ThemeTransitionOverlay />
        </NotificationProvider>
      </CustomThemeProvider>
    </AuthProvider>
  );
}

function RootLayoutNav({ expoPushToken }: { expoPushToken: string | null }) {
  const colorScheme = useColorScheme();
  const { session } = useAuth();

  // Save push token to Supabase when user is logged in
  useEffect(() => {
    if (session?.user?.id && expoPushToken) {
      import('@/lib/notifications').then(({ savePushToken }) => {
        savePushToken(session.user.id, expoPushToken);
      });
    }
  }, [session?.user?.id, expoPushToken]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
