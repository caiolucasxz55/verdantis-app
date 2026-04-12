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
      } else {
        router.replace("/(tabs)/dashboard");
      }
    }
  }, [user, loading, router]);

  
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  // Auth loading finished; the effect above will redirect.
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
