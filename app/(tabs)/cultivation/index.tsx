import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

import { ScreenContainer } from "../../../components/ScreenContainer";
import { CultivationLotCard } from "../../../components/CultivationLotCard";
import { AppCard } from "../../../components/AppCard";
import { AppButton } from "../../../components/AppButton";
import { TraceabilityTimeline } from "../../../components/TraceabilityTimeline";
import { TraceabilityEventForm } from "../../../components/TraceabilityEventForm";
import { theme } from "../../../components/generic/theme";
import { useToast } from "../../../context/ToastContext";
import { notifySuccess } from "../../../services/notifications";
import type { Cultivo, TraceabilityEvent } from "../../../types/domain";

import { addEventoLote, getEventosLote, getLotes } from "../../../api/lotes";
import type { EventoLoteDto, LoteDto } from "../../../api/types";

function formatMaybeDate(dateIso?: string): string {
  if (!dateIso) return "—";
  const parsed = new Date(dateIso);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("pt-BR");
}

function mapEventoDtoToTraceabilityEvent(ev: EventoLoteDto): TraceabilityEvent {
  const allowed = new Set(["INPUT_ADDITION", "IRRIGATION", "HARVEST", "OTHER"]);
  const type = allowed.has(ev.tipoEvento) ? (ev.tipoEvento as any) : "OTHER";
  const timestampSource = ev.dataPlantio || ev.dataColheitaEstimada;
  const parsed = timestampSource ? new Date(timestampSource) : new Date();
  return {
    id: String(ev.id),
    lotId: String(ev.loteId),
    type,
    description: ev.descricao,
    timestamp: Number.isNaN(parsed.getTime()) ? new Date() : parsed,
  };
}

function mapLoteDtoToCultivo(lote: LoteDto): Cultivo {
  const isFinal = String(lote.status).toLowerCase().includes("final");
  return {
    id: String(lote.id),
    name: lote.cultura,
    lot: lote.lote,
    lotId: String(lote.id),
    farm: "—",
    status: isFinal ? "Colheita" : "Em Crescimento",
    plantingDate: "—",
    harvestDate: "—",
    area: 0,
    daysUntilHarvest: 0,
    progress: isFinal ? 100 : 60,
    irrigation: false,
    weather: false,
    variety: "—",
    expectedYield: lote.producao ?? 0,
    isComplete: isFinal,
    events: [],
  };
}

export default function CultivationScreen() {
  const { showToast } = useToast();
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [loadingCultivos, setLoadingCultivos] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<Cultivo | null>(null);
  const [showTrace, setShowTrace] = useState(false);
  const [events, setEvents] = useState<TraceabilityEvent[]>([]);
  const [finalizedEvents, setFinalizedEvents] = useState<TraceabilityEvent[] | null>(null);
  const [showListModal, setShowListModal] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [addingEvent, setAddingEvent] = useState(false);

  const [showQrPreview, setShowQrPreview] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const loadCultivos = async () => {
    try {
      setLoadingCultivos(true);
      setError(null);
      const lotes = await getLotes();
      const baseCultivos = lotes.map(mapLoteDtoToCultivo);
      setCultivos(baseCultivos);

      const extras = await Promise.all(
        lotes.map(async (lote) => {
          try {
            const evs = await getEventosLote(lote.id);
            const mapped = evs.map(mapEventoDtoToTraceabilityEvent);
            const plant = evs.find((e) => !!e.dataPlantio)?.dataPlantio;
            const harvest = evs.find((e) => !!e.dataColheitaEstimada)?.dataColheitaEstimada;
            return {
              loteId: String(lote.id),
              events: mapped,
              plantingDate: formatMaybeDate(plant),
              harvestDate: formatMaybeDate(harvest),
            };
          } catch {
            return {
              loteId: String(lote.id),
              events: [] as TraceabilityEvent[],
              plantingDate: "—",
              harvestDate: "—",
            };
          }
        })
      );

      setCultivos((prev) =>
        prev.map((c) => {
          const match = extras.find((x) => x.loteId === c.lotId);
          return match
            ? { ...c, events: match.events, plantingDate: match.plantingDate, harvestDate: match.harvestDate }
            : c;
        })
      );
    } catch (err) {
      console.error("Erro ao carregar cultivos:", err);
      setError("Não foi possível carregar os cultivos.");
    } finally {
      setLoadingCultivos(false);
    }
  };

  useEffect(() => {
    void loadCultivos();
  }, []);

  const selectedLotId = useMemo(() => {
    if (!selected) return null;
    const id = Number(selected.lotId);
    return Number.isFinite(id) ? id : null;
  }, [selected]);

  const openDetails = async (c: Cultivo) => {
    setSelected(c);
    setFinalizedEvents(null);
    setEvents(c.events || []);

    const id = Number(c.lotId);
    if (!Number.isFinite(id)) return;

    try {
      setLoadingEvents(true);
      const evs = await getEventosLote(id);
      const mapped = evs.map(mapEventoDtoToTraceabilityEvent);
      setEvents(mapped);
      setCultivos((prev) => prev.map((x) => (x.lotId === c.lotId ? { ...x, events: mapped } : x)));
    } catch (err) {
      console.error("Erro ao carregar eventos do lote:", err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleAddEvent = (event: TraceabilityEvent) => {
    if (!selectedLotId) return;
    setEvents((prev) => [event, ...prev]);

    const run = async () => {
      try {
        setAddingEvent(true);
        const nowIso = new Date().toISOString();
        await addEventoLote(selectedLotId, {
          tipoEvento: event.type,
          descricao: event.description,
          dataPlantio: nowIso,
          dataColheitaEstimada: nowIso,
        });

        const evs = await getEventosLote(selectedLotId);
        const mapped = evs.map(mapEventoDtoToTraceabilityEvent);
        setEvents(mapped);
        setCultivos((prev) =>
          prev.map((x) => (x.lotId === String(selectedLotId) ? { ...x, events: mapped } : x))
        );
        showToast("Evento registrado com sucesso!", "success");
        await notifySuccess(`Evento "${event.type}" registrado no cultivo.`);
      } catch (err) {
        console.error("Erro ao adicionar evento:", err);
        showToast("Não foi possível salvar o evento.", "error");
      } finally {
        setAddingEvent(false);
      }
    };

    void run();
  };

  const handleFinalize = () => {
    if (!selected || events.length === 0) {
      showToast("Adicione ao menos um evento antes de finalizar.", "warning");
      return;
    }
    setSelected((prev) => (prev ? { ...prev, isComplete: true } : prev));
    setFinalizedEvents(events.slice());
    showToast("Cultivo finalizado! Pronto para exportação.", "success");
    void notifySuccess(`Cultivo "${selected.name}" finalizado com sucesso.`);
  };

  const handleDownloadPDF = async () => {
    const list = finalizedEvents ?? events;
    if (!list || list.length === 0) {
      showToast("Nenhum evento para exportar.", "warning");
      return;
    }
    const html = `
      <html><body>
      <h1>Rastreabilidade - ${selected?.name || "lote"}</h1>
      <ul>
      ${list.map((e) => `<li><b>${e.type}</b> - ${e.description} (${e.timestamp.toString()})</li>`).join("")}
      </ul>
      </body></html>`;

    try {
      const Print = await import("expo-print");
      await Print.printAsync({ html });
    } catch {
      await Clipboard.setStringAsync(html);
      showToast("HTML copiado para a área de transferência.", "info");
    }
  };

  const handleGenerateQr = async () => {
    const list = finalizedEvents ?? events;
    if (!list || list.length === 0) {
      showToast("Nenhum evento para gerar QR.", "warning");
      return;
    }
    const payload = JSON.stringify({ lot: selected?.name, events: list });
    const url = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(payload)}`;
    setQrUrl(url);
    setShowQrPreview(true);
  };

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Cultivos</Text>
          <Text style={styles.subtitle}>
            {cultivos.length > 0
              ? `${cultivos.length} cultivo${cultivos.length > 1 ? "s" : ""} ativo${cultivos.length > 1 ? "s" : ""}`
              : "Nenhum cultivo ainda"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={() => void loadCultivos()}
          disabled={loadingCultivos}
        >
          <Ionicons
            name="refresh-outline"
            size={20}
            color={loadingCultivos ? theme.colors.textMuted : theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {error && !loadingCultivos ? (
        <TouchableOpacity style={styles.errorBanner} onPress={() => void loadCultivos()}>
          <Ionicons name="alert-circle-outline" size={16} color={theme.colors.error} />
          <Text style={styles.errorText}>{error} Toque para tentar novamente.</Text>
        </TouchableOpacity>
      ) : null}

      {loadingCultivos ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando cultivos...</Text>
        </View>
      ) : cultivos.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="leaf-outline" size={48} color={theme.colors.border} />
          <Text style={styles.emptyTitle}>Nenhum cultivo ainda</Text>
          <Text style={styles.emptyDesc}>Crie lotes na aba Lotes para ver os cultivos aqui.</Text>
        </View>
      ) : (
        cultivos.map((cultivo) => (
          <CultivationLotCard
            key={cultivo.id}
            cultivo={cultivo}
            onPress={() => void openDetails(cultivo)}
          />
        ))
      )}

      {/* Details modal */}
      <Modal visible={!!selected && !showTrace} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selected && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHandle} />

                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>{selected.name}</Text>
                    <Text style={styles.modalSubtitle}>{selected.lot} • {selected.farm}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelected(null)} style={styles.closeBtn}>
                    <Ionicons name="close" size={20} color={theme.colors.textMuted} />
                  </TouchableOpacity>
                </View>

                {/* Progress bar */}
                <AppCard style={styles.progressCard}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressTitle}>Progresso da safra</Text>
                    <Text style={styles.progressValue}>{selected.progress}%</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${selected.progress}%` }]} />
                  </View>
                  <Text style={styles.progressLabel}>
                    {selected.isComplete ? "Colheita concluída" : "Em andamento"}
                  </Text>
                </AppCard>

                {/* Details */}
                <AppCard style={styles.section}>
                  <Text style={styles.sectionTitle}>Detalhes do cultivo</Text>
                  <DetailRow icon="pulse-outline" label="Status" value={selected.status} />
                  <DetailRow icon="calendar-outline" label="Plantio" value={selected.plantingDate} />
                  <DetailRow icon="leaf-outline" label="Colheita estimada" value={selected.harvestDate} />
                  <DetailRow icon="resize-outline" label="Área" value={`${selected.area} ha`} />
                </AppCard>

                <View style={{ gap: 10, marginTop: 4 }}>
                  <AppButton label="Ver rastreabilidade" onPress={() => setShowTrace(true)} />
                  <AppButton label="Fechar" onPress={() => setSelected(null)} variant="secondary" />
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Traceability modal */}
      <Modal visible={showTrace} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selected && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHandle} />

                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>Rastreabilidade</Text>
                    <Text style={styles.modalSubtitle}>{selected.name} • {selected.lot}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => { setShowTrace(false); setSelected(null); }}
                    style={styles.closeBtn}
                  >
                    <Ionicons name="close" size={20} color={theme.colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <AppCard style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Timeline de eventos</Text>
                    {loadingEvents || addingEvent ? (
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                    ) : (
                      <View style={styles.eventCount}>
                        <Text style={styles.eventCountText}>{events.length} eventos</Text>
                      </View>
                    )}
                  </View>
                  <TraceabilityTimeline events={events} />
                </AppCard>

                <AppCard style={styles.section}>
                  <Text style={styles.sectionTitle}>Registrar evento</Text>
                  <TraceabilityEventForm
                    lotId={selected.lotId}
                    onAddEvent={handleAddEvent}
                    disabled={Boolean(selected.isComplete) || addingEvent}
                  />
                  <View style={{ marginTop: 14 }}>
                    <AppButton
                      label="Finalizar cultivo"
                      onPress={handleFinalize}
                      disabled={Boolean(selected.isComplete) || events.length === 0}
                    />
                  </View>
                  {(selected?.isComplete || finalizedEvents) ? (
                    <View style={{ marginTop: 10 }}>
                      <AppButton
                        label="Lista de rastreabilidade"
                        onPress={() => setShowListModal(true)}
                        variant="secondary"
                      />
                    </View>
                  ) : null}
                </AppCard>

                {/* QR Preview nested modal */}
                <Modal visible={showQrPreview && !!qrUrl} animationType="fade" transparent>
                  <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { maxHeight: "60%" }]}>
                      <View style={styles.modalHandle} />
                      <Text style={styles.modalTitle}>QR Code</Text>
                      <Text style={styles.modalSubtitle}>Escaneie para verificar a rastreabilidade</Text>
                      {qrUrl ? (
                        <View style={{ alignItems: "center", marginVertical: 20 }}>
                          <Image source={{ uri: qrUrl }} style={{ width: 220, height: 220, borderRadius: 8 }} />
                        </View>
                      ) : null}
                      <View style={{ gap: 10 }}>
                        <AppButton
                          label="Copiar link"
                          onPress={async () => {
                            if (qrUrl) {
                              await Clipboard.setStringAsync(qrUrl);
                              showToast("Link copiado para a área de transferência.", "success");
                            }
                          }}
                          variant="secondary"
                        />
                        <AppButton
                          label="Abrir no navegador"
                          onPress={async () => { if (qrUrl) await Linking.openURL(qrUrl); }}
                          variant="secondary"
                        />
                        <AppButton label="Fechar" onPress={() => setShowQrPreview(false)} variant="secondary" />
                      </View>
                    </View>
                  </View>
                </Modal>

                {/* List modal */}
                <Modal visible={showListModal} animationType="slide" transparent>
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.modalHandle} />
                        <Text style={styles.modalTitle}>Lista de rastreabilidade</Text>
                        <Text style={styles.modalSubtitle}>{selected?.name} • {selected?.lot}</Text>

                        <AppCard style={styles.section}>
                          <Text style={styles.sectionTitle}>Eventos finalizados</Text>
                          <TraceabilityTimeline events={finalizedEvents ?? events} />
                        </AppCard>

                        <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
                          <View style={{ flex: 1 }}>
                            <AppButton label="Baixar PDF" onPress={handleDownloadPDF} variant="secondary" />
                          </View>
                          <View style={{ flex: 1 }}>
                            <AppButton label="Gerar QR" onPress={handleGenerateQr} variant="secondary" />
                          </View>
                        </View>

                        <View style={{ marginTop: 10 }}>
                          <AppButton label="Fechar" onPress={() => setShowListModal(false)} variant="secondary" />
                        </View>
                      </ScrollView>
                    </View>
                  </View>
                </Modal>

                <View style={{ marginTop: 4 }}>
                  <AppButton
                    label="Fechar rastreabilidade"
                    onPress={() => { setShowTrace(false); setSelected(null); }}
                    variant="secondary"
                  />
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={detailStyles.row}>
      <Ionicons name={icon} size={15} color={theme.colors.textMuted} />
      <Text style={detailStyles.label}>{label}:</Text>
      <Text style={detailStyles.value}>{value}</Text>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  label: { fontSize: 13, color: theme.colors.textMuted, fontWeight: "600" },
  value: { fontSize: 13, color: theme.colors.textPrimary, fontWeight: "600", flex: 1 },
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
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    maxHeight: "92%",
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
  progressCard: {
    padding: 14,
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.primary,
  },
  progressBar: {
    height: 10,
    backgroundColor: theme.colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  progressLabel: {
    marginTop: 8,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  section: {
    padding: 14,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  eventCount: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  eventCountText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.primaryDark,
  },
});
