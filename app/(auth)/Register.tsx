import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import InputField from "../../components/generic/InputField";
import PrimaryButton from "../../components/generic/PrimaryButton";
import LinkText from "../../components/generic/LinkText";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<"Gestor" | "Produtor" | null>(null);

  // Campos comuns
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  // Campos específicos do Gestor
  const [cnpj, setCnpj] = useState("");
  const [empresa, setEmpresa] = useState("");

  const handleRegister = async () => {
    if (!selectedRole) return Alert.alert("Erro", "Selecione um tipo de usuário.");
    if (!nome || !cpf || !email || !telefone)
      return Alert.alert("Erro", "Preencha todos os campos obrigatórios.");

    if (selectedRole === "Gestor" && (!cnpj || !empresa)) {
      return Alert.alert("Erro", "Preencha os campos de CNPJ e nome da empresa.");
    }

    try {
      await register({
        userType: selectedRole,
        nome,
        cpf,
        email,
        telefone,
        cnpj: selectedRole === "Gestor" ? cnpj : undefined,
        empresa: selectedRole === "Gestor" ? empresa : undefined,
      });

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      router.replace("/(auth)/Login");
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Falha ao realizar cadastro.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/agro-image-2.png")}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View style={styles.card}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Selecione o tipo de usuário:</Text>

          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleButton, selectedRole === "Produtor" && styles.selectedRole]}
              onPress={() => setSelectedRole("Produtor")}
            >
              <Text
                style={[styles.roleText, selectedRole === "Produtor" && styles.selectedText]}
              >
                👨‍🌾 Produtor
              </Text>
              <Text style={styles.roleDescription}>Gestão da fazenda</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleButton, selectedRole === "Gestor" && styles.selectedRole]}
              onPress={() => setSelectedRole("Gestor")}
            >
              <Text style={[styles.roleText, selectedRole === "Gestor" && styles.selectedText]}>
                📊 Gestor
              </Text>
              <Text style={styles.roleDescription}>Relatórios e analytics</Text>
            </TouchableOpacity>
          </View>

          {selectedRole && (
            <>
              <InputField placeholder="Nome completo" value={nome} onChangeText={setNome} />
              <InputField placeholder="CPF" value={cpf} onChangeText={setCpf} />
              <InputField
                placeholder={selectedRole === "Gestor" ? "E-mail empresarial" : "E-mail"}
                value={email}
                onChangeText={setEmail}
              />
              <InputField placeholder="Telefone" value={telefone} onChangeText={setTelefone} />

              {selectedRole === "Gestor" && (
                <>
                  <InputField placeholder="CNPJ" value={cnpj} onChangeText={setCnpj} />
                  <InputField
                    placeholder="Nome da empresa"
                    value={empresa}
                    onChangeText={setEmpresa}
                  />
                </>
              )}

              <PrimaryButton
                label="Cadastrar"
                onPress={handleRegister}
                style={{ marginTop: 20 }}
              />
            </>
          )}

          <View style={{ marginTop: 25 }}>
            <LinkText
              text="Já possui uma conta?"
              highlight="Fazer login"
              onPress={() => router.push("/(auth)/Login")}
            />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 25,
    margin: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center", color: "#1b5e20" },
  subtitle: { textAlign: "center", marginVertical: 15, color: "#444", fontSize: 15 },
  roleContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 5,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  selectedRole: { borderColor: "#2e7d32", backgroundColor: "#c8e6c9" },
  roleText: { fontWeight: "bold", fontSize: 16, color: "#333" },
  selectedText: { color: "#1b5e20" },
  roleDescription: { fontSize: 12, color: "#666", marginTop: 4 },
});
