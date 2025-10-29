import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Message {
  id: string;
  name: string;
  message: string;
  time: string;
  avatar: string;
}

const messages: Message[] = [
  {
    id: "1",
    name: "Gestor - Fazenda Verde",
    message: "Olá! Lembre-se de enviar o relatório de sustentabilidade 🌱",
    time: "14:32",
    avatar: "https://cdn-icons-png.flaticon.com/512/4140/4140037.png",
  },
  {
    id: "2",
    name: "Gestor - AgroFaz",
    message: "Precisamos revisar os dados de colheita de junho.",
    time: "13:20",
    avatar: "https://cdn-icons-png.flaticon.com/512/4140/4140047.png",
  },
  {
    id: "3",
    name: "Gestor - GreenCoop",
    message: "Parabéns! Sua eficiência aumentou 5% este mês 💪",
    time: "Ontem",
    avatar: "https://cdn-icons-png.flaticon.com/512/4140/4140057.png",
  },
];

const Contact: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Centro de Conversas 💬</Text>
        <Text style={styles.headerSubtitle}>Comunique-se com seus gestores</Text>
      </View>

      {/* Lista de conversas */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.85}>
            <View style={styles.leftAccent} />
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.message} numberOfLines={1}>
                {item.message}
              </Text>
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.time}>{item.time}</Text>
              <Ionicons name="chevron-forward" size={20} color="#557C68" />
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Botão flutuante */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
        <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default Contact;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBF8",
    paddingTop: Platform.OS === "android" ? 36 : 60,
    paddingHorizontal: 18,
  },
  header: { marginBottom: 18 },
  headerTitle: { fontSize: 28, fontWeight: "800", color: "#1D6B3A" },
  headerSubtitle: { fontSize: 14, color: "#557C68", marginTop: 6 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingRight: 14,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    overflow: "hidden",
  },
  leftAccent: {
    width: 8,
    height: "100%",
    backgroundColor: "#58A55C",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    marginRight: 12,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginRight: 14,
    backgroundColor: "#E8F3E8",
    borderWidth: 2,
    borderColor: "#A9D59A",
  },
  textContainer: { flex: 1 },
  name: { fontSize: 17, fontWeight: "700", color: "#1D6B3A", marginBottom: 4 },
  message: { fontSize: 15, color: "#335E49" },
  rightSection: { alignItems: "center", justifyContent: "center", width: 60 },
  time: { fontSize: 12, color: "#58A55C", marginBottom: 6 },
  fab: {
    position: "absolute",
    bottom: 26,
    right: 20,
    backgroundColor: "#1D6B3A",
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});
