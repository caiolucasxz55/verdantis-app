import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../../components/ScreenContainer";
import { AppCard } from "../../components/AppCard";
import { theme } from "../../components/generic/theme";
import { useAuth } from "../../hooks/useAuth";
import { getUserById } from "../../api/users";
import type { UserDto } from "../../api/types";

const USER_TYPE_LABEL: Record<string, string> = {
  PRODUTOR: "Produtor Rural",
  GESTOR: "Gestor",
  ADMIN: "Administrador",
};

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
      } finally {
        setDetailsLoading(false);
      }
    };
    void run();
  }, [userId]);

  const registrationDate = useMemo(() => {
    if (!details?.registrationDate) return null;
    const parsed = new Date(details.registrationDate);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toLocaleDateString("pt-BR");
  }, [details?.registrationDate]);

  const initials = useMemo(() => {
    const name = user?.name ?? "";
    return name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("");
  }, [user?.name]);

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja encerrar a sessão?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: logout },
    ]);
  };

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
      <Text style={styles.subtitle}>Informações do produtor</Text>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initials || "?"}</Text>
        </View>
        <View style={styles.avatarInfo}>
          <Text style={styles.avatarName}>{user?.name ?? "Produtor"}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark-outline" size={12} color={theme.colors.primary} />
              <Text style={styles.badgeText}>
                {USER_TYPE_LABEL[user?.userType ?? ""] ?? user?.userType ?? "Usuário"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Details card */}
      <AppCard style={styles.card}>
        <InfoRow icon="mail-outline" label="Email" value={user?.email ?? "—"} />

        {detailsLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Carregando detalhes...</Text>
          </View>
        ) : (
          <>
            {details?.cpf ? (
              <InfoRow icon="card-outline" label="CPF" value={details.cpf} />
            ) : null}
            {registrationDate ? (
              <InfoRow icon="calendar-outline" label="Membro desde" value={registrationDate} />
            ) : null}
          </>
        )}
      </AppCard>

      {/* Actions */}
      <View style={styles.actionsCard}>
        <TouchableOpacity style={styles.actionRow} onPress={handleLogout}>
          <View style={[styles.actionIcon, { backgroundColor: theme.colors.errorLight }]}>
            <Ionicons name="log-out-outline" size={18} color={theme.colors.error} />
          </View>
          <Text style={[styles.actionLabel, { color: theme.colors.error }]}>Encerrar sessão</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={infoStyles.row}>
      <View style={infoStyles.iconWrap}>
        <Ionicons name={icon} size={16} color={theme.colors.primary} />
      </View>
      <View style={infoStyles.textWrap}>
        <Text style={infoStyles.label}>{label}</Text>
        <Text style={infoStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: { flex: 1 },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
});

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 20,
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadow.strong,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 22,
  },
  avatarInfo: { flex: 1 },
  avatarName: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.primaryDark,
  },
  card: {
    gap: 0,
    paddingVertical: 4,
    marginBottom: 16,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  loadingText: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  actionsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    overflow: "hidden",
    ...theme.shadow.soft,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  actionIcon: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
});
