import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { User, AuthContextData, RegisterData } from "../types/auth";

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ⚠️ Atualize este IP conforme o da sua máquina
  const API_URL = "http://10.0.2.2:8080";


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
  // 🔹 LOGIN — agora sem parâmetros, apenas busca todos os usuários
  async function login(): Promise<User[]> {
    try {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) throw new Error("Erro ao buscar usuários.");

      const allUsers: User[] = await response.json();
      console.log("=== USUÁRIOS RECEBIDOS ===");
      console.log(JSON.stringify(allUsers, null, 2));

      return allUsers;
    } catch (error) {
      console.log("Erro no login:", error);
      Alert.alert("Erro", "Falha ao realizar login.");
      return [];
    }
  }

  // 🔹 SET USER FROM LOGIN - updates user state after successful login
  async function setUserFromLogin(userData: User) {
    try {
      await AsyncStorage.setItem("@user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.log("Erro ao salvar usuário:", error);
    }
  }

  // 🔹 REGISTRO — envia JSON compatível com backend Java
  async function register(data: RegisterData) {
    try {
      const { nome, email, telefone, userType } = data;

      if (!nome || !email || !telefone) {
        Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
        return;
      }      const newUser = {
        userName: nome,
        registrationDate: new Date().toISOString(),
        userType: { 
          userTypeId: userType === "Gestor" ? 2 : 1,
          userDescription: userType
        },
        contacts: [
          { contactType: { contactTypeId: 1 }, value: telefone },
          { contactType: { contactTypeId: 2 }, value: email },
        ],
      };

      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error("Falha ao cadastrar usuário.");

      const createdUser: User = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(createdUser));
      setUser(createdUser);

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
    <AuthContext.Provider value={{ user, loading, login, setUserFromLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
