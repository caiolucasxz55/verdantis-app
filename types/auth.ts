export interface User {
  id: string;
  name: string;
  email: string;
  userType?: string;
  cpf?: string;
  registrationDate?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  cpf: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
}
