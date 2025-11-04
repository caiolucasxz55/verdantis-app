export interface UserType {
  userTypeId: number;
  userDescription: "Gestor" | "Produtor";
}

export interface User {
  userId?: number;
  userName: string;
  registrationDate: string;
  userType: UserType;
  cpf?: string;
  email?: string;
  telefone?: string;
  cnpj?: string | null;
  empresa?: string | null;
}

export interface RegisterData {
  userType: "Gestor" | "Produtor";
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cnpj?: string;
  empresa?: string;
}

export interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, cpf: string) => Promise<User | null>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}
