// app/(gestor)/Contact.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Contact() {
  const fazendas = [
    { id: "1", nome: "Fazenda Boa Esperança" },
    { id: "2", nome: "Sítio Primavera" },
    { id: "3", nome: "Fazenda Rio Verde" },
    { id: "4", nome: "AgroVale" },
  ];

  const [selectedFarm, setSelectedFarm] = useState(fazendas[0]);
  const [messages, setMessages] = useState([
    { from: "fazenda", text: "Olá gestor! A colheita de soja está indo bem." },
    { from: "gestor", text: "Excelente! Continuem o bom trabalho." },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: "gestor", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { from: "fazenda", text: "Mensagem recebida, gestor!" }]);
    }, 800);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💬 Contato com Fazendas</Text>
      </View>

      <FlatList
        data={fazendas}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        style={styles.farmList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.farmButton, selectedFarm.id === item.id && styles.farmButtonActive]}
            onPress={() => {
              setSelectedFarm(item);
              setMessages([{ from: "fazenda", text: `Olá gestor! Aqui é ${item.nome}.` }]);
            }}
          >
            <Ionicons name="leaf-outline" size={18} color={selectedFarm.id === item.id ? "#fff" : "#2e7d32"} />
            <Text style={[styles.farmText, selectedFarm.id === item.id && styles.farmTextActive]}>
              {item.nome}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.from === "gestor" ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <Text
              style={[styles.messageText, item.from === "gestor" && { color: "#fff" }]}
            >
              {item.text}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={`Mensagem para ${selectedFarm.nome}`}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6faf7" },
  header: { padding: 16, backgroundColor: "#2e7d32", alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  farmList: { maxHeight: 70, marginTop: 5 },
  farmButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#2e7d32",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 6,
  },
  farmButtonActive: { backgroundColor: "#2e7d32" },
  farmText: { color: "#2e7d32", fontWeight: "500", marginLeft: 6 },
  farmTextActive: { color: "#fff" },
  messagesContainer: { padding: 15, flexGrow: 1, justifyContent: "flex-end" },
  messageBubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
  },
  sentMessage: {
    backgroundColor: "#2e7d32",
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  receivedMessage: {
    backgroundColor: "#e7f3e9",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
  },
  messageText: { fontSize: 15, color: "#333" },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  input: { flex: 1, paddingHorizontal: 10, height: 40, fontSize: 15 },
  sendButton: { backgroundColor: "#2e7d32", padding: 10, borderRadius: 50, marginLeft: 6 },
});
