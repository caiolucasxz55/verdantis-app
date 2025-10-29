// app/(produtor)/_layout.tsx
import { Tabs } from "expo-router";

export default function ProdutorLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="Home" />
      <Tabs.Screen name="Dashboard" />
      <Tabs.Screen name="Contact" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
