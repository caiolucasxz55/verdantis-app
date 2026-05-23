import React, { useEffect } from "react";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";
import { requestNotificationPermission } from "../services/notifications";

function NotificationSetup() {
  useEffect(() => {
    void requestNotificationPermission();
  }, []);
  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ToastProvider>
          <NotificationSetup />
          <Slot />
        </ToastProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
