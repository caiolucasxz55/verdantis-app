
export interface User {
  email: string;
  role: "Gestor" | "Produtor";
}

export interface LoginData {
  email: string;
  password: string;
}


export interface RegisterData {
  email: string;
  password: string;
  role: "Gestor" | "Produtor";
}


export interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}
