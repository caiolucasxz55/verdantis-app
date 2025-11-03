import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeProdutor() {
  const router = useRouter();

  const cultivos = [
    { id: "1", nome: "Milho", status: "Em crescimento", img: require("../../assets/milho-img.png") },
    { id: "2", nome: "Soja", status: "Colheita próxima", img: require("../../assets/soja-img.png") },
    { id: "3", nome: "Café", status: "Plantio recente", img: require("../../assets/cafe-img.png") },
  ];

  const dicas = [
    { id: "1", titulo: "Economize água", desc: "Use irrigação controlada para reduzir até 20% do consumo.", icon: "water-outline" },
    { id: "2", titulo: "Rotação de culturas", desc: "Evite o desgaste do solo alternando os cultivos.", icon: "leaf-outline" },
    { id: "3", titulo: "Manejo sustentável", desc: "Reduza custos e aumente produtividade com práticas verdes.", icon: "earth-outline" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, Produtor 👋</Text>
        <Text style={styles.subGreeting}>Veja suas propriedades e cultivos em um só lugar.</Text>
      </View>

      {/* Ações principais */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#e8f5e9" }]}
          onPress={() => router.push("/(produtor)/(funcionalidades)/Propriedade")}
        >
          <Ionicons name="map-outline" size={28} color="#2e7d32" />
          <Text style={styles.actionText}>Propriedades</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#f1f8e9" }]}
          onPress={() => router.push("/(produtor)/(funcionalidades)/RegistroLote")}
        >
          <Ionicons name="leaf-outline" size={28} color="#388e3c" />
          <Text style={styles.actionText}>Registrar Lote</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#e0f2f1" }]}
          onPress={() => router.push("/(produtor)/(funcionalidades)/ScannerQR")}
        >
          <Ionicons name="qr-code-outline" size={28} color="#00695c" />
          <Text style={styles.actionText}>Scanner</Text>
        </TouchableOpacity>
      </View>

      {/* Cultivos ativos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌾 Seus cultivos</Text>
        <FlatList
          data={cultivos}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.9} style={styles.cropCard}>
              <Image source={item.img} style={styles.cropImg} resizeMode="cover" />
              <View style={styles.cropOverlay}>
                <Text style={styles.cropName}>{item.nome}</Text>
                <Text style={styles.cropStatus}>{item.status}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Dicas rápidas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Dicas para você</Text>
        {dicas.map((item) => (
          <View key={item.id} style={styles.tipCard}>
            <Ionicons name={item.icon as any} size={26} color="#2e7d32" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.tipTitle}>{item.titulo}</Text>
              <Text style={styles.tipDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Resumo rápido */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>📊 Resumo</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>5</Text>
            <Text style={styles.summaryLabel}>Propriedades</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>12</Text>
            <Text style={styles.summaryLabel}>Lotes ativos</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>87%</Text>
            <Text style={styles.summaryLabel}>Saúde do solo</Text>
          </View>
        </View>
      </View>

      {/* Botão Dashboard */}
      <TouchableOpacity
        style={styles.dashboardButton}
        onPress={() => router.push("/(produtor)/Dashboard")}
        activeOpacity={0.9}
      >
        <Ionicons name="bar-chart-outline" size={22} color="#fff" />
        <Text style={styles.dashboardText}>Ver Painel Detalhado</Text>
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
    marginBottom: 28,
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
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1b5e20",
    marginBottom: 12,
  },

  cropCard: {
    width: 160,
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 16,
    backgroundColor: "#eaf4ec",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cropImg: {
    width: "100%",
    height: "100%",
  },
  cropOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingVertical: 8,
    alignItems: "center",
  },
  cropName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  cropStatus: {
    color: "#dcdcdc",
    fontSize: 13,
  },

  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
  },
  tipTitle: { fontSize: 15, fontWeight: "600", color: "#2e7d32" },
  tipDesc: { fontSize: 13, color: "#555", marginTop: 3 },

  summarySection: {
    marginBottom: 30,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 18,
    marginHorizontal: 4,
    elevation: 2,
  },
  summaryNumber: { fontSize: 18, fontWeight: "700", color: "#2e7d32" },
  summaryLabel: { fontSize: 13, color: "#555", marginTop: 4 },

  dashboardButton: {
    backgroundColor: "#1b5e20",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 5,
    marginBottom: 50,
  },
  dashboardText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
});
