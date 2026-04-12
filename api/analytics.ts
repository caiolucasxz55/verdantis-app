import { apiClient } from "./client";
import type {
  ComparativoCulturaDto,
  ComparativoLoteDto,
  CotacaoDto,
  CustoReceitaDto,
  TendenciaLucroDto,
} from "./types";

export async function getCotacoes(): Promise<CotacaoDto[]> {
  const { data } = await apiClient.get<CotacaoDto[]>("/analytics/cotacoes");
  return data;
}

export async function postComparativoLotes(payload: { lotIds: number[] }): Promise<ComparativoLoteDto[]> {
  const { data } = await apiClient.post<ComparativoLoteDto[]>("/analytics/comparativo-lotes", payload);
  return data;
}

export async function postComparativoCulturas(payload: { culturas: string[] }): Promise<ComparativoCulturaDto[]> {
  const { data } = await apiClient.post<ComparativoCulturaDto[]>("/analytics/comparativo-culturas", payload);
  return data;
}

export async function getCustoReceita(): Promise<CustoReceitaDto[]> {
  const { data } = await apiClient.get<CustoReceitaDto[]>("/analytics/custo-receita");
  return data;
}

export async function getTendenciaLucro(): Promise<TendenciaLucroDto[]> {
  const { data } = await apiClient.get<TendenciaLucroDto[]>("/analytics/tendencia-lucro");
  return data;
}
