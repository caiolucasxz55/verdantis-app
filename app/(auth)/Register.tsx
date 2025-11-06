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

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [empresa, setEmpresa] = useState("");

  const handleRegister = async () => {
    if (!selectedRole)
      return Alert.alert("Erro", "Selecione o tipo de usuário.");

    if (!nome || !email || !telefone)
      return Alert.alert("Erro", "Preencha todos os campos obrigatórios.");

    if (selectedRole === "Gestor" && (!cnpj || !empresa))
      return Alert.alert("Erro", "Preencha o CNPJ e o nome da empresa.");

    try {
      // Monta o payload conforme RegisterData (usado pelo context.register)
      const payload = {
        userType: selectedRole,
        nome,
        email,
        telefone,
        ...(selectedRole === "Gestor" ? { cnpj, empresa } : {}),
      };

      console.log("📦 Enviando payload:", JSON.stringify(payload, null, 2));

      await register(payload);

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      router.replace("/(auth)/Login");
    } catch (err: any) {
      console.error("Erro no registro:", err);
      Alert.alert("Erro", err.message || "Falha ao realizar cadastro.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/agro-image-2.png")}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Cadastro de Usuário</Text>
          <Text style={styles.subtitle}>Selecione o tipo de usuário:</Text>

          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === "Produtor" && styles.selectedRole,
              ]}
              onPress={() => setSelectedRole("Produtor")}
            >
              <Text
                style={[
                  styles.roleText,
                  selectedRole === "Produtor" && styles.selectedText,
                ]}
              >
                👨‍🌾 Produtor
              </Text>
              <Text style={styles.roleDescription}>
                Gerencia fazendas e propriedades
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === "Gestor" && styles.selectedRole,
              ]}
              onPress={() => setSelectedRole("Gestor")}
            >
              <Text
                style={[
                  styles.roleText,
                  selectedRole === "Gestor" && styles.selectedText,
                ]}
              >
                📊 Gestor
              </Text>
              <Text style={styles.roleDescription}>
                Administra empresas e produtores
              </Text>
            </TouchableOpacity>
          </View>

          {selectedRole && (
            <>
              <InputField
                placeholder="Nome completo"
                value={nome}
                onChangeText={setNome}
              />
              <InputField
                placeholder={
                  selectedRole === "Gestor"
                    ? "E-mail empresarial"
                    : "E-mail pessoal"
                }
                value={email}
                onChangeText={setEmail}
              />
              <InputField
                placeholder="Telefone"
                value={telefone}
                onChangeText={setTelefone}
              />

              {selectedRole === "Gestor" && (
                <>
                  <InputField
                    placeholder="CNPJ da empresa"
                    value={cnpj}
                    onChangeText={setCnpj}
                  />
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 25,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1b5e20",
  },
  subtitle: {
    textAlign: "center",
    marginVertical: 15,
    color: "#444",
    fontSize: 15,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
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
