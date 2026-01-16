import React from 'react';
import { View, Text } from 'react-native';
import { MotiView } from 'moti';

export default function LearnScreen() {
    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC', paddingTop: 60, paddingHorizontal: 20 }}>
            <MotiView
                from={{ opacity: 0, translateY: -10 }}
                animate={{ opacity: 1, translateY: 0 }}
            >
                <Text style={{ fontSize: 28, fontWeight: '800', color: '#1E293B' }}>Learn</Text>
                <Text style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>Your courses and lectures</Text>
            </MotiView>

            <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 200 }}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={{ fontSize: 48 }}>📚</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#334155', marginTop: 12 }}>Coming Soon</Text>
                <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>Courses will appear here</Text>
            </MotiView>
        </View>
    );
}
