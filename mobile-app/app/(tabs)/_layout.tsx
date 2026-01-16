import { Tabs } from 'expo-router';
import React from 'react';
import { View, Platform } from 'react-native';
import { Home, PlayCircle, HelpCircle, ClipboardList } from 'lucide-react-native';
import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Theme-based colors
  const activeColor = '#3B82F6'; // Blue
  const inactiveColor = isDark ? '#FFFFFF' : '#000000'; // White on Dark, Black on Light
  const backgroundColor = isDark ? '#0F1115' : '#FFFFFF';
  const borderColor = isDark ? '#1F2937' : '#E5E7EB';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: backgroundColor,
          borderTopColor: borderColor,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 90 : 70, // Standard modern height
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10, // Standard safe area spacing
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: 0
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Home size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="lectures"
        options={{
          title: 'Lectures',
          tabBarIcon: ({ color, focused }) => (
            <PlayCircle size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="doubts"
        options={{
          title: 'Doubts',
          tabBarIcon: ({ color, focused }) => (
            <HelpCircle size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="tests"
        options={{
          title: 'Tests',
          tabBarIcon: ({ color, focused }) => (
            <ClipboardList size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="learn" options={{ href: null }} />
    </Tabs>
  );
}
