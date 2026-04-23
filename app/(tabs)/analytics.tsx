import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "../../components/ScreenContainer";
import { AppCard } from "../../components/AppCard";
import { CropMarketCard } from "../../components/CropMarketCard";
import { theme } from "../../components/generic/theme";
import { BarChart, LineChart } from "react-native-chart-kit";
import type { CropMarketData } from "../../types/domain";

import { getCotacoes, getTendenciaLucro, postComparativoCulturas } from "../../api/analytics";
import type { ComparativoCulturaDto, CotacaoDto, TendenciaLucroDto } from "../../api/types";

const cropImageByName: Record<string, string> = {
  Soja: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=200&q=80",
  Milho: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=200&q=80",
  Trigo: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=200&q=80",
  Cafe: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=200&q=80",
};

export default function AnalyticsScreen() {
  const width = Dimensions.get("window").width - 40;

  const toFinite = (value: unknown): number => {
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const [loading, setLoading] = useState(true);
  const [cotacoes, setCotacoes] = useState<CotacaoDto[]>([]);
  const [comparativoCulturas, setComparativoCulturas] = useState<ComparativoCulturaDto[]>([]);
  const [tendencias, setTendencias] = useState<TendenciaLucroDto[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const [cotacoesData, tendenciasData] = await Promise.all([
          getCotacoes(),
          getTendenciaLucro(),
        ]);
        setCotacoes(cotacoesData);
        setTendencias(tendenciasData);

        const culturas = cotacoesData.map((c) => c.cultura).filter(Boolean);
        if (culturas.length > 0) {
          const comp = await postComparativoCulturas({ culturas });
          setComparativoCulturas(comp);
        } else {
          setComparativoCulturas([]);
        }
      } catch (err) {
        console.error("Erro ao carregar analytics:", err);
        Alert.alert("Erro", "Não foi possível carregar os dados de analytics.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const cropMarketData: CropMarketData[] = cotacoes.map((c) => ({
    id: c.cultura,
    name: c.cultura,
    imageUrl: cropImageByName[c.cultura] ?? cropImageByName.Soja,
    pricePerSack: toFinite(c.precoSaca),
    priceTrend: "stable",
  }));

  return (
    <ScreenContainer>
      <Text style={styles.title}>Analytics</Text>
      <Text style={styles.subtitle}>Visao de mercado e desempenho</Text>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : null}

      {cropMarketData.map((crop) => (
        <CropMarketCard key={crop.id} {...crop} />
      ))}

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

      <AppCard style={styles.chartCard}>
        <Text style={styles.cardTitle}>Tendencia de lucro (por cultura)</Text>
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
  loadingBox: {
    paddingVertical: 18,
  },
  emptyText: {
    color: theme.colors.textMuted,
  },
  chartCard: {
    marginTop: 16,
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
