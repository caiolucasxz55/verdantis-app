import React, { useEffect, useMemo, useState } from "react";
import { Text, StyleSheet, View, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { ScreenContainer } from "../../components/ScreenContainer";
import { AppCard } from "../../components/AppCard";
import { theme } from "../../components/generic/theme";
import { useAuth } from "../../hooks/useAuth";
import { getUserById } from "../../api/users";
import type { UserDto } from "../../api/types";

export default function ProfileScreen() {
  const { user, logout, loading } = useAuth();

  const [detailsLoading, setDetailsLoading] = useState(false);
  const [details, setDetails] = useState<UserDto | null>(null);

  const userId = useMemo(() => {
    const id = Number(user?.id);
    return Number.isFinite(id) ? id : null;
  }, [user?.id]);

  useEffect(() => {
    const run = async () => {
      if (!userId) {
        setDetails(null);
        return;
      }
      try {
        setDetailsLoading(true);
        const data = await getUserById(userId);
        setDetails(data);
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
        Alert.alert("Erro", "Não foi possível carregar os detalhes do perfil.");
      } finally {
        setDetailsLoading(false);
      }
    };

    void run();
  }, [userId]);

  const registrationDate = useMemo(() => {
    if (!details?.registrationDate) return "";
    const parsed = new Date(details.registrationDate);
    return Number.isNaN(parsed.getTime()) ? details.registrationDate : parsed.toLocaleDateString("pt-BR");
  }, [details?.registrationDate]);

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

        {detailsLoading ? (
          <View style={{ paddingVertical: 8 }}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        ) : null}

        {details?.cpf ? (
          <>
            <Text style={styles.label}>CPF</Text>
            <Text style={styles.value}>{details.cpf}</Text>
          </>
        ) : null}

        {registrationDate ? (
          <>
            <Text style={styles.label}>Data de cadastro</Text>
            <Text style={styles.value}>{registrationDate}</Text>
          </>
        ) : null}
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
