import React from "react";
import { Text, StyleSheet, ViewStyle, View } from "react-native";
import { AppCard } from "./AppCard";
import { theme } from "./generic/theme";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  style?: ViewStyle;
}

export function StatCard({ title, value, description, style }: StatCardProps) {
  return (
    <AppCard style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 6,
  },
  title: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "600",
  },
  value: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  description: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
});
