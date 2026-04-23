import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppCard } from "./AppCard";
import { theme } from "./generic/theme";
import type { Cultivo } from "../types/domain";

interface CultivationLotCardProps {
  cultivo: Cultivo;
  onPress: () => void;
}

export function CultivationLotCard({ cultivo, onPress }: CultivationLotCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <AppCard style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{cultivo.name}</Text>
            <Text style={styles.subtitle}>{cultivo.lot} • {cultivo.farm}</Text>
          </View>
          <Text style={styles.status}>{cultivo.status}</Text>
        </View>

        <View style={styles.progressRow}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${cultivo.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{cultivo.progress}%</Text>
        </View>

        <Text style={styles.events}>Eventos: {cultivo.events?.length ?? 0}</Text>
      </AppCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  status: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primaryDark,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "600",
  },
  events: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
});
