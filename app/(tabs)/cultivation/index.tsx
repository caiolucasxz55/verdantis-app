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
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";

import { ScreenContainer } from "../../../components/ScreenContainer";
import { CultivationLotCard } from "../../../components/CultivationLotCard";
import { AppCard } from "../../../components/AppCard";
import { AppButton } from "../../../components/AppButton";
import { TraceabilityTimeline } from "../../../components/TraceabilityTimeline";
import { TraceabilityEventForm } from "../../../components/TraceabilityEventForm";
import { theme } from "../../../components/generic/theme";
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
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [loadingCultivos, setLoadingCultivos] = useState(true);

  const [selected, setSelected] = useState<Cultivo | null>(null);
  const [showTrace, setShowTrace] = useState(false);
  const [events, setEvents] = useState<TraceabilityEvent[]>([]);
  const [finalizedEvents, setFinalizedEvents] = useState<TraceabilityEvent[] | null>(null);
  const [showListModal, setShowListModal] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const [showQrPreview, setShowQrPreview] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoadingCultivos(true);
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
              ? {
                  ...c,
                  events: match.events,
                  plantingDate: match.plantingDate,
                  harvestDate: match.harvestDate,
                }
              : c;
          })
        );
      } catch (err) {
        console.error("Erro ao carregar cultivos:", err);
        Alert.alert("Erro", "Não foi possível carregar os cultivos.");
      } finally {
        setLoadingCultivos(false);
      }
    };

    run();
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
      } catch (err) {
        console.error("Erro ao adicionar evento:", err);
        Alert.alert("Erro", "Não foi possível salvar o evento no backend.");
      }
    };

    void run();
  };

  const handleFinalize = () => {
    if (!selected || events.length === 0) return;
    setSelected((prev) => (prev ? { ...prev, isComplete: true } : prev));
    setFinalizedEvents(events.slice());
    Alert.alert("Finalizado", "Lista de eventos finalizada e disponível para exportação.");
  };

  const handleDownloadPDF = async () => {
    const list = finalizedEvents ?? events;
    if (!list || list.length === 0) {
      Alert.alert("PDF", "Nenhum evento para exportar.");
      return;
    }
    const html = `
      <html><body>
      <h1>Rastreabilidade - ${selected?.name || "lote"}</h1>
      <ul>
      ${list
        .map((e) => `<li><b>${e.type}</b> - ${e.description} (${e.timestamp.toString()})</li>`)
        .join("")}
      </ul>
      </body></html>`;

    try {
      // @ts-ignore
      const Print = await import("expo-print");
      await Print.printAsync({ html });
    } catch {
      await Clipboard.setStringAsync(html);
      Alert.alert(
        "PDF",
        "Biblioteca expo-print não instalada. HTML copiado para a área de transferência."
      );
    }
  };

  const handleGenerateQr = async () => {
    const list = finalizedEvents ?? events;
    if (!list || list.length === 0) {
      Alert.alert("QR Code", "Nenhum evento para gerar QR.");
      return;
    }
    const payload = JSON.stringify({ lot: selected?.name, events: list });
    const url = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(payload)}`;
    setQrUrl(url);
    setShowQrPreview(true);
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Cultivos</Text>
      <Text style={styles.subtitle}>Acompanhe o andamento dos cultivos</Text>

      {loadingCultivos ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : null}

      {cultivos.map((cultivo) => (
        <CultivationLotCard
          key={cultivo.id}
          cultivo={cultivo}
          onPress={() => void openDetails(cultivo)}
        />
      ))}

      <Modal visible={!!selected && !showTrace} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selected && (
              <ScrollView>
                <Text style={styles.title}>{selected.name}</Text>
                <Text style={styles.subtitle}>{selected.lot} • {selected.farm}</Text>

                <AppCard style={styles.progressCard}>
                  <Text style={styles.progressTitle}>Progresso da safra</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${selected.progress}%` }]} />
                  </View>
                  <Text style={styles.progressValue}>{selected.progress}% concluido</Text>
                </AppCard>

                <AppCard style={styles.section}>
                  <Text style={styles.sectionTitle}>Detalhes</Text>
                  <Text>Status: {selected.status}</Text>
                  <Text>Plantio: {selected.plantingDate}</Text>
                  <Text>Colheita estimada: {selected.harvestDate}</Text>
                  <Text>Area: {selected.area} ha</Text>
                </AppCard>

                <View style={{ marginTop: 12 }}>
                  <AppButton label="Ver rastreabilidade" onPress={() => setShowTrace(true)} />
                </View>
                <View style={{ marginTop: 8 }}>
                  <AppButton label="Fechar" onPress={() => setSelected(null)} variant="secondary" />
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={showTrace} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selected && (
              <ScrollView>
                <Text style={styles.title}>Rastreabilidade - {selected.name}</Text>
                <Text style={styles.subtitle}>{selected.lot}</Text>

                <AppCard style={styles.section}>
                  <Text style={styles.sectionTitle}>Timeline de eventos</Text>
                  {loadingEvents ? (
                    <View style={{ paddingVertical: 10 }}>
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                    </View>
                  ) : null}
                  <TraceabilityTimeline events={events} />
                </AppCard>

                <AppCard style={styles.section}>
                  <Text style={styles.sectionTitle}>Registrar evento</Text>
                  <TraceabilityEventForm
                    lotId={selected.lotId}
                    onAddEvent={handleAddEvent}
                    disabled={Boolean(selected.isComplete)}
                  />
                  <View style={{ marginTop: 14 }}>
                    <AppButton
                      label="Finalizar cultivo"
                      onPress={handleFinalize}
                      disabled={Boolean(selected.isComplete) || events.length === 0}
                    />
                  </View>
                  {(selected?.isComplete || finalizedEvents) && (
                    <View style={{ marginTop: 10 }}>
                      <AppButton
                        label="Lista de rastreabilidade"
                        onPress={() => setShowListModal(true)}
                        variant="secondary"
                      />
                    </View>
                  )}
                </AppCard>

                <Modal visible={showQrPreview && !!qrUrl} animationType="slide" transparent>
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <Text style={styles.title}>QR Preview</Text>
                      {qrUrl && (
                        <View style={{ alignItems: "center", marginTop: 12 }}>
                          <Image source={{ uri: qrUrl }} style={{ width: 220, height: 220 }} />
                        </View>
                      )}
                      <View style={{ marginTop: 12 }}>
                        <AppButton
                          label="Copiar link do QR"
                          onPress={async () => {
                            if (qrUrl) {
                              await Clipboard.setStringAsync(qrUrl);
                              Alert.alert("QR", "Link copiado para área de transferência.");
                            }
                          }}
                          variant="secondary"
                        />
                      </View>
                      <View style={{ marginTop: 8 }}>
                        <AppButton
                          label="Abrir no navegador"
                          onPress={async () => {
                            if (qrUrl) {
                              await Linking.openURL(qrUrl);
                            }
                          }}
                          variant="secondary"
                        />
                      </View>
                      <View style={{ marginTop: 8 }}>
                        <AppButton label="Fechar" onPress={() => setShowQrPreview(false)} variant="secondary" />
                      </View>
                    </View>
                  </View>
                </Modal>

                <Modal visible={showListModal} animationType="slide" transparent>
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <ScrollView>
                        <Text style={styles.title}>Lista de rastreabilidade - {selected?.name}</Text>
                        <Text style={styles.subtitle}>{selected?.lot}</Text>

                        <AppCard style={styles.section}>
                          <Text style={styles.sectionTitle}>Eventos finalizados</Text>
                          <TraceabilityTimeline events={finalizedEvents ?? events} />
                        </AppCard>

                        <View
                          style={{
                            marginTop: 8,
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <AppButton label="Baixar PDF" onPress={handleDownloadPDF} variant="secondary" />
                          <AppButton label="Gerar QR" onPress={handleGenerateQr} variant="secondary" />
                        </View>

                        <View style={{ marginTop: 12 }}>
                          <AppButton label="Fechar" onPress={() => setShowListModal(false)} variant="secondary" />
                        </View>
                      </ScrollView>
                    </View>
                  </View>
                </Modal>

                <View style={{ marginTop: 12 }}>
                  <AppButton
                    label="Fechar rastreabilidade"
                    onPress={() => {
                      setShowTrace(false);
                      setSelected(null);
                    }}
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
  loadingBox: {
    paddingVertical: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.backgroundOverlay,
    justifyContent: "center",
    padding: 18,
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 16,
    maxHeight: "90%",
  },
  progressCard: {
    padding: 12,
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: theme.colors.textPrimary,
  },
  progressBar: {
    height: 12,
    backgroundColor: theme.colors.border,
    borderRadius: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  progressValue: {
    marginTop: 8,
    color: theme.colors.textMuted,
  },
  section: {
    padding: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    color: theme.colors.textPrimary,
  },
});
