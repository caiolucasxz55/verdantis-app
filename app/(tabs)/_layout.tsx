import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../components/generic/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: { backgroundColor: "#fff", borderTopColor: theme.colors.border },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            dashboard: "home-outline",
            "lotes/index": "grid-outline",
            analytics: "bar-chart-outline",
            profile: "person-outline",
            "cultivation/index": "leaf-outline",
          };
          const iconName = icons[route.name] ?? "ellipse-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Visible tabs (exactly 4) */}
      <Tabs.Screen name="dashboard" options={{ title: "Home" }} />
      <Tabs.Screen name="lotes/index" options={{ title: "Lotes" }} />
      <Tabs.Screen name="cultivation/index" options={{ title: "Cultivos" }} />
      <Tabs.Screen name="analytics" options={{ title: "Análises" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />

      {/* Hidden/internal routes */}
      {/* (none for now) */}
    </Tabs>
  );
}
