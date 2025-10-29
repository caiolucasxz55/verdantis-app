import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function LogoHeader() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/agro-logo-2.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Bem-vindo ao Verdantis</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", marginVertical: 32 },
  logo: { width: 120, height: 120, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff" },
});
