import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinkTextProps } from "../../types/fields";
import { theme } from "./theme";


export default function LinkText({ text, highlight, href, onPress }: LinkTextProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) return onPress();
    if (href) router.push(href);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.text}>
        {text} <Text style={styles.highlight}>{highlight}</Text>
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 14, color: theme.colors.textMuted, textAlign: "center" },
  highlight: { color: theme.colors.primary, fontWeight: "700" },
});
