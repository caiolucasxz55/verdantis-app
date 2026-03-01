import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { theme } from "./theme";

export default function LogoHeader() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/agro-logo-2.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Verdantis</Text>
      <Text style={styles.subtitle}>Gestao agricola inteligente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", marginBottom: 24 },
  logo: { width: 96, height: 96, marginBottom: 12 },
  title: { fontSize: 26, fontWeight: "800", color: theme.colors.textLight },
  subtitle: { marginTop: 6, fontSize: 14, color: "rgba(248, 250, 252, 0.8)" },
});
