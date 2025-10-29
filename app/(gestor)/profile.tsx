// app/(gestor)/Profile.tsx
import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

export default function Profile() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      router.replace("/(auth)/Login");
    } catch {
      Alert.alert("Erro", "Falha ao sair da conta.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={{ color: "#777", marginTop: 10 }}>Carregando perfil...</Text>
      </View>
    );
  }

  const avatarUri =
    user.role === "Produtor"
      ? "https://cdn-icons-png.flaticon.com/512/3069/3069172.png"
      : "https://cdn-icons-png.flaticon.com/512/1995/1995574.png";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <Text style={styles.name}>{user.email}</Text>
        <Text style={styles.role}>{user.role === "Produtor" ? "Gestão de Fazenda" : "Gestor Agrícola"}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📍 Localização</Text>
        <Text style={styles.infoText}>São Paulo, Brasil</Text>
        <Text style={styles.infoTitle}>📅 Data de Cadastro</Text>
        <Text style={styles.infoText}>06 de Outubro de 2025</Text>
        <Text style={styles.infoTitle}>🌿 Responsabilidades</Text>
        <Text style={styles.infoText}>
          {user.role === "Gestor"
            ? "Monitoramento de exportações e produtividade."
            : "Supervisão de colheitas e plantio."}
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={loading}>
        {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.logoutText}>Sair</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fdf9", alignItems: "center", padding: 20 },
  header: { alignItems: "center", marginTop: 60, marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 18, fontWeight: "bold", color: "#333" },
  role: { fontSize: 15, color: "#32CD32", marginTop: 4 },
  infoCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    marginBottom: 25,
    elevation: 3,
  },
  infoTitle: { fontWeight: "bold", color: "#333", marginTop: 10 },
  infoText: { color: "#666", marginTop: 4 },
  logoutButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
