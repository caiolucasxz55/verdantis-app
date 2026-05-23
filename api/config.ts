import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * API base URL (no .env).
 *
 * Rules (in order):
 * - If we can derive the dev-machine host from Expo metadata, use it (best for physical devices).
 * - Android fallback: 10.0.2.2 (emulator -> host loopback).
 * - Otherwise: localhost.
 */

// Optional manual override (keep null by default).
// If Expo metadata is unavailable in your setup, set this to your PC LAN IP, e.g. "192.168.0.10".
const MANUAL_DEV_MACHINE_HOST: string | null = null;

function toHost(value: unknown): string | null {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;


  try {
    if (raw.includes("://")) {
      const url = new URL(raw);
      return url.hostname || null;
    }
  } catch {
    // ignore
  }

  const noPath = raw.split("/")[0];
  const host = noPath.split(":")[0];
  return host || null;
}

function getExpoDevHost(): string | null {
  const candidates: unknown[] = [
    // Expo Go
    (Constants as any).expoGoConfig?.debuggerHost,
    // Expo CLI dev server (present during development)
    Constants.expoConfig?.hostUri,
    // Various runtime URIs
    (Constants as any).linkingUri,
    (Constants as any).experienceUrl,
    // Newer manifest shape (expo-updates manifest2)
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost,
    (Constants as any).manifest2?.extra?.expoClient?.hostUri,
    // Legacy manifest (kept as last resort)
    (Constants as any).manifest?.debuggerHost,
  ];

  if (__DEV__) {
    const preview = candidates
      .map((c) => {
        const raw = c == null ? null : String(c);
        const host = toHost(c);
        return { raw, host };
      })
      .filter((x) => x.raw || x.host);
    console.log("[API] Expo host candidates", preview);
  }

  for (const candidate of candidates) {
    const host = toHost(candidate);
    if (host) return host;
  }
  return null;
}

export function getApiBaseUrl(): string {
  if (MANUAL_DEV_MACHINE_HOST && MANUAL_DEV_MACHINE_HOST.trim()) {
    return `http://${MANUAL_DEV_MACHINE_HOST.trim()}:8080`;
  }

  // Prefer Expo-derived host when available (this fixes physical devices).
  const expoHost = getExpoDevHost();
  if (expoHost) {
    if (expoHost === "localhost" || expoHost === "127.0.0.1") {
      // On Android, localhost points to the device/emulator itself.
      if (Platform.OS === "android") return "http://10.0.2.2:8080";
      return "http://localhost:8080";
    }
    return `http://${expoHost}:8080`;
  }

  // Last-resort fallbacks.
  if (Platform.OS === "android") return "http://10.0.2.2:8080";
  return "http://localhost:8080";
}

// Exposed for visibility/debugging in UI if needed.
export const API_BASE_URL = getApiBaseUrl();
