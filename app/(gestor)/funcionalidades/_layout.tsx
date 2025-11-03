import { Stack } from "expo-router";

export default function FuncionalidadesLayout() {
  return (
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
  );
}
