import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { theme } from "./generic/theme";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  style?: ViewStyle;
  disabled?: boolean;
}

export function AppButton({ label, onPress, variant = "primary", style, disabled }: AppButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === "secondary" && styles.secondaryText,
          variant === "ghost" && styles.ghostText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadow.soft,
  },
  secondary: {
    backgroundColor: "#f1f5f9",
  },
  ghost: {
    backgroundColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  secondaryText: {
    color: theme.colors.textPrimary,
  },
  ghostText: {
    color: theme.colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
});
