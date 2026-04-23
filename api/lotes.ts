import { apiClient } from "./client";
import type {
  CreateEventoLoteRequestDto,
  CreateLoteRequestDto,
  EventoLoteDto,
  FinalizarCultivoResponseDto,
  LoteDto,
} from "./types";

export async function createLote(payload: CreateLoteRequestDto): Promise<void> {
  await apiClient.post("/lotes", payload);
}

export async function getLotes(): Promise<LoteDto[]> {
  const { data } = await apiClient.get<LoteDto[]>("/lotes");
  return data;
}

export async function getLoteById(id: number): Promise<LoteDto> {
  // API spec shows an array, but a single entity is expected; normalize both.
  const { data } = await apiClient.get<LoteDto | LoteDto[]>(`/lotes/${id}`);
  return Array.isArray(data) ? data[0] : data;
}

export async function deleteLote(id: number): Promise<{ mensagem: string }> {
  const { data } = await apiClient.delete<{ mensagem: string }>(`/lotes/${id}`);
  return data;
}

export async function getEventosLote(id: number): Promise<EventoLoteDto[]> {
  const { data } = await apiClient.get<EventoLoteDto[]>(`/lotes/${id}/eventos`);
  return data;
}

export async function addEventoLote(id: number, payload: CreateEventoLoteRequestDto): Promise<void> {
  await apiClient.post(`/lotes/${id}/eventos`, payload);
}

export async function finalizarCultivo(
  id: number,
  payload: CreateLoteRequestDto
): Promise<FinalizarCultivoResponseDto> {
  const { data } = await apiClient.post<FinalizarCultivoResponseDto>(
    `/lotes/${id}/finalizar-cultivo`,
    payload
  );
  return data;
}
