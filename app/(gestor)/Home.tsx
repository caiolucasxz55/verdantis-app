import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { theme } from "../../components/generic/theme";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const fazendas = [
    { id: "1", nome: "Fazenda Boa Esperança", cultura: "Soja", producao: 350 },
    { id: "2", nome: "Sítio Primavera", cultura: "Milho", producao: 280 },
    { id: "3", nome: "Fazenda Rio Verde", cultura: "Café", producao: 400 },
    { id: "4", nome: "AgroVale", cultura: "Algodão", producao: 150 },
  ];

  const ranking = [...fazendas].sort((a, b) => b.producao - a.producao);

  const total = fazendas.reduce((acc, f) => acc + f.producao, 0);
  const media = Math.round(total / fazendas.length);
  const melhor = ranking[0];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {user?.userName || "Gestor"}</Text>
        <Text style={styles.subGreeting}>Gerencie suas propriedades com transparencia.</Text>
      </View>

      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Producao total</Text>
          <Text style={styles.kpiValue}>{total} ton</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Media</Text>
          <Text style={styles.kpiValue}>{media} ton</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Destaque</Text>
          <Text style={styles.kpiValue}>{melhor.nome}</Text>
        </View>
      </View>

      {/* Ações principais */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#e8f5e9" }]}
          onPress={() => router.push("/(gestor)/(funcionalidades)/FeedAtividades")}
        >
          <Ionicons name="newspaper-outline" size={28} color="#1b5e20" />
          <Text style={styles.actionText}>Atividades</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#f1f8e9" }]}
          onPress={() => router.push("/(gestor)/(funcionalidades)/Observacao")}
        >
          <Ionicons name="business-outline" size={28} color="#2e7d32" />
          <Text style={styles.actionText}>Fazendas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#e0f2f1" }]}
          onPress={() => router.push("/(gestor)/(funcionalidades)/ScannerQR")}
        >
          <Ionicons name="qr-code-outline" size={28} color="#388e3c" />
          <Text style={styles.actionText}>Scanner</Text>
        </TouchableOpacity>
      </View>

      {/* Fazendas registradas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suas Fazendas</Text>
        <FlatList
          data={fazendas}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.fazendaNome}>{item.nome}</Text>
                <Text style={styles.fazendaCultura}>🌱 {item.cultura}</Text>
              </View>
              <Text style={styles.producaoText}>{item.producao} ton</Text>
            </View>
          )}
        />
      </View>

      {/* Ranking */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ranking de Producao</Text>
        {ranking.map((item, index) => (
          <View key={item.id} style={styles.rankingItem}>
            <View style={styles.rankLeft}>
              <Text style={[styles.rankingPos, { color: index === 0 ? "#1b5e20" : "#555" }]}>
                {index + 1}º
              </Text>
              <Text style={styles.rankingName}>{item.nome}</Text>
            </View>
            <Text style={styles.rankingValue}>{item.producao} ton</Text>
          </View>
        ))}
      </View>

      {/* Dashboard */}
      <TouchableOpacity
        style={styles.dashboardButton}
        onPress={() => router.push("/(gestor)/Dashboard")}
        activeOpacity={0.9}
      >
        <Ionicons name="bar-chart-outline" size={22} color="#fff" />
        <Text style={styles.dashboardText}>Ver Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  subGreeting: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  kpiRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 22,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: theme.radius.lg,
    padding: 14,
    ...theme.shadow.soft,
  },
  kpiLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 6,
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 16,
    marginHorizontal: 6,
    ...theme.shadow.soft,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginTop: 6,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: theme.radius.lg,
    padding: 16,
    marginVertical: 6,
    ...theme.shadow.soft,
  },
  fazendaNome: { fontWeight: "700", fontSize: 16, color: theme.colors.textPrimary },
  fazendaCultura: { color: theme.colors.textMuted, marginTop: 3 },
  producaoText: { fontWeight: "700", color: theme.colors.primaryDark },
  rankingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: theme.radius.md,
    padding: 12,
    marginVertical: 5,
    ...theme.shadow.soft,
  },
  rankLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rankingPos: { fontSize: 16, fontWeight: "bold", marginRight: 8 },
  rankingName: { fontSize: 15, fontWeight: "600", color: theme.colors.textPrimary },
  rankingValue: { fontWeight: "700", color: theme.colors.primaryDark },
  dashboardButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: theme.radius.md,
    marginTop: 15,
    marginBottom: 40,
    ...theme.shadow.soft,
  },
  dashboardText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
});
