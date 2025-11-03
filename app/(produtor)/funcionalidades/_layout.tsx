// app/(produtor)/funcionalidades/_layout.tsx
import { Stack } from "expo-router";

export default function FuncionalidadesLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="Propriedade"
        options={{ title: "Cadastrar Propriedade" }}
      />
      <Stack.Screen
        name="RegistroLote"
        options={{ title: "Registrar Lote e Cultivo" }}
      />
      <Stack.Screen
        name="ScannerQR"
        options={{ title: "Scanner de QR Code" }}
      />
    </Stack>
  );
}
