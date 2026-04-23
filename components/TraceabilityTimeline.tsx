import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "./generic/theme";
import type { TraceabilityEvent } from "../types/domain";

interface TraceabilityTimelineProps {
  events: TraceabilityEvent[];
}

const eventLabels: Record<TraceabilityEvent["type"], string> = {
  INPUT_ADDITION: "Adicao de Insumo",
  IRRIGATION: "Irrigacao",
  HARVEST: "Colheita",
  OTHER: "Outro",
};

export function TraceabilityTimeline({ events }: TraceabilityTimelineProps) {
  if (events.length === 0) {
    return <Text style={styles.empty}>Nenhum evento registrado.</Text>;
  }

  return (
    <View style={styles.container}>
      {events.map((event) => (
        <View key={event.id} style={styles.item}>
          <View style={styles.dot} />
          <View style={styles.content}>
            <Text style={styles.type}>{eventLabels[event.type]}</Text>
            <Text style={styles.description}>{event.description}</Text>
            <Text style={styles.date}>{event.timestamp.toLocaleDateString("pt-BR")}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  item: {
    flexDirection: "row",
    marginBottom: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
    marginTop: 6,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  type: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  description: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  date: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 6,
  },
  empty: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
});
