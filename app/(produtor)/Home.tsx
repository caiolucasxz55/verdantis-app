import React from "react";
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const crops = [
  { name: "Milho", img: require("../../assets/milho-img.png") },
  { name: "Soja", img: require("../../assets/soja-img.png") },
  { name: "Café", img: require("../../assets/cafe-img.png") },
];

const Home: React.FC = () => {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, Produtor 👋</Text>
        <Text style={styles.subtext}>Bem-vindo ao Verdantis</Text>
      </View>

      <View style={styles.weatherCard}>
        <Ionicons name="sunny" size={40} color="#FFD700" />
        <View>
          <Text style={styles.weatherText}>28°C - Ensolarado</Text>
          <Text style={styles.weatherSub}>Umidade: 54% | Vento: 9 km/h</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações rápidas</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => router.push("/(produtor)/funcionalidades/Propriedade")}
          >
            <Ionicons name="map" size={28} color="#32CD32" />
            <Text style={styles.actionText}>Propriedade</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => router.push("/(produtor)/funcionalidades/RegistroLote")}
          >
            <Ionicons name="leaf" size={28} color="#32CD32" />
            <Text style={styles.actionText}>Registrar Lote</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => router.push("/(produtor)/funcionalidades/ScannerQR")}
          >
            <Ionicons name="qr-code" size={28} color="#32CD32" />
            <Text style={styles.actionText}>Escanear</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cultivos recomendados</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {crops.map((crop, index) => (
            <View key={index} style={styles.cropCard}>
              <Image source={crop.img} style={styles.cropImg} resizeMode="cover" />
              <Text style={styles.cropName}>{crop.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sustentabilidade</Text>
        <View style={styles.sustainabilityCard}>
          <Ionicons name="earth" size={30} color="#32CD32" />
          <View>
            <Text style={styles.sustainabilityText}>Práticas Verdes</Text>
            <Text style={styles.sustainabilitySub}>
              Você reduziu 12% no uso de água este mês 💧
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", paddingTop: 20, paddingHorizontal: 16 },
  header: { marginBottom: 24 },
  greeting: { fontSize: 24, fontWeight: "bold", color: "#32CD32" },
  subtext: { fontSize: 16, color: "#333" },
  weatherCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  weatherText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  weatherSub: { fontSize: 14, color: "#777" },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#32CD32", marginBottom: 16 },
  actions: { flexDirection: "row", justifyContent: "space-between" },
  actionButton: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    width: "30%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  actionText: { fontSize: 14, color: "#333", marginTop: 8 },
  cropCard: { marginRight: 16, alignItems: "center" },
  cropImg: { width: 120, height: 120, borderRadius: 8, marginBottom: 8 },
  cropName: { fontSize: 14, fontWeight: "bold", color: "#333" },
  sustainabilityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sustainabilityText: { fontSize: 16, fontWeight: "bold", color: "#32CD32" },
  sustainabilitySub: { fontSize: 14, color: "#777" },
});
