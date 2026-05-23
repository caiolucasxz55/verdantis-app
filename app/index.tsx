import React, { useContext, useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";
import { theme } from "../components/generic/theme";

export default function Index() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => {
        if (!user) {
          router.replace("/(auth)/Login");
        } else {
          router.replace("/(tabs)/dashboard");
        }
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [user, loading, router]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoWrap, { opacity, transform: [{ scale }] }]}>
        <Image source={require("../assets/agro-logo-2.png")} style={styles.logo} resizeMode="contain" />
        <Text style={styles.appName}>Verdantis</Text>
        <Text style={styles.tagline}>Gestão inteligente do campo</Text>
      </Animated.View>

      <Animated.View style={[styles.dotsRow, { opacity }]}>
        <PulsingDot delay={0} />
        <PulsingDot delay={200} />
        <PulsingDot delay={400} />
      </Animated.View>
    </View>
  );
}

function PulsingDot({ delay }: { delay: number }) {
  const anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 400, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return <Animated.View style={[styles.dot, { opacity: anim }]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDark,
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  logoWrap: {
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 90,
    height: 90,
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: theme.colors.textLight,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: "rgba(248, 250, 252, 0.6)",
    letterSpacing: 0.5,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
});
