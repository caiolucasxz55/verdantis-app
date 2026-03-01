import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppCard } from "./AppCard";
import { theme } from "./generic/theme";
import type { Lote } from "../types/domain";

interface LotCardProps extends Lote {
  onPress: () => void;
}

export function LotCard({ name, crop, profit, cost, revenue, status, onPress }: LotCardProps) {
  const statusColor = status === "Finalizado" ? "#16a34a" : status === "Em Preparo" ? "#f59e0b" : "#2563eb";

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <AppCard style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.crop}>{crop}</Text>
          </View>
          <View style={[styles.badge, { borderColor: statusColor, backgroundColor: `${statusColor}20` }]}
          >
            <Text style={[styles.badgeText, { color: statusColor }]}>{status}</Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View>
            <Text style={styles.metricLabel}>Lucro</Text>
            <Text style={styles.metricValue}>R$ {profit.toLocaleString("pt-BR")}</Text>
          </View>
          <View>
            <Text style={styles.metricLabel}>Custo</Text>
            <Text style={styles.metricValue}>R$ {cost.toLocaleString("pt-BR")}</Text>
          </View>
          <View>
            <Text style={styles.metricLabel}>Receita</Text>
            <Text style={styles.metricValue}>R$ {revenue.toLocaleString("pt-BR")}</Text>
          </View>
        </View>
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
  crop: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
});
