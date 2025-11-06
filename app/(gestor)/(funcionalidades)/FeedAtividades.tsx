import React from "react";
import { View, Text, StyleSheet, FlatList, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "lote" | "agua" | "export" | "sustentabilidade";
}

const atividades: Activity[] = [
  {
    id: "1",
    title: "Novo Lote de Milho",
    description: "Fazenda Santa Maria adicionou um novo lote de milho (12 ha).",
    date: "03/11/2025",
    type: "lote",
  },
  {
    id: "2",
    title: "Eficiência Hídrica",
    description: "Fazenda Boa Esperança reduziu o uso de água em 8%.",
    date: "02/11/2025",
    type: "agua",
  },
  {
    id: "3",
    title: "Exportação",
    description: "Fazenda Verde Vida enviou lote #203 para Alemanha.",
    date: "01/11/2025",
    type: "export",
  },
  {
    id: "4",
    title: "Certificação Sustentável",
    description: "Fazenda Rio Azul recebeu selo Verde 2025.",
    date: "30/10/2025",
    type: "sustentabilidade",
  },
];

const getIcon = (type: Activity["type"]) => {
  switch (type) {
    case "lote":
      return <Ionicons name="leaf-outline" size={28} color="#2e7d32" />;
    case "agua":
      return <Ionicons name="water-outline" size={28} color="#32CD32" />;
    case "export":
      return <Ionicons name="boat-outline" size={28} color="#388E3C" />;
    case "sustentabilidade":
      return <Ionicons name="earth-outline" size={28} color="#4CAF50" />;
    default:
      return <Ionicons name="document-text-outline" size={28} color="#2e7d32" />;
  }
};

const FeedAtividades: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Atividades Recentes</Text>

      <FlatList
        data={atividades}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconContainer}>{getIcon(item.type)}</View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
              <Text style={styles.cardDate}>{item.date}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default FeedAtividades;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBF8",
    paddingTop: Platform.OS === "android" ? 36 : 60,
    paddingHorizontal: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1D6B3A",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: { marginRight: 12, justifyContent: "center" },
  textContainer: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: "bold", color: "#2e7d32" },
  cardDescription: { fontSize: 14, color: "#333", marginTop: 4 },
  cardDate: { fontSize: 12, color: "#888", marginTop: 6 },
});
