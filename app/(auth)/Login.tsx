import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Alert,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LogoHeader from "../../components/generic/LogoHeader";
import PrimaryButton from "../../components/generic/PrimaryButton";
import LinkText from "../../components/generic/LinkText";
import { useAuth } from "../../hooks/useAuth";
import { User } from "../../types/auth";

export default function LoginScreen() {
  const { login, setUserFromLogin } = useAuth();
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"Gestor" | "Produtor" | null>(null);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const handleLogin = async () => {
    try {
      if (!userName) {
        Alert.alert("Erro", "Informe seu nome de usuário.");
        return;
      }

      if (!showRoleSelection) {
        // First step: Get users by name
        const users: User[] = await login();

        if (!users || users.length === 0) {
          Alert.alert("Erro", "Nenhum usuário encontrado no servidor!");
          return;
        }

        const matchedUsers = users.filter(
          (u: User) => u.userName?.toLowerCase().trim() === userName.toLowerCase().trim()
        );

        if (matchedUsers.length === 0) {
          Alert.alert("Erro", "Usuário não encontrado.");
          return;
        }

        // Show role selection if user found
        setAvailableUsers(matchedUsers);
        setShowRoleSelection(true);
        return;
      }

      // Second step: Login with selected role
      if (!selectedRole) {
        Alert.alert("Erro", "Selecione seu tipo de usuário.");
        return;
      }

      const matchedUser = availableUsers.find(
        (u: User) => u.userType?.userDescription === selectedRole
      );

      if (!matchedUser) {
        Alert.alert("Erro", `Usuário não encontrado com o perfil ${selectedRole}.`);
        return;
      }

      // Save user to context and AsyncStorage
      await setUserFromLogin(matchedUser);
      
      const role = matchedUser.userType?.userDescription;

      if (role === "Gestor") {
        router.replace("/(gestor)/Home");
      } else if (role === "Produtor") {
        router.replace("/(produtor)/Home");
      } else {
        Alert.alert("Aviso", "Tipo de usuário não reconhecido.");
      }
    } catch (err: any) {
      console.error("Erro no login:", err);
      Alert.alert("Erro", err.message || "Falha ao realizar login.");
    }
  };

  const resetLogin = () => {
    setShowRoleSelection(false);
    setSelectedRole(null);
    setAvailableUsers([]);
  };
  return (
    <ImageBackground
      source={require("../../assets/agro-image-2.png")}
      style={styles.container}
    >
      <View style={styles.overlay} />
      <View style={styles.content}>
        <LogoHeader />

        {!showRoleSelection ? (
          <>
            {/* Username Input */}
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#4ade80" style={styles.icon} />
              <TextInput
                style={styles.loginInput}
                placeholder="Nome de usuário"
                placeholderTextColor="#888"
                value={userName}
                onChangeText={setUserName}
                autoCapitalize="none"
              />
            </View>

            <PrimaryButton
              label="Continuar"
              onPress={handleLogin}
              style={{ marginTop: 25, width: "100%" }}
            />
          </>
        ) : (
          <>
            {/* Role Selection */}
            <Text style={styles.roleTitle}>Olá, {userName}!</Text>
            <Text style={styles.roleSubtitle}>Selecione seu tipo de usuário:</Text>

            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleCard,
                  selectedRole === "Produtor" && styles.selectedRoleCard,
                ]}
                onPress={() => setSelectedRole("Produtor")}
              >
                <Ionicons 
                  name="leaf-outline" 
                  size={32} 
                  color={selectedRole === "Produtor" ? "#fff" : "#4ade80"} 
                />
                <Text
                  style={[
                    styles.roleText,
                    selectedRole === "Produtor" && styles.selectedRoleText,
                  ]}
                >
                  👨‍🌾 Produtor
                </Text>
                <Text
                  style={[
                    styles.roleDescription,
                    selectedRole === "Produtor" && styles.selectedRoleDescription,
                  ]}
                >
                  Gerencia fazendas e propriedades
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleCard,
                  selectedRole === "Gestor" && styles.selectedRoleCard,
                ]}
                onPress={() => setSelectedRole("Gestor")}
              >
                <Ionicons 
                  name="business-outline" 
                  size={32} 
                  color={selectedRole === "Gestor" ? "#fff" : "#4ade80"} 
                />
                <Text
                  style={[
                    styles.roleText,
                    selectedRole === "Gestor" && styles.selectedRoleText,
                  ]}
                >
                  📊 Gestor
                </Text>
                <Text
                  style={[
                    styles.roleDescription,
                    selectedRole === "Gestor" && styles.selectedRoleDescription,
                  ]}
                >                  Administra empresas e produtores
                </Text>
              </TouchableOpacity>
            </View>

            <PrimaryButton
              label="Entrar"
              onPress={handleLogin}
              style={{ marginTop: 25, width: "100%" }}
            />

            <TouchableOpacity onPress={resetLogin} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Voltar</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.orText}>ou continue com</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={22} color="#DB4437" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-apple" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 25 }}>
          <LinkText
            text="Ainda não tem conta?"
            highlight="Cadastre-se"
            onPress={() => router.push("/(auth)/Register")}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  content: { padding: 25, alignItems: "center", justifyContent: "center" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginVertical: 8,
    width: "90%",
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignSelf: "center",
  },
  loginInput: { flex: 1, fontSize: 16, color: "#000", backgroundColor: "transparent" },
  icon: { marginRight: 8 },
  roleTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  roleSubtitle: {
    fontSize: 16,
    color: "#ddd",
    textAlign: "center",
    marginBottom: 20,
  },
  roleContainer: {
    width: "100%",
    marginBottom: 20,
  },
  roleCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 15,
    padding: 20,
    marginVertical: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedRoleCard: {
    backgroundColor: "#4ade80",
    borderColor: "#22c55e",
  },
  roleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  selectedRoleText: {
    color: "#fff",
  },
  roleDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  selectedRoleDescription: {
    color: "#f0f9ff",
  },
  backButton: {
    marginTop: 15,
    padding: 10,
  },
  backButtonText: {
    color: "#4ade80",
    fontSize: 16,
    fontWeight: "500",
  },
  orText: { color: "#fff", marginTop: 20, marginBottom: 10, fontSize: 14 },
  socialContainer: { flexDirection: "row", justifyContent: "center", gap: 16 },
  socialButton: { backgroundColor: "#fff", padding: 12, borderRadius: 50, elevation: 3 },
});
