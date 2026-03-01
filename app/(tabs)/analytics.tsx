import React from "react";
import { Text, StyleSheet, Dimensions } from "react-native";
import { ScreenContainer } from "../../components/ScreenContainer";
import { AppCard } from "../../components/AppCard";
import { CropMarketCard } from "../../components/CropMarketCard";
import { theme } from "../../components/generic/theme";
import { BarChart, LineChart } from "react-native-chart-kit";
import type { CropMarketData } from "../../types/domain";

const cropMarketData: CropMarketData[] = [
  { id: "1", name: "Soja", imageUrl: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=200&q=80", pricePerSack: 148.5, priceTrend: "up" },
  { id: "2", name: "Milho", imageUrl: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=200&q=80", pricePerSack: 72.3, priceTrend: "down" },
  { id: "3", name: "Trigo", imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=200&q=80", pricePerSack: 95.0, priceTrend: "stable" },
  { id: "4", name: "Cafe", imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=200&q=80", pricePerSack: 1420.0, priceTrend: "up" },
];

const profitByCrop = [
  { crop: "Milho", lucro: 10575 },
  { crop: "Soja", lucro: 10400 },
  { crop: "Trigo", lucro: 1900 },
  { crop: "Cafe", lucro: -2700 },
  { crop: "Alface", lucro: -560 },
];

const profitTrends = [
  { month: "Jan", lucro: 2800 },
  { month: "Fev", lucro: 3200 },
  { month: "Mar", lucro: 1500 },
  { month: "Abr", lucro: 4100 },
  { month: "Mai", lucro: 3800 },
  { month: "Jun", lucro: 5200 },
];

export default function AnalyticsScreen() {
  const width = Dimensions.get("window").width - 40;

  return (
    <ScreenContainer>
      <Text style={styles.title}>Analytics</Text>
      <Text style={styles.subtitle}>Visao de mercado e desempenho</Text>

      {cropMarketData.map((crop) => (
        <CropMarketCard key={crop.id} {...crop} />
      ))}

      <AppCard style={styles.chartCard}>
        <Text style={styles.cardTitle}>Lucro por cultura</Text>
        <BarChart
          data={{
            labels: profitByCrop.map((item) => item.crop),
            datasets: [{ data: profitByCrop.map((item) => item.lucro) }],
          }}
          width={width}
          height={220}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </AppCard>

      <AppCard style={styles.chartCard}>
        <Text style={styles.cardTitle}>Tendencia de lucro</Text>
        <LineChart
          data={{
            labels: profitTrends.map((item) => item.month),
            datasets: [{ data: profitTrends.map((item) => item.lucro) }],
          }}
          width={width}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
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
