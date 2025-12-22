import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from "react";
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
  const mounted = useRef(false);

  const refreshMe = useCallback(async () => {
    const res = await apiFetch("/api/v1/auth/me", { method: "GET" });
    if (res.ok) setUser((await res.json()) as AuthUser);
    else setUser(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiFetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("login_failed");
    await refreshMe();
  }, [refreshMe]);

  const logout = useCallback(async () => {
    try {
      const res = await apiFetch("/api/v1/auth/logout", { method: "POST" });
      if (res.ok) {
        setUser(null);
      } else {
        console.error("Logout failed on server");
        // Still clear local state for security
        setUser(null);
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Clear local state even on network error
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    (async () => {
      try {
        await refreshMe();
      } finally {
        setIsLoading(false);
      }
    })();
  }, [refreshMe]);

  const value = useMemo(() => ({ user, isLoading, login, logout, refreshMe }), [user, isLoading, login, logout, refreshMe]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
