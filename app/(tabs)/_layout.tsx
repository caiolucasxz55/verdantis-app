import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../components/generic/theme";

function TabIcon({
  name,
  color,
  focused,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
}) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons name={name} size={22} color={color} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, focused }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            dashboard: focused ? "home" : "home-outline",
            "lotes/index": focused ? "grid" : "grid-outline",
            analytics: focused ? "bar-chart" : "bar-chart-outline",
            profile: focused ? "person" : "person-outline",
            "cultivation/index": focused ? "leaf" : "leaf-outline",
          };
          const iconName = icons[route.name] ?? "ellipse-outline";
          return <TabIcon name={iconName} color={color} focused={focused} />;
        },
      })}
    >
      <Tabs.Screen name="dashboard" options={{ title: "Home" }} />
      <Tabs.Screen name="lotes/index" options={{ title: "Lotes" }} />
      <Tabs.Screen name="cultivation/index" options={{ title: "Cultivos" }} />
      <Tabs.Screen name="analytics" options={{ title: "Análises" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    height: Platform.OS === "ios" ? 84 : 64,
    paddingBottom: Platform.OS === "ios" ? 24 : 8,
    paddingTop: 6,
    ...theme.shadow.soft,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  iconWrap: {
    width: 40,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.sm,
  },
  iconWrapActive: {
    backgroundColor: theme.colors.primaryLight,
  },
});
