// src/store/useAuthStore.ts
import type { BetterFetchError } from "better-auth/react";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
  error: BetterFetchError | null;
  // Actions
  setSession: (
    user: User | null,
    loading: boolean,
    err: BetterFetchError | null,
  ) => void;
  // Getters (Optional: สำหรับเช็คสิทธิ์ง่ายๆ)
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: "loading",
  error: null,
  setSession: (user, loading, err) => {
    set({
      user,
      status: loading ? "loading" : user ? "authenticated" : "unauthenticated",
      error: err,
    });
  },

  isAdmin: () => get().user?.role === "admin",
}));
