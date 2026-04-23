import { apiClient } from "./client";
import type { AuthResponseDto, LoginRequestDto, RegisterRequestDto } from "./types";

export async function loginApi(payload: LoginRequestDto): Promise<AuthResponseDto> {
  const { data } = await apiClient.post<AuthResponseDto>("/api/auth/login", payload);
  return data;
}

export async function registerApi(payload: RegisterRequestDto): Promise<AuthResponseDto> {
  const { data } = await apiClient.post<AuthResponseDto>("/api/auth/register", payload);
  return data;
}
