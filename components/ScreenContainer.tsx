import React from "react";
import { ScrollView, StyleSheet, ViewStyle } from "react-native";

interface ScreenContainerProps {
  children: React.ReactNode;
  contentStyle?: ViewStyle;
}

export function ScreenContainer({ children, contentStyle }: ScreenContainerProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, contentStyle]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
});
