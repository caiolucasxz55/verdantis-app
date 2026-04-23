import axios from "axios";
import { getApiBaseUrl } from "./config";
import { getToken } from "./storage";

function joinUrl(base: string, path: string): string {
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

async function probeWithFetch(inputUrl: string): Promise<void> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const token = await getToken();

    const res = await fetch(inputUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : null),
      } as any,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log("[API] fetch probe OK", { url: inputUrl, status: res.status });
  } catch (e: any) {
    console.log("[API] fetch probe FAIL", { url: inputUrl, message: e?.message ?? String(e) });
  }
}

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
  timeoutErrorMessage: "Tempo limite excedido ao conectar ao servidor.",
});

export default apiClient;

if (__DEV__) {
  console.log(`[API] baseURL: ${apiClient.defaults.baseURL ?? "(undefined)"}`);
}

apiClient.interceptors.request.use(async (config) => {
  if (__DEV__) {
    const method = (config.method ?? "GET").toUpperCase();
    const baseURL = config.baseURL ?? apiClient.defaults.baseURL ?? "";
    const url = config.url ?? "";
    console.log(`[API] ${method} ${baseURL}${url}`);
  }

  const token = await getToken();
  if (token) {
    config.headers = config.headers ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (__DEV__) {
      const status = error?.response?.status;
      const baseURL = error?.config?.baseURL ?? apiClient.defaults.baseURL;
      const url = error?.config?.url;
      const code = error?.code;
      const message = error?.message;

      if (!error?.response) {
        console.log("[API] NETWORK ERROR", { code, message, baseURL, url });

        const base = String(baseURL ?? "");
        const isLocal = base.includes("localhost") || base.includes("127.0.0.1") || base.includes("10.0.2.2");

        if (isLocal) {
          console.log(
            "[API] Hint: no Android, 'localhost' aponta para o próprio device/emulador. Use 10.0.2.2 (emulador) ou o IP do PC (device físico)."
          );
        } else {
          console.log(
            "[API] Hint: baseURL já é IP LAN. Verifique: (1) celular e PC na MESMA rede Wi‑Fi (sem 4G/5G), (2) roteador sem 'AP/Client Isolation', (3) firewall do Windows liberando porta 8080 (perfil Private), (4) backend escutando em 0.0.0.0:8080."
          );
          console.log(
            "[API] Tip (Android via USB): você pode usar `adb reverse tcp:8080 tcp:8080` e então apontar para http://localhost:8080 no device."
          );
        }

        // Extra diagnostics: try native fetch to the same URL.
        // If fetch succeeds but Axios fails, it's likely an Axios/XHR issue.
        if (baseURL && url) {
          const full = joinUrl(String(baseURL), String(url));
          void probeWithFetch(full);
        }
      } else {
        console.log("[API] ERROR", { status, baseURL, url, code, message });
      }
    }
    return Promise.reject(error);
  }
);
