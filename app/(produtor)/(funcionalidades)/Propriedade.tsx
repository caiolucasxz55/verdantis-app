import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Propriedade() {
  const [propriedades, setPropriedades] = useState<any[]>([]);
  const [form, setForm] = useState({
    nome: "",
    rua: "",
    cep: "",
    cidade: "",
    estado: "",
    tamanho: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleAddPropriedade = () => {
    if (
      !form.nome ||
      !form.rua ||
      !form.cep ||
      !form.cidade ||
      !form.estado ||
      !form.tamanho
    ) {
      alert("Preencha todos os campos!");
      return;
    }
    setPropriedades([...propriedades, { ...form }]);
    setForm({ nome: "", rua: "", cep: "", cidade: "", estado: "", tamanho: "" });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Registrar Propriedade</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome da Propriedade"
          value={form.nome}
          onChangeText={(v) => handleChange("nome", v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Rua"
          value={form.rua}
          onChangeText={(v) => handleChange("rua", v)}
        />
        <TextInput
          style={styles.input}
          placeholder="CEP"
          keyboardType="numeric"
          value={form.cep}
          onChangeText={(v) => handleChange("cep", v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Cidade"
          value={form.cidade}
          onChangeText={(v) => handleChange("cidade", v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Estado"
          value={form.estado}
          onChangeText={(v) => handleChange("estado", v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Tamanho (ha)"
          keyboardType="numeric"
          value={form.tamanho}
          onChangeText={(v) => handleChange("tamanho", v)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddPropriedade}
        >
          <Text style={styles.addButtonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20 }}>
        {propriedades.map((p, index) => (
          <View key={index} style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="location-outline" size={24} color="#32CD32" />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.cardTitle}>{p.nome}</Text>
                <Text style={styles.cardSubtitle}>
                  {p.cidade}, {p.estado}
                </Text>
              </View>
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.label}>Área Total</Text>
              <Text style={styles.value}>{p.tamanho} ha</Text>
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.label}>Endereço</Text>
              <Text style={styles.value}>{p.rua}</Text>
            </View>

            <View style={styles.cardFooter}>
              <TouchableOpacity style={styles.cardButton}>
                <Ionicons name="create-outline" size={18} color="#333" />
                <Text style={styles.cardButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cardButton}>
                <Ionicons name="trash-outline" size={18} color="#333" />
                <Text style={styles.cardButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#32CD32",
    marginBottom: 16,
  },
  form: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#32CD32",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#777",
  },
  cardInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    color: "#777",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cardButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 4,
  },
  cardButtonText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 6,
  },
});
