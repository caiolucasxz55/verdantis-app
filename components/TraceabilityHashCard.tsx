import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Clipboard from "expo-clipboard";
import { AppCard } from "./AppCard";
import { theme } from "./generic/theme";
import type { TraceabilityHash } from "../types/domain";

interface TraceabilityHashCardProps {
  hash: TraceabilityHash;
}

export function TraceabilityHashCard({ hash }: TraceabilityHashCardProps) {
  const handleCopy = async () => {
    await Clipboard.setStringAsync(hash.hash);
  };

  return (
    <AppCard style={styles.card}>
      <Text style={styles.title}>Hash de rastreabilidade</Text>
      <Text style={styles.hash}>{hash.hash}</Text>
      <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
        <Text style={styles.copyText}>Copiar</Text>
      </TouchableOpacity>
      <Text style={styles.meta}>Gerado em: {hash.generatedAt.toLocaleDateString("pt-BR")}</Text>
      <Text style={styles.meta}>Eventos registrados: {hash.eventCount}</Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  hash: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  copyButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
  },
  copyText: {
    fontSize: 12,
    color: theme.colors.primaryDark,
    fontWeight: "600",
  },
  meta: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
});
