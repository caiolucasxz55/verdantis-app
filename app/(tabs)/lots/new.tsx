import React, { useMemo, useState } from "react";
import { Text, StyleSheet, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { AppButton } from "../../../components/AppButton";
import { AppCard } from "../../../components/AppCard";
import { theme } from "../../../components/generic/theme";
import type { LoteFormData } from "../../../types/domain";

export default function LotFormScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoteFormData>({
    name: "",
    crop: "",
    production: 0,
    cost: 0,
    salePrice: 0,
  });

  const profitPreview = useMemo(() => {
    const revenue = formData.production * formData.salePrice;
    const profit = revenue - formData.cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    return { revenue, profit, margin };
  }, [formData]);

  const updateField = (field: keyof LoteFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "name" || field === "crop" ? value : Number(value),
    }));
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Criar lote</Text>
      <Text style={styles.subtitle}>Preencha os dados do lote</Text>

      <AppCard style={styles.formCard}>
        <Text style={styles.label}>Nome do lote</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Lote A1"
          placeholderTextColor={theme.colors.textMuted}
          value={formData.name}
          onChangeText={(value) => updateField("name", value)}
        />

        <Text style={styles.label}>Cultura</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Milho"
          placeholderTextColor={theme.colors.textMuted}
          value={formData.crop}
          onChangeText={(value) => updateField("crop", value)}
        />

        <Text style={styles.label}>Producao (ton)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 180"
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="numeric"
          value={formData.production ? String(formData.production) : ""}
          onChangeText={(value) => updateField("production", value)}
        />

        <Text style={styles.label}>Custo (R$)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 9800"
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="numeric"
          value={formData.cost ? String(formData.cost) : ""}
          onChangeText={(value) => updateField("cost", value)}
        />

        <Text style={styles.label}>Preco de venda (R$)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 85"
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="numeric"
          value={formData.salePrice ? String(formData.salePrice) : ""}
          onChangeText={(value) => updateField("salePrice", value)}
        />
      </AppCard>

      <AppCard style={styles.previewCard}>
        <Text style={styles.previewTitle}>Preview de lucro</Text>
        <Text style={styles.previewText}>Receita: R$ {profitPreview.revenue.toLocaleString("pt-BR")}</Text>
        <Text style={styles.previewText}>Lucro: R$ {profitPreview.profit.toLocaleString("pt-BR")}</Text>
        <Text style={styles.previewText}>Margem: {profitPreview.margin.toFixed(1)}%</Text>
      </AppCard>

      <AppButton label="Salvar lote" onPress={() => router.replace("/(tabs)/lots")} />
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
  formCard: {
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textMuted,
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
  previewCard: {
    marginTop: 18,
    gap: 6,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  previewText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
});
