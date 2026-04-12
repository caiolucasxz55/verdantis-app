import { apiClient } from "./client";
import type { CreateUserRequestDto, Paged, UserDto } from "./types";

export async function getUsersPaged(params?: {
  page?: number;
  size?: number;
  sort?: string;
}): Promise<Paged<UserDto>> {
  const { data } = await apiClient.get<Paged<UserDto>>("/users", { params });
  return data;
}

export async function getUsersAll(): Promise<UserDto[]> {
  const { data } = await apiClient.get<UserDto[]>("/users/all");
  return data;
}

export async function getUserById(id: number): Promise<UserDto> {
  const { data } = await apiClient.get<UserDto>(`/users/${id}`);
  return data;
}

export async function createUser(payload: CreateUserRequestDto): Promise<UserDto> {
  const { data } = await apiClient.post<UserDto>("/users", payload);
  return data;
}
