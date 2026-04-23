
import React, { createContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import type { AuthContextData, LoginData, RegisterData, User } from "../types/auth";
import { loginApi, registerApi } from "../api/auth";
import { clearStoredUser, clearToken, getStoredUser, setStoredUser, setToken } from "../api/storage";

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
				console.log("Load stored user error:", error);
			} finally {
				setLoading(false);
			}
		};

		loadStoredUser();
	}, []);

	const login = async (data: LoginData): Promise<boolean> => {
		try {
			if (!data.email || !data.password) return false;

			const res = await loginApi({ email: data.email, senha: data.password });
			const nextUser: User = {
				id: String(res.id),
				name: res.name,
				email: res.email,
				userType: res.userType,
			};

			await setToken(res.token);
			await setStoredUser(nextUser);
			setUser(nextUser);
			router.replace("/(tabs)/dashboard");
			return true;
		} catch (error) {
			console.log("Login error:", error);
			return false;
		}
	};

	const register = async (data: RegisterData): Promise<boolean> => {
		try {
			if (!data.name || !data.email || !data.cpf || !data.password) return false;
			const res = await registerApi({
				nomeCompleto: data.name,
				email: data.email,
				cpf: data.cpf,
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
			router.replace("/(tabs)/dashboard");
			return true;
		} catch (error) {
			console.log("Register error:", error);
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
//   // =======================================
