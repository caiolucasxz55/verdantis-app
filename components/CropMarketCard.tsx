import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { AppCard } from "./AppCard";
import { theme } from "./generic/theme";
import type { CropMarketData } from "../types/domain";

export function CropMarketCard({ name, imageUrl, pricePerSack, priceTrend }: CropMarketData) {
  const trendText = priceTrend === "up" ? "Em alta" : priceTrend === "down" ? "Em baixa" : "Estavel";
  const trendColor = priceTrend === "up" ? "#16a34a" : priceTrend === "down" ? "#dc2626" : "#f59e0b";

  return (
    <AppCard style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>R$ {pricePerSack.toFixed(2)} / saca</Text>
      </View>
      <View style={[styles.badge, { borderColor: trendColor, backgroundColor: `${trendColor}20` }]}
      >
        <Text style={[styles.badgeText, { color: trendColor }]}>{trendText}</Text>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#e2e8f0",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  price: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 4,
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
});
