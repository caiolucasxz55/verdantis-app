import React, { useMemo, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "../../../../components/ScreenContainer";
import { AppCard } from "../../../../components/AppCard";
import { AppButton } from "../../../../components/AppButton";
import { TraceabilityTimeline } from "../../../../components/TraceabilityTimeline";
import { TraceabilityEventForm } from "../../../../components/TraceabilityEventForm";
import { TraceabilityHashCard } from "../../../../components/TraceabilityHashCard";
import { theme } from "../../../../components/generic/theme";
import type { Cultivo, TraceabilityEvent, TraceabilityHash } from "../../../../types/domain";

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

export default function TraceabilityScreen() {
  const { lotId } = useLocalSearchParams<{ lotId: string }>();
  const cultivo = useMemo(() => cultivos.find((item) => item.id === lotId), [lotId]);

  const [events, setEvents] = useState<TraceabilityEvent[]>(cultivo?.events || []);
  const [isComplete, setIsComplete] = useState(Boolean(cultivo?.isComplete));
  const [hash, setHash] = useState<TraceabilityHash | null>(cultivo?.traceabilityHash || null);

  if (!cultivo) {
    return (
      <ScreenContainer>
        <Text style={styles.title}>Cultivo nao encontrado</Text>
      </ScreenContainer>
    );
  }

  const handleAddEvent = (event: TraceabilityEvent) => {
    setEvents((prev) => [event, ...prev]);
  };

  const handleFinalize = () => {
    if (events.length === 0) return;
    const generatedHash: TraceabilityHash = {
      lotId: cultivo.id,
      hash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
      generatedAt: new Date(),
      eventCount: events.length,
    };
    setHash(generatedHash);
    setIsComplete(true);
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Rastreabilidade</Text>
      <Text style={styles.subtitle}>{cultivo.name} • {cultivo.lot}</Text>

      <AppCard style={styles.section}>
        <Text style={styles.sectionTitle}>Timeline de eventos</Text>
        <TraceabilityTimeline events={events} />
      </AppCard>

      <AppCard style={styles.section}>
        <Text style={styles.sectionTitle}>Registrar evento</Text>
        <TraceabilityEventForm lotId={cultivo.id} onAddEvent={handleAddEvent} disabled={isComplete} />
        <View style={{ marginTop: 14 }}>
          <AppButton
            label="Finalizar cultivo"
            onPress={handleFinalize}
            disabled={isComplete || events.length === 0}
          />
        </View>
      </AppCard>

      {hash && (
        <View style={{ marginTop: 18 }}>
          <TraceabilityHashCard hash={hash} />
        </View>
      )}
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
  section: {
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
});
