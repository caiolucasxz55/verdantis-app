import React from "react";
import { Text, StyleSheet, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { ScreenContainer } from "../../components/ScreenContainer";
import { AppCard } from "../../components/AppCard";
import { theme } from "../../components/generic/theme";
import { useAuth } from "../../hooks/useAuth";

export default function ProfileScreen() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.subtitle}>Informacoes do produtor</Text>

      <AppCard style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{user?.name ?? "Produtor"}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email ?? ""}</Text>
      </AppCard>

      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    color: theme.colors.textMuted,
  },
  card: {
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textMuted,
  },
  value: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: theme.radius.md,
    backgroundColor: "#ef4444",
    ...theme.shadow.soft,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
  },
});
