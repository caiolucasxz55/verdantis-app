import { apiClient } from "./client";
import type {
  SimulacaoLoteExistenteDto,
  SimulacoesRequestDto,
  SimulacoesResponseDto,
} from "./types";

export async function postSimulacoes(payload: SimulacoesRequestDto): Promise<SimulacoesResponseDto> {
  const { data } = await apiClient.post<SimulacoesResponseDto>("/simulacoes", payload);
  return data;
}

export async function getSimulacoesLotesExistentes(): Promise<SimulacaoLoteExistenteDto[]> {
  const { data } = await apiClient.get<SimulacaoLoteExistenteDto[]>("/simulacoes/lotes-existentes");
  return data;
}
