import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

export default function ProdutorLayout() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f7f9fa" }}
      edges={["top", "left", "right", "bottom"]}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#2e7d32",
          tabBarInactiveTintColor: "#999",
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopColor: "#ddd",
            height: 60,
            paddingBottom: 4,
          },
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            title: "Início",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Dashboard"
          options={{
            title: "Produção",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bar-chart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Contact"
          options={{
            title: "Mensagens",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubbles-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(funcionalidades)"
          options={{ href: null }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
