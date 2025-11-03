import React, { useContext, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";

export default function Index() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
   
    if (!loading) {
      if (!user) {
        
        router.replace("/(auth)/Login");
      } else if (user.role === "Gestor") {
        router.replace("/(gestor)/Home");
      } else if (user.role === "Produtor") {
        router.replace("/(produtor)/Home");
      }
    }
  }, [user, loading]);

  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2e7d32" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
