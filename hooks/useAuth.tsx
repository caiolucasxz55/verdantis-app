// src/hooks/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { AuthContextData } from "../types/auth";

export function useAuth(): AuthContextData {
  return useContext(AuthContext);
}
