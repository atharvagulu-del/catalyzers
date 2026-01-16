import { Stack } from 'expo-router';

export default function TestsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="[id]" options={{ headerShown: false }} />
            <Stack.Screen name="result" options={{ presentation: 'modal', headerShown: false }} />
        </Stack>
    );
}
