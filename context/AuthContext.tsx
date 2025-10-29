// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

interface User {
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

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

  async function signIn(email: string, password: string) {
    // Simula uma autenticação (substitua por chamada de API real)
    try {
      if (email === "" || password === "") {
        Alert.alert("Erro", "Preencha todos os campos!");
        return;
      }

      const mockUser: User = { name: "Usuário Demo", email };
      await AsyncStorage.setItem("@user", JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      Alert.alert("Erro", "Falha ao fazer login.");
      console.log(error);
    }
  }

  async function register(name: string, email: string, password: string) {
    // Simula um cadastro local
    try {
      if (!name || !email || !password) {
        Alert.alert("Erro", "Preencha todos os campos!");
        return;
      }

      const newUser: User = { name, email };
      await AsyncStorage.setItem("@user", JSON.stringify(newUser));
      setUser(newUser);
      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao cadastrar.");
      console.log(error);
    }
  }

  async function signOut() {
    try {
      await AsyncStorage.removeItem("@user");
      setUser(null);
    } catch (error) {
      Alert.alert("Erro", "Falha ao sair.");
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, register, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
