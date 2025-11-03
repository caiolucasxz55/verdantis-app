import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {user?.email?.split("@")[0] || "Gestor"} 👋</Text>
        <Text style={styles.subGreeting}>Gerencie suas propriedades com transparência.</Text>
      </View>

      {/* Ações principais */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#e8f5e9" }]}
          onPress={() => router.push("/(gestor)/funcionalidades/FeedAtividades")}
        >
          <Ionicons name="newspaper-outline" size={28} color="#1b5e20" />
          <Text style={styles.actionText}>Atividades</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#f1f8e9" }]}
          onPress={() => router.push("/(gestor)/funcionalidades/Observacao")}
        >
          <Ionicons name="business-outline" size={28} color="#2e7d32" />
          <Text style={styles.actionText}>Fazendas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#e0f2f1" }]}
          onPress={() => router.push("/(gestor)/funcionalidades/ScannerQR")}
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
        <Text style={styles.sectionTitle}>🏆 Ranking de Produção</Text>
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
    backgroundColor: "#f9fafb",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1b5e20",
  },
  subGreeting: {
    fontSize: 15,
    color: "#666",
    marginTop: 4,
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
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1b5e20",
    marginTop: 6,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1b5e20",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  fazendaNome: { fontWeight: "bold", fontSize: 16, color: "#333" },
  fazendaCultura: { color: "#777", marginTop: 3 },
  producaoText: { fontWeight: "bold", color: "#2e7d32" },
  rankingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 5,
    elevation: 1,
  },
  rankLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rankingPos: { fontSize: 16, fontWeight: "bold", marginRight: 8 },
  rankingName: { fontSize: 15, fontWeight: "600", color: "#333" },
  rankingValue: { fontWeight: "700", color: "#2e7d32" },
  dashboardButton: {
    backgroundColor: "#1b5e20",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
    marginBottom: 40,
  },
  dashboardText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
});
