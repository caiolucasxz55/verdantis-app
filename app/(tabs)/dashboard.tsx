import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../../components/ScreenContainer";
import { StatCard } from "../../components/StatCard";
import { AppCard } from "../../components/AppCard";
import { theme } from "../../components/generic/theme";
import { BarChart, LineChart } from "react-native-chart-kit";
import { getTendenciaLucro, postComparativoCulturas } from "../../api/analytics";
import { getDashboard } from "../../api/dashboard";
import { getLotes } from "../../api/lotes";
import { useAuth } from "../../hooks/useAuth";
import type {
  ComparativoCulturaDto,
  DashboardDto,
  LoteDto,
  TendenciaLucroDto,
} from "../../api/types";

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const width = Dimensions.get("window").width - 48;

  const toFinite = (value: unknown): number => {
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardDto | null>(null);
  const [lotes, setLotes] = useState<LoteDto[]>([]);
  const [tendencias, setTendencias] = useState<TendenciaLucroDto[]>([]);
  const [comparativoCulturas, setComparativoCulturas] = useState<ComparativoCulturaDto[]>([]);

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

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
      setError("Não foi possível carregar o dashboard.");
      if (!isRefresh) Alert.alert("Erro", "Não foi possível carregar o dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadData();
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

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const firstName = user?.name?.split(" ")[0] ?? "Produtor";

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}, {firstName} 👋</Text>
          <Text style={styles.subtitle}>Resumo operacional da fazenda</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={() => void loadData(true)}
          disabled={refreshing || loading}
        >
          <Ionicons
            name="refresh-outline"
            size={20}
            color={refreshing ? theme.colors.textMuted : theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      ) : null}

      {error && !loading ? (
        <TouchableOpacity style={styles.errorBanner} onPress={() => void loadData()}>
          <Ionicons name="alert-circle-outline" size={16} color={theme.colors.error} />
          <Text style={styles.errorText}>{error} Toque para tentar novamente.</Text>
        </TouchableOpacity>
      ) : null}

      {/* Quick action */}
      <TouchableOpacity
        style={styles.quickAction}
        onPress={() => router.push("/(tabs)/cultivation")}
      >
        <View style={styles.quickActionLeft}>
          <Ionicons name="leaf" size={18} color={theme.colors.primary} />
          <Text style={styles.quickActionText}>Ver cultivos e rastreabilidade</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
      </TouchableOpacity>

      {/* KPI grid */}
      <View style={styles.kpiGrid}>
        <StatCard
          title="Lucro total"
          value={`R$ ${(dashboard?.lucroTotal ?? totals.totalProfit).toLocaleString("pt-BR")}`}
        />
        <StatCard title="Receita" value={`R$ ${totals.totalRevenue.toLocaleString("pt-BR")}`} />
        <StatCard title="Custo" value={`R$ ${totals.totalCost.toLocaleString("pt-BR")}`} />
        <StatCard title="Cultura + rentável" value={dashboard?.culturaMaisRentavel ?? "—"} />
        <StatCard
          title="Lote + rentável"
          value={dashboard?.loteMaisRentavel ?? (totals.mostProfitableLot?.lote ?? "—")}
        />
      </View>

      {/* Charts */}
      <AppCard style={styles.chartCard}>
        <Text style={styles.cardTitle}>Lucro por lote</Text>
        {lotes.length === 0 ? (
          <EmptyChart />
        ) : (
          <BarChart
            data={{
              labels: lotes.map((lot) => lot.lote),
              datasets: [{ data: lotes.map((lot) => toFinite(lot.lucroEstimado)) }],
            }}
            width={width}
            height={200}
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            style={styles.chart}
          />
        )}
      </AppCard>

      <AppCard style={styles.chartCard}>
        <Text style={styles.cardTitle}>Tendência de lucro</Text>
        {tendencias.length === 0 ? (
          <EmptyChart />
        ) : (
          <LineChart
            data={{
              labels: tendencias.map((item) => item.cultura),
              datasets: [{ data: tendencias.map((item) => toFinite(item.tendenciaLucro)) }],
            }}
            width={width}
            height={200}
            chartConfig={chartConfig}
            style={styles.chart}
            bezier
          />
        )}
      </AppCard>

      <AppCard style={styles.chartCard}>
        <Text style={styles.cardTitle}>Lucro por cultura</Text>
        {comparativoCulturas.length === 0 ? (
          <EmptyChart />
        ) : (
          <BarChart
            data={{
              labels: comparativoCulturas.map((item) => item.cultura),
              datasets: [{ data: comparativoCulturas.map((item) => toFinite(item.lucroMedio)) }],
            }}
            width={width}
            height={200}
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

function EmptyChart() {
  return (
    <View style={emptyStyles.wrap}>
      <Ionicons name="bar-chart-outline" size={32} color={theme.colors.border} />
      <Text style={emptyStyles.text}>Sem dados para exibir</Text>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  wrap: { alignItems: "center", paddingVertical: 24, gap: 8 },
  text: { color: theme.colors.textMuted, fontSize: 13 },
});

const chartConfig = {
  backgroundGradientFrom: "#f0fdf4",
  backgroundGradientTo: "#dcfce7",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
  propsForDots: { r: "4", strokeWidth: "2", stroke: theme.colors.primaryDark },
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  greeting: {
    fontSize: 22,
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
  loadingBox: {
    paddingVertical: 32,
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: theme.colors.textMuted,
    fontSize: 14,
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
  errorText: {
    color: theme.colors.error,
    fontSize: 13,
    flex: 1,
  },
  quickAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.2)",
  },
  quickActionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quickActionText: {
    color: theme.colors.primaryDark,
    fontWeight: "600",
    fontSize: 14,
  },
  kpiGrid: {
    gap: 10,
    marginBottom: 4,
  },
  chartCard: {
    marginTop: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
    color: theme.colors.textPrimary,
  },
  chart: {
    borderRadius: theme.radius.md,
    marginHorizontal: -4,
  },
});
