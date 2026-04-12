export type UserType = "PRODUTOR" | "GESTOR" | string;

export interface AuthResponseDto {
  token: string;
  id: number;
  name: string;
  email: string;
  userType: UserType;
}

export interface LoginRequestDto {
  email: string;
  senha: string;
}

export interface RegisterRequestDto {
  nomeCompleto: string;
  email: string;
  cpf: string;
  senha: string;
}

export interface Paged<T> {
  _embedded: {
    [key: string]: T[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface UserDto {
  id: number;
  name: string;
  cpf: string;
  email: string;
  registrationDate: string;
  _links?: {
    self?: { href: string };
  };
}

export interface CreateUserRequestDto {
  name: string;
  cpf: string;
  email: string;
  password: string;
}

export interface LoteDto {
  id: number;
  lote: string;
  cultura: string;
  producao: number;
  custo: number;
  receita: number;
  lucroEstimado: number;
  status: string;
}

export interface CreateLoteRequestDto {
  nomeLote: string;
  cultura: string;
  producaoTotal: number;
  custoTotal: number;
  precoVenda: number;
}

export interface EventoLoteDto {
  id: number;
  loteId: number;
  tipoEvento: string;
  descricao: string;
  dataPlantio: string;
  dataColheitaEstimada: string;
}

export interface CreateEventoLoteRequestDto {
  tipoEvento: string;
  descricao: string;
  dataPlantio: string;
  dataColheitaEstimada: string;
}

export interface FinalizarCultivoResponseDto {
  hashEventos: string;
  qrCode: string; // base64
  arquivoPdf: string; // base64
  arquivoTxt: string; // base64
}

export interface CotacaoDto {
  cultura: string;
  precoSaca: number;
}

export interface ComparativoLoteDto {
  loteId: number;
  lote: string;
  producao: number;
  custo: number;
  receita: number;
  lucro: number;
}

export interface ComparativoCulturaDto {
  cultura: string;
  lucroMedio: number;
  producaoTotal: number;
}

export interface CustoReceitaDto {
  loteId: number;
  custoTotal: number;
  receitaTotal: number;
  lucroTotal: number;
}

export interface TendenciaLucroDto {
  cultura: string;
  tendenciaLucro: number;
  crescimento: number;
}

export interface DashboardDto {
  lucroTotal: number;
  culturaMaisRentavel: string;
  loteMaisRentavel: string;
  precoMedio: number;
}

export interface SimulacoesRequestDto {
  cenarioA: {
    cultura: string;
    producaoEstimada: number;
    custoEstimado: number;
    precoEstimado: number;
  };
  cenarioB: {
    cultura: string;
    producaoEstimada: number;
    custoEstimado: number;
    precoEstimado: number;
  };
}

export interface SimulacoesResponseDto {
  comparacaoLucro: { cenarioA: number; cenarioB: number };
  comparacaoReceita: { cenarioA: number; cenarioB: number };
  melhorOpcao: string;
}

export interface SimulacaoLoteExistenteDto {
  id: number;
  nomeLote: string;
  cultura: string;
}
