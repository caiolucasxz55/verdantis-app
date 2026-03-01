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
import { Ionicons } from "@expo/vector-icons";
import LogoHeader from "../../components/generic/LogoHeader";
import { theme } from "../../components/generic/theme";

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const benefits = [
    { icon: "checkmark-circle-outline", title: "Cadastro gratuito", desc: "Comece sem custos iniciais" },
    { icon: "shield-checkmark-outline", title: "Dados protegidos", desc: "Seguranca e privacidade garantidas" },
    { icon: "leaf-outline", title: "Suporte completo", desc: "Equipe dedicada ao seu sucesso" },
  ];

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      return Alert.alert("Erro", "Preencha todos os campos obrigatorios.");
    }

    try {
      const ok = await register({ name: nome, email, password: senha });
      if (!ok) {
        Alert.alert("Erro", "Falha ao realizar cadastro.");
        return;
      }

      Alert.alert("Sucesso", "Conta criada com sucesso!");
      router.replace("/(tabs)/dashboard");
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
      <View style={styles.overlay} />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.brandSection}>
          <LogoHeader />
          <Text style={styles.brandTitle}>
            Crie sua <Text style={styles.brandHighlight}>conta</Text>
          </Text>
          <Text style={styles.brandSubtitle}>
            Comece a controlar a lucratividade dos seus lotes e tome decisoes melhores para a sua producao.
          </Text>
          <View style={styles.benefitsList}>
            {benefits.map((item) => (
              <View key={item.title} style={styles.benefitRow}>
                <View style={styles.benefitIcon}>
                  <Ionicons name={item.icon as any} size={20} color="#86efac" />
                </View>
                <View>
                  <Text style={styles.benefitTitle}>{item.title}</Text>
                  <Text style={styles.benefitDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Cadastro do produtor</Text>

          <InputField
            label="Nome completo"
            placeholder="Ex: Joao Pedro"
            value={nome}
            onChangeText={setNome}
          />
          <InputField
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
          />
          <InputField
            label="Senha"
            placeholder="Crie uma senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <PrimaryButton
            label="Cadastrar"
            onPress={handleRegister}
            style={{ marginTop: 16 }}
          />

          <View style={{ marginTop: 20 }}>
            <LinkText
              text="Ja possui uma conta?"
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.backgroundOverlay,
  },
  scrollContainer: {
    flexGrow: 1,
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
  },
  brandHighlight: { color: "#86efac" },
  brandSubtitle: {
    marginTop: 10,
    fontSize: 15,
    color: "rgba(248, 250, 252, 0.8)",
  },
  benefitsList: { marginTop: 18, gap: 12 },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  benefitTitle: { color: theme.colors.textLight, fontWeight: "700", fontSize: 14 },
  benefitDesc: { color: "rgba(248, 250, 252, 0.7)", fontSize: 13, marginTop: 2 },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    padding: 22,
    ...theme.shadow.card,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  subtitle: {
    color: theme.colors.textMuted,
    marginTop: 6,
    marginBottom: 14,
    fontSize: 13,
  },
});
