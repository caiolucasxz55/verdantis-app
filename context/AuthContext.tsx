import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { User, AuthContextData, RegisterData } from "../types/auth";

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ⚙️ Altere o IP conforme sua rede local (Java rodando na porta 8080)
 const API_URL = "http://192.168.15.19:8080";


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

  // 🔹 LOGIN — agora apenas com e-mail
  async function login(email: string): Promise<User | null> {
  try {
    if (!email.trim()) {
      Alert.alert("Erro", "Informe o e-mail para login.");
      return null;
    }

    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error("Erro ao buscar usuários.");

    const allUsers: User[] = await response.json();

    console.log("=== USUÁRIOS RECEBIDOS ===");
    console.log(JSON.stringify(allUsers, null, 2));

    // 🔍 busca por qualquer contato que contenha o e-mail informado
    const foundUser = allUsers.find((u) =>
      u.contacts?.some((c) =>
        c.value?.toLowerCase().trim() === email.toLowerCase().trim()
      )
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

  // 🔹 REGISTRO — envia JSON compatível com o modelo Java
  async function register(data: RegisterData) {
    try {
      const { userType, nome, email, telefone, cnpj, empresa } = data;

      if (!nome || !email || !telefone) {
        Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
        return;
      }

      // Monta o corpo da requisição conforme o modelo do back-end
      const newUser = {
        userName: nome,
        registrationDate: new Date().toISOString(),
        userType: { userTypeId: userType === "Gestor" ? 1 : 2 },
        contacts: [
          { contactType: { contactTypeId: 1 }, value: telefone },
          { contactType: { contactTypeId: 2 }, value: email },
        ],
        ...(userType === "Gestor" && cnpj && empresa
          ? { cnpj, empresa }
          : {}),
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

  // 🔹 LOGOUT
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
