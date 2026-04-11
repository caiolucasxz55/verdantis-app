import React, { useMemo, useState } from "react";
import { Text, StyleSheet, TextInput, View, ScrollView, Modal } from "react-native";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { LotCard } from "../../../components/LotCard";
import { AppButton } from "../../../components/AppButton";
import { AppCard } from "../../../components/AppCard";
import { theme } from "../../../components/generic/theme";
import type { Lote, LoteFormData } from "../../../types/domain";

const initialLots: Lote[] = [
  { id: "1", name: "Lote A1", crop: "Milho", production: 185, cost: 11500, salePrice: 85, revenue: 15725, profit: 4225, margin: 26.9, status: "Ativo", propertyName: "Fazenda Sao Jose" },
  { id: "2", name: "Lote B2", crop: "Soja", production: 160, cost: 8800, salePrice: 120, revenue: 19200, profit: 10400, margin: 54.2, status: "Ativo", propertyName: "Fazenda Boa Vista" },
  { id: "3", name: "Lote C3", crop: "Cafe", production: 75, cost: 16200, salePrice: 180, revenue: 13500, profit: -2700, margin: -20.0, status: "Ativo", propertyName: "Fazenda Verde" },
  { id: "4", name: "Lote D4", crop: "Trigo", production: 130, cost: 7200, salePrice: 70, revenue: 9100, profit: 1900, margin: 20.9, status: "Finalizado", propertyName: "Fazenda Sao Jose" },
];

export default function LotsScreen() {
  const [lots, setLots] = useState<Lote[]>(initialLots);
  const [formData, setFormData] = useState<LoteFormData>({ name: "", crop: "", production: 0, cost: 0, salePrice: 0 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<Lote | null>(null);

  const profitPreview = useMemo(() => {
    const revenue = formData.production * formData.salePrice;
    const profit = revenue - formData.cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    return { revenue, profit, margin };
  }, [formData]);

  const updateField = (field: keyof LoteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: field === "name" || field === "crop" ? value : Number(value) }));
  };

  const saveLot = () => {
    const id = String(Date.now());
    const revenue = formData.production * formData.salePrice;
    const profit = revenue - formData.cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const newLot: Lote = { id, name: formData.name || `Lote ${id}`, crop: formData.crop || "—", production: formData.production, cost: formData.cost, salePrice: formData.salePrice, revenue, profit, margin, status: "Ativo", propertyName: "Minha Fazenda" };
    setLots((prev) => [newLot, ...prev]);
    setFormData({ name: "", crop: "", production: 0, cost: 0, salePrice: 0 });
    setIsFormOpen(false);
  };

  const closeDetails = () => setSelectedLot(null);

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Lotes</Text>
        <Text style={styles.subtitle}>Crie e gerencie seus lotes abaixo</Text>

        <View style={styles.actionsRow}>
          <AppButton label="Novo lote" onPress={() => setIsFormOpen(true)} />
        </View>

        <View style={styles.listContainer}>
          {lots.map((lot) => (
            <LotCard key={lot.id} {...lot} onPress={() => setSelectedLot(lot)} />
          ))}
        </View>
      </ScrollView>

      <Modal visible={isFormOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Novo lote</Text>
              <Text style={styles.subtitle}>Preencha os dados do lote</Text>

              <AppCard style={styles.formCard}>
                <Text style={styles.label}>Nome do lote</Text>
                <TextInput style={styles.input} placeholder="Ex: Lote A1" placeholderTextColor={theme.colors.textMuted} value={formData.name} onChangeText={(v) => updateField("name", v)} />

                <Text style={styles.label}>Cultura</Text>
                <TextInput style={styles.input} placeholder="Ex: Milho" placeholderTextColor={theme.colors.textMuted} value={formData.crop} onChangeText={(v) => updateField("crop", v)} />

                <Text style={styles.label}>Producao (ton)</Text>
                <TextInput style={styles.input} placeholder="Ex: 180" placeholderTextColor={theme.colors.textMuted} keyboardType="numeric" value={formData.production ? String(formData.production) : ""} onChangeText={(v) => updateField("production", v)} />

                <Text style={styles.label}>Custo (R$)</Text>
                <TextInput style={styles.input} placeholder="Ex: 9800" placeholderTextColor={theme.colors.textMuted} keyboardType="numeric" value={formData.cost ? String(formData.cost) : ""} onChangeText={(v) => updateField("cost", v)} />

                <Text style={styles.label}>Preco de venda (R$)</Text>
                <TextInput style={styles.input} placeholder="Ex: 85" placeholderTextColor={theme.colors.textMuted} keyboardType="numeric" value={formData.salePrice ? String(formData.salePrice) : ""} onChangeText={(v) => updateField("salePrice", v)} />

                <View style={styles.previewRow}>
                  <Text style={styles.previewText}>Receita: R$ {profitPreview.revenue.toLocaleString("pt-BR")}</Text>
                  <Text style={styles.previewText}>Lucro: R$ {profitPreview.profit.toLocaleString("pt-BR")}</Text>
                  <Text style={styles.previewText}>Margem: {profitPreview.margin.toFixed(1)}%</Text>
                </View>

                <AppButton label="Salvar lote" onPress={saveLot} />
                <View style={{ marginTop: 10 }}>
                  <AppButton label="Cancelar" onPress={() => setIsFormOpen(false)} variant="secondary" />
                </View>
              </AppCard>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={!!selectedLot} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedLot && (
              <>
                <Text style={styles.title}>{selectedLot.name}</Text>
                <Text style={styles.subtitle}>{selectedLot.crop} • {selectedLot.propertyName}</Text>

                <View style={styles.grid}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Lucro</Text>
                    <Text style={styles.statValue}>R$ {selectedLot.profit.toLocaleString("pt-BR")}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Receita</Text>
                    <Text style={styles.statValue}>R$ {selectedLot.revenue.toLocaleString("pt-BR")}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Custo</Text>
                    <Text style={styles.statValue}>R$ {selectedLot.cost.toLocaleString("pt-BR")}</Text>
                  </View>
                </View>

                <View style={{ marginTop: 12 }}>
                  <AppButton label="Fechar" onPress={closeDetails} />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    marginBottom: 12,
    color: theme.colors.textMuted,
  },
  actionsRow: {
    marginBottom: 12,
  },
  formCard: {
    padding: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textMuted,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.textPrimary,
    marginTop: 6,
  },
  previewRow: {
    marginTop: 12,
    marginBottom: 12,
  },
  previewText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  listContainer: {
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.backgroundOverlay,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    padding: 16,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    maxHeight: "80%",
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  statBox: {
    flex: 1,
    padding: 8,
    marginRight: 8,
    backgroundColor: theme.colors.textLight,
    borderRadius: theme.radius.md,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginTop: 6,
  },
});
