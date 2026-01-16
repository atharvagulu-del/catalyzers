import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Lock } from 'lucide-react-native';
import { useAppColors } from '@/hooks/use-app-colors';

export default function TestsScreen() {
    const colors = useAppColors();

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <View style={{ width: 80, height: 80, borderRadius: 20, backgroundColor: colors.cardBg, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <Lock size={40} color={colors.textTertiary} />
            </View>
            <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
                Offline Test Results
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 32 }}>
                This section is reserved for enrolled offline students to view their periodic test scores and ranks.
            </Text>
            <TouchableOpacity style={{ backgroundColor: colors.iconBg, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}>
                <Text style={{ color: colors.text, fontWeight: '600' }}>Contact Admin to Enroll</Text>
            </TouchableOpacity>
        </View>
    );
}
