import React, { createContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import type { AuthContextData, LoginData, RegisterData, User } from "../types/auth";
import { loginApi, registerApi } from "../api/auth";
import { clearStoredUser, clearToken, getStoredUser, setStoredUser, setToken } from "../api/storage";
import { notifySuccess, notifyError } from "../services/notifications";

export const AuthContext = createContext<AuthContextData>({
  user: null,
  loading: false,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await getStoredUser<User>();
        if (storedUser) setUser(storedUser);
      } catch (error) {
        console.error("Erro ao carregar usuário salvo:", error);
      } finally {
        setLoading(false);
      }
    };
    void loadStoredUser();
  }, []);

  const login = async (data: LoginData): Promise<boolean> => {
    try {
      if (!data.email?.trim() || !data.password?.trim()) return false;

      const res = await loginApi({ email: data.email.trim(), senha: data.password });
      const nextUser: User = {
        id: String(res.id),
        name: res.name,
        email: res.email,
        userType: res.userType,
      };

      await setToken(res.token);
      await setStoredUser(nextUser);
      setUser(nextUser);
      await notifySuccess(`Bem-vindo de volta, ${nextUser.name.split(" ")[0]}!`);
      router.replace("/(tabs)/dashboard");
      return true;
    } catch (error: any) {
      console.error("Erro no login:", error);
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        await notifyError("Email ou senha incorretos.");
      } else if (!error?.response) {
        await notifyError("Sem conexão com o servidor.");
      }
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      if (!data.name?.trim() || !data.email?.trim() || !data.cpf?.trim() || !data.password?.trim()) {
        return false;
      }
      const res = await registerApi({
        nomeCompleto: data.name.trim(),
        email: data.email.trim(),
        cpf: data.cpf.trim(),
        senha: data.password,
      });
      const nextUser: User = {
        id: String(res.id),
        name: res.name,
        email: res.email,
        userType: res.userType,
      };

      await setToken(res.token);
      await setStoredUser(nextUser);
      setUser(nextUser);
      await notifySuccess(`Conta criada com sucesso! Bem-vindo, ${nextUser.name.split(" ")[0]}!`);
      router.replace("/(tabs)/dashboard");
      return true;
    } catch (error: any) {
      console.error("Erro no registro:", error);
      const status = error?.response?.status;
      if (status === 409) {
        await notifyError("Email ou CPF já cadastrado.");
      } else if (!error?.response) {
        await notifyError("Sem conexão com o servidor.");
      }
      return false;
    }
  };

  const logout = async () => {
    await clearStoredUser();
    await clearToken();
    setUser(null);
    router.replace("/(auth)/Login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
