import React from "react";
import { Text, StyleSheet, View, Dimensions } from "react-native";
import { ScreenContainer } from "../../components/ScreenContainer";
import { StatCard } from "../../components/StatCard";
import { AppCard } from "../../components/AppCard";
import { theme } from "../../components/generic/theme";
import { BarChart, LineChart } from "react-native-chart-kit";
import type { Lote } from "../../types/domain";

const lots: Lote[] = [
  { id: "1", name: "Lote A1", crop: "Milho", production: 185, cost: 11500, salePrice: 85, revenue: 15725, profit: 4225, margin: 26.9, status: "Ativo", propertyName: "Fazenda Sao Jose" },
  { id: "2", name: "Lote B2", crop: "Soja", production: 160, cost: 8800, salePrice: 120, revenue: 19200, profit: 10400, margin: 54.2, status: "Ativo", propertyName: "Fazenda Boa Vista" },
  { id: "3", name: "Lote C3", crop: "Cafe", production: 75, cost: 16200, salePrice: 180, revenue: 13500, profit: -2700, margin: -20.0, status: "Ativo", propertyName: "Fazenda Verde" },
  { id: "4", name: "Lote D4", crop: "Trigo", production: 130, cost: 7200, salePrice: 70, revenue: 9100, profit: 1900, margin: 20.9, status: "Finalizado", propertyName: "Fazenda Sao Jose" },
  { id: "5", name: "Lote E5", crop: "Milho", production: 190, cost: 9800, salePrice: 85, revenue: 16150, profit: 6350, margin: 39.3, status: "Ativo", propertyName: "Fazenda Boa Vista" },
];

const profitOverTime = [
  { month: "Jan", lucro: 2800 },
  { month: "Fev", lucro: 3200 },
  { month: "Mar", lucro: 1500 },
  { month: "Abr", lucro: 4100 },
  { month: "Mai", lucro: 3800 },
  { month: "Jun", lucro: 5200 },
];

const profitByCrop = [
  { crop: "Milho", lucro: 10575 },
  { crop: "Soja", lucro: 10400 },
  { crop: "Trigo", lucro: 1900 },
  { crop: "Cafe", lucro: -2700 },
  { crop: "Alface", lucro: -560 },
];

const totalProfit = lots.reduce((acc, lot) => acc + lot.profit, 0);
const totalRevenue = lots.reduce((acc, lot) => acc + lot.revenue, 0);
const totalCost = lots.reduce((acc, lot) => acc + lot.cost, 0);
const mostProfitableLot = [...lots].sort((a, b) => b.profit - a.profit)[0];
const mostProfitableCrop = profitByCrop.sort((a, b) => b.lucro - a.lucro)[0];

export default function DashboardScreen() {
  const width = Dimensions.get("window").width - 40;

  return (
    <ScreenContainer>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Resumo operacional da sua fazenda</Text>

      <View style={styles.kpiGrid}>
        <StatCard title="Lucro total" value={`R$ ${totalProfit.toLocaleString("pt-BR")}`} />
        <StatCard title="Receita total" value={`R$ ${totalRevenue.toLocaleString("pt-BR")}`} />
        <StatCard title="Custo total" value={`R$ ${totalCost.toLocaleString("pt-BR")}`} />
        <StatCard title="Cultura mais lucrativa" value={mostProfitableCrop.crop} />
        <StatCard title="Lote mais lucrativo" value={mostProfitableLot.name} />
      </View>

      <AppCard style={styles.chartCard}>
        <Text style={styles.cardTitle}>Lucro por lote</Text>
        <BarChart
          data={{
            labels: lots.map((lot) => lot.name),
            datasets: [{ data: lots.map((lot) => lot.profit) }],
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
        <Text style={styles.cardTitle}>Lucro ao longo do tempo</Text>
        <LineChart
          data={{
            labels: profitOverTime.map((item) => item.month),
            datasets: [{ data: profitOverTime.map((item) => item.lucro) }],
          }}
          width={width}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </AppCard>

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
  kpiGrid: {
    gap: 12,
  },
  chartCard: {
    marginTop: 18,
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
