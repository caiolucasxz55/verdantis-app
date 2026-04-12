import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../../components/ScreenContainer";
import { StatCard } from "../../components/StatCard";
import { AppCard } from "../../components/AppCard";
import { AppButton } from "../../components/AppButton";
import { theme } from "../../components/generic/theme";
import { BarChart, LineChart } from "react-native-chart-kit";
import { getTendenciaLucro, postComparativoCulturas } from "../../api/analytics";
import { getDashboard } from "../../api/dashboard";
import { getLotes } from "../../api/lotes";
import type {
  ComparativoCulturaDto,
  DashboardDto,
  LoteDto,
  TendenciaLucroDto,
} from "../../api/types";

export default function DashboardScreen() {
  const router = useRouter();
  const width = Dimensions.get("window").width - 40;

  const toFinite = (value: unknown): number => {
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardDto | null>(null);
  const [lotes, setLotes] = useState<LoteDto[]>([]);
  const [tendencias, setTendencias] = useState<TendenciaLucroDto[]>([]);
  const [comparativoCulturas, setComparativoCulturas] = useState<ComparativoCulturaDto[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const [dashboardData, lotesData, tendenciasData] = await Promise.all([
          getDashboard(),
          getLotes(),
          getTendenciaLucro(),
        ]);

        setDashboard(dashboardData);
        setLotes(lotesData);
        setTendencias(tendenciasData);

        const culturas = Array.from(new Set(lotesData.map((l) => l.cultura).filter(Boolean)));
        if (culturas.length > 0) {
          const comp = await postComparativoCulturas({ culturas });
          setComparativoCulturas(comp);
        } else {
          setComparativoCulturas([]);
        }
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        Alert.alert("Erro", "Não foi possível carregar o dashboard.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const totals = useMemo(() => {
    const totalProfit = lotes.reduce((acc, l) => acc + toFinite(l.lucroEstimado), 0);
    const totalRevenue = lotes.reduce((acc, l) => acc + toFinite(l.receita), 0);
    const totalCost = lotes.reduce((acc, l) => acc + toFinite(l.custo), 0);
    const mostProfitableLot = [...lotes].sort(
      (a, b) => toFinite(b.lucroEstimado) - toFinite(a.lucroEstimado)
    )[0];
    return { totalProfit, totalRevenue, totalCost, mostProfitableLot };
  }, [lotes]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Resumo operacional da sua fazenda</Text>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : null}

      <View style={styles.actionsRow}>
        <AppButton label="Ver cultivos e rastreabilidade" onPress={() => router.push("/(tabs)/cultivation")} variant="secondary" />
      </View>

      <View style={styles.kpiGrid}>
        <StatCard title="Lucro total" value={`R$ ${(dashboard?.lucroTotal ?? totals.totalProfit).toLocaleString("pt-BR")}`} />
        <StatCard title="Receita total" value={`R$ ${totals.totalRevenue.toLocaleString("pt-BR")}`} />
        <StatCard title="Custo total" value={`R$ ${totals.totalCost.toLocaleString("pt-BR")}`} />
        <StatCard title="Cultura mais rentável" value={dashboard?.culturaMaisRentavel ?? "—"} />
        <StatCard title="Lote mais rentável" value={dashboard?.loteMaisRentavel ?? (totals.mostProfitableLot?.lote ?? "—")} />
      </View>

      <AppCard style={styles.chartCard}>
        <Text style={styles.cardTitle}>Lucro por lote</Text>
        {lotes.length === 0 ? (
          <Text style={styles.emptyText}>Sem dados para exibir.</Text>
        ) : (
          <BarChart
            data={{
              labels: lotes.map((lot) => lot.lote),
              datasets: [{ data: lotes.map((lot) => toFinite(lot.lucroEstimado)) }],
            }}
            width={width}
            height={220}
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            style={styles.chart}
          />
        )}
      </AppCard>

      <AppCard style={styles.chartCard}>
        <Text style={styles.cardTitle}>Tendência de lucro (por cultura)</Text>
        {tendencias.length === 0 ? (
          <Text style={styles.emptyText}>Sem dados para exibir.</Text>
        ) : (
          <LineChart
            data={{
              labels: tendencias.map((item) => item.cultura),
              datasets: [{ data: tendencias.map((item) => toFinite(item.tendenciaLucro)) }],
            }}
            width={width}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        )}
      </AppCard>

      <AppCard style={styles.chartCard}>
        <Text style={styles.cardTitle}>Lucro por cultura</Text>
        {comparativoCulturas.length === 0 ? (
          <Text style={styles.emptyText}>Sem dados para exibir.</Text>
        ) : (
          <BarChart
            data={{
              labels: comparativoCulturas.map((item) => item.cultura),
              datasets: [{ data: comparativoCulturas.map((item) => toFinite(item.lucroMedio)) }],
            }}
            width={width}
            height={220}
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            style={styles.chart}
          />
        )}
      </AppCard>
    </ScreenContainer>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#f0fdf4",
  backgroundGradientTo: "#dcfce7",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
};

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
  actionsRow: {
    marginBottom: 6,
  },
  loadingBox: {
    paddingVertical: 18,
  },
  kpiGrid: {
    gap: 12,
  },
  chartCard: {
    marginTop: 18,
  },
  emptyText: {
    color: theme.colors.textMuted,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
    color: theme.colors.textPrimary,
  },
  chart: {
    borderRadius: theme.radius.md,
  },
});
