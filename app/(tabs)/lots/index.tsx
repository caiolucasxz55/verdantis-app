import React from "react";
import { Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { LotCard } from "../../../components/LotCard";
import { AppButton } from "../../../components/AppButton";
import { theme } from "../../../components/generic/theme";
import type { Lote } from "../../../types/domain";

const lots: Lote[] = [
  { id: "1", name: "Lote A1", crop: "Milho", production: 185, cost: 11500, salePrice: 85, revenue: 15725, profit: 4225, margin: 26.9, status: "Ativo", propertyName: "Fazenda Sao Jose" },
  { id: "2", name: "Lote B2", crop: "Soja", production: 160, cost: 8800, salePrice: 120, revenue: 19200, profit: 10400, margin: 54.2, status: "Ativo", propertyName: "Fazenda Boa Vista" },
  { id: "3", name: "Lote C3", crop: "Cafe", production: 75, cost: 16200, salePrice: 180, revenue: 13500, profit: -2700, margin: -20.0, status: "Ativo", propertyName: "Fazenda Verde" },
  { id: "4", name: "Lote D4", crop: "Trigo", production: 130, cost: 7200, salePrice: 70, revenue: 9100, profit: 1900, margin: 20.9, status: "Finalizado", propertyName: "Fazenda Sao Jose" },
];

export default function LotsScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <Text style={styles.title}>Lotes</Text>
      <Text style={styles.subtitle}>Gerencie seus lotes e acompanhe a lucratividade</Text>

      <AppButton label="Criar lote" onPress={() => router.push("/(tabs)/lots/new")} />

      {lots.map((lot) => (
        <LotCard key={lot.id} {...lot} onPress={() => router.push(`/(tabs)/lots/${lot.id}`)} />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    color: theme.colors.textMuted,
  },
});
