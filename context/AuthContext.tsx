import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { User, AuthContextData, RegisterData } from "../types/auth";

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ⚠️ Altere o IP abaixo para o IP local da sua máquina (use seu IP na rede local)
  const API_URL = "http://192.168.0.10:8080";

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

  // 🔹 LOGIN — valida com e-mail e CPF
  async function login(email: string, cpf: string): Promise<User | null> {
    try {
      if (!email.trim() || !cpf.trim()) {
        Alert.alert("Erro", "Informe o e-mail e CPF.");
        return null;
      }

      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) throw new Error("Erro ao buscar usuários.");

      const allUsers: User[] = await response.json();

      const foundUser = allUsers.find(
        (u) =>
          u.email?.toLowerCase() === email.toLowerCase() &&
          u.cpf?.replace(/\D/g, "") === cpf.replace(/\D/g, "")
      );

      if (!foundUser) {
        Alert.alert("Erro", "Usuário não encontrado!");
        return null;
      }

      await AsyncStorage.setItem("@user", JSON.stringify(foundUser));
      setUser(foundUser);
      return foundUser;
    } catch (error) {
      console.log("Erro no login:", error);
      Alert.alert("Erro", "Falha ao realizar login.");
      return null;
    }
  }

  // 🔹 REGISTRO — envia JSON completo compatível com o modelo Java
  async function register(data: RegisterData) {
    try {
      const { userType, nome, cpf, email, telefone, cnpj, empresa } = data;

      if (!nome || !cpf || !email || !telefone) {
        Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
        return;
      }

      const newUser = {
        userName: nome,
        registrationDate: new Date().toISOString(),
        userType: {
          userTypeId: userType === "Gestor" ? 1 : 2,
          userDescription: userType,
        },
        cpf,
        email,
        telefone,
        cnpj: userType === "Gestor" ? cnpj || null : null,
        empresa: userType === "Gestor" ? empresa || null : null,
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

  // 🔹 LOGOUT — limpa o armazenamento local
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
