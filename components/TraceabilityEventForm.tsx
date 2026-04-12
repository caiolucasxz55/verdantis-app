import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "./generic/theme";
import type { TraceabilityEvent, TraceabilityEventType } from "../types/domain";

interface TraceabilityEventFormProps {
  lotId: string;
  onAddEvent: (event: TraceabilityEvent) => void;
  disabled?: boolean;
}

const eventTypes: { type: TraceabilityEventType; label: string }[] = [
  { type: "INPUT_ADDITION", label: "Adicao de Insumo" },
  { type: "IRRIGATION", label: "Irrigacao" },
  { type: "HARVEST", label: "Colheita" },
  { type: "OTHER", label: "Outro" },
];

export function TraceabilityEventForm({ lotId, onAddEvent, disabled }: TraceabilityEventFormProps) {
  const [type, setType] = useState<TraceabilityEventType>("INPUT_ADDITION");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (disabled) return;
    if (!description.trim()) return;

    onAddEvent({
      id: `${Date.now()}`,
      lotId,
      type,
      description,
      timestamp: new Date(),
    });

    setDescription("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tipo de evento</Text>
      <View style={styles.typeRow}>
        {eventTypes.map((item) => (
          <TouchableOpacity
            key={item.type}
            onPress={() => setType(item.type)}
            disabled={disabled}
            style={[
              styles.typeChip,
              type === item.type && styles.typeChipActive,
              disabled && styles.disabled,
              { marginRight: 8, marginTop: 8 },
            ]}
          >
            <Text style={[styles.typeText, type === item.type && styles.typeTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Descricao</Text>
      <TextInput
        style={styles.input}
        placeholder="Descreva o evento"
        placeholderTextColor={theme.colors.textMuted}
        value={description}
        onChangeText={setDescription}
        editable={!disabled}
      />

      <TouchableOpacity onPress={handleSubmit} style={[styles.button, disabled && styles.disabled]}>
        <Text style={styles.buttonText}>Adicionar evento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textMuted,
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  typeChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
  },
  typeChipActive: {
    backgroundColor: theme.colors.primary,
  },
  typeText: {
    fontSize: 12,
    color: theme.colors.textPrimary,
  },
  typeTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.textPrimary,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.5,
  },
});
