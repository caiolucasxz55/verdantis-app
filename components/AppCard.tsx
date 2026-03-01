import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { theme } from "./generic/theme";

interface AppCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function AppCard({ children, style }: AppCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: theme.radius.lg,
    padding: 16,
    ...theme.shadow.soft,
  },
});
