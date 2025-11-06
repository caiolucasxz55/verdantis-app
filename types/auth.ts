export interface ContactType {
  contactTypeId: number;
  contactTypeName?: string;
}

export interface UserContact {
  contactType: ContactType;
  value: string;
}

export interface UserType {
  userTypeId: number;
  userDescription: "Gestor" | "Produtor";
}

export interface User {
  userId?: number;
  userName: string;
  registrationDate: string;
  userType: UserType;
  contacts?: UserContact[];
}

export interface RegisterData {
  nome: string;
  email: string;
  telefone: string;
  userType: "Gestor" | "Produtor";
}

export interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: () => Promise<User[]>; // ✅ AGORA RETORNA LISTA
  setUserFromLogin: (userData: User) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}
