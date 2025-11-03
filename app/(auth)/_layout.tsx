// app/(auth)/_layout.tsx
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f9fa" }} edges={['top', 'left', 'right', 'bottom']}>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" />
      <Stack.Screen name="Register" />
    </Stack>
    </SafeAreaView>
  );
}
