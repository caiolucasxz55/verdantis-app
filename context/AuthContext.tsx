// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { User, RegisterData, AuthContextData } from "../types/auth"; // ✅ importando types

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        const storedUser = await AsyncStorage.getItem("@user");
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (error) {
        console.log("Erro ao carregar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, []);

  async function login(email: string, password: string): Promise<User | null> {
    try {
      if (!email || !password) {
        Alert.alert("Erro", "Preencha todos os campos!");
        return null;
      }

      const storedUser = await AsyncStorage.getItem("@user");
      if (!storedUser) {
        Alert.alert("Erro", "Usuário não encontrado. Cadastre-se primeiro!");
        return null;
      }

      const parsedUser: User & { password?: string } = JSON.parse(storedUser);
      if (parsedUser.email === email) {
        setUser(parsedUser);
        return parsedUser;
      } else {
        Alert.alert("Erro", "Credenciais inválidas!");
        return null;
      }
    } catch (error) {
      console.log("Erro no login:", error);
      Alert.alert("Erro", "Falha ao fazer login.");
      return null;
    }
  }

  async function register({ email, password, role }: RegisterData) {
    try {
      if (!email || !password || !role) {
        Alert.alert("Erro", "Preencha todos os campos!");
        return;
      }

      const newUser: User & { password: string } = { email, role, password };
      await AsyncStorage.setItem("@user", JSON.stringify(newUser));
      setUser({ email, role });
      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
    } catch (error) {
      console.log("Erro no registro:", error);
      Alert.alert("Erro", "Falha ao cadastrar usuário.");
    }
  }

  async function logout() {
    try {
      await AsyncStorage.removeItem("@user");
      setUser(null);
    } catch (error) {
      console.log("Erro ao sair:", error);
      Alert.alert("Erro", "Falha ao sair da conta.");
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
