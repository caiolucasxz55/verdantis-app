
import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import type { AuthContextData, LoginData, RegisterData, User } from "../types/auth";

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
			const storedUser = await AsyncStorage.getItem("user");
			if (storedUser) {
				setUser(JSON.parse(storedUser));
			}
			setLoading(false);
		};

		loadStoredUser();
	}, []);

	const login = async (data: LoginData): Promise<boolean> => {
		try {
			if (!data.email || !data.password) return false;

			const farmer: User = {
				id: "farmer-1",
				name: data.email.split("@")[0] || "Produtor",
				email: data.email,
				registrationDate: new Date().toISOString(),
			};

			await AsyncStorage.setItem("user", JSON.stringify(farmer));
			setUser(farmer);
			router.replace("/(tabs)/dashboard");
			return true;
		} catch (error) {
			console.log("Login error:", error);
			return false;
		}
	};

	const register = async (data: RegisterData): Promise<boolean> => {
		try {
			if (!data.name || !data.email || !data.password) return false;

			const farmer: User = {
				id: "farmer-1",
				name: data.name,
				email: data.email,
				registrationDate: new Date().toISOString(),
			};

			await AsyncStorage.setItem("user", JSON.stringify(farmer));
			setUser(farmer);
			router.replace("/(tabs)/dashboard");
			return true;
		} catch (error) {
			console.log("Register error:", error);
			return false;
		}
	};

	const logout = async () => {
		await AsyncStorage.removeItem("user");
		setUser(null);
		router.replace("/(auth)/Login");
	};

	return (
		<AuthContext.Provider value={{ user, loading, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
//   // =======================================
