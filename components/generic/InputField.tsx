import React from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { InputFieldProps } from "../../types/fields";


export default function InputField({ label, placeholder, secureTextEntry, value, onChangeText }: InputFieldProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8, width: "100%" },
  label: { fontSize: 15, marginBottom: 4, color: "#333" },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#000",
  },
});
