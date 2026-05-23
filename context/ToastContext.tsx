import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../components/generic/theme";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextData {
  showToast: (message: string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextData>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

const TOAST_DURATION = 3000;

const toastConfig: Record<ToastType, { bg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  success: { bg: theme.colors.success, icon: "checkmark-circle-outline" },
  error: { bg: "#ef4444", icon: "alert-circle-outline" },
  info: { bg: "#3b82f6", icon: "information-circle-outline" },
  warning: { bg: "#f59e0b", icon: "warning-outline" },
};

function ToastItem({ toast, onDone }: { toast: ToastMessage; onDone: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -20, duration: 300, useNativeDriver: true }),
      ]).start(() => onDone());
    }, TOAST_DURATION);

    return () => clearTimeout(timer);
  }, []);

  const cfg = toastConfig[toast.type];

  return (
    <Animated.View style={[styles.toast, { backgroundColor: cfg.bg, opacity, transform: [{ translateY }] }]}>
      <Ionicons name={cfg.icon} size={18} color="#fff" style={{ marginRight: 8 }} />
      <Text style={styles.toastText} numberOfLines={2}>{toast.message}</Text>
    </Animated.View>
  );
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={styles.container} pointerEvents="none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDone={() => remove(t.id)} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 56,
    left: 16,
    right: 16,
    zIndex: 9999,
    gap: 8,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    ...theme.shadow.card,
  },
  toastText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    flex: 1,
  },
});
