import { apiClient } from "./client";
import type { DashboardDto } from "./types";

export async function getDashboard(): Promise<DashboardDto> {
  const { data } = await apiClient.get<DashboardDto>("/dashboard");
  return data;
}
