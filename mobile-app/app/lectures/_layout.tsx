import { Stack } from 'expo-router';

export default function LecturesLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="[id]" />
            <Stack.Screen
                name="player"
                options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                    headerShown: false
                }}
            />
        </Stack>
    );
}
