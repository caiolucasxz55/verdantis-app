import React from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { InputFieldProps } from "../../types/fields";
import { theme } from "./theme";


export default function InputField({
  label,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  value,
  onChangeText,
}: InputFieldProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8, width: "100%" },
  label: { fontSize: 13, marginBottom: 6, color: theme.colors.textMuted, fontWeight: "600" },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
});
