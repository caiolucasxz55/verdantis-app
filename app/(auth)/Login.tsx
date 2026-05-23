import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Alert,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LogoHeader from "../../components/generic/LogoHeader";
import PrimaryButton from "../../components/generic/PrimaryButton";
import LinkText from "../../components/generic/LinkText";
import { useAuth } from "../../hooks/useAuth";
import { theme } from "../../components/generic/theme";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const features = [
    {
      icon: "trending-up-outline",
      title: "Lucratividade em tempo real",
      desc: "Acompanhe lucro, receita e custos por lote",
    },
    {
      icon: "bar-chart-outline",
      title: "Analytics de performance",
      desc: "Graficos comparativos para decisoes rapidas",
    },
    {
      icon: "shield-checkmark-outline",
      title: "Rastreabilidade completa",
      desc: "Hash de verificacao e timeline de eventos",
    },
  ];

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Informe email e senha.");
      return;
    }
    try {
      setLoading(true);
      const ok = await login({ email, password });
      if (!ok) {
        Alert.alert("Erro", "Email ou senha incorretos.");
      }
    } catch (err: any) {
      console.error("Erro no login:", err);
      Alert.alert("Erro", err.message || "Falha ao realizar login.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <ImageBackground
      source={require("../../assets/agro-image-2.png")}
      style={styles.container}
    >
      <View style={styles.overlay} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.brandSection}>
          <LogoHeader />
          <Text style={styles.brandTitle}>
            Gerencie sua fazenda com <Text style={styles.brandHighlight}>inteligencia</Text>
          </Text>
          <Text style={styles.brandSubtitle}>
            Controle lotes, cultivos, custos e lucratividade em uma plataforma feita para o produtor rural.
          </Text>

          <View style={styles.featuresList}>
            {features.map((item) => (
              <View key={item.title} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name={item.icon as any} size={20} color="#86efac" />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{item.title}</Text>
                  <Text style={styles.featureDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Entrar</Text>
          <Text style={styles.cardSubtitle}>Acesse o painel da sua fazenda</Text>

          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={theme.colors.primary} style={styles.icon} />
            <TextInput
              style={styles.loginInput}
              placeholder="Email"
              placeholderTextColor={theme.colors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.colors.primary} style={styles.icon} />
            <TextInput
              style={styles.loginInput}
              placeholder="Senha"
              placeholderTextColor={theme.colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <PrimaryButton
            label={loading ? "Entrando..." : "Entrar"}
            onPress={handleLogin}
            style={{ marginTop: 16, width: "100%" }}
            disabled={loading}
          />
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginTop: 8 }} />
          ) : null}

          <Text style={styles.orText}>ou continue com</Text>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={20} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={20} color="#111" />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 20 }}>
            <LinkText
              text="Ainda nao tem conta?"
              highlight="Cadastre-se"
              onPress={() => router.push("/(auth)/Register")}
            />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.backgroundOverlay,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 70,
    paddingBottom: 40,
  },
  brandSection: {
    marginBottom: 24,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: theme.colors.textLight,
    textAlign: "left",
    marginTop: 8,
  },
  brandHighlight: {
    color: "#86efac",
  },
  brandSubtitle: {
    marginTop: 10,
    fontSize: 15,
    color: "rgba(248, 250, 252, 0.8)",
  },
  featuresList: {
    marginTop: 18,
    gap: 12,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: { flex: 1 },
  featureTitle: {
    color: theme.colors.textLight,
    fontWeight: "700",
    fontSize: 14,
  },
  featureDesc: {
    color: "rgba(248, 250, 252, 0.7)",
    fontSize: 13,
    marginTop: 2,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    padding: 22,
    ...theme.shadow.card,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 6,
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    marginVertical: 6,
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  loginInput: { flex: 1, fontSize: 15, color: theme.colors.textPrimary, backgroundColor: "transparent" },
  icon: { marginRight: 8 },
  orText: { color: theme.colors.textMuted, marginTop: 16, marginBottom: 10, fontSize: 12, textAlign: "center" },
  socialContainer: { flexDirection: "row", justifyContent: "center", gap: 16 },
  socialButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
