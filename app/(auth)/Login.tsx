import React, { useState, useContext } from "react";
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
import { useRouter } from "expo-router"; // ✅
import LogoHeader from "../../components/generic/LogoHeader";
import PrimaryButton from "../../components/generic/PrimaryButton";
import LinkText from "../../components/generic/LinkText";
import { useAuth } from "../../hooks/useAuth";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter(); // ✅
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const user = await login(email, password);
      if (user?.role === "Gestor") router.replace("/(gestor)/Home");
      else if (user?.role === "Produtor") router.replace("/(produtor)/Home");
      else router.replace("/(auth)/Login");
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/agro-image-2.png")}
      style={styles.container}
    >
      <View style={styles.overlay} />

      <View style={styles.content}>
        <LogoHeader />

        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} color="#4ade80" style={styles.icon} />
          <TextInput
            style={styles.loginInput}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#4ade80" style={styles.icon} />
          <TextInput
            style={styles.loginInput}
            placeholder="Senha"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <PrimaryButton label="Entrar" onPress={handleLogin} style={{ marginTop: 25, width: "100%" }} />

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
            onPress={() => router.push("/(auth)/Register")} // ✅
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
  orText: { color: "#fff", marginTop: 20, marginBottom: 10, fontSize: 14 },
  socialContainer: { flexDirection: "row", justifyContent: "center", gap: 16 },
  socialButton: { backgroundColor: "#fff", padding: 12, borderRadius: 50, elevation: 3 },
});
