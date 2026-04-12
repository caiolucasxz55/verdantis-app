import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { theme } from "../../components/generic/theme";
import DownloadButtons from "../../components/generic/DownloadButtons";

export default function Profile() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.replace("/(auth)/Login");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair da conta.");
      console.error("Erro ao sair:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={{ color: "#888", marginTop: 10 }}>Carregando perfil...</Text>
      </View>
    );
  }

  const isProdutor = false;
  const avatarUri = "https://cdn-icons-png.flaticon.com/512/1995/1995574.png";

  const stats = [
    { label: "Lotes ativos", value: "12" },
    { label: "Cultivos em andamento", value: "8" },
    { label: "Lucro acumulado", value: "R$ 20.175" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>
          {isProdutor
            ? "Produtor - Gestao da fazenda"
            : "Gestor - Relatorios e analytics"}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Conta verificada</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Localizacao</Text>
        <Text style={styles.infoText}>Sao Paulo, Brasil</Text>

        <Text style={styles.infoTitle}>Data de cadastro</Text>
        <Text style={styles.infoText}>06 de Outubro de 2025</Text>

        {isProdutor && (
          <>
            <Text style={styles.infoTitle}>Tipos de cultivo</Text>
            <Text style={styles.infoText}>• Soja</Text>
            <Text style={styles.infoText}>• Milho</Text>
            <Text style={styles.infoText}>• Cafe</Text>
          </>
        )}
      </View>

      <View style={styles.statsRow}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <DownloadButtons
        qrValue={user.email || user.id || user.name}
        pdfHtml={`<html><body><h1>Perfil de ${user.name}</h1><p>Role: ${isProdutor ? "Produtor" : "Gestor"}</p><ul>${stats
          .map((s) => `<li>${s.label}: ${s.value}</li>`)
          .join("")}</ul></body></html>`}
        fileBaseName={`perfil_${user.name.replace(/\s+/g, "_")}`}
      />

      <TouchableOpacity
        onPress={handleLogout}
        style={[styles.logoutButton, isLoggingOut && { opacity: 0.6 }]}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.logoutText}>Sair</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  header: { alignItems: "center", marginTop: 40, marginBottom: 24 },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: "700", color: theme.colors.textPrimary },
  role: { fontSize: 13, color: theme.colors.textMuted, marginTop: 4, textAlign: "center" },
  badge: {
    marginTop: 10,
    backgroundColor: "rgba(34, 197, 94, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { color: theme.colors.primaryDark, fontWeight: "600", fontSize: 12 },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: theme.radius.lg,
    padding: 18,
    marginBottom: 18,
    ...theme.shadow.soft,
  },
  infoTitle: { fontWeight: "700", color: theme.colors.textPrimary, marginTop: 10 },
  infoText: { color: theme.colors.textMuted, marginTop: 4 },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: theme.radius.lg,
    padding: 12,
    alignItems: "center",
    ...theme.shadow.soft,
  },
  statValue: { fontSize: 14, fontWeight: "700", color: theme.colors.textPrimary },
  statLabel: { fontSize: 11, color: theme.colors.textMuted, textAlign: "center", marginTop: 4 },
  logoutButton: {
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: theme.radius.md,
    alignItems: "center",
    ...theme.shadow.soft,
  },
  logoutText: { color: "#fff", fontWeight: "bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
