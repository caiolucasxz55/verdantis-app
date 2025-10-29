import React, { useState, useContext } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  Alert 
} from "react-native";
import { useRouter } from "expo-router"; 
import InputField from "../../src/components/generic/inputField";
import PrimaryButton from "../../src/components/generic/primaryButton";
import LinkText from "../../src/components/generic/linkText";
import { useAuth } from "../../hooks/UseAuth";

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter(); 
  
  const [selectedRole, setSelectedRole] = useState<"Gestor" | "Produtor" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!selectedRole) return Alert.alert("Erro", "Selecione um tipo de usuário.");
    if (!email || !password) return Alert.alert("Erro", "Preencha todos os campos.");

    const newUser = { email, password, role: selectedRole };

    try {
      await register(newUser);
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      router.replace("/(auth)/Login"); 
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/agro-image-2.png")}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Selecione seu tipo de usuário:</Text>

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, selectedRole === "Produtor" && styles.selectedRole]}
            onPress={() => setSelectedRole("Produtor")}
          >
            <Text style={[styles.roleText, selectedRole === "Produtor" && styles.selectedText]}>
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

        <InputField placeholder="E-mail" value={email} onChangeText={setEmail} />
        <InputField
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <PrimaryButton label="Cadastrar" onPress={handleRegister} style={{ marginTop: 20 }} />

        <View style={{ marginTop: 20 }}>
          <LinkText
            text="Já possui uma conta?"
            highlight="Fazer login"
            onPress={() => router.push("/(auth)/Login")} // ✅
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
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
