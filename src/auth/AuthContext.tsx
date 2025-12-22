import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/fetchClient";

export type AuthUser = { id: number; email: string; role: string };

type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshMe() {
    const res = await apiFetch("/api/v1/auth/me", { method: "GET" });
    if (res.ok) setUser((await res.json()) as AuthUser);
    else setUser(null);
  }

  async function login(email: string, password: string) {
    const res = await apiFetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("login_failed");
    await refreshMe();
  }

  async function logout() {
    await apiFetch("/api/v1/auth/logout", { method: "POST" }); // CSRF проставится автоматом
    setUser(null);
  }

  useEffect(() => {
    (async () => {
      try {
        await refreshMe();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const value = useMemo(() => ({ user, isLoading, login, logout, refreshMe }), [user, isLoading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
