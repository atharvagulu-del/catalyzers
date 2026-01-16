import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthProvider';
import { Skeleton } from '@/components/Skeleton';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
    Settings, HelpCircle, LogOut, ChevronRight,
    User, Download, ClipboardList, Shield, FileQuestion
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const { user, fullName, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const isDark = theme === 'dark';

    const [isLoading, setIsLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [userPhone, setUserPhone] = useState(user?.phone || '');

    // Colors
    const colors = {
        bg: isDark ? '#121212' : '#F3F4F6',
        card: isDark ? '#1E1E1E' : '#FFFFFF',
        text: isDark ? '#FFFFFF' : '#000000',
        subText: isDark ? '#A1A1AA' : '#6B7280',
        border: isDark ? '#2D2D2D' : '#E5E7EB',
        primary: '#3B82F6',
    };

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [])
    );

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            if (user) {
                // Fetch from 'enrollments' table (Teacher Panel Source)
                const { data, error } = await supabase
                    .from('enrollments')
                    .select('enrollment_status, phone_number')
                    .eq('user_id', user.id)
                    .single();

                if (data) {
                    setIsEnrolled(data.enrollment_status === 'ENROLLED');
                    if (data.phone_number) setUserPhone(data.phone_number);
                } else {
                    setIsEnrolled(false);
                }
            }
        } catch (e) {
            console.log('Error fetching profile:', e);
        } finally {
            setTimeout(() => setIsLoading(false), 500);
        }
    };

    const handleToggleTheme = () => {
        toggleTheme();
    };

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: signOut },
        ]);
    };

    // Cleaned Menu Items
    const menuItems = [
        { icon: Download, title: 'Downloaded Content', onPress: () => { } },
        { icon: User, title: 'Personal details', onPress: () => { } },
        { icon: ClipboardList, title: 'Noticeboard', onPress: () => { } },
        { icon: HelpCircle, title: 'Help & Support', onPress: () => { } },
        { icon: Settings, title: 'Settings', onPress: () => { } },
        { icon: FileQuestion, title: 'Terms & Condition', onPress: () => { } },
        { icon: Shield, title: 'Privacy Policy', onPress: () => { } },
    ];

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
                <View style={{ marginBottom: 24 }}>
                    <Skeleton width="100%" height={20} borderRadius={4} style={{ marginBottom: 20 }} />
                    <Skeleton width="100%" height={180} borderRadius={16} />
                </View>
                <View style={{ gap: 16 }}>
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} width="100%" height={60} borderRadius={0} />)}
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={{ paddingTop: 60, paddingHorizontal: 20, marginBottom: 20 }}>
                <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text }}>Your Profile</Text>
            </View>

            <Animated.View entering={FadeIn} style={{ paddingHorizontal: 20 }}>
                {/* Profile Card */}
                <View style={{
                    backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 24,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                    borderWidth: 1,
                    borderColor: colors.border
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View style={{ flex: 1, marginRight: 16 }}>
                            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 4 }}>
                                {fullName?.toUpperCase() || 'STUDENT'}
                            </Text>
                            <Text style={{ fontSize: 14, color: colors.subText, marginBottom: 16 }}>
                                {userPhone || user?.email || 'No Phone'}
                            </Text>

                            <Text style={{ fontSize: 14, color: colors.subText, marginBottom: 8 }}>
                                Class 11 | JEE Advanced
                            </Text>

                            {/* Enrollment Status Badge */}
                            <View style={{
                                backgroundColor: isEnrolled
                                    ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5')
                                    : (isDark ? '#374151' : '#F3F4F6'),
                                alignSelf: 'flex-start',
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 6,
                                borderWidth: 1,
                                borderColor: isEnrolled
                                    ? (isDark ? '#059669' : '#34D399')
                                    : (isDark ? '#4B5563' : '#E5E7EB')
                            }}>
                                <Text style={{
                                    fontSize: 11,
                                    fontWeight: '700',
                                    color: isEnrolled
                                        ? (isDark ? '#34D399' : '#059669')
                                        : '#9CA3AF',
                                    letterSpacing: 0.5
                                }}>
                                    {isEnrolled ? 'ENROLLED STUDENT' : 'NOT ENROLLED'}
                                </Text>
                            </View>
                        </View>

                        <View style={{
                            width: 60, height: 60, borderRadius: 30,
                            borderWidth: 2, borderColor: colors.subText,
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            <User size={30} color={colors.subText} />
                        </View>
                    </View>
                </View>

                {/* Theme Toggle */}
                <View style={{
                    backgroundColor: colors.card,
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 24,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderWidth: 1,
                    borderColor: colors.border
                }}>
                    <Text style={{ fontSize: 16, color: colors.text, fontWeight: '500' }}>App Theme</Text>
                    <Switch
                        value={isDark}
                        onValueChange={handleToggleTheme}
                        trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                        thumbColor={'#FFFFFF'}
                        ios_backgroundColor="#E5E7EB"
                    />
                </View>

                {/* Menu Items */}
                <View style={{ backgroundColor: colors.bg }}>
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={item.onPress}
                                activeOpacity={0.7}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingVertical: 16,
                                    borderBottomWidth: 1,
                                    borderBottomColor: colors.border
                                }}
                            >
                                <View style={{ width: 24, alignItems: 'center', marginRight: 16 }}>
                                    <Icon size={22} color={colors.text} strokeWidth={1.5} />
                                </View>
                                <Text style={{ flex: 1, fontSize: 16, color: colors.text, fontWeight: '400' }}>{item.title}</Text>
                                <ChevronRight size={16} color={colors.subText} />
                            </TouchableOpacity>
                        );
                    })}

                    <TouchableOpacity
                        onPress={handleSignOut}
                        activeOpacity={0.7}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: 16,
                            marginTop: 8
                        }}
                    >
                        <View style={{ width: 24, alignItems: 'center', marginRight: 16 }}>
                            <LogOut size={22} color={colors.text} strokeWidth={1.5} />
                        </View>
                        <Text style={{ flex: 1, fontSize: 16, color: colors.text, fontWeight: '400' }}>Logout</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 40, alignItems: 'center', paddingBottom: 20 }}>
                    <Text style={{ color: colors.subText, fontSize: 14 }}>App Version 5.2.0</Text>
                </View>

            </Animated.View>
        </ScrollView>
    );
}
