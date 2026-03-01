import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "../../../../components/ScreenContainer";
import { StatCard } from "../../../../components/StatCard";
import { AppButton } from "../../../../components/AppButton";
import { AppCard } from "../../../../components/AppCard";
import { theme } from "../../../../components/generic/theme";
import type { Cultivo } from "../../../../types/domain";

const cultivos: Cultivo[] = [
  {
    id: "1",
    name: "Milho",
    lot: "Lote A1",
    lotId: "1",
    farm: "Fazenda Sao Jose",
    status: "Em Crescimento",
    plantingDate: "15 de Janeiro, 2025",
    harvestDate: "20 de Maio, 2025",
    area: 25,
    daysUntilHarvest: 90,
    progress: 65,
    irrigation: true,
    weather: true,
    variety: "AG 8088 PRO3",
    expectedYield: 180,
    events: [
      { id: "e1", lotId: "1", type: "INPUT_ADDITION", description: "Aplicacao de fertilizante NPK", timestamp: new Date("2025-01-20") },
      { id: "e2", lotId: "1", type: "IRRIGATION", description: "Irrigacao por gotejamento", timestamp: new Date("2025-02-05") },
    ],
  },
  {
    id: "2",
    name: "Soja",
    lot: "Lote B1",
    lotId: "2",
    farm: "Fazenda Boa Vista",
    status: "Plantio",
    plantingDate: "10 de Marco, 2025",
    harvestDate: "15 de Julho, 2025",
    area: 30,
    daysUntilHarvest: 127,
    progress: 15,
    irrigation: true,
    weather: true,
    variety: "M 6210 IPRO",
    expectedYield: 210,
    events: [],
  },
  {
    id: "3",
    name: "Alface",
    lot: "Lote C2",
    lotId: "3",
    farm: "Fazenda Verde",
    status: "Colheita",
    plantingDate: "20 de Fevereiro, 2025",
    harvestDate: "05 de Abril, 2025",
    area: 15,
    daysUntilHarvest: 0,
    progress: 100,
    irrigation: true,
    weather: true,
    variety: "Crespa",
    expectedYield: 45,
    isComplete: true,
    traceabilityHash: {
      lotId: "3",
      hash: "0xa3f7b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
      generatedAt: new Date("2025-04-06"),
      eventCount: 5,
    },
    events: [
      { id: "e4", lotId: "3", type: "INPUT_ADDITION", description: "Adubacao organica", timestamp: new Date("2025-02-22") },
      { id: "e5", lotId: "3", type: "IRRIGATION", description: "Irrigacao por aspersao", timestamp: new Date("2025-03-01") },
      { id: "e6", lotId: "3", type: "HARVEST", description: "Colheita manual", timestamp: new Date("2025-04-05") },
    ],
  },
];

export default function CultivationDetailsScreen() {
  const { lotId } = useLocalSearchParams<{ lotId: string }>();
  const router = useRouter();
  const cultivo = cultivos.find((item) => item.id === lotId);

  if (!cultivo) {
    return (
      <ScreenContainer>
        <Text style={styles.title}>Cultivo nao encontrado</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>{cultivo.name}</Text>
      <Text style={styles.subtitle}>{cultivo.lot} • {cultivo.farm}</Text>

      <AppCard style={styles.progressCard}>
        <Text style={styles.progressTitle}>Progresso da safra</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${cultivo.progress}%` }]} />
        </View>
        <Text style={styles.progressValue}>{cultivo.progress}% concluido</Text>
      </AppCard>

      <View style={styles.grid}>
        <StatCard title="Status" value={cultivo.status} />
        <StatCard title="Plantio" value={cultivo.plantingDate} />
        <StatCard title="Colheita" value={cultivo.harvestDate} />
        <StatCard title="Area" value={`${cultivo.area} ha`} />
      </View>

      <AppButton
        label="Ver rastreabilidade"
        onPress={() => router.push(`/(tabs)/cultivation/${cultivo.id}/traceability`)}
      />
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
  progressCard: {
    gap: 10,
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#e2e8f0",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  progressValue: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  grid: {
    gap: 12,
    marginBottom: 18,
  },
});
