import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { LotCard } from "../../../components/LotCard";
import { AppButton } from "../../../components/AppButton";
import { AppCard } from "../../../components/AppCard";
import { theme } from "../../../components/generic/theme";
import { useToast } from "../../../context/ToastContext";
import { notifySuccess } from "../../../services/notifications";
import type { Lote, LoteFormData } from "../../../types/domain";
import { createLote, deleteLote, getLotes } from "../../../api/lotes";
import type { LoteDto } from "../../../api/types";

export default function LotsScreen() {
  const { showToast } = useToast();
  const [lots, setLots] = useState<Lote[]>([]);
  const [formData, setFormData] = useState<LoteFormData>({
    name: "",
    crop: "",
    production: 0,
    cost: 0,
    salePrice: 0,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<Lote | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapLoteDtoToUi = (dto: LoteDto): Lote => {
    const production = dto.producao ?? 0;
    const cost = dto.custo ?? 0;
    const revenue = dto.receita ?? 0;
    const profit = dto.lucroEstimado ?? 0;
    const salePrice = production > 0 ? revenue / production : 0;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const status = (dto.status || "ativo").toLowerCase() === "finalizado" ? "Finalizado" : "Ativo";
    return {
      id: String(dto.id),
      name: dto.lote,
      crop: dto.cultura,
      production,
      cost,
      salePrice,
      revenue,
      profit,
      margin,
      status,
      propertyName: "Minha Fazenda",
    };
  };

  const loadLots = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLotes();
      setLots(data.map(mapLoteDtoToUi));
    } catch (err: any) {
      console.error("Erro ao carregar lotes:", err);
      setError("Não foi possível carregar os lotes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLots();
  }, []);

  const profitPreview = useMemo(() => {
    const revenue = formData.production * formData.salePrice;
    const profit = revenue - formData.cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    return { revenue, profit, margin };
  }, [formData]);

  const updateField = (field: keyof LoteFormData, value: string) => {
    const parseNumber = (raw: string): number => {
      const normalized = raw.replace(/\s/g, "").replace(",", ".");
      const n = Number(normalized);
      return Number.isFinite(n) ? n : 0;
    };
    setFormData((prev) => ({
      ...prev,
      [field]: field === "name" || field === "crop" ? value : parseNumber(value),
    }));
  };

  const saveLot = async () => {
    if (!formData.name.trim() || !formData.crop.trim()) {
      showToast("Informe o nome do lote e a cultura.", "warning");
      return;
    }
    try {
      setSaving(true);
      await createLote({
        nomeLote: formData.name,
        cultura: formData.crop,
        producaoTotal: formData.production,
        custoTotal: formData.cost,
        precoVenda: formData.salePrice,
      });
      setFormData({ name: "", crop: "", production: 0, cost: 0, salePrice: 0 });
      setIsFormOpen(false);
      showToast(`Lote "${formData.name}" criado com sucesso!`, "success");
      await notifySuccess(`Lote "${formData.name}" foi criado.`);
      await loadLots();
    } catch (err: any) {
      console.error("Erro ao salvar lote:", err);
      showToast("Não foi possível salvar o lote.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (lot: Lote) => {
    Alert.alert(
      "Excluir lote",
      `Deseja excluir o lote "${lot.name}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteLote(Number(lot.id));
              setSelectedLot(null);
              showToast(`Lote "${lot.name}" excluído.`, "info");
              await loadLots();
            } catch (err: any) {
              console.error("Erro ao excluir lote:", err);
              showToast("Não foi possível excluir o lote.", "error");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Lotes</Text>
            <Text style={styles.subtitle}>
              {lots.length > 0 ? `${lots.length} lote${lots.length > 1 ? "s" : ""} cadastrado${lots.length > 1 ? "s" : ""}` : "Nenhum lote cadastrado"}
            </Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setIsFormOpen(true)}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Error banner */}
        {error && !loading ? (
          <TouchableOpacity style={styles.errorBanner} onPress={() => void loadLots()}>
            <Ionicons name="alert-circle-outline" size={16} color={theme.colors.error} />
            <Text style={styles.errorText}>{error} Toque para tentar novamente.</Text>
          </TouchableOpacity>
        ) : null}

        {/* List */}
        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Carregando lotes...</Text>
            </View>
          ) : lots.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="grid-outline" size={48} color={theme.colors.border} />
              <Text style={styles.emptyTitle}>Nenhum lote ainda</Text>
              <Text style={styles.emptyDesc}>
                Crie seu primeiro lote para começar a acompanhar sua produção.
              </Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => setIsFormOpen(true)}>
                <Text style={styles.emptyBtnText}>Criar primeiro lote</Text>
              </TouchableOpacity>
            </View>
          ) : (
            lots.map((lot) => <LotCard key={lot.id} {...lot} onPress={() => setSelectedLot(lot)} />)
          )}
        </View>
      </ScrollView>

      {/* Create form modal */}
      <Modal visible={isFormOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {/* Modal handle */}
              <View style={styles.modalHandle} />

              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Novo lote</Text>
                  <Text style={styles.modalSubtitle}>Preencha os dados do lote</Text>
                </View>
                <TouchableOpacity onPress={() => setIsFormOpen(false)} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color={theme.colors.textMuted} />
                </TouchableOpacity>
              </View>

              <AppCard style={styles.formCard}>
                <FormField
                  label="Nome do lote *"
                  placeholder="Ex: Lote A1"
                  value={formData.name}
                  onChangeText={(v) => updateField("name", v)}
                />
                <FormField
                  label="Cultura *"
                  placeholder="Ex: Milho"
                  value={formData.crop}
                  onChangeText={(v) => updateField("crop", v)}
                />
                <FormField
                  label="Produção (ton)"
                  placeholder="Ex: 180"
                  keyboardType="numeric"
                  value={formData.production ? String(formData.production) : ""}
                  onChangeText={(v) => updateField("production", v)}
                />
                <FormField
                  label="Custo (R$)"
                  placeholder="Ex: 9800"
                  keyboardType="numeric"
                  value={formData.cost ? String(formData.cost) : ""}
                  onChangeText={(v) => updateField("cost", v)}
                />
                <FormField
                  label="Preço de venda (R$/ton)"
                  placeholder="Ex: 85"
                  keyboardType="numeric"
                  value={formData.salePrice ? String(formData.salePrice) : ""}
                  onChangeText={(v) => updateField("salePrice", v)}
                />

                {/* Preview */}
                <View style={styles.previewBox}>
                  <Text style={styles.previewTitle}>Previsão financeira</Text>
                  <View style={styles.previewRow}>
                    <PreviewItem
                      label="Receita"
                      value={`R$ ${profitPreview.revenue.toLocaleString("pt-BR")}`}
                    />
                    <PreviewItem
                      label="Lucro"
                      value={`R$ ${profitPreview.profit.toLocaleString("pt-BR")}`}
                      positive={profitPreview.profit >= 0}
                    />
                    <PreviewItem
                      label="Margem"
                      value={`${profitPreview.margin.toFixed(1)}%`}
                      positive={profitPreview.margin >= 0}
                    />
                  </View>
                </View>
              </AppCard>

              <AppButton label={saving ? "Salvando..." : "Salvar lote"} onPress={saveLot} disabled={saving} />
              <View style={{ marginTop: 10 }}>
                <AppButton label="Cancelar" onPress={() => setIsFormOpen(false)} variant="secondary" />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Details modal */}
      <Modal visible={!!selectedLot} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedLot && (
              <>
                <View style={styles.modalHandle} />
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>{selectedLot.name}</Text>
                    <Text style={styles.modalSubtitle}>
                      {selectedLot.crop} • {selectedLot.propertyName}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, selectedLot.status === "Finalizado" && styles.statusBadgeDone]}>
                    <Text style={[styles.statusText, selectedLot.status === "Finalizado" && styles.statusTextDone]}>
                      {selectedLot.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.statsGrid}>
                  <StatBox label="Lucro" value={`R$ ${selectedLot.profit.toLocaleString("pt-BR")}`} color={selectedLot.profit >= 0 ? theme.colors.success : theme.colors.error} />
                  <StatBox label="Receita" value={`R$ ${selectedLot.revenue.toLocaleString("pt-BR")}`} />
                  <StatBox label="Custo" value={`R$ ${selectedLot.cost.toLocaleString("pt-BR")}`} />
                  <StatBox label="Margem" value={`${selectedLot.margin.toFixed(1)}%`} color={selectedLot.margin >= 0 ? theme.colors.success : theme.colors.error} />
                </View>

                <View style={{ marginTop: 16, gap: 10 }}>
                  <AppButton label="Fechar" onPress={() => setSelectedLot(null)} />
                  <AppButton
                    label={deleting ? "Excluindo..." : "Excluir lote"}
                    variant="secondary"
                    onPress={() => void handleDelete(selectedLot)}
                    disabled={deleting}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: "default" | "numeric";
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={fieldStyles.wrap}>
      <Text style={fieldStyles.label}>{label}</Text>
      <TextInput
        style={[fieldStyles.input, focused && fieldStyles.inputFocused]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? "default"}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

function PreviewItem({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  const color =
    positive === undefined
      ? theme.colors.textPrimary
      : positive
      ? theme.colors.success
      : theme.colors.error;
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Text style={{ fontSize: 11, color: theme.colors.textMuted, fontWeight: "600" }}>{label}</Text>
      <Text style={{ fontSize: 14, fontWeight: "700", color, marginTop: 2 }}>{value}</Text>
    </View>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <View style={statStyles.box}>
      <Text style={statStyles.label}>{label}</Text>
      <Text style={[statStyles.value, color ? { color } : null]}>{value}</Text>
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrap: { marginTop: 10 },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textMuted,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: theme.colors.textPrimary,
    fontSize: 15,
  },
  inputFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: "#fff",
  },
});

const statStyles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: 12,
    marginRight: 8,
  },
  label: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  value: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginTop: 4,
  },
});

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadow.strong,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.errorLight,
    borderRadius: theme.radius.sm,
    padding: 12,
    marginBottom: 12,
  },
  errorText: { color: theme.colors.error, fontSize: 13, flex: 1 },
  listContainer: { marginTop: 4 },
  loadingBox: {
    paddingVertical: 48,
    alignItems: "center",
    gap: 12,
  },
  loadingText: { color: theme.colors.textMuted, fontSize: 14 },
  emptyBox: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 10,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginTop: 4,
  },
  emptyDesc: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  emptyBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.backgroundOverlay,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    maxHeight: "88%",
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  modalSubtitle: {
    marginTop: 3,
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  formCard: { marginBottom: 16 },
  previewBox: {
    marginTop: 16,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.sm,
    padding: 12,
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.primaryDark,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  previewRow: { flexDirection: "row" },
  statsGrid: {
    flexDirection: "row",
    gap: 0,
    marginTop: 12,
  },
  statusBadge: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  statusBadgeDone: {
    backgroundColor: theme.colors.infoLight,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primaryDark,
  },
  statusTextDone: {
    color: theme.colors.info,
  },
});
