import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FuncionalidadesLayout() {
  return (
     <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f9fa" }} edges={['top', 'left', 'right', 'bottom']}>
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#ffffff" },
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: "bold", color: "#1b5e20" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="FeedAtividades"
        options={{ title: "Atividades" }}
      />
      <Stack.Screen
        name="Observacao"
        options={{ title: "Fazendas" }}
      />
      <Stack.Screen
        name="ScannerQR"
        options={{ title: "Scanner QR" }}
      />
    </Stack>
    </SafeAreaView>
  );
}
