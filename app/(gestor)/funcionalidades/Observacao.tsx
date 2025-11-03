import React from "react";
import { View, Text, StyleSheet, FlatList, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Fazenda {
  id: string;
  nome: string;
  cultura: string;
  dataEntrada: string;
}

const fazendas: Fazenda[] = [
  { id: "1", nome: "Fazenda Santa Maria", cultura: "Milho", dataEntrada: "12/04/2024" },
  { id: "2", nome: "Fazenda Boa Esperança", cultura: "Soja", dataEntrada: "25/05/2024" },
  { id: "3", nome: "Fazenda Verde Vida", cultura: "Café", dataEntrada: "10/07/2024" },
  { id: "4", nome: "Fazenda Rio Azul", cultura: "Algodão", dataEntrada: "30/08/2024" },
  { id: "5", nome: "Fazenda Bela Vista", cultura: "Trigo", dataEntrada: "15/09/2024" },
];

const Observacao: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fazendas Cadastradas</Text>

      <FlatList
        data={fazendas}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="business-outline" size={30} color="#1D6B3A" />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.nome}</Text>
              <Text style={styles.cultura}>🌾 Cultura principal: {item.cultura}</Text>
              <Text style={styles.date}>📅 Entrada: {item.dataEntrada}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Observacao;

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
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  cultura: {
    fontSize: 15,
    color: "#333",
    marginTop: 4,
  },
  date: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
});
