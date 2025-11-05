// types/auth.ts

export interface UserType {
  userTypeId: number;
  userDescription?: string;
}

export interface Contact {
  contactType: { contactTypeId: number };
  value: string;
}

export interface User {
  userId?: number;
  userName: string;
  registrationDate: string;
  userType: UserType;
  contacts?: Contact[];
  cnpj?: string | null;
  empresa?: string | null;
}

export interface RegisterData {
  userType: "Gestor" | "Produtor";
  nome: string;
  email: string;
  telefone: string;
  cnpj?: string;
  empresa?: string;
}

export interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<User | null>; // 👈 AQUI ESTÁ A MUDANÇA!
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}
