import React from "react";
import { Text, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { AppCard } from "./AppCard";
import { theme } from "./generic/theme";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  style?: StyleProp<ViewStyle>;
}

export function StatCard({ title, value, description, style }: StatCardProps) {
  return (
    <AppCard style={style}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "600",
  },
  value: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  description: {
    marginTop: 6,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
});
