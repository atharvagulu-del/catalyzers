import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAppColors } from '@/hooks/use-app-colors';

export default function LoginScreen() {
    const colors = useAppColors();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password,
        });

        setIsLoading(false);

        if (error) {
            Alert.alert('Login Failed', error.message);
        } else {
            router.replace('/(tabs)');
        }
    };

    return (
        <LinearGradient
            colors={[colors.primary, '#2563EB', '#60A5FA']}
            style={{ flex: 1 }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}
            >
                {/* Logo / Title */}
                <MotiView
                    from={{ opacity: 0, translateY: -30 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 600 }}
                    style={{ alignItems: 'center', marginBottom: 48 }}
                >
                    <Text style={{ fontSize: 42, fontWeight: '800', color: 'white', letterSpacing: 2 }}>
                        CATALYZER
                    </Text>
                    <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 8 }}>
                        Your path to IIT & NEET success
                    </Text>
                </MotiView>

                {/* Card */}
                <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 15, delay: 200 }}
                    style={{
                        backgroundColor: colors.cardBg,
                        borderRadius: 24,
                        padding: 24,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.2,
                        shadowRadius: 20,
                        elevation: 10,
                    }}
                >
                    <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 24, textAlign: 'center' }}>
                        Welcome Back
                    </Text>

                    {/* Email Input */}
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 }}>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="you@example.com"
                            placeholderTextColor={colors.textTertiary}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={{
                                backgroundColor: colors.bg,
                                borderRadius: 12,
                                paddingHorizontal: 16,
                                paddingVertical: 14,
                                fontSize: 16,
                                color: colors.text,
                            }}
                        />
                    </View>

                    {/* Password Input */}
                    <View style={{ marginBottom: 24 }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 }}>Password</Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="••••••••"
                            placeholderTextColor={colors.textTertiary}
                            secureTextEntry
                            style={{
                                backgroundColor: colors.bg,
                                borderRadius: 12,
                                paddingHorizontal: 16,
                                paddingVertical: 14,
                                fontSize: 16,
                                color: colors.text,
                            }}
                        />
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={isLoading}
                        activeOpacity={0.8}
                        style={{
                            backgroundColor: colors.primary,
                            borderRadius: 12,
                            paddingVertical: 16,
                            alignItems: 'center',
                            shadowColor: colors.primary,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                        }}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    {/* Forgot Password */}
                    <TouchableOpacity style={{ marginTop: 16, alignItems: 'center' }}>
                        <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '500' }}>Forgot Password?</Text>
                    </TouchableOpacity>
                </MotiView>

                {/* Sign Up Link */}
                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 400 }}
                    style={{ marginTop: 32, flexDirection: 'row', justifyContent: 'center' }}
                >
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Don't have an account? </Text>
                    <TouchableOpacity>
                        <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }}>Sign Up</Text>
                    </TouchableOpacity>
                </MotiView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}
